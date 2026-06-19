from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True
    dependencies = []

    operations = [
        migrations.CreateModel(
            name='MenuItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=200)),
                ('description', models.TextField(blank=True)),
                ('food_category_id', models.IntegerField(db_index=True)),
                ('section', models.CharField(
                    default='fondos',
                    max_length=20,
                    choices=[
                        ('entradas', 'Entradas'),
                        ('fondos', 'Fondos'),
                        ('postres', 'Postres'),
                        ('otros', 'Otros'),
                    ],
                )),
                ('is_active', models.BooleanField(default=True)),
                ('sort_order', models.IntegerField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'verbose_name': 'platillo',
                'verbose_name_plural': 'carta / menú',
                'ordering': ['section', 'sort_order', 'name'],
                'app_label': 'menu',
            },
        ),
    ]
