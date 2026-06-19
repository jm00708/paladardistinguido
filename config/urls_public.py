"""URLs para el schema público (admin global, gestión de tenants)."""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/tenants/', include('apps.tenants.urls')),
]
