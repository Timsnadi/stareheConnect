const COLOR_MAP = {
  teal:   { bg: '#E1F5EE', color: '#085041' },
  blue:   { bg: '#E6F1FB', color: '#042C53' },
  coral:  { bg: '#FAECE7', color: '#4A1B0C' },
  purple: { bg: '#EEEDFE', color: '#26215C' },
  amber:  { bg: '#FAEEDA', color: '#412402' },
  green:  { bg: '#EAF3DE', color: '#173404' },
  pink:   { bg: '#FBEAF0', color: '#4B1528' },
}

export default function Avatar({ init, avc = 'teal', size = 36, radius = '50%' }) {
  const { bg, color } = COLOR_MAP[avc] || COLOR_MAP.teal
  const fontSize = Math.round(size * 0.35)
  return (
    <div style={{
      width: size, height: size, borderRadius: radius,
      background: bg, color, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize, fontWeight: 500, letterSpacing: '0.02em',
    }}>
      {init}
    </div>
  )
}
