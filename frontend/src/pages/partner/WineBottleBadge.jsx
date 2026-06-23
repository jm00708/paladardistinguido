import './WineBottleBadge.css'

/**
 * Insignia de marca para el login del Portal del Aliado: una sola botella
 * que destapa su corcho y derrama una gota de vino. Vive en su propio
 * marco circular, separada de la fotografía de fondo (mezclar un dibujo
 * plano directamente sobre una foto realista se ve mal) — es un detalle
 * de marca aparte, como un sello, no parte de la escena fotografiada.
 * Animación de una sola vez, respeta prefers-reduced-motion.
 */
export default function WineBottleBadge() {
  return (
    <div className="login-badge" aria-hidden="true">
      <svg
        className="login-badge__svg"
        viewBox="0 0 80 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse className="login-badge__puddle" cx="40" cy="88" rx="17" ry="4.5" />
        <path
          className="login-badge__glass"
          d="M33,38 L33,58 C33,58 24,66 24,76 L24,82 C24,86 27,89 32,89 L48,89 C53,89 56,86 56,82 L56,76 C56,66 47,58 47,58 L47,38 Z"
        />
        <rect className="login-badge__label" x="28" y="62" width="24" height="20" rx="2" />
        <rect className="login-badge__mouth" x="36" y="35" width="8" height="6" rx="1.5" />
        <path
          className="login-badge__spill"
          d="M47,41 C51,48 52,55 49,60 C47,64 44,67 44,76"
          pathLength="1"
        />
        <g className="login-badge__cork">
          <rect x="31" y="20" width="18" height="17" rx="3.5" className="login-badge__cork-body" />
          <rect x="31" y="20" width="18" height="5" rx="2.5" className="login-badge__cork-top" />
        </g>
      </svg>
    </div>
  )
}
