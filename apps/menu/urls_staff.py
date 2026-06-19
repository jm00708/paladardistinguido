from django.urls import path
from rest_framework import generics, permissions
from .models import MenuItem
from .serializers import MenuItemSerializer, MenuItemWriteSerializer


class MenuStaffListView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = MenuItem.objects.all()

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return MenuItemWriteSerializer
        return MenuItemSerializer


class MenuStaffDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemWriteSerializer


urlpatterns = [
    path('', MenuStaffListView.as_view()),
    path('<int:pk>/', MenuStaffDetailView.as_view()),
]
