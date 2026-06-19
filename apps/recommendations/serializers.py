from rest_framework import serializers
from .models import Recommendation, Rating


class RecommendationRequestSerializer(serializers.Serializer):
    menu_item_id = serializers.IntegerField()
    table_number = serializers.CharField(max_length=20, default='', allow_blank=True)
    diner_id = serializers.IntegerField(required=False, allow_null=True)


class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ['stars', 'comment']

    def validate_stars(self, value):
        if not (1 <= value <= 5):
            raise serializers.ValidationError('Las estrellas deben estar entre 1 y 5.')
        return value


class RecommendationSerializer(serializers.ModelSerializer):
    rating = RatingSerializer(read_only=True)

    class Meta:
        model = Recommendation
        fields = ['id', 'wine_id', 'menu_item', 'match_score', 'profile_score',
                  'pairing_score', 'was_optimal', 'explanation', 'table_number',
                  'created_at', 'rating']
