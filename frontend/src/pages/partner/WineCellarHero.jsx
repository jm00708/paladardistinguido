import './WineCellarHero.css'

/**
 * Momento de marca para el login del Portal del Aliado: una pequeña
 * "cava" con 3 botellas que destapan su corcho y derraman vino de forma
 * escalonada (no simultánea, para que se sienta elegante y no caótico).
 * Animación de una sola vez — SVG + CSS puro, respeta prefers-reduced-motion.
 */
export default function WineCellarHero() {
  return (
    <div className="cellar-hero" aria-hidden="true">
      <svg
        className="cellar-hero__svg"
        viewBox="0 0 280 172"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Repisa de la cava */}
        <rect className="cellar-hero__shelf" x="10" y="156" width="260" height="6" rx="3" />

        {/* ── Botella 1 (izquierda) ───────────────────────────────── */}
        <g className="cellar-bottle cellar-bottle--1">
          <ellipse className="cellar-bottle__puddle" cx="55" cy="159" rx="20" ry="5" />
          <path
            className="cellar-bottle__glass"
            d="M48,75 L48,100 C48,100 38,108 38,118 L38,150 C38,155 41,158 46,158 L64,158 C69,158 72,155 72,150 L72,118 C72,108 62,100 62,100 L62,75 Z"
          />
          <rect className="cellar-bottle__label" x="42" y="118" width="26" height="22" rx="2" />
          <rect className="cellar-bottle__mouth" x="51" y="72" width="8" height="6" rx="1.5" />
          <path className="cellar-bottle__spill" d="M62,78 C66,86 68,94 65,100 C62,106 58,112 58,130" pathLength="1" />
          <g className="cellar-bottle__cork">
            <rect x="46" y="58" width="18" height="17" rx="3.5" className="cellar-bottle__cork-body" />
            <rect x="46" y="58" width="18" height="5" rx="2.5" className="cellar-bottle__cork-top" />
          </g>
        </g>

        {/* ── Botella 2 (centro, la más alta) ────────────────────── */}
        <g className="cellar-bottle cellar-bottle--2">
          <ellipse className="cellar-bottle__puddle" cx="140" cy="159" rx="24" ry="5.5" />
          <path
            className="cellar-bottle__glass"
            d="M132.5,45 L132.5,72 C132.5,72 121,82 121,94 L121,150 C121,155 124,158 130,158 L150,158 C156,158 159,155 159,150 L159,94 C159,82 147.5,72 147.5,72 L147.5,45 Z"
          />
          <rect className="cellar-bottle__label" x="124" y="98" width="32" height="26" rx="2" />
          <rect className="cellar-bottle__mouth" x="136" y="42" width="8" height="6" rx="1.5" />
          <path className="cellar-bottle__spill" d="M147.5,48 C152,58 155,68 151,76 C147,84 142,92 142,111" pathLength="1" />
          <g className="cellar-bottle__cork">
            <rect x="130.5" y="26" width="19" height="19" rx="4" className="cellar-bottle__cork-body" />
            <rect x="130.5" y="26" width="19" height="5.5" rx="2.75" className="cellar-bottle__cork-top" />
          </g>
        </g>

        {/* ── Botella 3 (derecha) ─────────────────────────────────── */}
        <g className="cellar-bottle cellar-bottle--3">
          <ellipse className="cellar-bottle__puddle" cx="225" cy="159" rx="21" ry="5" />
          <path
            className="cellar-bottle__glass"
            d="M218,60 L218,86 C218,86 207,95 207,106 L207,150 C207,155 210,158 216,158 L234,158 C240,158 243,155 243,150 L243,106 C243,95 232,86 232,86 L232,60 Z"
          />
          <rect className="cellar-bottle__label" x="211" y="106" width="28" height="24" rx="2" />
          <rect className="cellar-bottle__mouth" x="221" y="57" width="8" height="6" rx="1.5" />
          <path className="cellar-bottle__spill" d="M232,63 C236,72 238,81 235,88 C231,94 226,100 226,118" pathLength="1" />
          <g className="cellar-bottle__cork">
            <rect x="216" y="43" width="18" height="17" rx="3.5" className="cellar-bottle__cork-body" />
            <rect x="216" y="43" width="18" height="5" rx="2.5" className="cellar-bottle__cork-top" />
          </g>
        </g>
      </svg>
    </div>
  )
}
