from rest_framework import serializers
from .models import WineInventory


class WineInventorySerializer(serializers.ModelSerializer):
    wine_display = serializers.SerializerMethodField()

    class Meta:
        model = WineInventory
        fields = ['id', 'wine_id', 'wine_display', 'available',
                  'price_glass', 'price_bottle', 'notes', 'last_updated']
        read_only_fields = ['last_updated', 'wine_display']

    def get_wine_display(self, obj):
        wine = getattr(obj, '_wine_cache', None)
        if wine is None:
            return {'name': f'Vino #{obj.wine_id}', 'winery': '', 'wine_type': ''}
        vintage = f' {wine.vintage}' if wine.vintage else ''
        return {
            'name': f'{wine.name}{vintage}',
            'winery': wine.winery,
            'wine_type': wine.wine_type,
        }
