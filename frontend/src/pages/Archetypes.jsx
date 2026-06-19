import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'
import { getAllPaladarTypes } from '../api/social'
import './Archetypes.css'

export default function Archetypes() {
  const navigate = useNavigate()
  const [types, setTypes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllPaladarTypes().then(setTypes).finally(() => setLoading(false))
  }, [])

  return (
    <div className="page archetypes">
      <div className="archetypes__header">
        <button className="btn btn--text" onClick={() => navigate('/perfil')}>← Perfil</button>
        <h2 className="serif">Los 8 Paladares</h2>
        <p className="text-muted text-xs">Descubre qué tipo de catador eres y encuentra tu tribu</p>
      </div>

      {loading ? (
        <p className="text-muted text-sm" style={{ padding: 'var(--space-4)' }}>Cargando…</p>
      ) : (
        <div className="archetypes__grid">
          {types.map(t => (
            <button
              key={t.key}
              className="archetype-card card"
              onClick={() => navigate(`/red?archetype=${t.key}`)}
            >
              <span className="archetype-card__icon serif">{t.icon}</span>
              <div className="archetype-card__body">
                <h3 className="archetype-card__name serif">{t.name}</h3>
                <p className="archetype-card__desc text-xs text-muted">{t.description}</p>
              </div>
              <span className="archetype-card__count text-xs text-muted">
                {t.member_count} {t.member_count === 1 ? 'miembro' : 'miembros'}
              </span>
            </button>
          ))}
        </div>
      )}

      <div style={{ height: 80 }} />
      <NavBar />
    </div>
  )
}
