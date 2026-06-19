from django.urls import path
from rest_framework import generics, permissions
from .models import WinePairing
from .serializers import WinePairingSerializer


class PairingListView(generics.ListCreateAPIView):
    serializer_class = WinePairingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = WinePairing.objects.select_related('wine', 'food_category')
        wine_id = self.request.query_params.get('wine_id')
        if wine_id:
            qs = qs.filter(wine_id=wine_id)
        return qs


class PairingDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = WinePairingSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = WinePairing.objects.all()


urlpatterns = [
    path('', PairingListView.as_view()),
    path('<int:pk>/', PairingDetailView.as_view()),
]
