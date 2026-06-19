from django.contrib import admin
from .models import Recommendation, Rating


class RatingInline(admin.StackedInline):
    model = Rating
    extra = 0
    readonly_fields = ['created_at']


@admin.register(Recommendation)
class RecommendationAdmin(admin.ModelAdmin):
    list_display = ['table_number', 'wine_id', 'match_score', 'was_optimal', 'created_at']
    list_filter = ['was_optimal', 'created_at']
    readonly_fields = ['created_at']
    inlines = [RatingInline]
