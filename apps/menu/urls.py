from django.urls import path
from rest_framework import generics, permissions
from .models import MenuItem
from .serializers import MenuItemSerializer


class MenuListView(generics.ListAPIView):
    serializer_class = MenuItemSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = MenuItem.objects.filter(is_active=True)
        section = self.request.query_params.get('section')
        if section:
            qs = qs.filter(section=section)
        return qs


urlpatterns = [
    path('', MenuListView.as_view()),
]
