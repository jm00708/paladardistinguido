import { useEffect, useRef, useState } from 'react'
import { registerSW } from 'virtual:pwa-register'
import './UpdateToast.css'

/**
 * Aviso de "nueva versión disponible" para la PWA.
 *
 * Por defecto, el Service Worker (registerType: 'autoUpdate') instala la
 * versión nueva en segundo plano pero NO la activa en la pestaña ya abierta
 * hasta una recarga adicional — por eso un F5 normal a veces sigue
 * mostrando contenido viejo. Este componente detecta cuándo hay una
 * versión nueva lista y deja que el usuario decida cuándo actualizar,
 * en vez de que tenga que adivinar que necesita un hard refresh.
 */
export default function UpdateToast() {
  const [needRefresh, setNeedRefresh] = useState(false)
  const updateSWRef = useRef(null)

  useEffect(() => {
    updateSWRef.current = registerSW({
      immediate: true,
      onNeedRefresh() {
        setNeedRefresh(true)
      },
      onRegisteredSW(_url, registration) {
        if (!registration) return
        // Revisa si hay una versión nueva cada hora mientras la pestaña esté abierta
        setInterval(() => registration.update(), 60 * 60 * 1000)
      },
    })
  }, [])

  if (!needRefresh) return null

  return (
    <div className="update-toast" role="status">
      <span className="update-toast__text">Hay una nueva versión disponible</span>
      <button
        className="update-toast__btn"
        onClick={() => updateSWRef.current?.(true)}
      >
        Actualizar
      </button>
    </div>
  )
}
