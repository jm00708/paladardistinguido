from django.contrib import admin
from .models import StaffProfile, WineInventory


@admin.register(StaffProfile)
class StaffProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'role', 'created_at']
    list_filter = ['role']


@admin.register(WineInventory)
class WineInventoryAdmin(admin.ModelAdmin):
    list_display = ['wine_id', 'available', 'price_glass', 'price_bottle', 'last_updated']
    list_filter = ['available']
