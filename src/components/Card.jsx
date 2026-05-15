export default function Card({ children, style = {}, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '1rem 1.25rem',
        boxShadow: 'var(--shadow-card)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'border-color 0.15s',
        ...style,
      }}
      onMouseEnter={e => onClick && (e.currentTarget.style.borderColor = 'var(--color-border-strong)')}
      onMouseLeave={e => onClick && (e.currentTarget.style.borderColor = 'var(--color-border)')}
    >
      {children}
    </div>
  )
}

export function CardTitle({ icon: Icon, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14 }}>
      {Icon && <Icon size={15} style={{ color: 'var(--color-text-muted)' }} />}
      <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)' }}>
        {children}
      </span>
    </div>
  )
}
