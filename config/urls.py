"""URLs para schemas de tenant (cada restaurante)."""
from django.urls import path, include

urlpatterns = [
    # Autenticación
    path('api/v1/auth/', include('apps.diners.urls_auth')),

    # Flujo del comensal (PWA)
    path('api/v1/session/', include('apps.tenants.urls_session')),
    path('api/v1/wines/', include('apps.wines.urls')),
    path('api/v1/menu/', include('apps.menu.urls')),
    path('api/v1/diners/', include('apps.diners.urls')),
    path('api/v1/recommendations/', include('apps.recommendations.urls')),

    # Red social
    path('api/v1/social/', include('apps.social.urls')),

    # Dashboard del restaurante
    path('api/v1/dashboard/', include('apps.analytics.urls')),
    path('api/v1/dashboard/inventory/', include('apps.inventory.urls')),
    path('api/v1/dashboard/menu/', include('apps.menu.urls_staff')),
    path('api/v1/dashboard/pairings/', include('apps.wines.urls_staff')),
]
