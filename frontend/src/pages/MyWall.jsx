import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { OrnamentDivider } from '../components/ui/Ornament'
import NavBar from '../components/NavBar'
import { getMyWall, createPost, getMyPaladarType } from '../api/social'
import useDinerStore from '../store/useDinerStore'
import './MyWall.css'

/* ── Formulario de nuevo post ──────────────────────────────── */
function NewPostForm({ onPost, profile }) {
  const navigate = useNavigate()
  const { recommendation, selectedDish } = useDinerStore()
  const [open, setOpen]         = useState(false)
  const [manual, setManual]     = useState(false)
  const [note, setNote]         = useState('')
  const [form, setForm]         = useState({ wine_name: '', winery: '', dish_name: '', note: '' })
  const [submitting, setSubmitting] = useState(false)

  const prefill = recommendation?.wine
    ? {
        wine_id:   recommendation.wine.id,
        wine_name: `${recommendation.wine.name}${recommendation.wine.vintage ? ` ${recommendation.wine.vintage}` : ''}`,
        winery:    recommendation.wine.winery || '',
        dish_name: selectedDish?.name || '',
      }
    : null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (prefill && !manual) {
      if (!note.trim() && !prefill.wine_name) return
    } else {
      if (!form.wine_name.trim()) return
    }
    setSubmitting(true)
    try {
      if (prefill && !manual) {
        await onPost({ ...prefill, note, is_public: true })
      } else {
        await onPost({
          wine_id:   null,
          wine_name: form.wine_name.trim(),
          winery:    form.winery.trim(),
          dish_name: form.dish_name.trim(),
          note:      form.note.trim(),
          is_public: true,
        })
      }
      setNote(''); setForm({ wine_name: '', winery: '', dish_name: '', note: '' })
      setOpen(false); setManual(false)
    } finally {
      setSubmitting(false)
    }
  }

  const canSubmit = prefill && !manual
    ? true
    : form.wine_name.trim().length > 0

  if (!open) {
    return (
      <button className="quick-compose" onClick={() => setOpen(true)}>
        <span className="quick-compose__dot">◈</span>
        <span className="quick-compose__placeholder">Compartir mi vino de esta noche…</span>
        <span className="quick-compose__cta">Compartir</span>
      </button>
    )
  }

  return (
    <div className="new-post-form">
      {/* Avatar + nombre */}
      <div className="new-post-form__author">
        <span className="wall-avatar serif">{profile?.paladar_type?.icon || '◈'}</span>
        <div>
          <p className="wall-author-name">{profile?.email_display || 'Tú'}</p>
          <p className="text-xs text-muted">{profile?.paladar_type?.name || 'El Paladar'}</p>
        </div>
      </div>

      {/* Modo pre-rellenado (recomendación activa) */}
      {prefill && !manual ? (
        <div className="new-post-form__prefill">
          <p className="serif new-post-form__wine-name">{prefill.wine_name}</p>
          {prefill.winery && <p className="text-muted text-xs">{prefill.winery}</p>}
          {prefill.dish_name && (
            <p className="text-xs text-muted">Con: <em>{prefill.dish_name}</em></p>
          )}
          <textarea
            className="new-post-form__textarea"
            placeholder="¿Qué te pareció? (opcional)"
            value={note}
            onChange={e => setNote(e.target.value)}
            maxLength={600}
            rows={3}
          />
        </div>
      ) : (
        /* Modo entrada manual */
        <div className="new-post-form__manual">
          {!prefill && (
            <p className="text-xs text-muted new-post-form__hint">
              Sin recomendación activa.{' '}
              <button className="link-btn" onClick={() => navigate('/carta')}>
                Obtener recomendación →
              </button>
            </p>
          )}
          <input
            className="new-post-form__input"
            placeholder="Nombre del vino *"
            value={form.wine_name}
            onChange={e => setForm(f => ({ ...f, wine_name: e.target.value }))}
            maxLength={200}
          />
          <input
            className="new-post-form__input"
            placeholder="Bodega / Productor"
            value={form.winery}
            onChange={e => setForm(f => ({ ...f, winery: e.target.value }))}
            maxLength={200}
          />
          <input
            className="new-post-form__input"
            placeholder="Platillo maridado (opcional)"
            value={form.dish_name}
            onChange={e => setForm(f => ({ ...f, dish_name: e.target.value }))}
            maxLength={200}
          />
          <textarea
            className="new-post-form__textarea"
            placeholder="Nota de cata (opcional)"
            value={form.note}
            onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
            maxLength={600}
            rows={3}
          />
        </div>
      )}

      {/* Toggle entre modos */}
      {prefill && (
        <button className="new-post-form__toggle" onClick={() => setManual(m => !m)}>
          {manual ? '← Usar recomendación actual' : 'o agregar vino diferente ↓'}
        </button>
      )}

      {/* Acciones */}
      <div className="new-post-form__actions">
        <button
          className="new-post-form__cancel text-xs text-muted"
          onClick={() => { setOpen(false); setManual(false) }}
        >
          Cancelar
        </button>
        <button
          className="new-post-form__submit"
          onClick={handleSubmit}
          disabled={!canSubmit || submitting}
        >
          {submitting ? 'Publicando…' : 'Publicar'}
        </button>
      </div>
    </div>
  )
}

