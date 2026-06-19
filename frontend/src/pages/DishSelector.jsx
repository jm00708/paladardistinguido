import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import { initSession } from '../api/session'
import useDinerStore from '../store/useDinerStore'
import './DishSelector.css'

const SECTIONS = [
  { key: 'entradas', label: 'Entradas' },
  { key: 'fondos',   label: 'Fondos' },
  { key: 'postres',  label: 'Postres' },
]

export default function DishSelector() {
  const navigate = useNavigate()
  const { tableNumber, setSelectedDish, selectedDish, setRestaurant } = useDinerStore()
  const [menu, setMenu] = useState([])
  const [section, setSection] = useState('fondos')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    initSession(tableNumber)
      .then((data) => {
        setRestaurant(data.restaurant)
        setMenu(data.menu || [])
      })
      .finally(() => setLoading(false))
  }, [])

  const filtered = menu.filter((item) => item.section === section)

  const handleContinue = () => {
    if (selectedDish) navigate('/recomendacion')
  }

  return (
    <div className="page dish-selector animate-fade-up">
      <div className="dish-selector__header">
        <button className="btn btn--text" onClick={() => navigate(-1)}>← Atrás</button>
        <h2>¿Qué vas a cenar?</h2>
      </div>

      {/* Tabs de sección */}
      <div className="tabs">
        {SECTIONS.map((s) => (
          <button
            key={s.key}
            className={`tab ${section === s.key ? 'tab--active' : ''}`}
            onClick={() => setSection(s.key)}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Lista de platillos */}
      <div className="dish-selector__list">
        {loading && <p className="text-muted text-sm">Cargando carta…</p>}
        {!loading && filtered.length === 0 && (
          <p className="text-muted text-sm">Sin platillos en esta sección.</p>
        )}
        {filtered.map((item) => (
          <button
            key={item.id}
            className={`dish-card card ${selectedDish?.id === item.id ? 'card--selected' : ''}`}
            onClick={() => setSelectedDish(item)}
          >
            <span className="dish-card__name">{item.name}</span>
            {item.description && (
              <span className="dish-card__desc text-muted text-sm">{item.description}</span>
            )}
            {selectedDish?.id === item.id && (
              <span className="dish-card__check">✓</span>
            )}
          </button>
        ))}
      </div>

      {/* CTA */}
      <div className="dish-selector__footer mt-auto">
        <Button fullWidth size="lg" disabled={!selectedDish} onClick={handleContinue}>
          Ver mi recomendación →
        </Button>
      </div>
    </div>
  )
}
