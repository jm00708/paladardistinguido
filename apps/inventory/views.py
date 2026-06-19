from rest_framework import generics, permissions
from rest_framework.response import Response

from .models import WineInventory
from .serializers import WineInventorySerializer


class IsRestaurantStaff(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and hasattr(request.user, 'restaurant_role')


def _attach_wine_names(items):
    """Resuelve nombres de vino en una sola query al schema público."""
    wine_ids = list({item.wine_id for item in items})
    if not wine_ids:
        return
    try:
        from django_tenants.utils import schema_context
        from apps.wines.models import Wine
        with schema_context('public'):
            wines = Wine.objects.filter(id__in=wine_ids).only(
                'id', 'name', 'winery', 'vintage', 'wine_type'
            )
            wine_map = {w.id: w for w in wines}
        for item in items:
            item._wine_cache = wine_map.get(item.wine_id)
    except Exception:
        for item in items:
            item._wine_cache = None


class WineInventoryListView(generics.ListCreateAPIView):
    serializer_class = WineInventorySerializer
    permission_classes = [IsRestaurantStaff]

    def get_queryset(self):
        return WineInventory.objects.all().order_by('wine_id')

    def list(self, request, *args, **kwargs):
        items = list(self.get_queryset())
        _attach_wine_names(items)
        serializer = self.get_serializer(items, many=True)
        return Response(serializer.data)


class WineInventoryDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = WineInventorySerializer
    permission_classes = [IsRestaurantStaff]
    queryset = WineInventory.objects.all()

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        _attach_wine_names([instance])
        return Response(self.get_serializer(instance).data)
