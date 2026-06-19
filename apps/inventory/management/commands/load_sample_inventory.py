"""
Puebla el inventario de vinos para un restaurante piloto.

    docker compose exec backend python manage.py load_sample_inventory --schema noma_mx

Marca los 18 vinos de muestra como disponibles y asigna precios en MXN.
Requiere que load_sample_wines haya corrido primero en el schema público.
"""
from django.core.management.base import BaseCommand, CommandError
from django_tenants.utils import schema_context


# ── Precios MXN por copa / botella ───────────────────────────────────────────
# Índice = wine_id (1..18, coincide con el orden en load_sample_wines.py)
# (precio_copa, precio_botella)
PRICES = {
    1:  (380, 2200),   # Château Margaux 2018
    2:  (290, 1650),   # Opus One 2019
    3:  (195, 1100),   # Sassicaia 2019
    4:  (240, 1400),   # Catena Zapata Adrianna 2020
    5:  (175, 980),    # Cloudy Bay Sauvignon Blanc 2022
    6:  (220, 1250),   # Puligny-Montrachet 1er Cru 2020
    7:  (185, 1050),   # Rías Baixas Albariño Mar de Frades 2022
    8:  (310, 1800),   # Barolo Brunate 2018
    9:  (260, 1480),   # Château d'Yquem 2016
    10: (165, 920),    # Grüner Veltliner Smaragd 2021
    11: (340, 1950),   # Caymus Special Selection 2020
    12: (210, 1200),   # Bodegas Muga Reserva 2019
    13: (150, 840),    # Cava Gramona Gran Reserva
    14: (190, 1080),   # Vermentino di Sardegna 2022
    15: (420, 2450),   # Domaine de la Romanée-Conti Echezeaux 2017
    16: (280, 1600),   # Torres Gran Coronas Cabernet 2019
    17: (230, 1320),   # Sancerre Henri Bourgeois 2021
    18: (170, 960),    # Primitivo di Manduria 2020
}


class Command(BaseCommand):
    help = 'Carga el inventario de vinos de ejemplo para un restaurante piloto.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--schema', required=True,
            help='schema_name del restaurante (ej: noma_mx)',
        )
        parser.add_argument(
            '--clear', action='store_true',
            help='Elimina el inventario existente antes de cargar',
        )

    def handle(self, *args, **options):
        schema = options['schema']

        from apps.tenants.models import Restaurant
        try:
            restaurant = Restaurant.objects.get(schema_name=schema)
        except Restaurant.DoesNotExist:
            raise CommandError(
                f'No existe ningún restaurante con schema_name="{schema}". '
                'Créalo con: python manage.py bootstrap --restaurant "Nombre" --domain "dominio"'
            )

        # Verificar que los vinos existen en el schema público
        from django_tenants.utils import schema_context as sc
        with sc('public'):
            from apps.wines.models import Wine
            wine_ids_in_db = set(Wine.objects.filter(is_active=True).values_list('id', flat=True))

        if not wine_ids_in_db:
            raise CommandError(
                'No hay vinos en el schema público. '
                'Corre primero: python manage.py load_sample_wines'
            )

        with schema_context(schema):
            from apps.inventory.models import WineInventory

            if options['clear']:
                deleted, _ = WineInventory.objects.all().delete()
                self.stdout.write(self.style.WARNING(f'  {deleted} registros de inventario eliminados.'))

            created_count = 0
            for wine_id in sorted(wine_ids_in_db):
                copa, botella = PRICES.get(wine_id, (200, 1100))
                _, created = WineInventory.objects.get_or_create(
                    wine_id=wine_id,
                    defaults=dict(
                        available=True,
                        price_glass=copa,
                        price_bottle=botella,
                    ),
                )
                status = '✓' if created else '·'
                self.stdout.write(
                    f'  {status}  wine_id={wine_id:>2}  '
                    f'copa ${copa:,}  botella ${botella:,}'
                )
                if created:
                    created_count += 1

        self.stdout.write('')
        self.stdout.write(self.style.SUCCESS(
            f'Inventario listo en "{restaurant.name}": '
            f'{created_count} vinos nuevos de {len(wine_ids_in_db)} en total.'
        ))