/* ── Tarjeta de post propio ────────────────────────────────── */
function MyPostCard({ post, profile }) {
  const { wine_name, winery, dish_name, note, reactions_summary, comments_count, created_at } = post
  const pt = profile?.paladar_type || { icon: '◈', name: 'El Paladar' }

  return (
    <article className="post-card">
      <div className="post-card__layout">
        {/* Avatar */}
        <span className="wall-avatar serif">{pt.icon}</span>

        <div className="post-card__body">
          {/* Cabecera */}
          <div className="post-card__header">
            <div className="post-card__author-info">
              <span className="post-card__name">{profile?.email_display || 'Tú'}</span>
              <span className="post-card__type text-muted"> · {pt.name}</span>
              <span className="post-card__date">
                {' · '}{new Date(created_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}
              </span>
            </div>
          </div>

          {/* Vino */}
          <p className="post-card__wine-name serif">{wine_name}</p>
          {winery && <p className="text-muted text-xs">{winery}</p>}
          {dish_name && <p className="text-xs text-muted">Con: <em>{dish_name}</em></p>}

          {/* Nota */}
          {note && <p className="post-card__note">{note}</p>}

          {/* Conteo de reacciones (solo lectura en muro propio) */}
          <div className="wall-post__counts">
            <span>🍷 {reactions_summary.maridaje || 0}</span>
            <span>✦ {reactions_summary.descubrimiento || 0}</span>
            <span>♡ {reactions_summary.favorito || 0}</span>
            <span>💬 {comments_count || 0}</span>
          </div>
        </div>
      </div>
    </article>
  )
}

/* ── Página principal ──────────────────────────────────────── */
export default function MyWall() {
  const navigate = useNavigate()
  const { dinerId, isGuest } = useDinerStore()
  const [posts, setPosts]     = useState([])
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = () => {
    if (!dinerId) return
    Promise.all([
      getMyWall(dinerId),
      getMyPaladarType(dinerId),
    ]).then(([ps, prof]) => {
      setPosts(ps)
      setProfile(prof)
    }).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [dinerId])

  const handlePost = async (payload) => {
    await createPost(dinerId, payload)
    load()
  }

  if (isGuest || !dinerId) {
    return (
      <div className="page page-centered">
        <p className="serif" style={{ fontSize: 'var(--text-2xl)', opacity: 0.3 }}>◈</p>
        <p className="text-muted text-sm" style={{ textAlign: 'center' }}>
          Crea una cuenta para tener tu muro personal<br />y guardar tus vinos.
        </p>
        <button
          className="wall-cta-btn"
          style={{ marginTop: 'var(--space-4)' }}
          onClick={() => navigate('/registro')}
        >
          Crear mi cuenta
        </button>
        <NavBar />
      </div>
    )
  }

  return (
    <div className="my-wall-page">
      {/* Cabecera */}
      <div className="my-wall__header">
        <h2 className="serif">Mi Muro</h2>
        <p className="text-muted text-xs">Tu bitácora personal de vinos</p>
      </div>

      <OrnamentDivider />

      {/* Compose */}
      <div className="my-wall__compose">
        <NewPostForm onPost={handlePost} profile={profile} />
      </div>

      <OrnamentDivider />

      {loading && (
        <p className="text-muted text-sm" style={{ padding: 'var(--space-4)' }}>Cargando…</p>
      )}

      {!loading && posts.length === 0 && (
        <div className="my-wall__empty">
          <p className="serif" style={{ fontSize: 'var(--text-2xl)', opacity: 0.25 }}>◈</p>
          <p className="text-muted text-sm">
            Aún no tienes publicaciones.<br />Comparte tu próxima copa.
          </p>
        </div>
      )}

      <div className="feed__list">
        {posts.map(post => (
          <MyPostCard key={post.id} post={post} profile={profile} />
        ))}
      </div>

      <div style={{ height: 80 }} />
      <NavBar />
    </div>
  )
}
