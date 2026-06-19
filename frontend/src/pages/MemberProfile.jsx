import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { OrnamentDivider } from '../components/ui/Ornament'
import Button from '../components/ui/Button'
import NavBar from '../components/NavBar'
import { getMyPaladarType, toggleFollow } from '../api/social'
import client from '../api/client'
import useDinerStore from '../store/useDinerStore'
import './Profile.css'
import './MemberProfile.css'

export default function MemberProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { dinerId, isGuest } = useDinerStore()
  const memberId = parseInt(id, 10)

  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [following, setFollowing] = useState(false)

  useEffect(() => {
    Promise.all([
      getMyPaladarType(memberId),
      client.get('/social/wall/', { params: { diner_id: memberId } }).then(r => r.data),
    ])
      .then(([prof, wall]) => {
        setProfile(prof)
        setPosts(wall)
      })
      .finally(() => setLoading(false))
  }, [memberId])

  const handleFollow = async () => {
    if (!dinerId || isGuest) { navigate('/registro'); return }
    await toggleFollow(memberId, dinerId)
    setFollowing(f => !f)
    // Actualizar contador local
    setProfile(p => p ? {
      ...p,
      stats: {
        ...p.stats,
        followers: p.stats.followers + (following ? -1 : 1),
      },
    } : p)
  }

  if (loading) return (
    <div className="page page-centered">
      <p className="text-muted text-sm">Cargando perfil…</p>
      <NavBar />
    </div>
  )

  if (!profile) return (
    <div className="page page-centered">
      <p className="text-muted text-sm">Miembro no encontrado.</p>
      <Button onClick={() => navigate('/red')}>← Volver al feed</Button>
      <NavBar />
    </div>
  )

  const { paladar_type: pt, email_display, stats } = profile
  const isOwnProfile = dinerId === memberId

  return (
    <div className="page profile">
      <div className="member-profile__back">
        <button className="btn btn--text" onClick={() => navigate('/red')}>← Feed</button>
      </div>

      {/* Arquetipo */}
      <div className="profile__hero">
        <span className="profile__hero-icon serif">{pt.icon}</span>
        <h1 className="profile__type-name serif">{pt.name}</h1>
        <p className="profile__type-desc text-muted">{pt.description}</p>
      </div>

      <OrnamentDivider />

      {/* Handle, stats y botón seguir */}
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
        {!isOwnProfile && dinerId && (
          <Button
            variant={following ? 'ghost' : 'primary'}
            size="sm"
            onClick={handleFollow}
          >
            {following ? 'Siguiendo ✓' : '+ Seguir'}
          </Button>
        )}
      </div>

      <OrnamentDivider />

      {/* Posts del miembro */}
      <div className="member-profile__posts">
        {posts.length === 0 ? (
          <p className="text-muted text-sm" style={{ textAlign: 'center', padding: 'var(--space-6) 0' }}>
            Aún no tiene publicaciones.
          </p>
        ) : (
          posts.map(post => (
            <article key={post.id} className="post-card card">
              <div className="post-card__wine">
                <p
                  className="post-card__wine-name serif"
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/vino/${post.wine_id}`)}
                >
                  {post.wine_name}
                </p>
                {post.winery && <p className="text-muted text-xs">{post.winery}</p>}
                {post.dish_name && <p className="text-xs text-muted">Con: <em>{post.dish_name}</em></p>}
              </div>
              {post.note && <p className="post-card__note text-sm">{post.note}</p>}
              <div className="post-card__footer text-xs text-muted">
                <span>🍷 {post.reactions_summary.maridaje}</span>
                <span>✦ {post.reactions_summary.descubrimiento}</span>
                <span>♡ {post.reactions_summary.favorito}</span>
                <span>💬 {post.comments_count}</span>
                <span style={{ marginLeft: 'auto' }}>
                  {new Date(post.created_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}
                </span>
              </div>
            </article>
          ))
        )}
      </div>

      <div style={{ height: 80 }} />
      <NavBar />
    </div>
  )
}
