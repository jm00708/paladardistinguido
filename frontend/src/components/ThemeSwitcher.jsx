import { useState } from 'react'
import { useTheme } from '../themes/useTheme'
import './ThemeSwitcher.css'

export default function ThemeSwitcher() {
  const { activeKey, setTheme, themes } = useTheme()
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Botón flotante */}
      <button
        className="theme-fab"
        onClick={() => setOpen(v => !v)}
        title="Cambiar branding"
        aria-label="Cambiar branding"
      >
        <span className="theme-fab__icon">◈</span>
        <span className="theme-fab__label">Branding</span>
      </button>

      {/* Backdrop */}
      {open && <div className="theme-backdrop" onClick={() => setOpen(false)} />}

      {/* Panel de selección */}
      <div className={`theme-panel ${open ? 'theme-panel--open' : ''}`}>
        <div className="theme-panel__handle" onClick={() => setOpen(false)} />
        <div className="theme-panel__header">
          <p className="serif theme-panel__title">Estilos de presentación</p>
          <p className="text-xs text-muted theme-panel__subtitle">
            Elige la apariencia que mejor represente tu marca
          </p>
        </div>

        <div className="theme-panel__scroll">
          <div className="theme-panel__grid">
            {Object.values(themes).map((theme) => {
              const active = activeKey === theme.key
              return (
                <button
                  key={theme.key}
                  className={`theme-card ${active ? 'theme-card--active' : ''}`}
                  onClick={() => { setTheme(theme.key); setOpen(false) }}
                >
                  {/* Preview visual */}
                  <div className="theme-card__preview" style={{ background: theme.palette[0] }}>
                    <div className="theme-card__preview-stripe" style={{ background: theme.palette[1] }} />
                    <span
                      className="theme-card__preview-aa"
                      style={{
                        color: theme.palette[2],
                        fontFamily: theme.vars['--font-display'],
                      }}
                    >
                      Aa
                    </span>
                    <div className="theme-card__preview-dots">
                      {theme.palette.map((c, i) => (
                        <span key={i} style={{ background: c }} />
                      ))}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="theme-card__info">
                    <p className="theme-card__name">{theme.name}</p>
                    <p className="theme-card__desc">{theme.description}</p>
                  </div>

                  {active && <span className="theme-card__check">✓</span>}
                </button>
              )
            })}
          </div>
        </div>

        <p className="theme-panel__footer text-xs text-muted">
          Se guarda automáticamente · {Object.keys(themes).length} estilos disponibles
        </p>
      </div>
    </>
  )
}
