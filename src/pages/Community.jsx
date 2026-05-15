import { Trophy, Home, Medal, Lock } from 'lucide-react'
import Card, { CardTitle } from '../components/Card'
import Avatar from '../components/Avatar'
import WorldMap from '../components/WorldMap'
import { LEADERBOARD, HOUSE_LEADERBOARD, BADGES } from '../data/mockData'

const BADGE_ICONS = {
  Heart: '❤️', MessageCircle: '💬', Star: '⭐',
  Home: '🏠', Briefcase: '💼', Calendar: '📅',
  Trophy: '🏆', BookOpen: '📖',
}

export default function Community() {
  const maxPts = LEADERBOARD.length ? Math.max(...LEADERBOARD.map(m => m.pts)) : 1
  const maxHPts = HOUSE_LEADERBOARD.length ? Math.max(...HOUSE_LEADERBOARD.map(h => h.pts)) : 1
  const badgesDisplay = BADGES.map(b => ({ ...b, earned: false }))
  const earnedCount = 0

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 16, alignItems: 'start' }}>

      {/* Left */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

        <Card>
          <CardTitle icon={Trophy}>Top mentors</CardTitle>
          <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 8 }}>Sample leaderboard — not live rankings.</p>
          {LEADERBOARD.map((m, i) => (
            <div key={m.init} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < LEADERBOARD.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
              <span style={{
                fontSize: 13, fontWeight: 500, width: 20, flexShrink: 0,
                color: i === 0 ? '#BA7517' : 'var(--color-text-muted)',
              }}>
                {i + 1}
              </span>
              <Avatar init={m.init} avc={m.avc} size={30} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{m.name}</div>
                <div style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>{m.sessions} sessions · {m.house} House</div>
                <div style={{ height: 4, background: 'var(--color-bg)', borderRadius: 2, overflow: 'hidden', marginTop: 5 }}>
                  <div style={{ height: '100%', background: 'var(--color-primary)', borderRadius: 2, width: `${Math.round(m.pts / maxPts * 100)}%`, transition: 'width 0.6s ease' }} />
                </div>
              </div>
              <span style={{ fontSize: 12, color: 'var(--color-text-secondary)', minWidth: 50, textAlign: 'right' }}>
                {m.pts} pts
              </span>
            </div>
          ))}
        </Card>

        <Card>
          <CardTitle icon={Home}>House pride leaderboard</CardTitle>
          <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 8 }}>Sample points — for display only.</p>
          {HOUSE_LEADERBOARD.map((h, i) => (
            <div key={h.house} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: i < HOUSE_LEADERBOARD.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
              <span style={{
                fontSize: 12, fontWeight: 500, width: 18, flexShrink: 0,
                color: i === 0 ? '#BA7517' : 'var(--color-text-muted)',
              }}>
                {i + 1}
              </span>
              <span style={{ fontSize: 13, fontWeight: 500, minWidth: 64 }}>{h.house}</span>
              <div style={{ flex: 1, height: 5, background: 'var(--color-bg)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 3, background: h.color, width: `${Math.round(h.pts / maxHPts * 100)}%`, transition: 'width 0.6s ease' }} />
              </div>
              <span style={{ fontSize: 12, color: 'var(--color-text-secondary)', minWidth: 50, textAlign: 'right' }}>
                {h.pts.toLocaleString()}
              </span>
            </div>
          ))}
        </Card>
      </div>

      {/* Right */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Card>
          <CardTitle icon={Medal}>My badges</CardTitle>
          <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 10 }}>
            Examples only — none are tied to your account until achievements are tracked on the server.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 14 }}>
            {badgesDisplay.map(b => (
              <div key={b.name} style={{
                background: 'var(--color-bg)',
                borderRadius: 'var(--radius-md)', padding: '10px 6px',
                textAlign: 'center', opacity: b.earned ? 1 : 0.4,
                border: b.earned ? '1px solid var(--color-border)' : '1px dashed var(--color-border)',
              }}>
                <div style={{ fontSize: 20, marginBottom: 5 }}>{BADGE_ICONS[b.icon]}</div>
                <div style={{ fontSize: 10, color: 'var(--color-text-secondary)', lineHeight: 1.3 }}>{b.name}</div>
              </div>
            ))}
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 5 }}>
              <span>Overall progress</span>
              <span>{earnedCount} / {BADGES.length} badges</span>
            </div>
            <div style={{ height: 5, background: 'var(--color-bg)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{
                height: '100%', background: 'var(--color-primary)', borderRadius: 3,
                width: `${Math.round(earnedCount / BADGES.length * 100)}%`,
                transition: 'width 0.6s ease',
              }} />
            </div>
          </div>
        </Card>

        <Card>
          <CardTitle>Alumni world map</CardTitle>
          <WorldMap />
          <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 8 }}>
            Illustrative map from the design prototype — not live member locations.
          </div>
        </Card>
      </div>
    </div>
  )
}
