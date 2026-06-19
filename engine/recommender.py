"""Motor de recomendación MVP — reglas curadas por sommelier."""
from django.conf import settings

from .protocol import RecommendationResult
from .scoring import euclidean_similarity, get_pairing_score, get_certification_bonus


def recommend(
    profile_vector: list[float | None],
    food_category_id: int,
    available_wine_ids: list[int],
    preferred_certifications: list[str] | None = None,
) -> list[RecommendationResult]:
    """
    Genera hasta 3 recomendaciones ordenadas por score compuesto.
    Filtra exclusivamente dentro de available_wine_ids.
    """
    if not available_wine_ids:
        return []

    weights = getattr(settings, 'ENGINE_WEIGHTS', {
        'sensory_profile': 0.45,
        'pairing': 0.45,
        'certifications': 0.10,
    })
    preferred_certifications = preferred_certifications or []

    scored: list[tuple] = []
    for wine_id in available_wine_ids:
        wine_vector = _get_wine_vector(wine_id)
        if wine_vector is None:
            continue

        profile_score = euclidean_similarity(profile_vector, wine_vector)
        pairing_score = get_pairing_score(wine_id, food_category_id)
        cert_bonus = get_certification_bonus(wine_id, preferred_certifications)

        total = (
            weights['sensory_profile'] * profile_score
            + weights['pairing'] * pairing_score
            + weights['certifications'] * cert_bonus
        )
        scored.append((wine_id, total, profile_score, pairing_score))

    scored.sort(key=lambda x: x[1], reverse=True)

    return [
        RecommendationResult(
            wine_id=wine_id,
            match_score=round(total, 4),
            profile_score=round(prof, 4),
            pairing_score=round(pair, 4),
            was_optimal=True,
        )
        for wine_id, total, prof, pair in scored[:3]
    ]


def _get_wine_vector(wine_id: int) -> list[float] | None:
    from django_tenants.utils import schema_context
    with schema_context('public'):
        from apps.wines.models import SensoryAttributes
        try:
            return SensoryAttributes.objects.get(wine_id=wine_id).as_vector()
        except SensoryAttributes.DoesNotExist:
            return None
