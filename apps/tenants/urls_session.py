from django.urls import path
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.menu.models import MenuItem
from apps.menu.serializers import MenuItemSerializer


class SessionInitView(APIView):
    """
    Inicializa la sesión del comensal al escanear el QR.
    Devuelve info del restaurante y la carta activa.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        restaurant = request.tenant
        menu = MenuItem.objects.filter(is_active=True).order_by('section', 'sort_order')
        return Response({
            'restaurant': {
                'name': restaurant.name,
                'city': restaurant.city,
                'language': restaurant.language,
            },
            'table': request.query_params.get('table', ''),
            'menu': MenuItemSerializer(menu, many=True).data,
        })


urlpatterns = [
    path('', SessionInitView.as_view()),
]
