"""
Comando de arranque inicial del proyecto.

Ejecutar UNA sola vez después de levantar los contenedores:

    docker compose exec backend python manage.py bootstrap

Qué hace:
  1. Crea el tenant público (requerido por django-tenants)
  2. Crea el superusuario admin
  3. Carga los fixtures de categorías y certificaciones
  4. Crea el restaurante piloto (opcional con --restaurant)
"""
import os
from django.core.management.base import BaseCommand
from django.core.management import call_command
from django.db import connection


class Command(BaseCommand):
    help = 'Inicializa el proyecto: tenant público, superusuario y datos semilla.'

    def add_arguments(self, parser):
        parser.add_argument('--restaurant', type=str, default='',
                            help='Nombre del restaurante piloto a crear (opcional)')
        parser.add_argument('--domain', type=str, default='',
                            help='Dominio del restaurante piloto, ej: noma.localhost')
        parser.add_argument('--no-superuser', action='store_true',
                            help='Omitir la creación del superusuario')

    def handle(self, *args, **options):
        from apps.tenants.models import Restaurant, Domain

        # ── 1. Tenant público ───────────────────────────────────────────────
        self.stdout.write('Creando tenant público...')
        public, created = Restaurant.objects.get_or_create(
            schema_name='public',
            defaults={
                'name': 'El Paladar Distinguido — Admin',
                'city': 'CDMX',
                'zone': 'zona_01',
                'subscription_active': True,
            },
        )
        if created:
            Domain.objects.get_or_create(
                domain='localhost',
                defaults={'tenant': public, 'is_primary': True},
            )
            self.stdout.write(self.style.SUCCESS('  ✓ Tenant público creado'))
        else:
            self.stdout.write('  · Tenant público ya existe')

        # ── 2. Superusuario ─────────────────────────────────────────────────
        if not options['no_superuser']:
            self.stdout.write('Creando superusuario...')
            connection.set_schema_to_public()
            from django.contrib.auth import get_user_model
            User = get_user_model()
            admin_email = os.environ.get('DJANGO_SUPERUSER_EMAIL', 'admin@paladar.mx')
            admin_pass  = os.environ.get('DJANGO_SUPERUSER_PASSWORD', 'admin1234')
            if not User.objects.filter(email=admin_email).exists():
                User.objects.create_superuser(
                    username='admin',
                    email=admin_email,
                    password=admin_pass,
                )
                self.stdout.write(self.style.SUCCESS(f'  ✓ Superusuario: {admin_email} / {admin_pass}'))
                self.stdout.write(self.style.WARNING('  ⚠ Cambia la contraseña en producción'))
            else:
                self.stdout.write('  · Superusuario ya existe')

        # ── 3. Datos semilla (categorías y certificaciones) ──────────────────
        self.stdout.write('Cargando fixtures de datos semilla...')
        connection.set_schema_to_public()
        call_command('loaddata', 'fixtures/food_categories.json', verbosity=0)
        call_command('loaddata', 'fixtures/certifications.json', verbosity=0)
        self.stdout.write(self.style.SUCCESS('  ✓ Categorías de platillos y certificaciones cargadas'))

        # ── 4. Restaurante piloto (opcional) ────────────────────────────────
        restaurant_name = options.get('restaurant')
        domain_str      = options.get('domain')
        slug = ''
        if restaurant_name and domain_str:
            self.stdout.write(f'Creando restaurante piloto: {restaurant_name}...')
            slug = restaurant_name.lower().replace(' ', '_')[:30]
            pilot, created = Restaurant.objects.get_or_create(
                schema_name=slug,
                defaults={
                    'name': restaurant_name,
                    'city': 'CDMX',
                    'zone': 'zona_01',
                    'subscription_active': True,
                },
            )
            if created:
                Domain.objects.get_or_create(
                    domain=domain_str,
                    defaults={'tenant': pilot, 'is_primary': True},
                )
                self.stdout.write(self.style.SUCCESS(
                    f'  ✓ Restaurante "{restaurant_name}" creado en schema "{slug}"'
                ))
                self.stdout.write(f'  · Dominio: {domain_str}')
            else:
                self.stdout.write('  · Restaurante ya existe')

        # ── 5. Catálogo de vinos de ejemplo ─────────────────────────────────
        self.stdout.write('Cargando catálogo de vinos de ejemplo...')
        call_command('load_sample_wines', verbosity=0)
        self.stdout.write(self.style.SUCCESS('  ✓ Catálogo de vinos cargado'))

        # ── 6. Carta y inventario del piloto (solo si se creó restaurante) ───
        if restaurant_name and domain_str:
            self.stdout.write('Cargando carta de alta cocina...')
            call_command('load_sample_menu', schema=slug)

            self.stdout.write('Cargando inventario de vinos...')
            call_command('load_sample_inventory', schema=slug)

        self.stdout.write('')
        self.stdout.write(self.style.SUCCESS('Bootstrap completado. El proyecto está listo.'))
        self.stdout.write('')
        self.stdout.write('Próximos pasos:')
        self.stdout.write('  → Admin: http://localhost:8000/admin/')
        self.stdout.write('  → PWA:   http://localhost:5173/')
        self.stdout.write('')
        self.stdout.write('  → Para crear un restaurante piloto:')
        self.stdout.write('    docker compose exec backend python manage.py bootstrap \\')
        self.stdout.write('      --restaurant "Noma MX" --domain "noma.localhost"')
        self.stdout.write('')
        self.stdout.write('  → Para recargar solo los vinos:')
        self.stdout.write('    docker compose exec backend python manage.py load_sample_wines')
        self.stdout.write('    docker compose exec backend python manage.py load_sample_wines --clear  # reiniciar')
