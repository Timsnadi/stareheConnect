import { useState, useEffect } from 'react'
import { Trophy, Home, Medal, Loader, AlertTriangle } from 'lucide-react'
import Card, { CardTitle } from '../components/Card'
import Avatar from '../components/Avatar'
import WorldMap from '../components/WorldMap'
import { getLeaderboard, getHouseLeaderboard, getBadges } from '../lib/api'
import { getProfile, pickAvatarVariant } from '../lib/sessionUser'
import { LEADERBOARD as FALLBACK_LB, HOUSE_LEADERBOARD as FALLBACK_HLB, BADGES as FALLBACK_BADGES } from '../data/mockData'

const BADGE_ICONS = {
  Heart: '❤️', MessageCircle: '💬', Star: '⭐',
  Home: '🏠', Briefcase: '💼', Calendar: '📅',
  Trophy: '🏆', BookOpen: '📖',
}

function nameInitials(name = '') {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

export default function Community() {
  const me = getProfile()
  const [leaderboard, setLeaderboard]       = useState([])
  const [houseBoard, setHouseBoard]         = useState([])
  const [badges, setBadges]                 = useState([])
  const [loading, setLoading]               = useState(true)
  const [fallback, setFallback]             = useState(false)

  useEffect(() => {
    const userId = me?.id
    Promise.all([
      getLeaderboard()
        .then(r => setLeaderboard(r.data))
        .catch(() => { setLeaderboard(FALLBACK_LB); setFallback(true) }),
      getHouseLeaderboard()
        .then(r => setHouseBoard(r.data))
        .catch(() => setHouseBoard(FALLBACK_HLB)),
      userId
        ? getBadges(userId).then(r => setBadges(r.data)).catch(() => setBadges(FALLBACK_BADGES))
        : Promise.resolve(setBadges(FALLBACK_BADGES.map(b => ({ ...b, earned: false })))),
    ]).finally(() => setLoading(false))
  }, [])

  const maxPts  = leaderboard.length > 0 ? Math.max(...leaderboard.map(m => m.pts), 1) : 1
  const maxHPts = houseBoard.length  > 0 ? Math.max(...houseBoard.map(h => h.pts), 1)  : 1
  const earnedCount = badges.filter(b => b.earned).length

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem', gap: 10, color: 'var(--color-text-muted)' }}>
      <Loader size={18} /> Loading community…
    </div>
  )

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 16, alignItems: 'start' }}>

      {/* Left */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Card>
          <CardTitle icon={Trophy}>Top mentors</CardTitle>
          {fallback && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', background: '#FAEEDA', color: '#412402', borderRadius: 'var(--radius-md)', fontSize: 11, marginBottom: 10 }}>
              <AlertTriangle size={12} /> Sample data — rankings update as alumni hold sessions.
            </div>
          )}
          {leaderboard.length === 0 ? (
            <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>No mentor activity yet.</div>
          ) : leaderboard.map((m, i) => (
            <div key={m._id || m.init} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < leaderboard.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
              <span style={{ fontSize: 13, fontWeight: 500, width: 20, flexShrink: 0, color: i === 0 ? '#BA7517' : 'var(--color-text-muted)' }}>
                {i + 1}
              </span>
              <Avatar init={m.init || nameInitials(m.name)} avc={m.avc || pickAvatarVariant(m)} size={30} />
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
          {houseBoard.length === 0 ? (
            <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>No house activity yet.</div>
          ) : houseBoard.map((h, i) => (
            <div key={h.house} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: i < houseBoard.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
              <span style={{ fontSize: 12, fontWeight: 500, width: 18, flexShrink: 0, color: i === 0 ? '#BA7517' : 'var(--color-text-muted)' }}>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 14 }}>
            {badges.map(b => (
              <div key={b.key || b.name} style={{
                background: 'var(--color-bg)', borderRadius: 'var(--radius-md)',
                padding: '10px 6px', textAlign: 'center',
                opacity: b.earned ? 1 : 0.35,
                border: b.earned ? '1px solid var(--color-border)' : '1px dashed var(--color-border)',
              }}>
                <div style={{ fontSize: 20, marginBottom: 5 }}>{BADGE_ICONS[b.icon] || '🏅'}</div>
                <div style={{ fontSize: 10, color: 'var(--color-text-secondary)', lineHeight: 1.3 }}>{b.name}</div>
              </div>
            ))}
          </div>
          {badges.length === 0 && (
            <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>No badges yet — start connecting to earn them.</div>
          )}
          {badges.length > 0 && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 5 }}>
                <span>Progress</span>
                <span>{earnedCount} / {badges.length} badges</span>
              </div>
              <div style={{ height: 5, background: 'var(--color-bg)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', background: 'var(--color-primary)', borderRadius: 3, width: `${badges.length > 0 ? Math.round(earnedCount / badges.length * 100) : 0}%`, transition: 'width 0.6s ease' }} />
              </div>
              {earnedCount === 0 && (
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 6, fontStyle: 'italic' }}>
                  Badges are earned through activity — connect with a mentor, complete sessions, and contribute resources.
                </div>
              )}
            </>
          )}
        </Card>

        <Card>
          <CardTitle>Alumni world map</CardTitle>
          <WorldMap />
          <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 8 }}>
            Illustrative map — live alumni locations coming soon.
          </div>
        </Card>
      </div>
    </div>
  )
}
