import { useEffect, useState } from 'react'
import { getArchetypeInsights } from '../../api/partner'
import { IconUsers, IconSparkle, IconDiamond } from './icons'
import './Partner.css'

/* ── Distribution bar row ──────────────────────────────────── */
function ArchetypeBar({ archetype, max }) {
  const pct = max > 0 ? Math.round((archetype.count / max) * 100) : 0
  return (
    <div className="p-archetype-row">
      <div className="p-archetype-row__name">
        <span className="p-archetype-row__icon">{archetype.icon}</span>
        {archetype.name.replace('El ', '')}
      </div>
      <div className="p-archetype-row__bar-wrap">
        <div
          className="p-archetype-row__bar-fill"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="p-archetype-row__count">{archetype.count}</span>
    </div>
  )
}

/* ── Archetype detail card ─────────────────────────────────── */
function ArchetypeCard({ archetype, total }) {
  const pct = total > 0 ? Math.round((archetype.count / total) * 100) : 0
  return (
    <div className="p-archetype-card">
      <div className="p-archetype-card__head">
        <div className="p-archetype-card__icon">{archetype.icon}</div>
        <div>
          <p className="p-archetype-card__name">{archetype.name}</p>
          <p className="p-archetype-card__count">
            {archetype.count} comensal{archetype.count !== 1 ? 'es' : ''} · {pct}%
          </p>
        </div>
      </div>
      <p className="p-archetype-card__desc">{archetype.description}</p>
    </div>
  )
}

/* ── Main page ─────────────────────────────────────────────── */
export default function PartnerArchetypes() {
  const [data, setData]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)

  useEffect(() => {
    getArchetypeInsights()
      .then(setData)
      .catch(() => setError('No se pudieron cargar los insights.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-loading">Analizando perfiles sensoriales…</div>
  if (error)   return <div className="p-alert p-alert--error">{error}</div>

  const archetypes = data?.archetypes ?? []
  const total = data?.total_diners ?? 0
  const maxCount = Math.max(...archetypes.map(a => a.count), 1)

  const topArchetype = archetypes[0]

  return (
    <div>
      <div className="p-page-header">
        <h1 className="p-page-header__title">Insights de Arquetipos</h1>
        <p className="p-page-header__sub">Perfil sensorial de tus comensales</p>
      </div>

      {/* Summary KPIs */}
      <div className="p-kpi-grid">
        <div className="p-kpi">
          <div className="p-kpi__top">
            <p className="p-kpi__label">Comensales con perfil</p>
            <span className="p-kpi__icon"><IconUsers width={15} height={15} /></span>
          </div>
          <p className="p-kpi__value">{total}</p>
          <p className="p-kpi__detail">Han completado el cuestionario sensorial</p>
        </div>
        <div className="p-kpi">
          <div className="p-kpi__top">
            <p className="p-kpi__label">Arquetipo dominante</p>
            <span className="p-kpi__icon p-kpi__icon--success"><IconSparkle width={15} height={15} /></span>
          </div>
          <p className="p-kpi__value" style={{ fontSize: 19 }}>
            {topArchetype ? `${topArchetype.icon} ${topArchetype.name}` : '—'}
          </p>
          {topArchetype && (
            <p className="p-kpi__detail">
              {Math.round((topArchetype.count / Math.max(total, 1)) * 100)}% de tus comensales
            </p>
          )}
        </div>
        <div className="p-kpi">
          <div className="p-kpi__top">
            <p className="p-kpi__label">Arquetipos presentes</p>
            <span className="p-kpi__icon p-kpi__icon--blue"><IconDiamond width={15} height={15} /></span>
          </div>
          <p className="p-kpi__value">{archetypes.length}</p>
          <p className="p-kpi__detail">De 8 posibles perfiles de paladar</p>
        </div>
      </div>

      {/* Distribution chart */}
      {archetypes.length > 0 ? (
        <>
          <div className="p-card p-section">
            <div className="p-card-header">
              <span className="p-card-header__title">Distribución de arquetipos</span>
              <span className="p-card-header__sub">{total} comensales con perfil</span>
            </div>
            <div className="p-card-body">
              <div className="p-archetype-list">
                {archetypes.map(a => (
                  <ArchetypeBar key={a.key} archetype={a} max={maxCount} />
                ))}
              </div>
            </div>
          </div>

          {/* Archetype cards */}
          <div className="p-section">
            <div className="p-section__header">
              <span className="p-section__title">Perfiles de tus comensales</span>
            </div>
            <div className="p-archetype-cards">
              {archetypes.map(a => (
                <ArchetypeCard key={a.key} archetype={a} total={total} />
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="p-card">
          <div className="p-empty">
            <p>Aún no hay comensales con perfil sensorial completo.</p>
            <p style={{ marginTop: 8 }}>
              Los arquetipos se construyen a medida que los comensales completan
              el cuestionario de preferencias.
            </p>
          </div>
        </div>
      )}

      {/* Explainer */}
      <div className="p-card" style={{ marginTop: 24 }}>
        <div className="p-card-header">
          <span className="p-card-header__title">¿Qué son los arquetipos?</span>
        </div>
        <div className="p-card-body">
          <p style={{ fontSize: 13, color: 'var(--p-text-muted)', lineHeight: 1.7 }}>
            El motor de El Paladar analiza las preferencias sensoriales de cada comensal —
            cuerpo, acidez, taninos, dulzor, salinidad y mineralidad — y los clasifica
            en uno de <strong>8 arquetipos de paladar</strong>. Esta información te permite
            anticipar qué estilos de vino tendrán mayor acogida en tu restaurante y
            optimizar tu carta para el perfil real de tus clientes.
          </p>
        </div>
      </div>
    </div>
  )
}
