import { useEffect, useState } from 'react'
import { getDashboardStats, getWeeklyTrend } from '../../api/partner'
import './Partner.css'

/* ── Mini bar-chart (pure CSS) ──────────────────────────────── */
function BarChart({ trend }) {
  const max = Math.max(...trend.map(d => d.count), 1)

  const formatDay = (dayStr) => {
    const d = new Date(dayStr + 'T12:00:00')
    return d.toLocaleDateString('es-MX', { weekday: 'short' })
  }

  return (
    <div className="p-bar-chart">
      {trend.map((d) => (
        <div className="p-bar-chart__col" key={d.day}>
          <div
            className="p-bar-chart__bar"
            style={{ height: `${(d.count / max) * 100}%` }}
            data-count={d.count}
            title={`${d.day}: ${d.count}`}
          />
          <span className="p-bar-chart__label">{formatDay(d.day)}</span>
        </div>
      ))}
    </div>
  )
}

/* ── KPI card ────────────────────────────────────────────────── */
function KpiCard({ label, value, detail, accent }) {
  return (
    <div className="p-kpi">
      <p className="p-kpi__label">{label}</p>
      <p className={`p-kpi__value${accent ? ` p-kpi__value--${accent}` : ''}`}>
        {value ?? '—'}
      </p>
      {detail && <p className="p-kpi__detail">{detail}</p>}
    </div>
  )
}

/* ── Top wine pills ──────────────────────────────────────────── */
function TopWinesList({ wines }) {
  if (!wines?.length) {
    return <p className="p-empty" style={{ padding: '16px', textAlign: 'left' }}>Sin recomendaciones hoy todavía.</p>
  }
  return (
    <ol style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {wines.map((w, i) => (
        <li key={w.wine_id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < wines.length - 1 ? '1px solid var(--p-border)' : 'none' }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--p-text-faint)', width: 18 }}>{i + 1}</span>
          <span style={{ flex: 1, fontSize: 13, color: 'var(--p-text)', fontWeight: 500 }}>
            Vino #{w.wine_id}
          </span>
          <span style={{ fontSize: 12, color: 'var(--p-text-muted)', background: 'var(--p-border)', padding: '2px 8px', borderRadius: 999 }}>
            {w.count} rec.
          </span>
        </li>
      ))}
    </ol>
  )
}

/* ── Main Dashboard ──────────────────────────────────────────── */
export default function PartnerDashboard() {
  const [stats, setStats] = useState(null)
  const [trend, setTrend] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([getDashboardStats(), getWeeklyTrend()])
      .then(([s, t]) => {
        setStats(s)
        setTrend(t.trend || [])
      })
      .catch(() => setError('No se pudo cargar el dashboard.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-loading">Cargando dashboard…</div>
  if (error)   return <div className="p-alert p-alert--error">{error}</div>

  const rating = stats?.average_rating
  const ratingStr = rating ? `${rating.toFixed(1)} ★` : '—'

  return (
    <div>
      {/* KPIs */}
      <div className="p-kpi-grid">
        <KpiCard
          label="Recomendaciones hoy"
          value={stats?.recommendations_today ?? 0}
          detail="Total de servicios del día"
          accent="accent"
        />
        <KpiCard
          label="Calificación promedio"
          value={ratingStr}
          detail="Promedio histórico de comensales"
          accent="success"
        />
        <KpiCard
          label="Vinos en top hoy"
          value={stats?.top_wines_today?.length ?? 0}
          detail="Diferentes etiquetas recomendadas"
        />
      </div>

      {/* Trend + Top wines */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 24 }}>
        <div className="p-card">
          <div className="p-card-header">
            <span className="p-card-header__title">Tendencia semanal</span>
            <span className="p-card-header__sub">Últimos 7 días</span>
          </div>
          <div className="p-card-body" style={{ paddingBottom: 28 }}>
            {trend.length === 0 ? (
              <p className="p-empty" style={{ padding: 0, textAlign: 'left' }}>
                Sin datos de esta semana aún.
              </p>
            ) : (
              <BarChart trend={trend} />
            )}
          </div>
        </div>

        <div className="p-card">
          <div className="p-card-header">
            <span className="p-card-header__title">Top vinos hoy</span>
            <span className="p-card-header__sub">Por volumen</span>
          </div>
          <div className="p-card-body">
            <TopWinesList wines={stats?.top_wines_today} />
          </div>
        </div>
      </div>

      {/* Quick links info card */}
      <div className="p-card">
        <div className="p-card-body" style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <span style={{ fontSize: 32, opacity: 0.3 }}>◈</span>
          <div>
            <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>
              ¿Qué más puedes hacer?
            </p>
            <p style={{ fontSize: 13, color: 'var(--p-text-muted)', lineHeight: 1.6 }}>
              Gestiona tu carta de vinos en <strong>Inventario</strong> — activa o desactiva etiquetas,
              ajusta precios por copa y botella en tiempo real.<br />
              Explora el perfil sensorial de tus comensales en <strong>Arquetipos</strong> para
              personalizar recomendaciones y descubrir oportunidades.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
