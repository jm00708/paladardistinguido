from django.core.validators import MaxLengthValidator
from django.db import models
from django.utils import timezone


class WinePost(models.Model):
    diner = models.ForeignKey(
        'diners.Diner', on_delete=models.CASCADE, related_name='posts',
    )
    wine_id = models.IntegerField(db_index=True, null=True, blank=True)  # null cuando se agrega manualmente
    wine_name = models.CharField(max_length=200)       # desnormalizado para evitar queries al schema público en el feed
    winery = models.CharField(max_length=200, blank=True)
    dish_name = models.CharField(max_length=200, blank=True)
    note = models.TextField(blank=True, validators=[MaxLengthValidator(600)])
    photo = models.ImageField(upload_to='social/posts/', blank=True, null=True)
    is_public = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.diner_id} → {self.wine_name}'

    @property
    def engagement_score(self):
        """Score para el muro general: reacciones × 2 + comentarios × 3 + recencia."""
        age_hours = max((timezone.now() - self.created_at).total_seconds() / 3600, 1)
        reactions = self.reactions.count()
        comments = self.comments.count()
        return (reactions * 2 + comments * 3) / (age_hours ** 0.3)


class PostReaction(models.Model):
    MARIDAJE = 'maridaje'
    DESCUBRIMIENTO = 'descubrimiento'
    FAVORITO = 'favorito'
    TYPES = [
        (MARIDAJE, '🍷 Maridaje perfecto'),
        (DESCUBRIMIENTO, '✦ Descubrimiento'),
        (FAVORITO, '♡ Favorito'),
    ]

    post = models.ForeignKey(WinePost, on_delete=models.CASCADE, related_name='reactions')
    diner = models.ForeignKey('diners.Diner', on_delete=models.CASCADE, related_name='reactions')
    reaction_type = models.CharField(max_length=20, choices=TYPES)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = [('post', 'diner')]


class Comment(models.Model):
    post = models.ForeignKey(WinePost, on_delete=models.CASCADE, related_name='comments')
    diner = models.ForeignKey('diners.Diner', on_delete=models.CASCADE, related_name='comments')
    text = models.TextField(max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']


class Follow(models.Model):
    follower = models.ForeignKey(
        'diners.Diner', on_delete=models.CASCADE, related_name='following',
    )
    following = models.ForeignKey(
        'diners.Diner', on_delete=models.CASCADE, related_name='followers',
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = [('follower', 'following')]
