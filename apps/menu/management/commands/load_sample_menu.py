"""
Carga la carta de ejemplo para un restaurante piloto.

    docker compose exec backend python manage.py load_sample_menu --schema noma_mx

El argumento --schema debe coincidir con el schema_name del restaurante
creado con el comando bootstrap.
"""
from django.core.management.base import BaseCommand, CommandError
from django_tenants.utils import schema_context


# ── Carta de alta cocina ──────────────────────────────────────────────────────
# Cada entrada: (nombre, descripción, food_category_id, sección, orden)
#
# food_category_id (de fixtures/food_categories.json):
#   1  Carnes rojas          2  Carnes blancas        3  Pescados
#   4  Mariscos              5  Pasta y arroces       6  Quesos
#   7  Caza y estofados      8  Vegetariano           9  Postres
#  10  Embutidos            11  Cocina asiática

MENU = [

    # ── ENTRADAS ─────────────────────────────────────────────────────────────
    (
        'Tártara de atún aleta amarilla',
        'Con aguacate cremoso, ralladura de limón amarillo, aceite de sésamo '
        'y chips de arroz negro.',
        3, 'entradas', 10,
    ),
    (
        'Ostiones Kumamoto',
        'Servidos vivos con granita de pepino, mignonette de chalota '
        'y espuma de mar.',
        4, 'entradas', 20,
    ),
    (
        'Ceviche de camarón tigre',
        'Leche de tigre con habanero ahumado, maíz cacahuazintle tostado '
        'y cilantro micro.',
        4, 'entradas', 30,
    ),
    (
        'Terrina de foie gras',
        'Con brioche artesanal, confitura de membrillo y sal de flor de Guerrero.',
        2, 'entradas', 40,
    ),
    (
        'Betabel asado con queso de cabra',
        'Betabel tricolor confitado en mantequilla de hierbas, mousse de queso '
        'de cabra fresco y nuez de castilla caramelizada.',
        8, 'entradas', 50,
    ),
    (
        'Pulpo a las brasas',
        'Tentáculo asado en comal de leña, puré de papa ahumada, '
        'aceite de pimentón y chips de alcaparra.',
        4, 'entradas', 60,
    ),

    # ── FONDOS ────────────────────────────────────────────────────────────────
    (
        'Costilla de res 72 horas',
        'Confitada a baja temperatura, con reducción de vino tinto y '
        'tuétano, puré de coliflor ahumada y trufa negra.',
        1, 'fondos', 10,
    ),
    (
        'Filete Wagyu BMS 9',
        'Corte A5 japonés sellado en mantequilla clarificada, con espuma '
        'de mantequilla añeja, shiso y sal de Colima.',
        1, 'fondos', 20,
    ),
    (
        'Chuleta de cordero en costra de hierbas',
        'Rack de cordero neozelandés con chimichurri de epazote, '
        'gratin dauphinois y demi-glace de romero.',
        1, 'fondos', 30,
    ),
    (
        'Lomo de venado en mole negro',
        'Venado de caza mayor con mole negro oaxaqueño de 32 ingredientes, '
        'chayote cristalizado y polvo de chile pasilla.',
        7, 'fondos', 40,
    ),
    (
        'Pato confitado con cerezas',
        'Confit de pato con piel crujiente, salsa de cerezas al Oporto, '
        'lenteja beluga y cebolla perla asada.',
        2, 'fondos', 50,
    ),
    (
        'Branzino en mantequilla tostada',
        'Lubina europea sellada a la plancha, mantequilla noisette '
        'con alcaparras fritas, puré de hinojo y limón en polvo.',
        3, 'fondos', 60,
    ),
    (
        'Langosta al gratén',
        'Langosta del Caribe partida en dos, bisque de coral reducido, '
        'gratinada con gruyère añejo y cebollín.',
        4, 'fondos', 70,
    ),
    (
        'Risotto de hongos silvestres',
        'Arroz Carnaroli con mezcla de morillas, trompetas de la muerte '
        'y shiitake, mantecato con parmigiano y aceite de trufa negra.',
        5, 'fondos', 80,
    ),
    (
        'Robalo en hoja de maguey',
        'Filete de robalo asado en hoja de maguey tatemada, con pipián '
        'verde de pepita, nopales encurtidos y chiltomate.',
        3, 'fondos', 90,
    ),

    # ── POSTRES ───────────────────────────────────────────────────────────────
    (
        'Soufflé de chocolate 72%',
        'Chocolate Valrhona Gran Cru, coulant de frambuesa en el interior, '
        'helado de vainilla de Papantla y cacao en polvo.',
        9, 'postres', 10,
    ),
    (
        'Tarta tatin de manzana',
        'Manzana golden caramelizada en mantequilla de Bretaña, pasta '
        'hojaldrada artesanal, crème fraîche y calvados.',
        9, 'postres', 20,
    ),
    (
        'Cremoso de maracuyá',
        'Cremoso de maracuyá con sorbete de frutos rojos, merengue '
        'suizo tostado y tierra de almendra.',
        9, 'postres', 30,
    ),
    (
        'Tabla de quesos artesanales',
        'Selección de 5 quesos nacionales e importados con '
        'membrillo casero, uvas frescas y pan de nuez.',
        6, 'postres', 40,
    ),
]


class Command(BaseCommand):
    help = 'Carga la carta de alta cocina de ejemplo para un restaurante piloto.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--schema', required=True,
            help='schema_name del restaurante (ej: noma_mx)',
        )
        parser.add_argument(
            '--clear', action='store_true',
            help='Elimina los platillos existentes antes de cargar',
        )

    def handle(self, *args, **options):
        schema = options['schema']

        # Verificar que el tenant existe
        from apps.tenants.models import Restaurant
        try:
            restaurant = Restaurant.objects.get(schema_name=schema)
        except Restaurant.DoesNotExist:
            raise CommandError(
                f'No existe ningún restaurante con schema_name="{schema}". '
                'Créalo primero con: python manage.py bootstrap --restaurant "Nombre" --domain "dominio"'
            )

        with schema_context(schema):
            from apps.menu.models import MenuItem

            if options['clear']:
                deleted, _ = MenuItem.objects.all().delete()
                self.stdout.write(self.style.WARNING(f'  {deleted} platillos eliminados.'))

            created_count = 0
            for name, desc, cat_id, section, order in MENU:
                _, created = MenuItem.objects.get_or_create(
                    name=name,
                    defaults=dict(
                        description=desc,
                        food_category_id=cat_id,
                        section=section,
                        sort_order=order,
                        is_active=True,
                    ),
                )
                status = '✓' if created else '·'
                self.stdout.write(f'  {status}  [{section:<8}]  {name}')
                if created:
                    created_count += 1

        self.stdout.write('')
        self.stdout.write(self.style.SUCCESS(
            f'Carta cargada en "{restaurant.name}": '
            f'{created_count} platillos nuevos de {len(MENU)} en total.'
        ))

        # Resumen por sección
        with schema_context(schema):
            from apps.menu.models import MenuItem
            for section, label in [('entradas','Entradas'),('fondos','Fondos'),('postres','Postres')]:
                count = MenuItem.objects.filter(section=section).count()
                self.stdout.write(f'  {label:<10} {count} platillos')
