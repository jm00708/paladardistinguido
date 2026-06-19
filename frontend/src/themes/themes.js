/**
 * Temas de branding para El Paladar Distinguido.
 * Cada tema sobreescribe las CSS custom properties de :root.
 */

export const THEMES = {

  // ── 1. Encuadernado (default) ───────────────────────────────────────────
  encuadernado: {
    key: 'encuadernado',
    name: 'Encuadernado',
    description: 'Íntimo · editorial · oscuro',
    palette: ['#2A2118', '#7A1F2E', '#EDE4D3'],
    googleFonts: null,
    vars: {
      '--color-bg':           '#2A2118',
      '--color-bg-raised':    '#332A1F',
      '--color-bg-overlay':   '#1E1710',
      '--color-accent':       '#7A1F2E',
      '--color-accent-dim':   '#5C1722',
      '--color-accent-soft':  'rgba(122, 31, 46, 0.15)',
      '--color-text':         '#EDE4D3',
      '--color-text-muted':   '#C4A882',
      '--color-text-faint':   'rgba(237, 228, 211, 0.40)',
      '--color-line':         'rgba(196, 168, 130, 0.20)',
      '--color-line-strong':  'rgba(196, 168, 130, 0.45)',
      '--font-display':       "'Cormorant Garamond', Georgia, serif",
      '--font-body':          "'Lora', Georgia, serif",
    },
  },

  // ── 2. Noche Dorada ─────────────────────────────────────────────────────
  noche_dorada: {
    key: 'noche_dorada',
    name: 'Noche Dorada',
    description: 'Contemporáneo · minimalista · dorado',
    palette: ['#0D0D12', '#C9A84C', '#F0EFEC'],
    googleFonts: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&display=swap',
    vars: {
      '--color-bg':           '#0D0D12',
      '--color-bg-raised':    '#18181F',
      '--color-bg-overlay':   '#09090D',
      '--color-accent':       '#C9A84C',
      '--color-accent-dim':   '#A8883A',
      '--color-accent-soft':  'rgba(201, 168, 76, 0.12)',
      '--color-text':         '#F0EFEC',
      '--color-text-muted':   '#A89F8C',
      '--color-text-faint':   'rgba(240, 239, 236, 0.35)',
      '--color-line':         'rgba(201, 168, 76, 0.15)',
      '--color-line-strong':  'rgba(201, 168, 76, 0.35)',
      '--font-display':       "'Montserrat', 'Helvetica Neue', sans-serif",
      '--font-body':          "'Montserrat', 'Helvetica Neue', sans-serif",
    },
  },

  // ── 3. Viña Verde ────────────────────────────────────────────────────────
  vina_verde: {
    key: 'vina_verde',
    name: 'Viña Verde',
    description: 'Natural · terroso · vegetal',
    palette: ['#141C10', '#6BA05C', '#E8EDDE'],
    googleFonts: null,
    vars: {
      '--color-bg':           '#141C10',
      '--color-bg-raised':    '#1C2718',
      '--color-bg-overlay':   '#0E1509',
      '--color-accent':       '#6BA05C',
      '--color-accent-dim':   '#528048',
      '--color-accent-soft':  'rgba(107, 160, 92, 0.15)',
      '--color-text':         '#E8EDDE',
      '--color-text-muted':   '#A8B898',
      '--color-text-faint':   'rgba(232, 237, 222, 0.38)',
      '--color-line':         'rgba(107, 160, 92, 0.20)',
      '--color-line-strong':  'rgba(107, 160, 92, 0.45)',
      '--font-display':       "'Cormorant Garamond', Georgia, serif",
      '--font-body':          "'Lora', Georgia, serif",
    },
  },

  // ── 4. Carta Blanca ──────────────────────────────────────────────────────
  carta_blanca: {
    key: 'carta_blanca',
    name: 'Carta Blanca',
    description: 'Luminoso · limpio · clásico',
    palette: ['#FAF6EE', '#7A1F2E', '#1B1F2E'],
    googleFonts: null,
    vars: {
      '--color-bg':           '#FAF6EE',
      '--color-bg-raised':    '#FFFFFF',
      '--color-bg-overlay':   '#F0EAE0',
      '--color-accent':       '#7A1F2E',
      '--color-accent-dim':   '#5C1722',
      '--color-accent-soft':  'rgba(122, 31, 46, 0.08)',
      '--color-text':         '#1B1F2E',
      '--color-text-muted':   '#6B5E52',
      '--color-text-faint':   'rgba(27, 31, 46, 0.35)',
      '--color-line':         'rgba(27, 31, 46, 0.10)',
      '--color-line-strong':  'rgba(27, 31, 46, 0.25)',
      '--font-display':       "'Cormorant Garamond', Georgia, serif",
      '--font-body':          "'Lora', Georgia, serif",
      '--shadow-sm':          '0 1px 4px rgba(0, 0, 0, 0.10)',
      '--shadow-md':          '0 4px 16px rgba(0, 0, 0, 0.12)',
      '--shadow-lg':          '0 8px 32px rgba(0, 0, 0, 0.14)',
    },
  },

  // ── 5. Electro Punk ──────────────────────────────────────────────────────
  electro_punk: {
    key: 'electro_punk',
    name: 'Electro Punk',
    description: 'Disruptivo · neón · underground',
    palette: ['#080810', '#FF2075', '#F0EEFF'],
    googleFonts: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600&display=swap',
    vars: {
      '--color-bg':           '#080810',
      '--color-bg-raised':    '#10101C',
      '--color-bg-overlay':   '#050508',
      '--color-accent':       '#FF2075',
      '--color-accent-dim':   '#CC0055',
      '--color-accent-soft':  'rgba(255, 32, 117, 0.15)',
      '--color-text':         '#F0EEFF',
      '--color-text-muted':   '#9890C0',
      '--color-text-faint':   'rgba(240, 238, 255, 0.35)',
      '--color-line':         'rgba(255, 32, 117, 0.18)',
      '--color-line-strong':  'rgba(255, 32, 117, 0.40)',
      '--font-display':       "'Space Grotesk', 'Helvetica Neue', sans-serif",
      '--font-body':          "'Space Grotesk', 'Helvetica Neue', sans-serif",
      '--radius-sm':          '2px',
      '--radius':             '4px',
      '--radius-lg':          '8px',
    },
  },

  // ── 6. Mediterráneo ──────────────────────────────────────────────────────
  mediterraneo: {
    key: 'mediterraneo',
    name: 'Mediterráneo',
    description: 'Profundo · marino · terracota',
    palette: ['#0A1525', '#D4735A', '#EAE2D6'],
    googleFonts: null,
    vars: {
      '--color-bg':           '#0A1525',
      '--color-bg-raised':    '#122038',
      '--color-bg-overlay':   '#060D18',
      '--color-accent':       '#D4735A',
      '--color-accent-dim':   '#B05A44',
      '--color-accent-soft':  'rgba(212, 115, 90, 0.15)',
      '--color-text':         '#EAE2D6',
      '--color-text-muted':   '#B0A090',
      '--color-text-faint':   'rgba(234, 226, 214, 0.38)',
      '--color-line':         'rgba(212, 115, 90, 0.20)',
      '--color-line-strong':  'rgba(212, 115, 90, 0.45)',
      '--font-display':       "'Cormorant Garamond', Georgia, serif",
      '--font-body':          "'Lora', Georgia, serif",
    },
  },

  // ── 7. Art Déco ──────────────────────────────────────────────────────────
  art_deco: {
    key: 'art_deco',
    name: 'Art Déco',
    description: 'Geométrico · opulento · atemporal',
    palette: ['#12100E', '#D4AF6A', '#F5EDD8'],
    googleFonts: 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap',
    vars: {
      '--color-bg':           '#12100E',
      '--color-bg-raised':    '#1C1916',
      '--color-bg-overlay':   '#0C0A08',
      '--color-accent':       '#D4AF6A',
      '--color-accent-dim':   '#B08A48',
      '--color-accent-soft':  'rgba(212, 175, 106, 0.15)',
      '--color-text':         '#F5EDD8',
      '--color-text-muted':   '#C0A870',
      '--color-text-faint':   'rgba(245, 237, 216, 0.38)',
      '--color-line':         'rgba(212, 175, 106, 0.20)',
      '--color-line-strong':  'rgba(212, 175, 106, 0.45)',
      '--font-display':       "'Playfair Display', Georgia, serif",
      '--font-body':          "'Playfair Display', Georgia, serif",
      '--radius-sm':          '1px',
      '--radius':             '2px',
      '--radius-lg':          '4px',
    },
  },

  // ── 8. Amatista ──────────────────────────────────────────────────────────
  amatista: {
    key: 'amatista',
    name: 'Amatista',
    description: 'Místico · violeta · elegante',
    palette: ['#100D1A', '#A855F7', '#EDE8F8'],
    googleFonts: null,
    vars: {
      '--color-bg':           '#100D1A',
      '--color-bg-raised':    '#1A1628',
      '--color-bg-overlay':   '#0A0810',
      '--color-accent':       '#A855F7',
      '--color-accent-dim':   '#8030D8',
      '--color-accent-soft':  'rgba(168, 85, 247, 0.15)',
      '--color-text':         '#EDE8F8',
      '--color-text-muted':   '#9888C8',
      '--color-text-faint':   'rgba(237, 232, 248, 0.38)',
      '--color-line':         'rgba(168, 85, 247, 0.18)',
      '--color-line-strong':  'rgba(168, 85, 247, 0.40)',
      '--font-display':       "'Cormorant Garamond', Georgia, serif",
      '--font-body':          "'Lora', Georgia, serif",
    },
  },

}

export const DEFAULT_THEME = 'encuadernado'
