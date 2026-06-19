from django.db import models


class MenuSection(models.TextChoices):
    ENTRADAS = 'entradas', 'Entradas'
    FONDOS = 'fondos', 'Fondos'
    POSTRES = 'postres', 'Postres'
    OTROS = 'otros', 'Otros'


class MenuItem(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)

    # FK lógica a public.wines_foodcategory
    food_category_id = models.IntegerField(db_index=True)

    section = models.CharField(
        max_length=20, choices=MenuSection.choices, default=MenuSection.FONDOS
    )
    is_active = models.BooleanField(default=True)
    sort_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label = 'menu'
        verbose_name = 'platillo'
        verbose_name_plural = 'carta / menú'
        ordering = ['section', 'sort_order', 'name']

    def get_food_category(self):
        from django_tenants.utils import schema_context
        with schema_context('public'):
            from apps.wines.models import FoodCategory
            return FoodCategory.objects.get(id=self.food_category_id)

    def __str__(self):
        return self.name
