const VARIANTS = {
  teal:   { bg: '#E1F5EE', color: '#085041' },
  blue:   { bg: '#E6F1FB', color: '#042C53' },
  purple: { bg: '#EEEDFE', color: '#26215C' },
  amber:  { bg: '#FAEEDA', color: '#412402' },
  coral:  { bg: '#FAECE7', color: '#4A1B0C' },
  green:  { bg: '#EAF3DE', color: '#173404' },
  gray:   { bg: '#F1EFE8', color: '#2C2C2A' },
  red:    { bg: '#FCEBEB', color: '#501313' },
}

export default function Badge({ children, variant = 'teal', style = {} }) {
  const { bg, color } = VARIANTS[variant] || VARIANTS.gray
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 3,
      padding: '2px 8px', borderRadius: 10,
      fontSize: 11, fontWeight: 500,
      background: bg, color,
      whiteSpace: 'nowrap',
      ...style,
    }}>
      {children}
    </span>
  )
}
