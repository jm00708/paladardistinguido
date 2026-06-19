from rest_framework import serializers
from .models import Comment, Follow, PostReaction, WinePost
from engine.paladar_type import classify


def _paladar_type(diner):
    profile = getattr(diner, 'sensory_profile', None)
    if profile:
        return classify(profile.as_vector())
    return classify([None] * 6)


class CommentSerializer(serializers.ModelSerializer):
    diner_id = serializers.IntegerField(source='diner.id', read_only=True)
    diner_display = serializers.SerializerMethodField()
    paladar_type = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'diner_id', 'diner_display', 'paladar_type', 'text', 'created_at']
        read_only_fields = ['id', 'diner_id', 'diner_display', 'paladar_type', 'created_at']

    def get_diner_display(self, obj):
        return obj.diner.email.split('@')[0] if obj.diner.email else f'Invitado {obj.diner.id}'

    def get_paladar_type(self, obj):
        t = _paladar_type(obj.diner)
        return {'key': t['key'], 'name': t['name'], 'icon': t['icon']}


class ReactionSummarySerializer(serializers.Serializer):
    maridaje = serializers.IntegerField()
    descubrimiento = serializers.IntegerField()
    favorito = serializers.IntegerField()
    my_reaction = serializers.CharField(allow_null=True)


class WinePostSerializer(serializers.ModelSerializer):
    diner_id = serializers.IntegerField(source='diner.id', read_only=True)
    diner_display = serializers.SerializerMethodField()
    paladar_type = serializers.SerializerMethodField()
    reactions_summary = serializers.SerializerMethodField()
    comments = CommentSerializer(many=True, read_only=True)
    comments_count = serializers.IntegerField(source='comments.count', read_only=True)

    class Meta:
        model = WinePost
        fields = [
            'id', 'diner_id', 'diner_display', 'paladar_type',
            'wine_id', 'wine_name', 'winery', 'dish_name',
            'note', 'photo', 'is_public',
            'reactions_summary', 'comments_count', 'comments',
            'created_at',
        ]
        read_only_fields = ['id', 'diner_id', 'diner_display', 'paladar_type',
                            'reactions_summary', 'comments_count', 'comments', 'created_at']

    def get_diner_display(self, obj):
        return obj.diner.email.split('@')[0] if obj.diner.email else f'Invitado {obj.diner.id}'

    def get_paladar_type(self, obj):
        t = _paladar_type(obj.diner)
        return {'key': t['key'], 'name': t['name'], 'icon': t['icon'], 'description': t['description']}

    def get_reactions_summary(self, obj):
        request = self.context.get('request')
        diner_id = self.context.get('diner_id')
        qs = obj.reactions.all()
        my = None
        if diner_id:
            mine = qs.filter(diner_id=diner_id).first()
            my = mine.reaction_type if mine else None
        return {
            'maridaje': qs.filter(reaction_type='maridaje').count(),
            'descubrimiento': qs.filter(reaction_type='descubrimiento').count(),
            'favorito': qs.filter(reaction_type='favorito').count(),
            'my_reaction': my,
        }


class WinePostCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = WinePost
        fields = ['wine_id', 'wine_name', 'winery', 'dish_name', 'note', 'photo', 'is_public']


class FollowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Follow
        fields = ['id', 'following', 'created_at']
        read_only_fields = ['id', 'created_at']
