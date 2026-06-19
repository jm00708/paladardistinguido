from django.contrib import admin
from .models import Wine, SensoryAttributes, WinePairing, FoodCategory, Certification


class SensoryInline(admin.StackedInline):
    model = SensoryAttributes
    extra = 1


class PairingInline(admin.TabularInline):
    model = WinePairing
    extra = 1


@admin.register(Wine)
class WineAdmin(admin.ModelAdmin):
    list_display = ['name', 'winery', 'country', 'wine_type', 'vintage', 'is_active']
    list_filter = ['wine_type', 'country', 'is_active']
    search_fields = ['name', 'winery', 'region']
    inlines = [SensoryInline, PairingInline]
    filter_horizontal = ['certifications']


@admin.register(FoodCategory)
class FoodCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}


admin.site.register(Certification)
