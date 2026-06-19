import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Button from '../components/ui/Button'
import { OrnamentDivider } from '../components/ui/Ornament'
import { submitQuestionnaire } from '../api/session'
import useDinerStore from '../store/useDinerStore'
import './Questionnaire.css'

const STEPS = [
  {
    key: 'body',
    title: '¿Cómo prefieres tu vino?',
    subtitle: 'En cuanto a su peso en boca',
    type: 'slider',
    min: 'Ligero',
    max: 'Pleno',
  },
  {
    key: 'acidity',
    title: '¿Qué acidez buscas?',
    subtitle: 'La frescura y viveza en el paladar',
    type: 'slider',
    min: 'Suave',
    max: 'Vibrante',
  },
  {
    key: 'tannins',
    title: '¿Y la textura tánica?',
    subtitle: 'Esa sensación de sequedad en las encías',
    type: 'slider',
    min: 'Sin taninos',
    max: 'Muy tánico',
  },
  {
    key: 'sweetness',
    title: '¿Seco o con dulzor?',
    subtitle: 'El nivel de azúcar residual',
    type: 'slider',
    min: 'Completamente seco',
    max: 'Dulce',
  },
  {
    key: 'experience',
    title: '¿Cuánto exploramos juntos?',
    subtitle: 'Para calibrar nuestra recomendación',
    type: 'options',
    options: [
      { value: 'beginner',   label: 'Principiante',  desc: 'Estoy descubriendo el mundo del vino' },
      { value: 'occasional', label: 'Ocasional',     desc: 'Disfruto el vino en cenas y eventos' },
      { value: 'enthusiast', label: 'Entusiasta',    desc: 'Tengo preferencias bien definidas' },
      { value: 'expert',     label: 'Conocedor',     desc: 'Domino regiones, uvas y añadas' },
    ],
  },
]

export default function Questionnaire() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const skip = params.get('skip') === '1'

  const { questionnaire, setQuestionnaire, dinerId } = useDinerStore()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const current = STEPS[step]
  const progress = ((step + 1) / STEPS.length) * 100

  const handleNext = async () => {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1)
      return
    }
    // Último paso — enviar al backend y continuar
    setLoading(true)
    try {
      if (dinerId && !skip) {
        await submitQuestionnaire(dinerId, questionnaire)
      }
    } catch { /* no bloquear */ }
    finally { setLoading(false) }
    navigate('/membresia')
  }

  const handleSkip = () => navigate('/carta')

  return (
    <div className="page questionnaire animate-fade-up">
      {/* Progreso */}
      <div className="questionnaire__progress">
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="text-xs text-muted">{step + 1} / {STEPS.length}</span>
      </div>

      <OrnamentDivider />

      {/* Contenido del paso */}
      <div className="questionnaire__body" key={step}>
        <h2 className="questionnaire__title">{current.title}</h2>
        <p className="questionnaire__subtitle text-muted">{current.subtitle}</p>

        {current.type === 'slider' && (
          <div className="questionnaire__slider-wrap">
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={questionnaire[current.key]}
              onChange={(e) => setQuestionnaire({ [current.key]: parseFloat(e.target.value) })}
            />
            <div className="questionnaire__slider-labels">
              <span className="text-xs text-muted">{current.min}</span>
              <span className="text-xs text-muted">{current.max}</span>
            </div>
          </div>
        )}

        {current.type === 'options' && (
          <div className="questionnaire__options">
            {current.options.map((opt) => (
              <button
                key={opt.value}
                className={`questionnaire__option card ${questionnaire.experience === opt.value ? 'card--selected' : ''}`}
                onClick={() => setQuestionnaire({ experience: opt.value })}
              >
                <span className="questionnaire__option-label">{opt.label}</span>
                <span className="questionnaire__option-desc text-muted text-sm">{opt.desc}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Acciones */}
      <div className="questionnaire__actions mt-auto">
        <Button fullWidth size="lg" onClick={handleNext} disabled={loading}>
          {step < STEPS.length - 1 ? 'Siguiente →' : loading ? 'Guardando…' : 'Ver la carta →'}
        </Button>
        {step === 0 && (
          <Button variant="text" fullWidth onClick={handleSkip}>
            Omitir cuestionario
          </Button>
        )}
        {step > 0 && (
          <Button variant="text" fullWidth onClick={() => setStep((s) => s - 1)}>
            ← Anterior
          </Button>
        )}
      </div>
    </div>
  )
}
