import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { OrnamentDivider } from '../components/ui/Ornament'
import Button from '../components/ui/Button'
import WineBottleHero from '../components/WineBottleHero'
import { initSession, createGuest } from '../api/session'
import useDinerStore from '../store/useDinerStore'
import './Welcome.css'

export default function Welcome() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const [ageChecked, setAgeChecked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const { setRestaurant, setTableNumber, setDinerId } = useDinerStore()
  const table = params.get('table') || ''

  useEffect(() => {
    // Carga datos del restaurante en background
    initSession(table)
      .then((data) => {
        setRestaurant(data.restaurant)
        setTableNumber(data.table)
      })
      .catch(() => {}) // no bloquear si falla
  }, [table])

  const { restaurant } = useDinerStore()

  const handleStart = async () => {
    if (!ageChecked) return
    setLoading(true)
    setError(null)
    try {
      const { diner_id } = await createGuest(true)
      setDinerId(diner_id)
      navigate('/cuestionario')
    } catch {
      setError('No pudimos conectar con el servidor. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page page-centered welcome animate-fade-in">
      <div className="welcome__hero">
        <WineBottleHero />
        <div className="welcome__brand">
          <p className="welcome__brand-main serif">El Paladar</p>
          <p className="welcome__brand-sub serif">Distinguido</p>
        </div>
      </div>

      <div className="welcome__meta">
        {restaurant && (
          <>
            <p className="welcome__restaurant serif">{restaurant.name}</p>
            {table && (
              <p className="text-muted text-sm">Mesa &nbsp;·&nbsp; {table}</p>
            )}
          </>
        )}
        <p className="welcome__tagline">
          Déjanos conocer tu paladar<br />
          <span className="italic text-muted">para guiarte esta noche.</span>
        </p>
      </div>

      <OrnamentDivider />

      <div className="welcome__actions">
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={ageChecked}
            onChange={(e) => setAgeChecked(e.target.checked)}
          />
          Confirmo que soy mayor de 18 años
        </label>

        {error && <p className="welcome__error">{error}</p>}

        <Button
          fullWidth
          size="lg"
          disabled={!ageChecked || loading}
          onClick={handleStart}
        >
          {loading ? 'Un momento…' : 'Comenzar →'}
        </Button>

        <Button variant="text" fullWidth onClick={() => navigate('/cuestionario?skip=1')}>
          Omitir cuestionario
        </Button>

        <p className="welcome__privacy">
          <a href="/privacidad">Aviso de Privacidad</a>
        </p>
      </div>
    </div>
  )
}
