import './Button.css'

export default function Button({ children, variant = 'primary', size = 'md', fullWidth = false, disabled = false, onClick, type = 'button' }) {
  return (
    <button
      type={type}
      className={[
        'btn',
        `btn--${variant}`,
        `btn--${size}`,
        fullWidth && 'btn--full',
      ].filter(Boolean).join(' ')}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
