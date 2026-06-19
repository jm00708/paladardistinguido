from django.db import models


class AuthProvider(models.TextChoices):
    EMAIL = 'email', 'Email'
    GOOGLE = 'google', 'Google'
    GUEST = 'guest', 'Invitado'


class Diner(models.Model):
    email = models.EmailField(null=True, blank=True)
    auth_provider = models.CharField(
        max_length=10, choices=AuthProvider.choices, default=AuthProvider.GUEST
    )
    is_guest = models.BooleanField(default=True)
    age_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label = 'diners'
        verbose_name = 'comensal'
        verbose_name_plural = 'comensales'

    def __str__(self):
        return self.email or f'Invitado #{self.pk}'


class SensoryProfile(models.Model):
    diner = models.OneToOneField(
        Diner, on_delete=models.CASCADE, related_name='sensory_profile'
    )

    # Preferencias 0.0–1.0; None = no definida todavía
    body_preference = models.FloatField(null=True, blank=True)
    acidity_preference = models.FloatField(null=True, blank=True)
    tannins_preference = models.FloatField(null=True, blank=True)
    sweetness_preference = models.FloatField(null=True, blank=True)
    salinity_preference = models.FloatField(null=True, blank=True)
    minerality_preference = models.FloatField(null=True, blank=True)

    visit_count = models.IntegerField(default=0)
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        app_label = 'diners'
        verbose_name = 'perfil sensorial'

    def as_vector(self) -> list[float | None]:
        return [
            self.body_preference,
            self.acidity_preference,
            self.tannins_preference,
            self.sweetness_preference,
            self.salinity_preference,
            self.minerality_preference,
        ]

    def is_complete(self) -> bool:
        return all(v is not None for v in self.as_vector())

    def update_from_rating(self, wine_vector: list[float], stars: int) -> None:
        """
        Ajusta el perfil acumulativamente según una calificación.
        Las calificaciones altas (4-5) refuerzan las preferencias hacia el vino;
        las bajas (1-2) las alejan.
        """
        weight = (stars - 3) * 0.1  # -0.2 a +0.2
        fields = [
            'body_preference', 'acidity_preference', 'tannins_preference',
            'sweetness_preference', 'salinity_preference', 'minerality_preference',
        ]
        for i, field in enumerate(fields):
            current = getattr(self, field)
            if current is None:
                setattr(self, field, wine_vector[i])
            else:
                updated = current + weight * (wine_vector[i] - current)
                setattr(self, field, max(0.0, min(1.0, updated)))
        self.visit_count += 1
        self.save()

    def __str__(self):
        return f'Perfil de {self.diner}'
