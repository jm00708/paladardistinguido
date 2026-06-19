"""Generador de explicaciones en lenguaje natural usando Claude."""
import anthropic
from django.conf import settings

_client: anthropic.Anthropic | None = None


def _get_client() -> anthropic.Anthropic | None:
    global _client
    if _client is None:
        api_key = getattr(settings, 'ANTHROPIC_API_KEY', '') or ''
        if not api_key:
            return None
        _client = anthropic.Anthropic(api_key=api_key)
    return _client


def _fallback_explanation(wine_name: str, winery: str, dish_name: str, profile_score: float, was_optimal: bool) -> str:
    score_desc = 'excelente' if profile_score >= 0.7 else 'muy buena' if profile_score >= 0.5 else 'interesante'
    alt = ' (la primera opción no estaba disponible esta noche, pero este es el maridaje más cercano)' if not was_optimal else ''
    return (
        f"El {wine_name} de {winery} es una {score_desc} elección para acompañar {dish_name}{alt}. "
        f"Su perfil sensorial complementa los sabores del platillo, creando un equilibrio que realza "
        f"la experiencia gastronómica. Confíe en este maridaje para una noche memorable."
    )


def generate_explanation(
    wine_name: str,
    winery: str,
    region: str,
    profile_score: float,
    pairing_note: str,
    diner_profile_summary: str,
    dish_name: str,
    was_optimal: bool,
    alternative_reason: str = '',
    language: str = 'es',
) -> str:
    lang_instruction = 'en español' if language == 'es' else 'in English'

    alt_note = ''
    if not was_optimal:
        alt_note = (
            f'\nNota: el vino ideal no estaba disponible esta noche. '
            f'Esta es la mejor alternativa. Motivo: {alternative_reason}'
        )

    prompt = f"""Eres el sommelier digital de un restaurante de alta cocina.
Tu tono es cálido, experto y nunca condescendiente.

Perfil del comensal: {diner_profile_summary}
Platillo elegido: {dish_name}
Vino recomendado: {wine_name}, {winery} ({region})
Afinidad con el perfil: {profile_score * 100:.0f}%
Nota de maridaje del sommelier: {pairing_note or 'no disponible'}
{alt_note}

Escribe una explicación de 3 a 4 oraciones {lang_instruction} que justifique \
esta recomendación de forma personal y específica para este comensal y este platillo. \
No uses frases genéricas. Si es una alternativa, menciona brevemente que el vino \
ideal no estaba disponible y por qué este es el más cercano."""

    client = _get_client()
    if client is None:
        return _fallback_explanation(wine_name, winery, dish_name, profile_score, was_optimal)

    message = client.messages.create(
        model=settings.ANTHROPIC_MODEL,
        max_tokens=300,
        messages=[{'role': 'user', 'content': prompt}],
    )
    return message.content[0].text
