"""
Carga el catálogo de vinos de ejemplo para el piloto.

    docker compose exec backend python manage.py load_sample_wines

Incluye 18 vinos con atributos sensoriales completos, maridajes curados
y certificaciones. Diseñado para probar el motor de recomendación con
un rango representativo de perfiles (ligeros a plenos, secos a dulces).
"""
from django.core.management.base import BaseCommand
from django.db import connection


# ── Datos del catálogo ────────────────────────────────────────────────────────
# Cada entrada: (nombre, bodega, país, región, añada, uvas, tipo, cert_slugs,
#                sensory_dict, pairings_dict)
# pairings_dict: {food_category_slug: (score, nota_sommelier)}

WINES = [

    # ══════════════════════ TINTOS PLENOS ════════════════════════════════════

    (
        'Barolo Riserva',
        'Giacomo Conterno',
        'Italia', 'Piemonte — Serralunga d\'Alba', 2018,
        ['Nebbiolo'],
        'tinto',
        ['organico'],
        dict(body=0.92, acidity=0.78, tannins=0.88, sweetness=0.05,
             salinity=0.15, minerality=0.72, temperature_min=16, temperature_max=18),
        {
            'carnes-rojas':   (0.97, 'El Nebbiolo necesita la grasa y proteína de la carne roja para suavizar sus taninos. Combinación clásica del Piemonte.'),
            'caza-estofados': (0.92, 'Ideal con caza mayor y estofados de cocción lenta; el tiempo en barrica aporta la complejidad que estos platillos exigen.'),
            'quesos':         (0.78, 'Excelente con quesos curados de pasta dura como Parmigiano o Manchego añejo.'),
            'embutidos':      (0.65, 'Funcionable con charcutería italiana, especialmente bresaola.'),
            'pasta-arroces':  (0.70, 'Con ragú de carne; evitar pasta con salsa blanca.'),
        },
    ),

    (
        'Gran Ricardo',
        'Monte Xanic',
        'México', 'Valle de Guadalupe — Baja California', 2019,
        ['Cabernet Sauvignon', 'Merlot', 'Cabernet Franc'],
        'tinto',
        ['sustentable'],
        dict(body=0.85, acidity=0.65, tannins=0.78, sweetness=0.07,
             salinity=0.10, minerality=0.55, temperature_min=16, temperature_max=18),
        {
            'carnes-rojas':   (0.93, 'El ensamble bordelés de Baja California casa naturalmente con carnes rojas a las brasas; los taninos maduros del Valle de Guadalupe aportan estructura sin astringencia.'),
            'caza-estofados': (0.80, 'Soporta bien los sabores intensos de la caza.'),
            'quesos':         (0.70, 'Con quesos semi-curados nacionales como el Chihuahua añejo.'),
            'pasta-arroces':  (0.65, 'Con pastas de carne; su carácter frutal equilibra salsas complejas.'),
            'embutidos':      (0.60, 'Con charcutería artesanal mexicana.'),
        },
    ),

    (
        'Único',
        'Vega Sicilia',
        'España', 'Ribera del Duero', 2012,
        ['Tempranillo', 'Cabernet Sauvignon'],
        'tinto',
        [],
        dict(body=0.90, acidity=0.72, tannins=0.82, sweetness=0.06,
             salinity=0.12, minerality=0.65, temperature_min=16, temperature_max=18),
        {
            'carnes-rojas':   (0.95, 'El Único fue diseñado para acompañar el lechazo castellano; su acidez precisa corta la grasa con elegancia.'),
            'caza-estofados': (0.88, 'Con perdiz, liebre o venado; la complejidad del vino escala con la del platillo.'),
            'quesos':         (0.75, 'Con queso Manchego curado o Idiazábal.'),
            'embutidos':      (0.72, 'Con jamón ibérico de bellota, combinación de alto nivel.'),
        },
    ),

    (
        'Cabernet Sauvignon Adrianna Vineyard',
        'Catena Zapata',
        'Argentina', 'Mendoza — Valle de Uco', 2019,
        ['Cabernet Sauvignon'],
        'tinto',
        ['organico'],
        dict(body=0.88, acidity=0.68, tannins=0.80, sweetness=0.08,
             salinity=0.10, minerality=0.60, temperature_min=16, temperature_max=18),
        {
            'carnes-rojas':   (0.94, 'La altitud del Valle de Uco produce un Cabernet de acidez más fresca que Napa; ideal con cortes madurados en seco.'),
            'caza-estofados': (0.82, 'Con caza roja y estofados a las hierbas.'),
            'quesos':         (0.68, 'Con quesos curados de leche de cabra.'),
            'pasta-arroces':  (0.60, 'Con ragú boloñesa.'),
        },
    ),

    (
        'Malbec Valle de Uco',
        'Zuccardi',
        'Argentina', 'Mendoza — Valle de Uco', 2021,
        ['Malbec'],
        'tinto',
        ['organico', 'sustentable'],
        dict(body=0.78, acidity=0.60, tannins=0.68, sweetness=0.10,
             salinity=0.08, minerality=0.50, temperature_min=16, temperature_max=18),
        {
            'carnes-rojas':   (0.92, 'El Malbec de Valle de Uco es el maridaje clásico con el asado argentino; su fruta madura complementa sin dominar.'),
            'pasta-arroces':  (0.72, 'Con pasta de carne o ragú de hongos.'),
            'quesos':         (0.65, 'Con quesos semi-curados.'),
            'embutidos':      (0.70, 'Con charcutería y embutidos curados.'),
            'vegetariano':    (0.55, 'Con berenjenas asadas o portobello a la brasa.'),
        },
    ),

    (
        'Côte-Rôtie La Landonne',
        'E. Guigal',
        'Francia', 'Rhône Septentrional — Ampuis', 2016,
        ['Syrah'],
        'tinto',
        [],
        dict(body=0.88, acidity=0.70, tannins=0.80, sweetness=0.05,
             salinity=0.18, minerality=0.75, temperature_min=16, temperature_max=18),
        {
            'carnes-rojas':   (0.90, 'La Syrah del Ródano tiene una especiería única (pimienta, aceitunas negras) que se potencia con cortes de res o cordero.'),
            'caza-estofados': (0.95, 'La combinación ideal: la rusticidad mineral de La Landonne con caza mayor como jabalí o venado.'),
            'quesos':         (0.72, 'Con quesos de leche de oveja como Ossau-Iraty o Manchego.'),
        },
    ),

    (
        'Gran Reserva 904',
        'La Rioja Alta',
        'España', 'La Rioja', 2014,
        ['Tempranillo', 'Graciano'],
        'tinto',
        [],
        dict(body=0.80, acidity=0.70, tannins=0.72, sweetness=0.07,
             salinity=0.12, minerality=0.62, temperature_min=16, temperature_max=18),
        {
            'carnes-rojas':   (0.88, 'El Tempranillo riojano con crianza larga es el compañero natural del cordero asado y el cochinillo.'),
            'pasta-arroces':  (0.75, 'Con arroces de carne y guisos de legumbres.'),
            'caza-estofados': (0.82, 'Con codorniz, perdiz y estofados castellanos.'),
            'quesos':         (0.70, 'Con Manchego curado y quesos con denominación de origen española.'),
            'embutidos':      (0.78, 'Con jamón serrano y chorizo curado.'),
        },
    ),

    (
        'Chambolle-Musigny 1er Cru Les Amoureuses',
        'Joseph Drouhin',
        'Francia', 'Borgoña — Chambolle-Musigny', 2019,
        ['Pinot Noir'],
        'tinto',
        [],
        dict(body=0.55, acidity=0.80, tannins=0.45, sweetness=0.07,
             salinity=0.20, minerality=0.85, temperature_min=14, temperature_max=16),
        {
            'carnes-blancas': (0.92, 'El Pinot Noir borgoñés de Chambolle es el maridaje perfecto para el pato, la codorniz o el pollo de corral; su delicadeza no aplasta las carnes blancas.'),
            'pescados':       (0.72, 'Inusual pero magistral con salmón salvaje o atún rojo a baja temperatura.'),
            'quesos':         (0.85, 'Con quesos de pasta blanda como Brie o Camembert; la mineralidad del vino eleva la cremosidad.'),
            'caza-estofados': (0.80, 'Con caza de pluma: pichón, perdiz, codorniz.'),
            'vegetariano':    (0.68, 'Con risotto de hongos silvestres.'),
        },
    ),

    (
        'Nebbiolo',
        'L.A. Cetto',
        'México', 'Valle de Guadalupe — Baja California', 2020,
        ['Nebbiolo'],
        'tinto',
        [],
        dict(body=0.75, acidity=0.72, tannins=0.70, sweetness=0.08,
             salinity=0.10, minerality=0.48, temperature_min=15, temperature_max=17),
        {
            'carnes-rojas':   (0.85, 'El Nebbiolo mexicano tiene menos estructura que el piamontés pero más fruta; ideal con birria de res de alta cocina o estofados mexicanos.'),
            'pasta-arroces':  (0.75, 'Con pasta al amatriciana o a la norma.'),
            'quesos':         (0.65, 'Con quesos mexicanos curados.'),
            'caza-estofados': (0.78, 'Con conejo en mole negro o estofado de venado.'),
        },
    ),

    # ══════════════════════ BLANCOS ═══════════════════════════════════════════

    (
        'Vine Hill Road Chardonnay',
        'Kistler',
        'Estados Unidos', 'Sonoma — Russian River Valley', 2020,
        ['Chardonnay'],
        'blanco',
        [],
        dict(body=0.78, acidity=0.62, tannins=0.04, sweetness=0.12,
             salinity=0.22, minerality=0.65, temperature_min=10, temperature_max=12),
        {
            'carnes-blancas': (0.90, 'El Chardonnay de Kistler con crianza en roble francés eleva cualquier preparación de pollo o pavo con salsa cremosa.'),
            'pescados':       (0.85, 'Con pescados de carne firme como el halibut, el pargo o la lubina en mantequilla.'),
            'mariscos':       (0.78, 'Con langosta o cangrejo al vapor.'),
            'quesos':         (0.80, 'Con quesos de triple crema como Brillat-Savarin.'),
            'pasta-arroces':  (0.82, 'Con risotto de mariscos o pasta con crema y trufa.'),
        },
    ),

    (
        'Bougros Grand Cru',
        'William Fèvre',
        'Francia', 'Borgoña — Chablis', 2019,
        ['Chardonnay'],
        'blanco',
        ['organico'],
        dict(body=0.55, acidity=0.90, tannins=0.03, sweetness=0.04,
             salinity=0.38, minerality=0.95, temperature_min=10, temperature_max=12),
        {
            'mariscos':       (0.97, 'El Grand Cru de Chablis es el maridaje ideal con ostiones: la mineralidad calcárea del suelo kimmeridgiano refleja el mar en cada sorbo.'),
            'pescados':       (0.90, 'Con pescados magros al limón o en ceviche de alta cocina.'),
            'carnes-blancas': (0.70, 'Con pechuga de pollo en salsa de cítricos.'),
            'vegetariano':    (0.72, 'Con espárragos blancos y salsas de hierbas frescas.'),
            'pasta-arroces':  (0.75, 'Con pasta de mariscos o risotto de espárragos.'),
        },
    ),

    (
        'Sauvignon Blanc',
        'Cloudy Bay',
        'Nueva Zelanda', 'Marlborough', 2022,
        ['Sauvignon Blanc'],
        'blanco',
        ['sustentable'],
        dict(body=0.40, acidity=0.88, tannins=0.02, sweetness=0.08,
             salinity=0.30, minerality=0.78, temperature_min=8, temperature_max=10),
        {
            'pescados':       (0.88, 'La acidez vibrante y los aromas de hierba fresca de Marlborough complementan pescados blancos a la plancha y ceviches.'),
            'mariscos':       (0.85, 'Con camarones, almejas y ostiones frescos.'),
            'vegetariano':    (0.80, 'Con ensaladas de hierbas, espárragos y platillos con vinagreta.'),
            'carnes-blancas': (0.72, 'Con pollo en salsa de cítricos o hierbas.'),
            'asiatica':       (0.75, 'Su frescura corta la grasa de la cocina thai y vietnamita.'),
        },
    ),

    (
        'Oberhäuser Brücke Riesling Spätlese',
        'Dönnhoff',
        'Alemania', 'Nahe — Oberhausen', 2021,
        ['Riesling'],
        'blanco',
        [],
        dict(body=0.35, acidity=0.90, tannins=0.02, sweetness=0.48,
             salinity=0.28, minerality=0.92, temperature_min=7, temperature_max=9),
        {
            'asiatica':       (0.95, 'El dulzor residual y la acidez del Riesling Spätlese son el contrapeso perfecto para los picantes y salsas umami de la cocina asiática.'),
            'mariscos':       (0.88, 'Con vieiras selladas o langostinos en salsa de jengibre.'),
            'pescados':       (0.82, 'Con salmón ahumado o trucha de río.'),
            'postres':        (0.78, 'Puede funcionar como vino de postre ligero con frutas amarillas.'),
            'quesos':         (0.75, 'Maridaje sorprendente con quesos azules; la acidez balancea la sal.'),
        },
    ),

    (
        'Pazo de Señorans Albariño',
        'Pazo de Señorans',
        'España', 'Rías Baixas — Salnés', 2022,
        ['Albariño'],
        'blanco',
        [],
        dict(body=0.45, acidity=0.82, tannins=0.03, sweetness=0.09,
             salinity=0.50, minerality=0.80, temperature_min=8, temperature_max=10),
        {
            'mariscos':       (0.97, 'El Albariño gallego nació en la costa; su salinidad y frescura marina no tienen par con mariscos, pulpo a la gallega y percebes.'),
            'pescados':       (0.92, 'Con merluza, rodaballo y pescados a la plancha. La quintaesencia del maridaje gallego.'),
            'asiatica':       (0.78, 'Con sushi y sashimi; la mineralidad complementa el umami del pescado crudo.'),
            'vegetariano':    (0.70, 'Con gazpacho y ensaladas mediterráneas.'),
        },
    ),

    # ══════════════════════ ESPUMOSO ═════════════════════════════════════════

    (
        'Grande Cuvée',
        'Krug',
        'Francia', 'Champagne', None,
        ['Pinot Noir', 'Chardonnay', 'Pinot Meunier'],
        'espumoso',
        [],
        dict(body=0.60, acidity=0.85, tannins=0.08, sweetness=0.18,
             salinity=0.30, minerality=0.78, temperature_min=7, temperature_max=9),
        {
            'mariscos':       (0.95, 'El Champagne Krug y las ostras son una de las grandes uniones de la gastronomía; la mineralidad de la región calcárea dialoga con el yodo del mar.'),
            'pescados':       (0.88, 'Con cualquier pescado noble: caviar, trucha, salmón o lenguado.'),
            'carnes-blancas': (0.80, 'El Krug soporta preparaciones más complejas que un Champagne estándar; ideal con poularde trufada.'),
            'quesos':         (0.82, 'Con quesos de alta cremosidad como Comté joven o Brillat-Savarin.'),
            'postres':        (0.70, 'Con postres de frutos del bosque; evitar los muy dulces.'),
            'embutidos':      (0.75, 'Con jamón ibérico; contraste clásico burbuja-grasa.'),
        },
    ),

    # ══════════════════════ ROSADO ════════════════════════════════════════════

    (
        'Garrus Rosé',
        'Château d\'Esclans',
        'Francia', 'Provenza — Var', 2021,
        ['Grenache', 'Rolle'],
        'rosado',
        ['organico'],
        dict(body=0.52, acidity=0.70, tannins=0.10, sweetness=0.10,
             salinity=0.25, minerality=0.62, temperature_min=8, temperature_max=10),
        {
            'pescados':       (0.88, 'El Garrus, el rosado más premiado de Provenza, eleva cualquier platillo de pescado mediterráneo; su textura cremosa acompaña preparaciones con mantequilla o crema.'),
            'mariscos':       (0.85, 'Con bogavante a la plancha o vieiras con aceite de oliva.'),
            'carnes-blancas': (0.78, 'Con pechuga de pato rosada o pollo al limón.'),
            'vegetariano':    (0.80, 'Con ratatouille provenzal o ensalada niçoise.'),
            'pasta-arroces':  (0.72, 'Con pasta de mariscos o risotto de azafrán.'),
        },
    ),

    # ══════════════════════ DULCE / JEREZ ════════════════════════════════════

    (
        'Pedro Ximénez Viejo',
        'Toro Albalá',
        'España', 'Montilla-Moriles — Córdoba', 2010,
        ['Pedro Ximénez'],
        'dulce',
        [],
        dict(body=0.95, acidity=0.35, tannins=0.05, sweetness=0.98,
             salinity=0.08, minerality=0.20, temperature_min=12, temperature_max=14),
        {
            'postres':        (0.98, 'El PX Toro Albalá sobre helado de vainilla o chocolate negro es uno de los maridajes más hedonistas que existen; la concentración de pasas y dátiles del vino no encuentra rival.'),
            'quesos':         (0.90, 'Con quesos azules como Cabrales o Roquefort; el contraste dulce-salado es magistral.'),
        },
    ),

    (
        'Tokaji Aszú 5 Puttonyos',
        'Royal Tokaji',
        'Hungría', 'Tokaj-Hegyalja', 2017,
        ['Furmint', 'Hárslevelű'],
        'dulce',
        [],
        dict(body=0.70, acidity=0.88, tannins=0.05, sweetness=0.85,
             salinity=0.15, minerality=0.80, temperature_min=10, temperature_max=12),
        {
            'postres':        (0.95, 'El Aszú con su acidez excepcional nunca empalaga; perfecto con postres de frutas cítricas, tartas de manzana o foie gras como entrada dulce.'),
            'quesos':         (0.88, 'Con Roquefort o quesos azules; la acidez del Furmint equilibra la sal del queso.'),
            'carnes-blancas': (0.72, 'En la alta cocina húngara acompaña el foie gras con membrillo.'),
        },
    ),
]


