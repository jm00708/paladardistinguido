from django.db import models


class WineType(models.TextChoices):
    TINTO = 'tinto', 'Tinto'
    BLANCO = 'blanco', 'Blanco'
    ROSADO = 'rosado', 'Rosado'
    ESPUMOSO = 'espumoso', 'Espumoso'
    DULCE = 'dulce', 'Dulce'
    JEREZ = 'jerez', 'Jerez / Fortificado'


class FoodCategory(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)

    class Meta:
        verbose_name = 'categoría de platillo'
        verbose_name_plural = 'categorías de platillo'
        ordering = ['name']

    def __str__(self):
        return self.name


class Certification(models.Model):
    name = models.CharField(max_length=100)
    abbreviation = models.CharField(max_length=20, blank=True)

    class Meta:
        verbose_name = 'certificación'
        ordering = ['name']

    def __str__(self):
        return self.name


class Wine(models.Model):
    name = models.CharField(max_length=200)
    winery = models.CharField(max_length=200)
    country = models.CharField(max_length=100)
    region = models.CharField(max_length=100, blank=True)
    vintage = models.IntegerField(null=True, blank=True)
    grapes = models.JSONField(default=list, help_text='["Nebbiolo", "Sangiovese"]')
    wine_type = models.CharField(max_length=20, choices=WineType.choices)
    image = models.ImageField(upload_to='wines/', null=True, blank=True)
    certifications = models.ManyToManyField(Certification, blank=True, related_name='wines')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'vino'
        ordering = ['name']

    def __str__(self):
        vintage_str = f' {self.vintage}' if self.vintage else ''
        return f'{self.name}{vintage_str} — {self.winery}'


class SensoryAttributes(models.Model):
    wine = models.OneToOneField(Wine, on_delete=models.CASCADE, related_name='sensory')

    # Escala 0.0–1.0 en todos los atributos
    body = models.FloatField(help_text='0.0 ligero — 1.0 muy pleno')
    acidity = models.FloatField(help_text='0.0 baja — 1.0 alta')
    tannins = models.FloatField(help_text='0.0 sin taninos — 1.0 muy tánico')
    sweetness = models.FloatField(help_text='0.0 seco — 1.0 dulce')
    salinity = models.FloatField(default=0.0)
    minerality = models.FloatField(default=0.0)

    temperature_min = models.IntegerField(default=14, help_text='°C')
    temperature_max = models.IntegerField(default=18, help_text='°C')

    class Meta:
        verbose_name = 'atributos sensoriales'

    def as_vector(self) -> list[float]:
        return [self.body, self.acidity, self.tannins, self.sweetness, self.salinity, self.minerality]

    def __str__(self):
        return f'Sensory — {self.wine}'


class WinePairing(models.Model):
    wine = models.ForeignKey(Wine, on_delete=models.CASCADE, related_name='pairings')
    food_category = models.ForeignKey(FoodCategory, on_delete=models.CASCADE, related_name='pairings')
    score = models.FloatField(help_text='0.0–1.0, definido por el sommelier')
    sommelier_note = models.TextField(blank=True)

    class Meta:
        unique_together = ['wine', 'food_category']
        verbose_name = 'maridaje'
        verbose_name_plural = 'maridajes'
        ordering = ['-score']

    def __str__(self):
        return f'{self.wine.name} × {self.food_category.name} ({self.score:.2f})'
