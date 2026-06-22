import './WineBottleHero.css'

/**
 * Momento de marca: una botella de vino tinto a la que se le retira el
 * corcho con un "pop" al abrir la app. Animación de una sola vez (no
 * continua), construida solo con SVG + CSS — sin librerías de animación.
 */
export default function WineBottleHero() {
  return (
    <div className="bottle-hero" aria-hidden="true">
      <svg
        className="bottle-hero__svg"
        viewBox="0 0 200 380"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="bh-glass" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--color-accent-dim)" />
            <stop offset="45%" stopColor="var(--color-accent)" />
            <stop offset="60%" stopColor="var(--color-accent)" />
            <stop offset="100%" stopColor="var(--color-accent-dim)" />
          </linearGradient>
          <linearGradient id="bh-foil" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--color-text-muted)" />
            <stop offset="50%" stopColor="var(--color-text)" />
            <stop offset="100%" stopColor="var(--color-text-muted)" />
          </linearGradient>
        </defs>

        {/* Sombra de apoyo */}
        <ellipse className="bottle-hero__shadow" cx="100" cy="358" rx="46" ry="9" />

        {/* Destello del "pop" — líneas que estallan desde la boca de la botella */}
        <g className="bottle-hero__burst">
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const angle = -90 + (i - 2.5) * 26
            const rad = (angle * Math.PI) / 180
            const x2 = 100 + Math.cos(rad) * 34
            const y2 = 92 + Math.sin(rad) * 34
            return (
              <line
                key={i}
                className="bottle-hero__burst-ray"
                x1="100" y1="92"
                x2={x2} y2={y2}
                strokeLinecap="round"
              />
            )
          })}
        </g>

        {/* Cuerpo de la botella */}
        <g className="bottle-hero__bottle">
          <path
            className="bottle-hero__glass"
            d="M86,60 L86,128 C86,128 60,146 60,180 L60,338 C60,348 67,354 77,354 L123,354 C133,354 140,348 140,338 L140,180 C140,146 114,128 114,128 L114,60 Z"
            fill="url(#bh-glass)"
          />
          {/* brillo del vidrio */}
          <path className="bottle-hero__shine" d="M70,190 L70,330" strokeLinecap="round" />

          {/* cápsula / foil del cuello */}
          <path
            className="bottle-hero__foil"
            d="M84,60 L116,60 L116,116 C116,116 108,124 100,124 C92,124 84,116 84,116 Z"
            fill="url(#bh-foil)"
          />

          {/* etiqueta */}
          <rect className="bottle-hero__label" x="72" y="210" width="56" height="64" rx="3" />
          <g className="bottle-hero__label-mark">
            <path d="M100,260 C100,250 100,242 100,232" strokeLinecap="round" />
            <path d="M100,247 C95,244 91,240 92,235 C94,239 97,243 100,247Z" />
            <path d="M100,241 C105,238 109,234 108,229 C106,233 103,237 100,241Z" />
          </g>
        </g>

        {/* Boca de la botella (debajo del corcho) */}
        <rect x="92" y="56" width="16" height="10" rx="2" className="bottle-hero__mouth" />

        {/* Corcho — se anima hacia afuera */}
        <g className="bottle-hero__cork">
          <rect x="91" y="32" width="18" height="28" rx="4" className="bottle-hero__cork-body" />
          <rect x="91" y="32" width="18" height="7" rx="3.5" className="bottle-hero__cork-top" />
          <line x1="95" y1="42" x2="95" y2="56" className="bottle-hero__cork-line" />
          <line x1="100" y1="40" x2="100" y2="58" className="bottle-hero__cork-line" />
          <line x1="105" y1="42" x2="105" y2="56" className="bottle-hero__cork-line" />
        </g>
      </svg>
    </div>
  )
}
