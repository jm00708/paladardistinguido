import { useNavigate } from 'react-router-dom'
import { Logo, OrnamentDivider } from '../components/ui/Ornament'
import Button from '../components/ui/Button'
import './Membership.css'

const BENEFITS = [
  {
    icon: '❦',
    title: 'Tu sommelier te recuerda',
    desc: 'Cada visita refina tu perfil. Las recomendaciones mejoran con el tiempo.',
  },
  {
    icon: '◈',
    title: 'Bodega personal',
    desc: 'Guarda los vinos que has disfrutado, con notas y calificaciones propias.',
  },
  {
    icon: '✦',
    title: 'Red El Paladar Distinguido',
    desc: 'Conecta con otros amantes del vino. Descubre qué beben en las mejores mesas.',
  },
]

export default function Membership() {
  const navigate = useNavigate()

  return (
    <div className="page membership animate-fade-up">
      <div className="membership__top">
        <Logo size="md" />
      </div>

      <div className="membership__headline">
        <h2 className="serif">Tu paladar merece<br /><span className="italic text-accent">ser recordado.</span></h2>
        <p className="text-muted membership__sub">
          Crea tu perfil gratuito y lleva tu sommelier personal a cada restaurante que visites.
        </p>
      </div>

      <OrnamentDivider />

      <ul className="membership__benefits">
        {BENEFITS.map((b) => (
          <li key={b.title} className="membership__benefit">
            <span className="membership__benefit-icon serif">{b.icon}</span>
            <div>
              <p className="membership__benefit-title">{b.title}</p>
              <p className="membership__benefit-desc text-muted text-sm">{b.desc}</p>
            </div>
          </li>
        ))}
      </ul>

      <OrnamentDivider />

      <div className="membership__actions mt-auto">
        <Button fullWidth size="lg" onClick={() => navigate('/registro')}>
          Crear mi cuenta — es gratis
        </Button>
        <Button variant="text" fullWidth onClick={() => navigate('/carta')}>
          Continuar como invitado →
        </Button>
      </div>
    </div>
  )
}
