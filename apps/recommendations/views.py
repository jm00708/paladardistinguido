from django.core.cache import cache
from django_tenants.utils import schema_context
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.diners.models import Diner, SensoryProfile
from apps.inventory.models import WineInventory
from apps.menu.models import MenuItem
from engine import explainer, recommender

from .models import Rating, Recommendation
from .serializers import (
    RatingSerializer,
    RecommendationRequestSerializer,
    RecommendationSerializer,
)


class RecommendationView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RecommendationRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        try:
            menu_item = MenuItem.objects.get(id=data['menu_item_id'], is_active=True)
        except MenuItem.DoesNotExist:
            return Response({'error': 'Platillo no encontrado.'}, status=status.HTTP_404_NOT_FOUND)

        # Perfil del comensal (invitado o registrado)
        profile_vector = [None] * 6
        diner_id = data.get('diner_id')
        if diner_id:
            try:
                profile = Diner.objects.get(id=diner_id).sensory_profile
                profile_vector = profile.as_vector()
            except (Diner.DoesNotExist, SensoryProfile.DoesNotExist):
                pass

        # Vinos disponibles en este restaurante ahora mismo
        available_ids = list(
            WineInventory.objects.filter(available=True).values_list('wine_id', flat=True)
        )
        if not available_ids:
            return Response(
                {'error': 'No hay vinos disponibles en este momento.'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        # Motor de recomendación
        results = recommender.recommend(
            profile_vector=profile_vector,
            food_category_id=menu_item.food_category_id,
            available_wine_ids=available_ids,
        )
        if not results:
            return Response(
                {'error': 'No se pudo generar una recomendación.'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        top = results[0]

        # Datos del vino y nota de maridaje (schema público)
        with schema_context('public'):
            from apps.wines.models import Wine, WinePairing
            wine = Wine.objects.select_related('sensory').prefetch_related('certifications').get(
                id=top.wine_id
            )
            pairing = WinePairing.objects.filter(
                wine_id=top.wine_id,
                food_category_id=menu_item.food_category_id,
            ).first()
            pairing_note = pairing.sommelier_note if pairing else ''

        # Explicación en lenguaje natural (con caché para evitar llamadas LLM repetidas)
        cache_key = f'expl:{top.wine_id}:{menu_item.food_category_id}:{round(top.profile_score, 1)}'
        explanation = cache.get(cache_key)
        if not explanation:
            explanation = explainer.generate_explanation(
                wine_name=wine.name,
                winery=wine.winery,
                region=wine.region,
                profile_score=top.profile_score,
                pairing_note=pairing_note,
                diner_profile_summary=_profile_summary(profile_vector),
                dish_name=menu_item.name,
                was_optimal=top.was_optimal,
                alternative_reason=top.alternative_reason,
                language=request.tenant.language,
            )
            from django.conf import settings
            cache.set(cache_key, explanation, timeout=settings.EXPLANATION_CACHE_TTL)

        # Persistir la recomendación
        rec = Recommendation.objects.create(
            diner_id=diner_id,
            menu_item=menu_item,
            wine_id=top.wine_id,
            was_optimal=top.was_optimal,
            alternative_reason=top.alternative_reason,
            match_score=top.match_score,
            profile_score=top.profile_score,
            pairing_score=top.pairing_score,
            explanation=explanation,
            table_number=data['table_number'],
        )

        inv = WineInventory.objects.filter(wine_id=top.wine_id).first()

        sensory = getattr(wine, 'sensory', None)
        return Response({
            'recommendation_id': rec.id,
            'wine': {
                'id': wine.id,
                'name': wine.name,
                'winery': wine.winery,
                'region': wine.region,
                'vintage': wine.vintage,
                'type': wine.wine_type,
                'image': request.build_absolute_uri(wine.image.url) if wine.image else None,
                'grapes': wine.grapes,
                'certifications': [c.name for c in wine.certifications.all()],
                'sensory': {
                    'body': sensory.body if sensory else None,
                    'acidity': sensory.acidity if sensory else None,
                    'tannins': sensory.tannins if sensory else None,
                    'sweetness': sensory.sweetness if sensory else None,
                    'salinity': sensory.salinity if sensory else None,
                    'minerality': sensory.minerality if sensory else None,
                } if sensory else None,
            },
            'match_score': top.match_score,
            'profile_score': top.profile_score,
            'pairing_score': top.pairing_score,
            'was_optimal': top.was_optimal,
            'explanation': explanation,
            'price_glass': str(inv.price_glass) if inv and inv.price_glass else None,
            'price_bottle': str(inv.price_bottle) if inv and inv.price_bottle else None,
            'alternatives': [
                {'wine_id': r.wine_id, 'match_score': r.match_score}
                for r in results[1:]
            ],
        }, status=status.HTTP_201_CREATED)


class RatingView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, recommendation_id):
        try:
            rec = Recommendation.objects.get(id=recommendation_id)
        except Recommendation.DoesNotExist:
            return Response({'error': 'Recomendación no encontrada.'}, status=status.HTTP_404_NOT_FOUND)

        if hasattr(rec, 'rating'):
            return Response({'error': 'Esta recomendación ya fue calificada.'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = RatingSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        rating = serializer.save(recommendation=rec)

        # Actualizar perfil sensorial del comensal
        if rec.diner_id:
            try:
                profile = rec.diner.sensory_profile
                with schema_context('public'):
                    from apps.wines.models import SensoryAttributes
                    attrs = SensoryAttributes.objects.get(wine_id=rec.wine_id)
                    profile.update_from_rating(attrs.as_vector(), rating.stars)
            except Exception:
                pass  # No bloquear la calificación si falla la actualización del perfil

        return Response(RatingSerializer(rating).data, status=status.HTTP_201_CREATED)


def _profile_summary(vector: list[float | None]) -> str:
    labels = ['cuerpo', 'acidez', 'taninos', 'dulzor', 'salinidad', 'mineralidad']
    ranges = [(0.0, 0.33, 'bajo'), (0.33, 0.66, 'medio'), (0.66, 1.01, 'alto')]
    parts = []
    for label, val in zip(labels, vector):
        if val is None:
            continue
        for low, high, desc in ranges:
            if low <= val < high:
                parts.append(f'{label} {desc}')
                break
    return ', '.join(parts) if parts else 'sin preferencias definidas'
