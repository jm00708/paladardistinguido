import { NavLink } from 'react-router-dom'
import './NavBar.css'

const TABS = [
  { to: '/mi-bodega', icon: '🍷', label: 'Bodega' },
  { to: '/red',       icon: '◈',  label: 'Red' },
  { to: '/perfil',    icon: '✦',  label: 'Perfil' },
]

export default function NavBar() {
  return (
    <nav className="navbar">
      {TABS.map(({ to, icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `navbar__tab ${isActive ? 'navbar__tab--active' : ''}`}
        >
          <span className="navbar__icon">{icon}</span>
          <span className="navbar__label">{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
