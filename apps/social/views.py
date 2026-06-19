from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.diners.models import Diner
from engine.paladar_type import classify, TYPES

from .models import Comment, Follow, PostReaction, WinePost
from .serializers import CommentSerializer, WinePostCreateSerializer, WinePostSerializer


def _get_diner(request) -> Diner | None:
    diner_id = request.query_params.get('diner_id') or request.data.get('diner_id')
    if diner_id:
        try:
            return Diner.objects.get(id=diner_id)
        except Diner.DoesNotExist:
            pass
    return None


def _serialize_posts(posts, diner_id=None):
    return WinePostSerializer(
        posts, many=True, context={'diner_id': diner_id}
    ).data


class GeneralFeedView(APIView):
    """Muro General — posts públicos ordenados por engagement."""
    permission_classes = [AllowAny]

    def get(self, request):
        diner_id = request.query_params.get('diner_id')
        archetype_filter = request.query_params.get('archetype')
        posts = list(
            WinePost.objects.filter(is_public=True)
            .select_related('diner', 'diner__sensory_profile')
            .prefetch_related('reactions', 'comments', 'comments__diner',
                              'comments__diner__sensory_profile')
        )
        # Filtrar por arquetipo si se solicita
        if archetype_filter:
            posts = [
                p for p in posts
                if classify(
                    p.diner.sensory_profile.as_vector()
                    if hasattr(p.diner, 'sensory_profile') else [None] * 6
                )['key'] == archetype_filter
            ]
        # Ordenar por engagement_score descendente
        posts.sort(key=lambda p: p.engagement_score, reverse=True)
        return Response(_serialize_posts(posts, diner_id))


class MyWallView(APIView):
    """Muro Propio — posts del comensal autenticado."""
    permission_classes = [AllowAny]

    def get(self, request):
        diner = _get_diner(request)
        if not diner:
            return Response({'error': 'diner_id requerido.'}, status=status.HTTP_400_BAD_REQUEST)
        posts = (
            WinePost.objects.filter(diner=diner)
            .select_related('diner', 'diner__sensory_profile')
            .prefetch_related('reactions', 'comments', 'comments__diner',
                              'comments__diner__sensory_profile')
        )
        return Response(_serialize_posts(posts, diner.id))

    def post(self, request):
        diner = _get_diner(request)
        if not diner:
            return Response({'error': 'diner_id requerido.'}, status=status.HTTP_400_BAD_REQUEST)
        serializer = WinePostCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        post = serializer.save(diner=diner)
        return Response(
            WinePostSerializer(post, context={'diner_id': diner.id}).data,
            status=status.HTTP_201_CREATED,
        )


