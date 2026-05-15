import { MAP_DOTS } from '../data/mockData'

export default function WorldMap() {
  return (
    <div style={{ background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', padding: 12, position: 'relative', minHeight: 180 }}>
      <svg
        width="100%" height="180" viewBox="0 0 320 180"
        style={{ position: 'absolute', top: 0, left: 0, opacity: 0.2 }}
        aria-hidden="true"
      >
        <ellipse cx="160" cy="90" rx="155" ry="85" fill="none" stroke="currentColor" strokeWidth="0.8" />
        <line x1="5" y1="90" x2="315" y2="90" stroke="currentColor" strokeWidth="0.5" />
        <line x1="160" y1="5" x2="160" y2="175" stroke="currentColor" strokeWidth="0.5" />
        <ellipse cx="160" cy="90" rx="80" ry="85" fill="none" stroke="currentColor" strokeWidth="0.5" />
        <ellipse cx="160" cy="90" rx="120" ry="85" fill="none" stroke="currentColor" strokeWidth="0.3" />
      </svg>

      <div style={{ position: 'relative', height: 180 }}>
        {MAP_DOTS.map((d, i) => {
          const size = Math.max(8, Math.min(18, d.count / 5 + 6))
          return (
            <div key={i} title={`${d.label} (${d.count})`} style={{
              position: 'absolute',
              left: `${d.x}%`, top: `${d.y}%`,
              width: size, height: size,
              borderRadius: '50%',
              background: d.color,
              transform: 'translate(-50%, -50%)',
              cursor: 'pointer',
              transition: 'transform 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.5)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)'}
            />
          )
        })}
        {MAP_DOTS.map((d, i) => (
          <div key={`label-${i}`} style={{
            position: 'absolute',
            left: `calc(${d.x}% + ${Math.max(8, Math.min(18, d.count / 5 + 6)) / 2 + 3}px)`,
            top: `${d.y}%`,
            fontSize: 9,
            color: 'var(--color-text-secondary)',
            transform: 'translateY(-50%)',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}>
            {d.label} ({d.count})
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 8 }}>
        {[
          { label: 'Kenya', color: '#1D9E75' },
          { label: 'Europe', color: '#7F77DD' },
          { label: 'Americas', color: '#378ADD' },
          { label: 'East Africa', color: '#EF9F27' },
        ].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--color-text-secondary)' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: l.color }} />
            {l.label}
          </div>
        ))}
      </div>
    </div>
  )
}
