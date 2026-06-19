from rest_framework import serializers
from .models import Wine, SensoryAttributes, WinePairing, FoodCategory, Certification


class CertificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certification
        fields = ['id', 'name', 'abbreviation']


class SensoryAttributesSerializer(serializers.ModelSerializer):
    class Meta:
        model = SensoryAttributes
        fields = ['body', 'acidity', 'tannins', 'sweetness', 'salinity', 'minerality',
                  'temperature_min', 'temperature_max']


class WineListSerializer(serializers.ModelSerializer):
    certifications = CertificationSerializer(many=True, read_only=True)

    class Meta:
        model = Wine
        fields = ['id', 'name', 'winery', 'country', 'region', 'vintage',
                  'wine_type', 'image', 'certifications']


class WineDetailSerializer(serializers.ModelSerializer):
    sensory = SensoryAttributesSerializer(read_only=True)
    certifications = CertificationSerializer(many=True, read_only=True)

    class Meta:
        model = Wine
        fields = ['id', 'name', 'winery', 'country', 'region', 'vintage',
                  'grapes', 'wine_type', 'image', 'sensory', 'certifications']


class WinePairingSerializer(serializers.ModelSerializer):
    food_category_name = serializers.CharField(source='food_category.name', read_only=True)

    class Meta:
        model = WinePairing
        fields = ['id', 'wine', 'food_category', 'food_category_name', 'score', 'sommelier_note']


class FoodCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodCategory
        fields = ['id', 'name', 'slug']
