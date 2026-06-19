from typing import Protocol, runtime_checkable
from dataclasses import dataclass, field


@dataclass
class RecommendationResult:
    wine_id: int
    match_score: float
    profile_score: float
    pairing_score: float
    was_optimal: bool
    alternative_reason: str = field(default='')


@runtime_checkable
class RecommendationEngine(Protocol):
    """
    Contrato del motor de recomendación.
    En el MVP se implementa con reglas curadas por el sommelier.
    En Fase 3 se puede sustituir por un servicio ML sin modificar la API.
    """

    def recommend(
        self,
        profile_vector: list[float | None],
        food_category_id: int,
        available_wine_ids: list[int],
        preferred_certifications: list[str] | None = None,
    ) -> list[RecommendationResult]: ...
