import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import usePartnerStore from '../../store/usePartnerStore'
import './Partner.css'

const NAV = [
  { to: '/aliado/dashboard',   label: 'Dashboard',   icon: '▦' },
  { to: '/aliado/inventario',  label: 'Inventario',  icon: '▤' },
  { to: '/aliado/arquetipos',  label: 'Arquetipos',  icon: '◈' },
]

const PAGE_TITLES = {
  '/aliado/dashboard':  'Dashboard',
  '/aliado/inventario': 'Gestión de Inventario',
  '/aliado/arquetipos': 'Insights de Arquetipos',
}

export default function PartnerLayout() {
  const { email, logout } = usePartnerStore()
  const navigate = useNavigate()
  const currentPath = window.location.pathname
  const pageTitle = PAGE_TITLES[currentPath] || 'Portal del Aliado'

  const handleLogout = () => {
    logout()
    navigate('/aliado/login')
  }

  const initial = email ? email[0].toUpperCase() : 'A'

  return (
    <div className="partner-root">
      <div className="partner-layout">
        {/* ── Sidebar ── */}
        <aside className="partner-sidebar">
          <div className="partner-sidebar__brand">
            <span className="partner-sidebar__logo">
              <em className="partner-sidebar__logo-icon">◈</em>
              <span className="partner-sidebar__logo-text">
                <span className="partner-sidebar__logo-main">El Paladar</span>
                <span className="partner-sidebar__logo-sub">Portal Aliado</span>
              </span>
            </span>
          </div>

          <nav className="partner-sidebar__nav">
            <div className="partner-nav-group">
              <p className="partner-nav-group__label">Menú</p>
              {NAV.map(({ to, label, icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    'partner-nav-link' + (isActive ? ' active' : '')
                  }
                >
                  <span className="partner-nav-link__icon">{icon}</span>
                  {label}
                </NavLink>
              ))}
            </div>
          </nav>

          <div className="partner-sidebar__footer">
            <div className="partner-sidebar__user">
              <div className="partner-sidebar__avatar">{initial}</div>
              <span className="partner-sidebar__user-email">{email || 'Aliado'}</span>
            </div>
            <button className="partner-logout-btn" onClick={handleLogout}>
              ↩ Cerrar sesión
            </button>
          </div>
        </aside>

        {/* ── Main ── */}
        <div className="partner-main">
          <header className="partner-topbar">
            <span className="partner-topbar__title">{pageTitle}</span>
            <div className="partner-topbar__right">
              <span className="partner-topbar__badge">◈ Restaurante</span>
            </div>
          </header>

          <main className="partner-content">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
