import { useOutletContext } from 'react-router-dom'
import { Edit2, Bell } from 'lucide-react'
import Card, { CardTitle } from '../components/Card'
import Avatar from '../components/Avatar'
import Badge from '../components/Badge'
import Button from '../components/Button'
import { BADGES } from '../data/mockData'
import { getProfile, displayInitials } from '../lib/sessionUser'

const BADGE_ICONS = {
  Heart: '❤️', MessageCircle: '💬', Star: '⭐',
  Home: '🏠', Briefcase: '💼', Calendar: '📅',
  Trophy: '🏆', BookOpen: '📖',
}

const VARIANT_CYCLE = ['teal', 'blue', 'purple', 'amber', 'coral', 'green']

function formatRole(role) {
  if (!role) return null
  if (role === 'alumnus') return 'Alumnus'
  if (role === 'student') return 'Student'
  if (role === 'admin') return 'Admin'
  return role
}

export default function MyProfile() {
  const { userSession } = useOutletContext()
  const profile = getProfile(userSession)
  const name = profile?.name || 'Member'
  const initials = displayInitials(name)

  const subtitleParts = [profile?.stream, profile?.house].filter(Boolean)
  const subtitle = subtitleParts.length
    ? subtitleParts.join(' · ')
    : [formatRole(profile?.role)].filter(Boolean).join('') || 'Your profile'

  const identityTags = []
  if (profile?.house) identityTags.push({ label: profile.house, variant: 'teal' })
  if (profile?.stream) identityTags.push({ label: profile.stream, variant: 'blue' })
  const roleLabel = formatRole(profile?.role)
  if (roleLabel) identityTags.push({ label: roleLabel, variant: 'purple' })
  if (Array.isArray(profile?.clubs)) {
    profile.clubs.forEach((club, i) => {
      if (club) identityTags.push({ label: club, variant: VARIANT_CYCLE[(identityTags.length + i) % VARIANT_CYCLE.length] })
    })
  }

  const careerTags = []
  if (Array.isArray(profile?.clubs) && profile.clubs.length) {
    profile.clubs.forEach((club, i) => {
      if (club) careerTags.push({ label: club, variant: VARIANT_CYCLE[i % VARIANT_CYCLE.length] })
    })
  }
  if (profile?.profession) careerTags.push({ label: profile.profession, variant: 'gray' })

  const stats = [
    { n: 0, label: 'Mentors connected' },
    { n: 0, label: 'Sessions done' },
    { n: 0, label: 'Badges earned' },
    { n: 0, label: 'Resources read' },
  ]

  const badgesDisplay = BADGES.map(b => ({ ...b, earned: false }))
  const earnedCount = 0

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.3fr) minmax(0,1fr)', gap: 16, alignItems: 'start' }}>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Card>
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 16 }}>
            <Avatar init={initials} avc="teal" size={60} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 17, fontWeight: 500 }}>{name}</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 2 }}>{subtitle}</div>
              <div style={{ display: 'flex', gap: 5, marginTop: 8, flexWrap: 'wrap' }}>
                {identityTags.length > 0 ? (
                  identityTags.map((t, i) => (
                    <Badge key={`${t.label}-${i}`} variant={t.variant}>{t.label}</Badge>
                  ))
                ) : (
                  <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Add house and stream in profile settings when available.</span>
                )}
              </div>
            </div>
            <Button variant="secondary" size="sm" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Edit2 size={12} /> Edit
            </Button>
          </div>

          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>
              Career goals
            </div>
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
              {careerTags.length > 0 ? (
                careerTags.map((t, i) => (
                  <Badge key={`c-${t.label}-${i}`} variant={t.variant}>{t.label}</Badge>
                ))
              ) : (
                <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Goals will appear here as you complete onboarding and update your profile.</span>
              )}
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 12, marginTop: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>
              Mentorship progress
            </div>
            <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 6 }}>
              Connect with mentors to see sessions and milestones here. (Live stats when the API is connected.)
            </div>
            <div style={{ height: 5, background: 'var(--color-bg)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', background: 'var(--color-primary)', borderRadius: 3, width: '0%' }} />
            </div>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 4 }}>0% — start from the Matching or Alumni pages</div>
          </div>
        </Card>

        <Card>
          <CardTitle>My badges</CardTitle>
          <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 12 }}>
            Sample badge types below; yours will unlock as you use the platform.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 14 }}>
            {badgesDisplay.map(b => (
              <div key={b.name} style={{
                background: 'var(--color-bg)', borderRadius: 'var(--radius-md)',
                padding: '10px 6px', textAlign: 'center',
                opacity: b.earned ? 1 : 0.4,
                border: b.earned ? '1px solid var(--color-border)' : '1px dashed var(--color-border)',
              }}>
                <div style={{ fontSize: 20, marginBottom: 5 }}>{BADGE_ICONS[b.icon]}</div>
                <div style={{ fontSize: 10, color: 'var(--color-text-secondary)', lineHeight: 1.3 }}>{b.name}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 5 }}>
            <span>Progress</span><span>{earnedCount} / {BADGES.length} earned</span>
          </div>
          <div style={{ height: 5, background: 'var(--color-bg)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', background: 'var(--color-primary)', borderRadius: 3, width: `${Math.round(earnedCount / BADGES.length * 100)}%` }} />
          </div>
        </Card>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {stats.map(s => (
            <div key={s.label} style={{
              background: 'var(--color-surface)', border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)', padding: '12px 14px',
            }}>
              <div style={{ fontSize: 24, fontWeight: 500 }}>{s.n}</div>
              <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <Card>
          <CardTitle icon={Bell}>Notifications</CardTitle>
          <div style={{ fontSize: 13, color: 'var(--color-text-muted)', padding: '12px 0' }}>
            You&apos;re all caught up. Notifications will appear here when the feed is connected to your account.
          </div>
        </Card>
      </div>
    </div>
  )
}
