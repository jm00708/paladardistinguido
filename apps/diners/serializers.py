from rest_framework import serializers
from .models import Diner, SensoryProfile


class SensoryProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = SensoryProfile
        fields = ['body_preference', 'acidity_preference', 'tannins_preference',
                  'sweetness_preference', 'salinity_preference', 'minerality_preference',
                  'visit_count', 'last_updated']
        read_only_fields = ['visit_count', 'last_updated']


class DinerSerializer(serializers.ModelSerializer):
    sensory_profile = SensoryProfileSerializer(read_only=True)

    class Meta:
        model = Diner
        fields = ['id', 'email', 'auth_provider', 'is_guest', 'age_verified',
                  'sensory_profile', 'created_at']
        read_only_fields = ['id', 'created_at']


class QuestionnaireSerializer(serializers.Serializer):
    """Respuestas del cuestionario inicial de 5 preguntas."""
    body = serializers.FloatField(min_value=0.0, max_value=1.0)
    acidity = serializers.FloatField(min_value=0.0, max_value=1.0)
    tannins = serializers.FloatField(min_value=0.0, max_value=1.0)
    sweetness = serializers.FloatField(min_value=0.0, max_value=1.0)
    experience = serializers.ChoiceField(
        choices=['beginner', 'occasional', 'enthusiast', 'expert']
    )
