"""
Clasifica a un comensal en uno de los 8 arquetipos de paladar
basándose en su vector de preferencias sensoriales.
"""
import math

# Orden del vector: body, acidity, tannins, sweetness, salinity, minerality
TYPES = [
    {
        'key': 'tanico_robusto',
        'name': 'El Tánico Robusto',
        'description': 'Prefiere vinos de gran estructura, taninos firmes y presencia imponente en boca. Disfruta los grandes tintos de guarda.',
        'icon': '◼',
        'vector': [0.85, 0.45, 0.88, 0.15, 0.30, 0.40],
    },
    {
        'key': 'aficionado_fresco',
        'name': 'El Aficionado Fresco',
        'description': 'Ama la energía de la acidez y la ligereza. Busca vinos que refrescan y despiertan el paladar con viveza.',
        'icon': '◇',
        'vector': [0.30, 0.88, 0.22, 0.15, 0.45, 0.55],
    },
    {
        'key': 'mineral_puro',
        'name': 'El Mineral Puro',
        'description': 'Aprecia la tensión mineral y la pureza en cada sorbo. Los vinos de suelos únicos son su pasión.',
        'icon': '◈',
        'vector': [0.40, 0.75, 0.28, 0.10, 0.50, 0.92],
    },
    {
        'key': 'marino',
        'name': 'El Marino',
        'description': 'Tiene predilección por notas salinas y yodadas que evocan el mar. Mariscos y blancos atlánticos son su mundo.',
        'icon': '≋',
        'vector': [0.38, 0.65, 0.25, 0.18, 0.88, 0.68],
    },
    {
        'key': 'hedonista',
        'name': 'El Hedonista',
        'description': 'Busca vinos expresivos, generosos y con cuerpo pleno. La fruta y la riqueza son sus aliados.',
        'icon': '❧',
        'vector': [0.80, 0.38, 0.52, 0.48, 0.22, 0.28],
    },
    {
        'key': 'gourmand',
        'name': 'El Gourmand',
        'description': 'Disfruta del dulzor elegante y los vinos que acompañan los grandes postres y la cocina más elaborada.',
        'icon': '✦',
        'vector': [0.58, 0.28, 0.22, 0.80, 0.18, 0.25],
    },
    {
        'key': 'equilibrado',
        'name': 'El Equilibrado',
        'description': 'Aprecia la armonía perfecta entre todas las dimensiones. Versátil y curioso, disfruta casi cualquier estilo.',
        'icon': '⊙',
        'vector': [0.50, 0.50, 0.50, 0.40, 0.45, 0.45],
    },
    {
        'key': 'explorador',
        'name': 'El Explorador',
        'description': 'Todavía descubriendo su paladar. Cada copa es una nueva aventura sin mapa.',
        'icon': '✈',
        'vector': [0.50, 0.50, 0.50, 0.50, 0.50, 0.50],
    },
]


def _euclidean(v1: list[float], v2: list[float]) -> float:
    return math.sqrt(sum((a - b) ** 2 for a, b in zip(v1, v2)))


def classify(profile_vector: list[float | None]) -> dict:
    """
    Recibe el vector sensorial del comensal (6 dimensiones, puede tener None)
    y devuelve el arquetipo más cercano como dict.
    """
    # Rellenar None con 0.5 (neutro) para el cálculo
    filled = [v if v is not None else 0.5 for v in profile_vector]

    # Si el perfil está casi completamente en blanco, devolver explorador
    known = [v for v in profile_vector if v is not None]
    if len(known) < 2:
        return next(t for t in TYPES if t['key'] == 'explorador')

    best = min(TYPES, key=lambda t: _euclidean(filled, t['vector']))
    return best


def get_type_by_key(key: str) -> dict | None:
    return next((t for t in TYPES if t['key'] == key), None)
