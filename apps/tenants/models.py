from django_tenants.models import TenantMixin, DomainMixin
from django.db import models


class Zone(models.TextChoices):
    ZONA_01 = 'zona_01', 'Zona 1 — CDMX Centro'
    ZONA_02 = 'zona_02', 'Zona 2 — CDMX Sur'
    ZONA_03 = 'zona_03', 'Zona 3 — CDMX Norte'
    ZONA_04 = 'zona_04', 'Zona 4 — Monterrey'
    ZONA_05 = 'zona_05', 'Zona 5 — Guadalajara'
    ZONA_06 = 'zona_06', 'Zona 6 — Cancún / Riviera Maya'
    ZONA_07 = 'zona_07', 'Zona 7 — Los Cabos'
    ZONA_08 = 'zona_08', 'Zona 8 — Puerto Vallarta'
    ZONA_09 = 'zona_09', 'Zona 9 — Puebla / Oaxaca'
    ZONA_10 = 'zona_10', 'Zona 10 — Bajío'
    ZONA_11 = 'zona_11', 'Zona 11 — Norte / Baja'


class Restaurant(TenantMixin):
    name = models.CharField(max_length=200)
    city = models.CharField(max_length=100)
    zone = models.CharField(max_length=20, choices=Zone.choices)
    address = models.TextField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    language = models.CharField(max_length=5, default='es', help_text='es | en')
    subscription_active = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    # django-tenants requiere este flag
    auto_create_schema = True

    class Meta:
        verbose_name = 'restaurante'
        verbose_name_plural = 'restaurantes'

    def __str__(self):
        return self.name


class Domain(DomainMixin):
    pass
