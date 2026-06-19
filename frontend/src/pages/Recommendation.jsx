import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import SensoryBars from '../components/SensoryBars'
import { OrnamentDivider } from '../components/ui/Ornament'
import NavBar from '../components/NavBar'
import { getRecommendation } from '../api/recommendations'
import { createPost } from '../api/social'
import { classifyPaladar } from '../engine/paladarType'
import useDinerStore from '../store/useDinerStore'
import './Recommendation.css'

export default function Recommendation() {
  const navigate = useNavigate()
  const { dinerId, isGuest, selectedDish, tableNumber, questionnaire, setRecommendation, recommendation } = useDinerStore()
  const [loading, setLoading] = useState(!recommendation)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Arquetipo calculado localmente (body, acidity, tannins, sweetness, salinity≈inferred, minerality≈inferred)
  const paladarType = useMemo(() => {
    if (!questionnaire) return null
    const { body, acidity, tannins, sweetness } = questionnaire
    const salinity = Math.min(0.9, 0.2 + acidity * 0.45 + (1 - sweetness) * 0.15)
    const minerality = Math.min(0.95, 0.25 + acidity * 0.35 + (1 - sweetness) * 0.25)
    return classifyPaladar([body, acidity, tannins, sweetness, salinity, minerality])
  }, [questionnaire])

  useEffect(() => {
    if (recommendation) return
    if (!selectedDish) { navigate('/carta'); return }

    getRecommendation(dinerId, selectedDish.id, tableNumber)
      .then((data) => {
        setRecommendation(data)
      })
      .catch(() => setError('No pudimos generar tu recomendación. Intenta de nuevo.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingScreen />
  if (error) return <ErrorScreen message={error} onRetry={() => { setError(null); setLoading(true) }} />

  const { wine, explanation, match_score, pairing_score, was_optimal, price_glass, price_bottle, alternatives } = recommendation

  async function handleGuardar() {
    if (isGuest || !dinerId) {
      navigate('/registro')
      return
    }
    if (saved) {
      navigate('/mi-bodega')
      return
    }
    setSaving(true)
    try {
      await createPost(dinerId, {
        wine_id: wine.id,
        wine_name: `${wine.name}${wine.vintage ? ` ${wine.vintage}` : ''}`,
        winery: wine.winery || '',
        dish_name: selectedDish?.name || '',
        note: '',
        is_public: true,
      })
      setSaved(true)
      navigate('/mi-bodega')
    } catch {
      // Si falla, al menos navegar al muro
      navigate('/mi-bodega')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page recommendation animate-fade-up">
      {/* Cabecera */}
      <div className="recommendation__header">
        <button className="btn btn--text" onClick={() => navigate('/carta')}>← Cambiar platillo</button>
        <p className="text-muted text-sm">Tu vino para esta noche</p>
      </div>

      {/* Imagen del vino */}
      <div className="recommendation__image-wrap">
        {wine.image ? (
          <img src={wine.image} alt={wine.name} className="recommendation__image" />
        ) : (
          <div className="recommendation__image-placeholder">
            <span className="serif" style={{ fontSize: 'var(--text-4xl)', opacity: 0.2 }}>❦</span>
          </div>
        )}
        {!was_optimal && (
          <div className="recommendation__alt-badge">Mejor alternativa disponible</div>
        )}
      </div>

      {/* Nombre y bodega */}
      <div className="recommendation__title-block">
        <h1 className="recommendation__wine-name">{wine.name}{wine.vintage ? ` ${wine.vintage}` : ''}</h1>
        <p className="recommendation__winery text-muted">{wine.winery} · {wine.region}</p>
        {wine.certifications?.length > 0 && (
          <div className="recommendation__certs">
            {wine.certifications.map((c) => (
              <span key={c} className="recommendation__cert-badge">✦ {c}</span>
            ))}
          </div>
        )}
      </div>

      <OrnamentDivider />

      {/* Explicación del sommelier */}
      <blockquote className="recommendation__explanation">
        {explanation}
      </blockquote>

      <OrnamentDivider />

      {/* Perfil sensorial */}
      <div className="recommendation__sensory">
        <p className="text-xs text-muted" style={{ letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 'var(--space-3)' }}>
          Afinidad con tu perfil
        </p>
        <SensoryBars sensory={wine.sensory} />
        <div className="recommendation__scores">
          <div>
            <span className="recommendation__score-value">{Math.round(match_score * 100)}%</span>
            <span className="text-xs text-muted">Match total</span>
          </div>
          <div>
            <span className="recommendation__score-value">{Math.round(pairing_score * 100)}%</span>
            <span className="text-xs text-muted">Maridaje</span>
          </div>
        </div>
      </div>

      {/* Badge de arquetipo */}
      {paladarType && (
        <div className="recommendation__archetype-badge">
          <span className="serif">{paladarType.icon}</span>
          <span className="text-xs text-muted">
            Recomendado para <strong>{paladarType.name}</strong>
          </span>
        </div>
      )}

      {/* Precio */}
      {(price_glass || price_bottle) && (
        <div className="recommendation__price">
          {price_glass && <span>Copa&nbsp;&nbsp;<strong>${price_glass}</strong></span>}
          {price_bottle && <span>Botella&nbsp;&nbsp;<strong>${price_bottle}</strong></span>}
        </div>
      )}

      {/* CTAs */}
      <div className="recommendation__actions mt-auto">
        {saved ? (
          <Button fullWidth size="lg" onClick={() => navigate('/mi-bodega')}>
            Ver en mi bodega →
          </Button>
        ) : (
          <Button fullWidth size="lg" onClick={handleGuardar} disabled={saving}>
            {saving ? 'Guardando…' : isGuest ? 'Guardar este vino ♡' : 'Compartir en la red ✦'}
          </Button>
        )}
        <div className="recommendation__secondary">
          <Button variant="ghost" onClick={() => navigate(`/vino/${wine.id}`)}>
            Ver ficha completa
          </Button>
          {alternatives?.length > 0 && (
            <Button variant="ghost" onClick={() => navigate('/carta')}>
              Ver alternativas
            </Button>
          )}
        </div>
      </div>

      {!isGuest && <div style={{ height: 80 }} />}
      {!isGuest && <NavBar />}
    </div>
  )
}

function LoadingScreen() {
  return (
    <div className="page page-centered animate-fade-in">
      <div className="loading-sommelier">
        <span className="serif loading-sommelier__text">
          El sommelier está eligiendo<br />
          <span className="italic text-muted">tu vino…</span>
        </span>
        <div className="loading-sommelier__dots">
          <span /><span /><span />
        </div>
      </div>
    </div>
  )
}

function ErrorScreen({ message, onRetry }) {
  return (
    <div className="page page-centered">
      <p className="text-muted">{message}</p>
      <Button onClick={onRetry} style={{ marginTop: 'var(--space-4)' }}>Reintentar</Button>
    </div>
  )
}