class PostReactionView(APIView):
    """Reaccionar a un post o quitar la reacción."""
    permission_classes = [AllowAny]

    def post(self, request, post_id):
        diner = _get_diner(request)
        if not diner:
            return Response({'error': 'diner_id requerido.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            post = WinePost.objects.get(id=post_id)
        except WinePost.DoesNotExist:
            return Response({'error': 'Post no encontrado.'}, status=status.HTTP_404_NOT_FOUND)

        reaction_type = request.data.get('reaction_type')
        if reaction_type not in ('maridaje', 'descubrimiento', 'favorito'):
            return Response({'error': 'Tipo de reacción inválido.'}, status=status.HTTP_400_BAD_REQUEST)

        existing = PostReaction.objects.filter(post=post, diner=diner).first()
        if existing:
            if existing.reaction_type == reaction_type:
                existing.delete()
                return Response({'status': 'removed'})
            existing.reaction_type = reaction_type
            existing.save(update_fields=['reaction_type'])
            return Response({'status': 'updated', 'reaction_type': reaction_type})

        PostReaction.objects.create(post=post, diner=diner, reaction_type=reaction_type)
        return Response({'status': 'created', 'reaction_type': reaction_type}, status=status.HTTP_201_CREATED)


class PostCommentView(APIView):
    """Comentar en un post."""
    permission_classes = [AllowAny]

    def post(self, request, post_id):
        diner = _get_diner(request)
        if not diner:
            return Response({'error': 'diner_id requerido.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            post = WinePost.objects.get(id=post_id)
        except WinePost.DoesNotExist:
            return Response({'error': 'Post no encontrado.'}, status=status.HTTP_404_NOT_FOUND)

        text = request.data.get('text', '').strip()
        if not text:
            return Response({'error': 'El comentario no puede estar vacío.'}, status=status.HTTP_400_BAD_REQUEST)

        comment = Comment.objects.create(post=post, diner=diner, text=text[:500])
        return Response(CommentSerializer(comment).data, status=status.HTTP_201_CREATED)


class FollowView(APIView):
    """Seguir / dejar de seguir a un comensal."""
    permission_classes = [AllowAny]

    def post(self, request, diner_id):
        follower = _get_diner(request)
        if not follower:
            return Response({'error': 'diner_id requerido.'}, status=status.HTTP_400_BAD_REQUEST)
        if follower.id == diner_id:
            return Response({'error': 'No puedes seguirte a ti mismo.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            target = Diner.objects.get(id=diner_id)
        except Diner.DoesNotExist:
            return Response({'error': 'Comensal no encontrado.'}, status=status.HTTP_404_NOT_FOUND)

        follow, created = Follow.objects.get_or_create(follower=follower, following=target)
        if not created:
            follow.delete()
            return Response({'status': 'unfollowed'})
        return Response({'status': 'following'}, status=status.HTTP_201_CREATED)


class PaladarTypeView(APIView):
    """Devuelve el arquetipo de paladar de un comensal."""
    permission_classes = [AllowAny]

    def get(self, request):
        diner = _get_diner(request)
        if not diner:
            return Response({'error': 'diner_id requerido.'}, status=status.HTTP_400_BAD_REQUEST)
        profile = getattr(diner, 'sensory_profile', None)
        vector = profile.as_vector() if profile else [None] * 6
        archetype = classify(vector)
        followers = diner.followers.count()
        following = diner.following.count()
        posts = diner.posts.count()
        sensory = None
        if profile:
            v = profile.as_vector()
            labels = ['body', 'acidity', 'tannins', 'sweetness', 'salinity', 'minerality']
            sensory = {l: (round(val, 3) if val is not None else None) for l, val in zip(labels, v)}

        return Response({
            'diner_id': diner.id,
            'email_display': diner.email.split('@')[0] if diner.email else f'Invitado {diner.id}',
            'paladar_type': archetype,
            'sensory': sensory,
            'stats': {
                'posts': posts,
                'followers': followers,
                'following': following,
            },
        })


class SuggestedDinersView(APIView):
    """Comensales activos que el usuario aún no sigue (para sidebar 'Quién seguir')."""
    permission_classes = [AllowAny]

    def get(self, request):
        from apps.diners.models import Diner as DinerModel
        from django.db.models import Count

        diner = _get_diner(request)
        exclude_ids = set()
        if diner:
            exclude_ids = set(
                Follow.objects.filter(follower=diner).values_list('following_id', flat=True)
            )
            exclude_ids.add(diner.id)

        candidates = (
            DinerModel.objects
            .exclude(id__in=exclude_ids)
            .filter(is_guest=False)
            .select_related('sensory_profile')
            .annotate(post_count=Count('posts'))
            .order_by('-post_count')[:5]
        )

        result = []
        for d in candidates:
            profile = getattr(d, 'sensory_profile', None)
            vector = profile.as_vector() if profile else [None] * 6
            archetype = classify(vector)
            result.append({
                'diner_id': d.id,
                'display': d.email.split('@')[0] if d.email else f'Miembro {d.id}',
                'paladar_type': archetype,
                'post_count': d.post_count,
            })
        return Response(result)


class AllPaladarTypesView(APIView):
    """Lista los 8 arquetipos con descripción y conteo de miembros."""
    permission_classes = [AllowAny]

    def get(self, request):
        from apps.diners.models import Diner, SensoryProfile
        profiles = SensoryProfile.objects.select_related('diner').filter(diner__is_guest=False)
        counts = {t['key']: 0 for t in TYPES}
        for profile in profiles:
            key = classify(profile.as_vector())['key']
            counts[key] = counts.get(key, 0) + 1
        result = [
            {**t, 'member_count': counts.get(t['key'], 0)}
            for t in TYPES
        ]
        return Response(result)
