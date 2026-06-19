/* Ornamento botánico SVG — hoja de vid estilizada */
export default function Ornament({ size = 24, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={{ color: 'var(--color-text-muted)', opacity: 0.7 }}
      aria-hidden="true"
    >
      {/* Tallo central */}
      <path d="M12 20 C12 14, 12 10, 12 4" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
      {/* Hoja izquierda */}
      <path
        d="M12 13 C9 11, 6 9, 7 6 C8 9, 10 11, 12 13Z"
        fill="currentColor" opacity="0.6"
      />
      {/* Hoja derecha */}
      <path
        d="M12 10 C15 8, 18 6, 17 3 C16 6, 14 8, 12 10Z"
        fill="currentColor" opacity="0.6"
      />
      {/* Zarcillo */}
      <path
        d="M12 16 C14 15, 16 14, 17 16 C16 17, 14 17, 12 16"
        stroke="currentColor" strokeWidth="0.6" fill="none" strokeLinecap="round"
      />
    </svg>
  )
}

/* Separador horizontal con ornamento central */
export function OrnamentDivider({ label }) {
  return (
    <div className="ornament-line" style={{ margin: '1.5rem 0' }}>
      {label || <Ornament size={16} />}
    </div>
  )
}

/* Logo tipográfico */
export function Logo({ size = 'md' }) {
  const sizes = { sm: '1.5rem', md: '2rem', lg: '2.75rem' }
  return (
    <div style={{ textAlign: 'center', lineHeight: 1.2 }}>
      <Ornament size={size === 'lg' ? 28 : 20} style={{ display: 'block', margin: '0 auto var(--space-2)' }} />
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: sizes[size],
        fontWeight: 300,
        letterSpacing: '0.05em',
        color: 'var(--color-text)',
      }}>
        El Paladar
      </div>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: `calc(${sizes[size]} * 0.6)`,
        fontWeight: 400,
        letterSpacing: '0.25em',
        color: 'var(--color-text-muted)',
        textTransform: 'uppercase',
        marginTop: '2px',
      }}>
        Distinguido
      </div>
    </div>
  )
}
