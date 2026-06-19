from django.urls import path
from .views import (
    AnalyticsView, ArchetypeInsightsView,
    DashboardStatsView, RecommendationHistoryView, WeeklyTrendView,
)

urlpatterns = [
    path('stats/', DashboardStatsView.as_view()),
    path('trend/', WeeklyTrendView.as_view()),
    path('history/', RecommendationHistoryView.as_view()),
    path('analytics/', AnalyticsView.as_view()),
    path('archetypes/', ArchetypeInsightsView.as_view()),
]
