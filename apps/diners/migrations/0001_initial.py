from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True
    dependencies = []

    operations = [
        migrations.CreateModel(
            name='Diner',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False)),
                ('email', models.EmailField(blank=True, max_length=254, null=True)),
                ('auth_provider', models.CharField(
                    default='guest',
                    max_length=10,
                    choices=[
                        ('email', 'Email'),
                        ('google', 'Google'),
                        ('guest', 'Invitado'),
                    ],
                )),
                ('is_guest', models.BooleanField(default=True)),
                ('age_verified', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'verbose_name': 'comensal',
                'verbose_name_plural': 'comensales',
                'app_label': 'diners',
            },
        ),
        migrations.CreateModel(
            name='SensoryProfile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False)),
                ('body_preference', models.FloatField(blank=True, null=True)),
                ('acidity_preference', models.FloatField(blank=True, null=True)),
                ('tannins_preference', models.FloatField(blank=True, null=True)),
                ('sweetness_preference', models.FloatField(blank=True, null=True)),
                ('salinity_preference', models.FloatField(blank=True, null=True)),
                ('minerality_preference', models.FloatField(blank=True, null=True)),
                ('visit_count', models.IntegerField(default=0)),
                ('last_updated', models.DateTimeField(auto_now=True)),
                ('diner', models.OneToOneField(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='sensory_profile',
                    to='diners.diner',
                )),
            ],
            options={
                'verbose_name': 'perfil sensorial',
                'app_label': 'diners',
            },
        ),
    ]
