"""Funciones de puntuación para el motor de recomendación."""
import math


def euclidean_similarity(
    profile_vector: list[float | None],
    wine_vector: list[float],
) -> float:
    """
    Similitud entre el perfil del comensal y los atributos del vino.
    Ignora dimensiones donde el perfil no está definido (None).
    Retorna 0.5 si no hay ninguna dimensión definida (score neutral).
    """
    pairs = [
        (p, w)
        for p, w in zip(profile_vector, wine_vector)
        if p is not None
    ]
    if not pairs:
        return 0.5
    distance = math.sqrt(sum((p - w) ** 2 for p, w in pairs) / len(pairs))
    return max(0.0, 1.0 - distance)


def get_pairing_score(wine_id: int, food_category_id: int) -> float:
    """Recupera el score de maridaje definido por el sommelier."""
    from django_tenants.utils import schema_context
    with schema_context('public'):
        from apps.wines.models import WinePairing
        pairing = WinePairing.objects.filter(
            wine_id=wine_id,
            food_category_id=food_category_id,
        ).first()
        return float(pairing.score) if pairing else 0.0


def get_certification_bonus(wine_id: int, preferred_certs: list[str]) -> float:
    """Bonus por coincidencia de certificaciones preferidas por el comensal."""
    if not preferred_certs:
        return 0.0
    from django_tenants.utils import schema_context
    with schema_context('public'):
        from apps.wines.models import Wine
        wine_cert_names = list(
            Wine.objects.filter(id=wine_id)
            .values_list('certifications__name', flat=True)
        )
    matches = sum(1 for c in preferred_certs if c in wine_cert_names)
    return min(1.0, matches / len(preferred_certs))