class Command(BaseCommand):
    help = 'Carga el catálogo de vinos de ejemplo para el piloto.'

    def add_arguments(self, parser):
        parser.add_argument('--clear', action='store_true',
                            help='Elimina los vinos existentes antes de cargar')

    def handle(self, *args, **options):
        # Las wines viven en el schema público
        connection.set_schema_to_public()

        from apps.wines.models import (
            Certification, FoodCategory, SensoryAttributes, Wine, WinePairing,
        )

        if options['clear']:
            Wine.objects.all().delete()
            self.stdout.write(self.style.WARNING('Vinos anteriores eliminados.'))

        # Mapa de slugs de certificaciones
        cert_map = {
            'organico':    'Orgánico',
            'biodinamico': 'Biodinámico',
            'sustentable': 'Producción Sostenible',
            'sin-sulfitos': 'Sin Sulfitos Añadidos',
            'vegano':      'Vegano',
            'natural':     'Natural',
        }

        # Mapa de food_category_slug → objeto
        cat_map = {c.slug: c for c in FoodCategory.objects.all()}
        if not cat_map:
            self.stdout.write(self.style.ERROR(
                'No hay categorías de platillo. Ejecuta primero: '
                'python manage.py bootstrap'
            ))
            return

        created_count = 0

        for (name, winery, country, region, vintage, grapes, wine_type,
             cert_slugs, sensory_data, pairings_data) in WINES:

            wine, created = Wine.objects.get_or_create(
                name=name,
                winery=winery,
                vintage=vintage,
                defaults=dict(
                    country=country,
                    region=region,
                    grapes=grapes,
                    wine_type=wine_type,
                    is_active=True,
                ),
            )

            if created:
                # Certificaciones
                for slug in cert_slugs:
                    cert_name = cert_map.get(slug)
                    if cert_name:
                        cert, _ = Certification.objects.get_or_create(name=cert_name)
                        wine.certifications.add(cert)

                # Atributos sensoriales
                SensoryAttributes.objects.get_or_create(wine=wine, defaults=sensory_data)

                # Maridajes
                for food_slug, (score, note) in pairings_data.items():
                    category = cat_map.get(food_slug)
                    if category:
                        WinePairing.objects.get_or_create(
                            wine=wine,
                            food_category=category,
                            defaults=dict(score=score, sommelier_note=note),
                        )

                created_count += 1
                self.stdout.write(
                    f'  ✓  {wine_type.upper():<10} {name} — {winery} ({vintage or "S/A"})'
                )
            else:
                self.stdout.write(f'  ·  (ya existe) {name} — {winery}')

        self.stdout.write('')
        self.stdout.write(self.style.SUCCESS(
            f'Catálogo cargado: {created_count} vinos nuevos de {len(WINES)} en total.'
        ))
        self.stdout.write('')
        self.stdout.write('Resumen por tipo:')
        for wine_type, label in [('tinto','Tintos'), ('blanco','Blancos'),
                                   ('espumoso','Espumosos'), ('rosado','Rosados'),
                                   ('dulce','Dulces/Jerez')]:
            count = Wine.objects.filter(wine_type=wine_type).count()
            if count:
                self.stdout.write(f'  {label:<12} {count}')
