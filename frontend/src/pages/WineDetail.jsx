import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { OrnamentDivider } from '../components/ui/Ornament'
import Button from '../components/ui/Button'
import SensoryBars from '../components/SensoryBars'
import { getWineDetail } from '../api/recommendations'
import './WineDetail.css'

export default function WineDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [wine, setWine] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getWineDetail(id)
      .then(setWine)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="page page-centered animate-fade-in">
      <p className="text-muted italic serif">Cargando…</p>
    </div>
  )

  if (!wine) return (
    <div className="page page-centered">
      <p className="text-muted">Vino no encontrado.</p>
      <Button onClick={() => navigate(-1)} style={{ marginTop: 'var(--space-4)' }}>← Volver</Button>
    </div>
  )

  return (
    <div className="page wine-detail animate-fade-up">
      <button className="btn btn--text" onClick={() => navigate(-1)}>← Volver</button>

      {wine.image && (
        <div className="wine-detail__image-wrap">
          <img src={wine.image} alt={wine.name} className="wine-detail__image" />
        </div>
      )}

      <div className="wine-detail__title-block">
        <h1 className="wine-detail__name">
          {wine.name}{wine.vintage ? ` ${wine.vintage}` : ''}
        </h1>
        <p className="wine-detail__winery text-muted">{wine.winery}</p>
        <p className="wine-detail__origin text-muted text-sm">
          {[wine.region, wine.country].filter(Boolean).join(' · ')}
        </p>
        {wine.grapes?.length > 0 && (
          <p className="wine-detail__grapes text-sm text-muted">
            {wine.grapes.join(', ')}
          </p>
        )}
      </div>

      <OrnamentDivider />

      <div className="wine-detail__section">
        <p className="wine-detail__section-label">Atributos</p>
        <SensoryBars sensory={wine.sensory} showAll />
        {wine.sensory && (
          <p className="text-xs text-muted" style={{ marginTop: 'var(--space-3)' }}>
            Temperatura de servicio: {wine.sensory.temperature_min}–{wine.sensory.temperature_max} °C
          </p>
        )}
      </div>

      {wine.pairings?.length > 0 && (
        <>
          <OrnamentDivider />
          <div className="wine-detail__section">
            <p className="wine-detail__section-label">Maridajes ideales</p>
            <ul className="wine-detail__pairings">
              {wine.pairings.map((p) => (
                <li key={p.id}>
                  <span className="text-accent">·</span> {p.food_category_name}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {wine.certifications?.length > 0 && (
        <>
          <OrnamentDivider />
          <div className="wine-detail__certs">
            {wine.certifications.map((c) => (
              <span key={c.id} className="recommendation__cert-badge">✦ {c.name}</span>
            ))}
          </div>
        </>
      )}

      <div className="mt-auto">
        <Button fullWidth onClick={() => navigate('/guardar')}>
          Guardar este vino ♡
        </Button>
      </div>
    </div>
  )
}
