/* Iconos SVG minimalistas (estilo Heroicons outline, 24x24, stroke-based) */

const base = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export const IconGrid = (props) => (
  <svg {...base} {...props}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
)

export const IconBottle = (props) => (
  <svg {...base} {...props}>
    <path d="M9 2h6" />
    <path d="M10 2v5.5c0 .9-.4 1.7-1.1 2.3C7.7 10.8 7 12.3 7 14v5a3 3 0 0 0 3 3h4a3 3 0 0 0 3-3v-5c0-1.7-.7-3.2-1.9-4.2-.7-.6-1.1-1.4-1.1-2.3V2" />
    <path d="M7.5 13.5h9" />
  </svg>
)

export const IconSparkle = (props) => (
  <svg {...base} {...props}>
    <path d="M12 3v4M12 17v4M5 5l2.5 2.5M16.5 16.5 19 19M3 12h4M17 12h4M5 19l2.5-2.5M16.5 7.5 19 5" />
    <circle cx="12" cy="12" r="2.5" />
  </svg>
)

export const IconLogout = (props) => (
  <svg {...base} {...props}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="M16 17l5-5-5-5" />
    <path d="M21 12H9" />
  </svg>
)

export const IconSearch = (props) => (
  <svg {...base} {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3" />
  </svg>
)

export const IconPencil = (props) => (
  <svg {...base} {...props}>
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
)

export const IconCheck = (props) => (
  <svg {...base} {...props}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
)

export const IconX = (props) => (
  <svg {...base} {...props}>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
)

export const IconTrendUp = (props) => (
  <svg {...base} {...props}>
    <path d="M3 17l6-6 4 4 7-7" />
    <path d="M16 7h5v5" />
  </svg>
)

export const IconUsers = (props) => (
  <svg {...base} {...props}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
    <path d="M16.5 6.2a3.2 3.2 0 0 1 0 6.3" />
    <path d="M21 20c0-2.7-1.8-5-4.3-5.7" />
  </svg>
)

export const IconStar = (props) => (
  <svg {...base} {...props}>
    <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8-4.3-4.1 5.9-.9Z" />
  </svg>
)

export const IconDiamond = (props) => (
  <svg {...base} {...props}>
    <path d="M6 3h12l3 6-9 12L3 9Z" />
    <path d="M3 9h18M9 3l-1.5 6L12 21l4.5-12L15 3" />
  </svg>
)
