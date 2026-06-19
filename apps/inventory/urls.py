from django.urls import path
from .views import WineInventoryListView, WineInventoryDetailView

urlpatterns = [
    path('', WineInventoryListView.as_view()),
    path('<int:pk>/', WineInventoryDetailView.as_view()),
]
