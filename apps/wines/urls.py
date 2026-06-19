from django.urls import path
from rest_framework import generics, permissions
from .models import Wine
from .serializers import WineListSerializer, WineDetailSerializer


class WineListView(generics.ListAPIView):
    serializer_class = WineListSerializer
    permission_classes = [permissions.AllowAny]
    queryset = Wine.objects.filter(is_active=True).select_related('sensory')


class WineDetailView(generics.RetrieveAPIView):
    serializer_class = WineDetailSerializer
    permission_classes = [permissions.AllowAny]
    queryset = Wine.objects.filter(is_active=True).select_related('sensory').prefetch_related('certifications', 'pairings')


urlpatterns = [
    path('', WineListView.as_view()),
    path('<int:pk>/', WineDetailView.as_view()),
]
