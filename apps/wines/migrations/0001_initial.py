from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True
    dependencies = []

    operations = [
        migrations.CreateModel(
            name='Certification',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100)),
                ('abbreviation', models.CharField(blank=True, max_length=20)),
            ],
            options={'verbose_name': 'certificación', 'ordering': ['name']},
        ),
        migrations.CreateModel(
            name='FoodCategory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100)),
                ('slug', models.SlugField(unique=True)),
            ],
            options={
                'verbose_name': 'categoría de platillo',
                'verbose_name_plural': 'categorías de platillo',
                'ordering': ['name'],
            },
        ),
        migrations.CreateModel(
            name='Wine',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=200)),
                ('winery', models.CharField(max_length=200)),
                ('country', models.CharField(max_length=100)),
                ('region', models.CharField(blank=True, max_length=100)),
                ('vintage', models.IntegerField(blank=True, null=True)),
                ('grapes', models.JSONField(default=list)),
                ('wine_type', models.CharField(
                    max_length=20,
                    choices=[
                        ('tinto', 'Tinto'),
                        ('blanco', 'Blanco'),
                        ('rosado', 'Rosado'),
                        ('espumoso', 'Espumoso'),
                        ('dulce', 'Dulce'),
                        ('jerez', 'Jerez / Fortificado'),
                    ],
                )),
                ('image', models.ImageField(blank=True, null=True, upload_to='wines/')),
                ('is_active', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('certifications', models.ManyToManyField(
                    blank=True, related_name='wines', to='wines.certification',
                )),
            ],
            options={'verbose_name': 'vino', 'ordering': ['name']},
        ),
        migrations.CreateModel(
            name='SensoryAttributes',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False)),
                ('body', models.FloatField()),
                ('acidity', models.FloatField()),
                ('tannins', models.FloatField()),
                ('sweetness', models.FloatField()),
                ('salinity', models.FloatField(default=0.0)),
                ('minerality', models.FloatField(default=0.0)),
                ('temperature_min', models.IntegerField(default=14)),
                ('temperature_max', models.IntegerField(default=18)),
                ('wine', models.OneToOneField(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='sensory',
                    to='wines.wine',
                )),
            ],
            options={'verbose_name': 'atributos sensoriales'},
        ),
        migrations.CreateModel(
            name='WinePairing',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False)),
                ('score', models.FloatField()),
                ('sommelier_note', models.TextField(blank=True)),
                ('food_category', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='pairings',
                    to='wines.foodcategory',
                )),
                ('wine', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='pairings',
                    to='wines.wine',
                )),
            ],
            options={
                'verbose_name': 'maridaje',
                'verbose_name_plural': 'maridajes',
                'ordering': ['-score'],
            },
        ),
        migrations.AlterUniqueTogether(
            name='winepairing',
            unique_together={('wine', 'food_category')},
        ),
    ]
