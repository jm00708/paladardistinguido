from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()


class WineInventory(models.Model):
    # FK lógica al catálogo público (public.wines_wine)
    # No se usa ForeignKey real para evitar restricciones cross-schema
    wine_id = models.IntegerField(db_index=True)

    available = models.BooleanField(default=True)
    price_glass = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    price_bottle = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    notes = models.CharField(max_length=200, blank=True)
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        app_label = 'inventory'
        verbose_name = 'inventario de vino'
        verbose_name_plural = 'inventario de vinos'
        ordering = ['wine_id']

    def get_wine(self):
        """Resuelve el objeto Wine desde el schema público."""
        from django_tenants.utils import schema_context
        with schema_context('public'):
            from apps.wines.models import Wine
            return Wine.objects.select_related('sensory').get(id=self.wine_id)

    def __str__(self):
        status = '✓' if self.available else '✗'
        return f'[{status}] Vino #{self.wine_id}'


class StaffProfile(models.Model):
    ROLES = [
        ('admin', 'Administrador'),
        ('sommelier', 'Sommelier'),
        ('manager', 'Gerente'),
    ]
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name='restaurant_role',
    )
    role = models.CharField(max_length=20, choices=ROLES, default='admin')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label = 'inventory'
        verbose_name = 'staff del restaurante'

    def __str__(self):
        return f'{self.user.email} ({self.role})'
