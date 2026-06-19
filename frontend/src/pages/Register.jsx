import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Logo, OrnamentDivider } from '../components/ui/Ornament'
import Button from '../components/ui/Button'
import { registerDiner } from '../api/auth'
import useDinerStore from '../store/useDinerStore'
import './Register.css'

export default function Register() {
  const navigate = useNavigate()
  const { dinerId, setDiner } = useDinerStore()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    setError(null)
    try {
      const diner = await registerDiner(email, dinerId)
      setDiner(diner)
      setSubmitted(true)
    } catch (err) {
      const msg = err.response?.data?.error || 'No pudimos crear tu perfil. Intenta de nuevo.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="page page-centered animate-fade-in">
        <Logo size="md" />
        <OrnamentDivider />
        <div className="register__success">
          <h2 className="serif">Tu perfil está guardado.</h2>
          <p className="text-muted">
            Tu sommelier te recordará en cada visita.<br />
            Revisa tu correo para confirmar tu cuenta.
          </p>
          <Button fullWidth onClick={() => navigate('/carta')} style={{ marginTop: 'var(--space-6)' }}>
            Ver la carta →
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="page register animate-fade-up">
      <button className="btn btn--text" style={{ alignSelf: 'flex-start' }} onClick={() => navigate(-1)}>
        ← Atrás
      </button>

      <Logo size="md" />

      <div className="register__body">
        <h2 className="register__headline">
          Tu sommelier<br />
          <span className="italic text-muted">te recordará.</span>
        </h2>
        <p className="text-muted">
          Guarda tu perfil de gusto y llévalo a cada restaurante de la red.
        </p>
      </div>

      <OrnamentDivider />

      <form className="register__form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="correo@ejemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          autoFocus
        />
        {error && <p className="register__error">{error}</p>}
        <Button type="submit" fullWidth size="lg" disabled={!email || loading}>
          {loading ? 'Creando perfil…' : 'Crear mi perfil gratuito'}
        </Button>
      </form>

      <div className="register__divider">
        <div className="ornament-line">o</div>
      </div>

      <Button variant="ghost" fullWidth size="lg" disabled>
        <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continuar con Google
        <span className="text-xs text-muted" style={{ marginLeft: 'auto' }}>Próximamente</span>
      </Button>

      <div className="mt-auto">
        <Button variant="text" fullWidth onClick={() => navigate('/carta')}>
          Continuar sin cuenta
        </Button>
      </div>
    </div>
  )
}
