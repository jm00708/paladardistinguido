from django.db.models import Avg, Count
from django.db.models.functions import TruncDate
from django.utils import timezone
from datetime import timedelta
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.recommendations.models import Rating, Recommendation


class DashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        today = timezone.now().date()
        recs_today = Recommendation.objects.filter(created_at__date=today)

        top_wines = (
            Recommendation.objects.filter(created_at__date=today)
            .values('wine_id')
            .annotate(count=Count('id'))
            .order_by('-count')[:5]
        )

        avg_rating = Rating.objects.aggregate(avg=Avg('stars'))['avg']

        return Response({
            'recommendations_today': recs_today.count(),
            'average_rating': round(avg_rating, 2) if avg_rating else None,
            'top_wines_today': list(top_wines),
        })


class WeeklyTrendView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        since = timezone.now() - timedelta(days=7)
        daily = (
            Recommendation.objects
            .filter(created_at__gte=since)
            .annotate(day=TruncDate('created_at'))
            .values('day')
            .annotate(count=Count('id'))
            .order_by('day')
        )
        return Response({'trend': list(daily)})


class RecommendationHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        days = int(request.query_params.get('days', 1))
        since = timezone.now() - timedelta(days=days)
        recs = (
            Recommendation.objects
            .filter(created_at__gte=since)
            .select_related('menu_item', 'rating')
            .order_by('-created_at')[:100]
        )
        from apps.recommendations.serializers import RecommendationSerializer
        return Response(RecommendationSerializer(recs, many=True).data)


class AnalyticsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        days = int(request.query_params.get('days', 7))
        since = timezone.now() - timedelta(days=days)

        wine_stats = (
            Recommendation.objects.filter(created_at__gte=since)
            .values('wine_id')
            .annotate(
                recommendations=Count('id'),
                avg_rating=Avg('rating__stars'),
            )
            .order_by('-recommendations')[:10]
        )

        return Response({'wine_stats': list(wine_stats), 'period_days': days})


class ArchetypeInsightsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        from apps.diners.models import SensoryProfile
        from engine.paladar_type import classify

        profiles = SensoryProfile.objects.filter(
            diner__is_guest=False
        ).select_related('diner')

        archetype_counts = {}
        for p in profiles:
            result = classify(p.as_vector())
            key = result['key']
            if key not in archetype_counts:
                archetype_counts[key] = {
                    'key': key,
                    'name': result['name'],
                    'icon': result['icon'],
                    'description': result['description'],
                    'count': 0,
                }
            archetype_counts[key]['count'] += 1

        total = sum(d['count'] for d in archetype_counts.values())
        archetypes = sorted(archetype_counts.values(), key=lambda x: -x['count'])

        return Response({'archetypes': archetypes, 'total_diners': total})
