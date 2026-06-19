import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { OrnamentDivider } from '../components/ui/Ornament'
import Button from '../components/ui/Button'
import SensoryBars from '../components/SensoryBars'
import NavBar from '../components/NavBar'
import { getMyPaladarType } from '../api/social'
import useDinerStore from '../store/useDinerStore'
import './Profile.css'

export default function Profile() {
  const navigate = useNavigate()
  const { dinerId, isGuest } = useDinerStore()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!dinerId) { setLoading(false); return }
    getMyPaladarType(dinerId).then(setProfile).finally(() => setLoading(false))
  }, [dinerId])

  if (isGuest || !dinerId) {
    return (
      <div className="page page-centered">
        <p className="serif" style={{ fontSize: 'var(--text-5xl)', opacity: 0.15 }}>✦</p>
        <p className="text-muted text-sm" style={{ textAlign: 'center' }}>
          Crea una cuenta para descubrir<br />tu arquetipo de paladar.
        </p>
        <Button style={{ marginTop: 'var(--space-4)' }} onClick={() => navigate('/registro')}>
          Crear mi cuenta
        </Button>
        <NavBar />
      </div>
    )
  }

  if (loading) return (
    <div className="page page-centered">
      <p className="text-muted text-sm">Cargando tu perfil…</p>
      <NavBar />
    </div>
  )

  if (!profile) return <div className="page page-centered"><NavBar /></div>

  const { paladar_type: pt, email_display, stats, sensory } = profile
  const hasProfile = sensory && Object.values(sensory).some(v => v !== null)

  return (
    <div className="page profile">
      {/* Arquetipo — protagonista de la pantalla */}
      <div className="profile__hero">
        <span className="profile__hero-icon serif">{pt.icon}</span>
        <h1 className="profile__type-name serif">{pt.name}</h1>
        <p className="profile__type-desc text-muted">{pt.description}</p>
        {!hasProfile && (
          <button
            className="profile__questionnaire-cta text-xs"
            onClick={() => navigate('/cuestionario')}
          >
            ✦ Tomar cuestionario para afinar tu arquetipo
          </button>
        )}
      </div>

      <OrnamentDivider />

      {/* Handle y estadísticas */}
      <div className="profile__identity">
        <p className="profile__handle">@{email_display}</p>
        <div className="profile__stats">
          <div className="profile__stat">
            <span className="profile__stat-value">{stats.posts}</span>
            <span className="text-xs text-muted">Publicaciones</span>
          </div>
          <div className="profile__stat">
            <span className="profile__stat-value">{stats.followers}</span>
            <span className="text-xs text-muted">Seguidores</span>
          </div>
          <div className="profile__stat">
            <span className="profile__stat-value">{stats.following}</span>
            <span className="text-xs text-muted">Siguiendo</span>
          </div>
        </div>
      </div>

      {/* Firma sensorial */}
      {sensory && Object.values(sensory).some(v => v !== null) && (
        <>
          <OrnamentDivider />
          <div className="profile__sensory">
            <p className="text-xs text-muted profile__sensory-label">Tu firma sensorial</p>
            <SensoryBars sensory={sensory} showAll />
          </div>
        </>
      )}

      <OrnamentDivider />

      {/* Acciones */}
      <div className="profile__actions">
        <Button fullWidth onClick={() => navigate('/carta')}>
          Nueva recomendación →
        </Button>
        <Button variant="ghost" fullWidth onClick={() => navigate('/mi-bodega')}>
          Ver mi muro
        </Button>
        <Button variant="ghost" fullWidth onClick={() => navigate('/arquetipos')}>
          Los 8 Paladares ◈
        </Button>
      </div>

      <div style={{ height: 80 }} />
      <NavBar />
    </div>
  )
}
