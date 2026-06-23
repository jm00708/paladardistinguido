import './WineGlassBadge.css'

/**
 * Insignia de marca para el login del Portal del Aliado: una copa de
 * vino espumoso con burbujas subiendo. Vive en su propio marco circular,
 * separada de la fotografía de fondo de la cava.
 *
 * El llenado de la copa es una sola pasada (efecto de marca al cargar);
 * las burbujas, en cambio, se repiten en loop suave — un espumoso real
 * nunca deja de burbujear, así que detenerlas se vería "sin gas".
 * Todo el movimiento respeta prefers-reduced-motion.
 */
export default function WineGlassBadge() {
  return (
    <div className="glass-badge" aria-hidden="true">
      <svg
        className="glass-badge__svg"
        viewBox="0 0 60 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Copa (contorno de vidrio) — panza cóncava tipo copa de vino real,
            no recta como una flauta */}
        <path
          className="glass-badge__outline"
          d="M13,12 C10,18 9,25 12,32 C15,42 23,50 29,58 L31,58 C37,50 45,42 48,32 C51,25 50,18 47,12 Z"
        />
        <ellipse className="glass-badge__rim" cx="30" cy="12" rx="17" ry="2.3" />

        {/* Vino tinto (se llena una vez al cargar) */}
        <path
          className="glass-badge__wine"
          d="M12,32 Q30,37 48,32 C45,42 37,50 31,58 L29,58 C23,50 15,42 12,32 Z"
        />

        {/* Burbujas — loop suave */}
        <circle className="glass-badge__bubble glass-badge__bubble--1" cx="27" cy="52" r="1.4" />
        <circle className="glass-badge__bubble glass-badge__bubble--2" cx="33" cy="48" r="1.1" />
        <circle className="glass-badge__bubble glass-badge__bubble--3" cx="29" cy="42" r="1.6" />
        <circle className="glass-badge__bubble glass-badge__bubble--4" cx="35" cy="38" r="1" />
        <circle className="glass-badge__bubble glass-badge__bubble--5" cx="25" cy="35" r="1.3" />

        {/* Tallo y base */}
        <rect className="glass-badge__stem" x="28.3" y="58" width="3.4" height="25" />
        <ellipse className="glass-badge__base" cx="30" cy="85" rx="13" ry="2.6" />
      </svg>
    </div>
  )
}
