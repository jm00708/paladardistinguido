from django.urls import path
from .views import RecommendationView, RatingView

urlpatterns = [
    path('', RecommendationView.as_view()),
    path('<int:recommendation_id>/rate/', RatingView.as_view()),
]
