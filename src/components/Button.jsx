const BASE = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  gap: 6, border: 'none', borderRadius: 'var(--radius-md)',
  fontFamily: 'inherit', fontWeight: 500, cursor: 'pointer',
  transition: 'all 0.15s', whiteSpace: 'nowrap',
}

const SIZES = {
  sm:  { padding: '5px 12px', fontSize: 12 },
  md:  { padding: '8px 16px', fontSize: 13 },
  lg:  { padding: '10px 20px', fontSize: 14 },
  full:{ padding: '10px 20px', fontSize: 14, width: '100%' },
}

const VARIANTS = {
  primary:  { background: 'var(--color-primary)', color: '#fff', border: 'none' },
  secondary:{ background: 'transparent', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' },
  ghost:    { background: 'transparent', color: 'var(--color-text-secondary)', border: 'none' },
  success:  { background: '#E1F5EE', color: '#085041', border: '1px solid #9FE1CB' },
  danger:   { background: '#FCEBEB', color: '#501313', border: '1px solid #F7C1C1' },
}

export default function Button({
  children, variant = 'secondary', size = 'sm',
  onClick, style = {}, disabled = false, type = 'button'
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={{
        ...BASE,
        ...SIZES[size],
        ...VARIANTS[variant],
        opacity: disabled ? 0.5 : 1,
        ...style,
      }}
    >
      {children}
    </button>
  )
}
