import { useState, useEffect, useCallback } from 'react'
import { THEMES, DEFAULT_THEME } from './themes'

const STORAGE_KEY = 'epd-theme'

export function applyTheme(theme) {
  const root = document.documentElement
  Object.entries(theme.vars).forEach(([prop, value]) => {
    root.style.setProperty(prop, value)
  })
  // Cargar fuente Google si el tema la necesita y no está ya cargada
  if (theme.googleFonts) {
    const existing = document.querySelector(`link[data-epd-font="${theme.key}"]`)
    if (!existing) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = theme.googleFonts
      link.setAttribute('data-epd-font', theme.key)
      document.head.appendChild(link)
    }
  }
}

// Aplicar tema almacenado inmediatamente (antes del primer render) para evitar flash
;(function initTheme() {
  const key = localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME
  const theme = THEMES[key] || THEMES[DEFAULT_THEME]
  applyTheme(theme)
})()

export function useTheme() {
  const [activeKey, setActiveKey] = useState(
    () => localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME
  )

  useEffect(() => {
    const theme = THEMES[activeKey] || THEMES[DEFAULT_THEME]
    applyTheme(theme)
  }, [activeKey])

  const setTheme = useCallback((key) => {
    localStorage.setItem(STORAGE_KEY, key)
    setActiveKey(key)
  }, [])

  return { activeKey, setTheme, themes: THEMES }
}
