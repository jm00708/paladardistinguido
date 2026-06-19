import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import ThemeSwitcher from './components/ThemeSwitcher'

/* ── Consumer PWA ─── */
import Welcome from './pages/Welcome'
import Questionnaire from './pages/Questionnaire'
import Membership from './pages/Membership'
import DishSelector from './pages/DishSelector'
import Recommendation from './pages/Recommendation'
import WineDetail from './pages/WineDetail'
import Register from './pages/Register'
import Feed from './pages/Feed'
import MyWall from './pages/MyWall'
import Profile from './pages/Profile'
import MemberProfile from './pages/MemberProfile'
import Archetypes from './pages/Archetypes'

/* ── Portal del Aliado ─── */
import PartnerLogin from './pages/partner/PartnerLogin'
import PartnerLayout from './pages/partner/PartnerLayout'
import PartnerDashboard from './pages/partner/PartnerDashboard'
import PartnerInventory from './pages/partner/PartnerInventory'
import PartnerArchetypes from './pages/partner/PartnerArchetypes'
import usePartnerStore from './store/usePartnerStore'

function PartnerGuard({ children }) {
  const { access } = usePartnerStore()
  if (!access) return <Navigate to="/aliado/login" replace />
  return children
}

export default function App() {
  const location = useLocation()
  const isPartnerRoute = location.pathname.startsWith('/aliado')

  return (
    <>
      <Routes>
        {/* ── Flujo comensal ── */}
        <Route path="/"               element={<Welcome />} />
        <Route path="/cuestionario"   element={<Questionnaire />} />
        <Route path="/membresia"      element={<Membership />} />
        <Route path="/registro"       element={<Register />} />
        <Route path="/carta"          element={<DishSelector />} />
        <Route path="/recomendacion"  element={<Recommendation />} />
        <Route path="/vino/:id"       element={<WineDetail />} />

        {/* ── Red social ── */}
        <Route path="/red"            element={<Feed />} />
        <Route path="/mi-bodega"      element={<MyWall />} />
        <Route path="/perfil"         element={<Profile />} />
        <Route path="/miembro/:id"    element={<MemberProfile />} />
        <Route path="/arquetipos"     element={<Archetypes />} />

        {/* ── Portal del Aliado ── */}
        <Route path="/aliado/login"   element={<PartnerLogin />} />
        <Route
          path="/aliado"
          element={<PartnerGuard><PartnerLayout /></PartnerGuard>}
        >
          <Route index element={<Navigate to="/aliado/dashboard" replace />} />
          <Route path="dashboard"  element={<PartnerDashboard />} />
          <Route path="inventario" element={<PartnerInventory />} />
          <Route path="arquetipos" element={<PartnerArchetypes />} />
        </Route>

        <Route path="/guardar" element={<Navigate to="/registro" replace />} />
        <Route path="*"        element={<Navigate to="/" replace />} />
      </Routes>

      {/* ThemeSwitcher sólo en el PWA del comensal */}
      {!isPartnerRoute && <ThemeSwitcher />}
    </>
  )
}
