import django.core.validators
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True
    dependencies = [
        ('diners', '0001_initial'),
        ('menu', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Recommendation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False)),
                ('wine_id', models.IntegerField(db_index=True)),
                ('was_optimal', models.BooleanField(default=True)),
                ('alternative_reason', models.TextField(blank=True)),
                ('match_score', models.FloatField()),
                ('profile_score', models.FloatField(default=0.0)),
                ('pairing_score', models.FloatField(default=0.0)),
                ('explanation', models.TextField()),
                ('table_number', models.CharField(max_length=20)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('diner', models.ForeignKey(
                    blank=True, null=True,
                    on_delete=django.db.models.deletion.SET_NULL,
                    related_name='recommendations',
                    to='diners.diner',
                )),
                ('menu_item', models.ForeignKey(
                    null=True,
                    on_delete=django.db.models.deletion.SET_NULL,
                    to='menu.menuitem',
                )),
            ],
            options={
                'verbose_name': 'recomendación',
                'verbose_name_plural': 'recomendaciones',
                'ordering': ['-created_at'],
                'app_label': 'recommendations',
            },
        ),
        migrations.CreateModel(
            name='Rating',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False)),
                ('stars', models.IntegerField(validators=[
                    django.core.validators.MinValueValidator(1),
                    django.core.validators.MaxValueValidator(5),
                ])),
                ('comment', models.TextField(blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('recommendation', models.OneToOneField(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='rating',
                    to='recommendations.recommendation',
                )),
            ],
            options={
                'verbose_name': 'calificación',
                'app_label': 'recommendations',
            },
        ),
    ]
