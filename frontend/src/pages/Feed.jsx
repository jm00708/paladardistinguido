import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { OrnamentDivider } from '../components/ui/Ornament'
import NavBar from '../components/NavBar'
import { getFeed, reactToPost, commentPost, toggleFollow, getSuggestions, getMyPaladarType } from '../api/social'
import useDinerStore from '../store/useDinerStore'
import './Feed.css'

const REACTIONS = [
  { key: 'maridaje',       label: '🍷', title: 'Maridaje perfecto' },
  { key: 'descubrimiento', label: '✦',  title: 'Descubrimiento' },
  { key: 'favorito',       label: '♡',  title: 'Favorito' },
]

const ARCHETYPE_CHIPS = [
  { key: null,               label: 'Todos' },
  { key: 'tanico_robusto',   label: '◼ Tánico' },
  { key: 'aficionado_fresco',label: '◇ Fresco' },
  { key: 'mineral_puro',     label: '◈ Mineral' },
  { key: 'marino',           label: '≋ Marino' },
  { key: 'hedonista',        label: '❧ Hedonista' },
  { key: 'gourmand',         label: '✦ Gourmand' },
  { key: 'equilibrado',      label: '⊙ Equilibrado' },
]

function PostCard({ post, dinerId, onReact, onComment, onFollow, featured = false }) {
  const navigate = useNavigate()
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [following, setFollowing] = useState(false)

  const {
    paladar_type, diner_id: authorId, diner_display,
    wine_id, wine_name, winery, dish_name, note,
    reactions_summary, comments, comments_count, created_at,
  } = post
  const isOwnPost = dinerId && dinerId === authorId

  const handleComment = async (e) => {
    e.preventDefault()
    if (!commentText.trim()) return
    setSubmitting(true)
    await onComment(post.id, commentText)
    setCommentText('')
    setSubmitting(false)
  }

  return (
    <article className={`post-card ${featured ? 'post-card--featured' : ''}`}>
      {featured && (
        <div className="post-card__featured-label text-xs">✦ Destacado de la comunidad</div>
      )}

      <div className="post-card__layout">
        {/* Avatar circular con ícono de arquetipo */}
        <button
          className="post-card__avatar"
          onClick={() => navigate(`/miembro/${authorId}`)}
          title={paladar_type.name}
        >
          {paladar_type.icon}
        </button>

        <div className="post-card__body">
          {/* Cabecera: nombre · arquetipo · fecha */}
          <div className="post-card__header">
            <div
              className="post-card__author-info"
              onClick={() => navigate(`/miembro/${authorId}`)}
            >
              <span className="post-card__name">{diner_display}</span>
              <span className="post-card__type text-muted"> · {paladar_type.name}</span>
              <span className="post-card__date">
                {' · '}{new Date(created_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}
              </span>
            </div>
            {dinerId && !isOwnPost && (
              <button
                className={`follow-btn ${following ? 'follow-btn--active' : ''}`}
                onClick={async () => { await onFollow(authorId); setFollowing(f => !f) }}
              >
                {following ? 'Siguiendo' : '+ Seguir'}
              </button>
            )}
          </div>

          {/* Vino */}
          <p
            className="post-card__wine-name serif"
            onClick={() => navigate(`/vino/${wine_id}`)}
          >
            {wine_name}
          </p>
          {winery && <p className="text-muted text-xs">{winery}</p>}
          {dish_name && <p className="text-xs text-muted">Con: <em>{dish_name}</em></p>}

          {/* Nota de cata */}
          {note && <p className="post-card__note">{note}</p>}

          {/* Reacciones */}
          <div className="post-card__reactions">
            {REACTIONS.map(({ key, label, title }) => (
              <button
                key={key}
                className={`reaction-btn ${reactions_summary.my_reaction === key ? 'reaction-btn--active' : ''}`}
                title={title}
                onClick={() => onReact(post.id, key)}
                disabled={!dinerId}
              >
                {label} <span>{reactions_summary[key] || 0}</span>
              </button>
            ))}
            <button className="reaction-btn" onClick={() => setShowComments(v => !v)}>
              💬 <span>{comments_count}</span>
            </button>
          </div>

          {/* Comentarios expandibles */}
          {showComments && (
            <div className="post-card__comments">
              {comments.map(c => (
                <div key={c.id} className="comment">
                  <span className="comment__icon serif">{c.paladar_type.icon}</span>
                  <div>
                    <span className="comment__name text-xs">{c.diner_display}</span>
                    <p className="comment__text text-sm">{c.text}</p>
                  </div>
                </div>
              ))}
              {dinerId && (
                <form className="comment-form" onSubmit={handleComment}>
                  <input
                    placeholder="Añade un comentario…"
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    maxLength={500}
                  />
                  <button type="submit" disabled={submitting || !commentText.trim()}>→</button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

/* ── Quick Compose bar ─────────────────────────────────────── */
function QuickCompose({ dinerId }) {
  const navigate = useNavigate()
  if (!dinerId) return null
  return (
    <button className="quick-compose" onClick={() => navigate('/mi-bodega')}>
      <span className="quick-compose__dot" aria-hidden>◈</span>
      <span className="quick-compose__placeholder text-muted">Comparte tu vino de esta noche…</span>
      <span className="quick-compose__cta">Compartir</span>
    </button>
  )
}

/* ── Sidebar: mini perfil del usuario ─────────────────────── */
function UserMiniCard({ dinerId }) {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    if (dinerId) getMyPaladarType(dinerId).then(setProfile).catch(() => {})
  }, [dinerId])

  if (!dinerId) {
    return (
      <div className="sidebar-card">
        <p className="text-muted text-xs" style={{ textAlign: 'center' }}>
          Únete a la red para guardar tus vinos
        </p>
        <button className="sidebar-card__link" onClick={() => navigate('/registro')}>
          Crear mi cuenta →
        </button>
      </div>
    )
  }

  if (!profile) return null

  const { paladar_type: pt, email_display, stats } = profile

  return (
    <div className="sidebar-card">
      <div className="sidebar-card__user">
        <span className="sidebar-card__avatar serif">{pt.icon}</span>
        <div>
          <p className="sidebar-card__name text-sm">{email_display}</p>
          <p className="text-xs text-muted">{pt.name}</p>
        </div>
      </div>
      <div className="sidebar-card__stats">
        <div><strong>{stats.posts}</strong><span className="text-xs text-muted"> posts</span></div>
        <div><strong>{stats.followers}</strong><span className="text-xs text-muted"> seg.</span></div>
        <div><strong>{stats.following}</strong><span className="text-xs text-muted"> sig.</span></div>
      </div>
      <button className="sidebar-card__link" onClick={() => navigate('/perfil')}>
        Ver mi perfil →
      </button>
    </div>
  )
}

/* ── Sidebar: Quién seguir ─────────────────────────────────── */
function WhoToFollow({ dinerId, onFollow }) {
  const navigate = useNavigate()
  const [suggestions, setSuggestions] = useState([])
  const [followed, setFollowed] = useState({})

  useEffect(() => {
    getSuggestions(dinerId).then(setSuggestions).catch(() => {})
  }, [dinerId])

  if (!suggestions.length) return null

  return (
    <div className="sidebar-card">
      <p className="sidebar-card__title text-xs">Quién seguir</p>

      {suggestions.map(s => (
        <div key={s.diner_id} className="suggestion-row">
          <button
            className="suggestion-row__avatar serif"
            onClick={() => navigate(`/miembro/${s.diner_id}`)}
            title={s.paladar_type.name}
          >
            {s.paladar_type.icon}
          </button>
          <div
            className="suggestion-row__info"
            onClick={() => navigate(`/miembro/${s.diner_id}`)}
          >
            <p className="suggestion-row__name text-sm">{s.display}</p>
            <p className="text-xs text-muted">{s.paladar_type.name}</p>
          </div>
          {dinerId && (
            <button
              className={`follow-btn ${followed[s.diner_id] ? 'follow-btn--active' : ''}`}
              onClick={async () => {
                await onFollow(s.diner_id)
                setFollowed(prev => ({ ...prev, [s.diner_id]: !prev[s.diner_id] }))
              }}
            >
              {followed[s.diner_id] ? 'Siguiendo' : 'Seguir'}
            </button>
          )}
        </div>
      ))}

      <button className="sidebar-card__link" onClick={() => navigate('/arquetipos')}>
        Explorar los 8 Paladares →
      </button>
    </div>
  )
}

/* ── Feed principal ────────────────────────────────────────── */
export default function Feed() {
  const navigate = useNavigate()
  const { dinerId } = useDinerStore()
  const [searchParams, setSearchParams] = useSearchParams()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [archetype, setArchetype] = useState(searchParams.get('archetype') || null)

  const load = (arc = archetype) => {
    setLoading(true)
    getFeed(dinerId, arc).then(setPosts).finally(() => setLoading(false))
  }

  useEffect(() => { load(archetype) }, [])

  const handleFilter = (key) => {
    setArchetype(key)
    if (key) setSearchParams({ archetype: key })
    else setSearchParams({})
    load(key)
  }

  const handleReact = async (postId, reactionType) => {
    if (!dinerId) return
    await reactToPost(postId, dinerId, reactionType)
    load()
  }

  const handleComment = async (postId, text) => {
    if (!dinerId) return
    await commentPost(postId, dinerId, text)
    load()
  }

  const handleFollow = async (targetId) => {
    if (!dinerId) return
    await toggleFollow(targetId, dinerId)
  }

  return (
    <div className="feed-page">
      {/* Cabecera centrada */}
      <div className="feed-page__header">
        <h2 className="serif">Muro General</h2>
        <p className="text-muted text-xs">Los momentos más destacados de la red</p>
      </div>

      {/* Layout 1-col móvil / 2-col desktop */}
      <div className="feed-layout">

        {/* ── Columna principal ── */}
        <div className="feed-layout__main">
          <QuickCompose dinerId={dinerId} />

          {/* Chips filtro por arquetipo */}
          <div className="feed__chips">
            {ARCHETYPE_CHIPS.map(({ key, label }) => (
              <button
                key={String(key)}
                className={`feed__chip ${archetype === key ? 'feed__chip--active' : ''}`}
                onClick={() => handleFilter(key)}
              >
                {label}
              </button>
            ))}
          </div>

          <OrnamentDivider />

          {loading && (
            <p className="text-muted text-sm" style={{ padding: 'var(--space-4)' }}>Cargando…</p>
          )}

          {!loading && posts.length === 0 && (
            <div className="feed__empty">
              <p className="serif" style={{ fontSize: 'var(--text-2xl)', opacity: 0.3 }}>◈</p>
              <p className="text-muted text-sm">
                {archetype
                  ? 'No hay posts de este arquetipo aún.'
                  : '¡Sé el primero en compartir tu vino!'}
              </p>
            </div>
          )}

          <div className="feed__list">
            {posts.map((post, index) => (
              <PostCard
                key={post.id}
                post={post}
                dinerId={dinerId}
                onReact={handleReact}
                onComment={handleComment}
                onFollow={handleFollow}
                featured={index === 0 && !archetype}
              />
            ))}
          </div>
        </div>

        {/* ── Sidebar (solo desktop) ── */}
        <aside className="feed-layout__sidebar">
          <UserMiniCard dinerId={dinerId} />
          <WhoToFollow dinerId={dinerId} onFollow={handleFollow} />
        </aside>
      </div>

      <div style={{ height: 80 }} />
      <NavBar />
    </div>
  )
}
