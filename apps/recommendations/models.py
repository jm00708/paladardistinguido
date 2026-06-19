from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models


class Recommendation(models.Model):
    diner = models.ForeignKey(
        'diners.Diner', on_delete=models.SET_NULL, null=True, blank=True,
        related_name='recommendations'
    )
    menu_item = models.ForeignKey(
        'menu.MenuItem', on_delete=models.SET_NULL, null=True
    )

    # FK lógica a public.wines_wine
    wine_id = models.IntegerField(db_index=True)

    was_optimal = models.BooleanField(
        default=True, help_text='False si el vino ideal no estaba disponible'
    )
    alternative_reason = models.TextField(blank=True)

    match_score = models.FloatField()
    profile_score = models.FloatField(default=0.0)
    pairing_score = models.FloatField(default=0.0)
    explanation = models.TextField()

    table_number = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label = 'recommendations'
        verbose_name = 'recomendación'
        verbose_name_plural = 'recomendaciones'
        ordering = ['-created_at']

    def __str__(self):
        return f'Mesa {self.table_number} — Vino #{self.wine_id} ({self.match_score:.0%})'


class Rating(models.Model):
    recommendation = models.OneToOneField(
        Recommendation, on_delete=models.CASCADE, related_name='rating'
    )
    stars = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label = 'recommendations'
        verbose_name = 'calificación'
        verbose_name_plural = 'calificaciones'

    def __str__(self):
        return f'★{self.stars} — {self.recommendation}'
