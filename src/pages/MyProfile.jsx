import { useState, useEffect } from 'react'
import { Edit2, Bell, Save, X, Loader } from 'lucide-react'
import Card, { CardTitle } from '../components/Card'
import Avatar from '../components/Avatar'
import Badge from '../components/Badge'
import Button from '../components/Button'
import { getUser, updateUser, getBadges, getConnections } from '../lib/api'
import { getProfile, pickAvatarVariant, displayInitials } from '../lib/sessionUser'
import { BADGES as FALLBACK_BADGES } from '../data/mockData'

const BADGE_ICONS = {
  Heart: '❤️', MessageCircle: '💬', Star: '⭐',
  Home: '🏠', Briefcase: '💼', Calendar: '📅',
  Trophy: '🏆', BookOpen: '📖',
}

const NOTIFICATIONS = [
  { init: 'SC', avc: 'blue',  text: 'Welcome to StareheConnect! Complete your profile to get started.', time: 'Just now' },
]

export default function MyProfile() {
  const me = getProfile()
  const [profile, setProfile]   = useState(null)
  const [badges, setBadges]     = useState([])
  const [connections, setConnections] = useState([])
  const [loading, setLoading]   = useState(true)
  const [editing, setEditing]   = useState(false)
  const [saving, setSaving]     = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [form, setForm]         = useState({})

  useEffect(() => {
    if (!me?.id) { setLoading(false); return }
    Promise.all([
      getUser(me.id).then(r => {
        setProfile(r.data)
        setForm({
          name: r.data.name || '',
          bio: r.data.bio || '',
          profession: r.data.profession || '',
          location: r.data.location || '',
        })
      }).catch(() => setProfile(me)),
      getBadges(me.id).then(r => setBadges(r.data)).catch(() => setBadges(FALLBACK_BADGES.map(b => ({ ...b, earned: false })))),
      getConnections(me.id).then(r => setConnections(r.data)).catch(() => {}),
    ]).finally(() => setLoading(false))
  }, [])

  async function handleSave() {
    setSaving(true)
    setSaveError(null)
    try {
      const res = await updateUser(me.id, form)
      setProfile(res.data)
      setEditing(false)
    } catch {
      setSaveError('Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem', gap: 10, color: 'var(--color-text-muted)' }}>
      <Loader size={18} /> Loading profile…
    </div>
  )

  const p = profile || me || {}
  const earnedCount = badges.filter(b => b.earned).length
  const STATS = [
    { n: connections.length,  label: 'Connections' },
    { n: earnedCount,         label: 'Badges earned' },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.3fr) minmax(0,1fr)', gap: 16, alignItems: 'start' }}>

      {/* Left */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Card>
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 16 }}>
            <Avatar init={displayInitials(p)} avc={pickAvatarVariant(p)} size={60} />
            <div style={{ flex: 1 }}>
              {editing ? (
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  style={{ fontSize: 16, fontWeight: 500, padding: '4px 8px', width: '100%', marginBottom: 6 }} />
              ) : (
                <div style={{ fontSize: 17, fontWeight: 500 }}>{p.name}</div>
              )}
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: editing ? 0 : 2 }}>
                {p.role === 'alumnus' ? 'Alumni' : 'Student'} · {p.stream} · {p.house} House
              </div>
              <div style={{ display: 'flex', gap: 5, marginTop: 8, flexWrap: 'wrap' }}>
                {p.house   && <Badge variant="teal">{p.house} House</Badge>}
                {p.stream  && <Badge variant="blue">{p.stream}</Badge>}
                {p.role    && <Badge variant="purple">{p.role === 'alumnus' ? 'Alumni' : 'Student'}</Badge>}
                {(p.clubs || []).slice(0, 2).map(c => <Badge key={c} variant="amber">{c}</Badge>)}
              </div>
            </div>
            {editing ? (
              <div style={{ display: 'flex', gap: 6 }}>
                <Button variant="primary" size="sm" onClick={handleSave} disabled={saving}
                  style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Save size={12} /> {saving ? 'Saving…' : 'Save'}
                </Button>
                <Button variant="secondary" size="sm" onClick={() => setEditing(false)}>
                  <X size={12} />
                </Button>
              </div>
            ) : (
              <Button variant="secondary" size="sm" onClick={() => setEditing(true)}
                style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <Edit2 size={12} /> Edit
              </Button>
            )}
          </div>

          {saveError && (
            <div style={{ fontSize: 12, color: '#993C1D', marginBottom: 10 }}>{saveError}</div>
          )}

          {/* Bio */}
          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Bio</div>
            {editing ? (
              <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                placeholder="Tell the community about yourself…"
                style={{ width: '100%', padding: '8px 12px', resize: 'none', height: 72, fontSize: 13, borderRadius: 'var(--radius-md)' }} />
            ) : (
              <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                {p.bio || 'No bio yet. Click Edit to add one.'}
              </p>
            )}
          </div>

          {/* Profession (alumni) */}
          {(p.role === 'alumnus' || editing) && (
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 12, marginTop: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Profession</div>
              {editing ? (
                <input value={form.profession} onChange={e => setForm(f => ({ ...f, profession: e.target.value }))}
                  placeholder="e.g. Software Engineer @ Safaricom"
                  style={{ padding: '7px 10px', fontSize: 13, width: '100%' }} />
              ) : (
                <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{p.profession || '—'}</div>
              )}
            </div>
          )}

          {/* Clubs */}
          {(p.clubs || []).length > 0 && (
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 12, marginTop: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>Clubs & activities</div>
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                {(p.clubs || []).map(c => <Badge key={c} variant="amber">{c}</Badge>)}
              </div>
            </div>
          )}
        </Card>

        <Card>
          <CardTitle>My badges</CardTitle>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 5 }}>
            <span>Progress</span><span>{earnedCount} / {badges.length} earned</span>
          </div>
          <div style={{ height: 5, background: 'var(--color-bg)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', background: 'var(--color-primary)', borderRadius: 3, width: `${badges.length > 0 ? Math.round(earnedCount / badges.length * 100) : 0}%` }} />
          </div>
        </Card>
      </div>

      {/* Right */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {STATS.map(s => (
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
          {NOTIFICATIONS.map((n, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: i < NOTIFICATIONS.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
              <Avatar init={n.init} avc={n.avc} size={30} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, color: 'var(--color-text-primary)', lineHeight: 1.5 }}>{n.text}</div>
                <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginTop: 2 }}>{n.time}</div>
              </div>
            </div>
          ))}
        </Card>

        {connections.length > 0 && (
          <Card>
            <CardTitle>My connections</CardTitle>
            {connections.map(c => (
              <div key={c._id} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '7px 0', borderBottom: '1px solid var(--color-border)' }}>
                <Avatar
                  init={c.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
                  avc={pickAvatarVariant(c)} size={30}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                    {c.profession || c.role} · {c.house} House
                  </div>
                </div>
              </div>
            ))}
          </Card>
        )}
      </div>
    </div>
  )
}
