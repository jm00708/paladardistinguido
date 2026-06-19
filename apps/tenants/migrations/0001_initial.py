from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True
    dependencies = []

    operations = [
        migrations.CreateModel(
            name='Restaurant',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False)),
                ('schema_name', models.CharField(
                    db_index=True, max_length=63, unique=True,
                )),
                ('name', models.CharField(max_length=200)),
                ('city', models.CharField(max_length=100)),
                ('zone', models.CharField(
                    max_length=20,
                    choices=[
                        ('zona_01', 'Zona 1 — CDMX Centro'),
                        ('zona_02', 'Zona 2 — CDMX Sur'),
                        ('zona_03', 'Zona 3 — CDMX Norte'),
                        ('zona_04', 'Zona 4 — Monterrey'),
                        ('zona_05', 'Zona 5 — Guadalajara'),
                        ('zona_06', 'Zona 6 — Cancún / Riviera Maya'),
                        ('zona_07', 'Zona 7 — Los Cabos'),
                        ('zona_08', 'Zona 8 — Puerto Vallarta'),
                        ('zona_09', 'Zona 9 — Puebla / Oaxaca'),
                        ('zona_10', 'Zona 10 — Bajío'),
                        ('zona_11', 'Zona 11 — Norte / Baja'),
                    ],
                )),
                ('address', models.TextField(blank=True)),
                ('phone', models.CharField(blank=True, max_length=20)),
                ('language', models.CharField(default='es', max_length=5)),
                ('subscription_active', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'verbose_name': 'restaurante',
                'verbose_name_plural': 'restaurantes',
            },
        ),
        migrations.CreateModel(
            name='Domain',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False)),
                ('domain', models.CharField(db_index=True, max_length=253, unique=True)),
                ('is_primary', models.BooleanField(db_index=True, default=True)),
                ('tenant', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='domains',
                    to='tenants.restaurant',
                )),
            ],
            options={'abstract': False},
        ),
    ]
