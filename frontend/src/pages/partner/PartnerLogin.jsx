import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { partnerLogin } from '../../api/partner'
import usePartnerStore from '../../store/usePartnerStore'
import { IconDiamond } from './icons'
import './Partner.css'

export default function PartnerLogin() {
  const navigate = useNavigate()
  const { setTokens } = usePartnerStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim() || !password) return
    setLoading(true)
    setError(null)
    try {
      const { access, refresh } = await partnerLogin(email.trim(), password)
      setTokens(access, refresh, email.trim())
      navigate('/aliado/dashboard', { replace: true })
    } catch (err) {
      const status = err.response?.status
      if (status === 401 || status === 400) {
        setError('Credenciales incorrectas. Verifica tu correo y contraseña.')
      } else {
        setError('Error de conexión. Intenta de nuevo.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="partner-root partner-login-page">
      <div className="partner-login-card">
        <div className="partner-login-card__brand">
          <span className="partner-login-card__brand-icon"><IconDiamond width={18} height={18} /></span>
          <span className="partner-login-card__brand-text">
            <span className="partner-login-card__brand-main">El Paladar Distinguido</span>
            <span className="partner-login-card__brand-sub">PORTAL DEL ALIADO</span>
          </span>
        </div>

        <div className="partner-login-card__panel">
          <h1 className="partner-login-card__title">Inicia sesión</h1>
          <p className="partner-login-card__subtitle">Accede al panel de tu restaurante</p>

          {error && <div className="p-alert p-alert--error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="p-form-group">
              <label className="p-form-label" htmlFor="email">Correo electrónico</label>
              <input
                id="email"
                type="email"
                className="p-form-input"
                placeholder="sommelier@restaurante.mx"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="p-form-group">
              <label className="p-form-label" htmlFor="password">Contraseña</label>
              <input
                id="password"
                type="password"
                className="p-form-input"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            <button
              type="submit"
              className="partner-login-btn"
              disabled={loading || !email || !password}
            >
              {loading ? 'Verificando…' : 'Iniciar sesión'}
            </button>
          </form>
        </div>

        <p className="partner-login-hint">Acceso exclusivo para personal del restaurante</p>
      </div>
    </div>
  )
}
