import { useState, useEffect } from 'react'
import { MapPin, X, Loader, AlertTriangle } from 'lucide-react'
import Card, { CardTitle } from '../components/Card'
import Avatar from '../components/Avatar'
import Badge from '../components/Badge'
import Button from '../components/Button'
import WorldMap from '../components/WorldMap'
import { getUsers, createConversation } from '../lib/api'
import { getProfile, pickAvatarVariant } from '../lib/sessionUser'
import { ALUMNI as FALLBACK_ALUMNI } from '../data/mockData'
import { useNavigate } from 'react-router-dom'

const FIELDS = ['All', 'Technology', 'Finance', 'Medicine', 'Law', 'Engineering', 'Education', 'Entrepreneurship']

function nameInitials(name = '') {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

export default function Alumni() {
  const me       = getProfile()
  const navigate = useNavigate()
  const [alumni, setAlumni]           = useState([])
  const [filter, setFilter]           = useState('All')
  const [search, setSearch]           = useState('')
  const [openProfile, setOpenProfile] = useState(null)
  const [loading, setLoading]         = useState(true)
  const [fallback, setFallback]       = useState(false)
  const [error, setError]             = useState(null)

  useEffect(() => {
    getUsers()
      .then(r => {
        const others = r.data.filter(u => u._id !== me?.id && u.role !== 'admin')
        if (others.length === 0) {
          setAlumni([])
        } else {
          setAlumni(others)
        }
      })
      .catch(() => {
        setAlumni(FALLBACK_ALUMNI)
        setFallback(true)
        setError('Could not reach the server. Showing sample data.')
      })
      .finally(() => setLoading(false))
  }, [])

  const filtered = alumni.filter(a => {
    const field = a.field || a.profession || ''
    const fMatch = filter === 'All' || field.toLowerCase().includes(filter.toLowerCase()) || (a.role === 'alumnus' && filter === 'All')
    const sMatch = !search
      || a.name?.toLowerCase().includes(search.toLowerCase())
      || (a.profession || a.co || '').toLowerCase().includes(search.toLowerCase())
    return fMatch && sMatch
  })

  async function handleMessage(user) {
    try {
      const res = await createConversation(user._id)
      navigate('/messages', { state: { conversationId: res.data._id } })
    } catch {
      setError('Could not start conversation. Please try again.')
    }
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem', gap: 10, color: 'var(--color-text-muted)' }}>
      <Loader size={18} /> Loading alumni…
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: '#FAEEDA', color: '#412402', borderRadius: 'var(--radius-md)', fontSize: 13 }}>
          <AlertTriangle size={14} /> {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search alumni…"
          style={{ width: 200, padding: '7px 12px' }}
        />
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {FIELDS.map(f => (
            <Button key={f} variant={filter === f ? 'success' : 'secondary'} size="sm"
              onClick={() => setFilter(f)}>{f}
            </Button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.3fr) minmax(0,1fr)', gap: 14, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)', fontSize: 13 }}>
              {fallback ? 'No alumni matched your filter.' : 'No other users found yet.'}
            </div>
          ) : filtered.map(a => (
            <Card key={a._id || a.init} onClick={() => setOpenProfile(prev => prev === (a._id || a.init) ? null : (a._id || a.init))}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <Avatar init={nameInitials(a.name)} avc={pickAvatarVariant(a)} size={44} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{a.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 2 }}>
                    {a.profession || a.role} {a.co ? `· ${a.co}` : ''}
                  </div>
                  <div style={{ display: 'flex', gap: 5, marginTop: 6, flexWrap: 'wrap' }}>
                    {a.house && <Badge variant="teal">{a.house} House</Badge>}
                    {(a.yearLeft || a.year) && <Badge variant="blue">Class of {a.yearLeft || a.year}</Badge>}
                    {(a.field || a.profession) && <Badge variant="purple">{a.field || a.profession}</Badge>}
                    {(a.location || a.loc) && <Badge variant="gray"><MapPin size={9} /> {a.location || a.loc}</Badge>}
                  </div>
                </div>
                {!fallback && (
                  <Button variant="success" size="sm"
                    onClick={e => { e.stopPropagation(); handleMessage(a) }}>
                    Message
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {openProfile && (
            <ProfilePanel
              user={filtered.find(a => (a._id || a.init) === openProfile)}
              onClose={() => setOpenProfile(null)}
              onMessage={!fallback ? handleMessage : null}
            />
          )}
          <Card>
            <CardTitle>Alumni world map</CardTitle>
            <WorldMap />
            <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 8 }}>
              {fallback
                ? 'Illustrative map — showing sample locations.'
                : `${alumni.length} users registered across multiple locations.`}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function ProfilePanel({ user, onClose, onMessage }) {
  if (!user) return null
  return (
    <Card style={{ border: '1px solid var(--color-border-strong)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <Avatar init={user.name?.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)} avc={pickAvatarVariant(user)} size={52} />
          <div>
            <div style={{ fontSize: 16, fontWeight: 500 }}>{user.name}</div>
            <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 2 }}>
              {user.profession || user.role} {user.co ? `· ${user.co}` : ''}
            </div>
            <div style={{ display: 'flex', gap: 5, marginTop: 8, flexWrap: 'wrap' }}>
              {user.house && <Badge variant="teal">{user.house} House</Badge>}
              {(user.yearLeft || user.year) && <Badge variant="blue">Class of {user.yearLeft || user.year}</Badge>}
              {user.stream && <Badge variant="purple">{user.stream}</Badge>}
            </div>
          </div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', padding: 4, cursor: 'pointer' }}>
          <X size={16} />
        </button>
      </div>

      {user.bio && (
        <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: 12 }}>{user.bio}</p>
      )}

      <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10 }}>
          Career timeline
        </div>
        {[
          user.profession && { label: user.profession, sub: 'Current role', active: true },
          user.yearJoined && { label: `Starehe Boys Centre`, sub: `${user.yearJoined}–${user.yearLeft || ''}`, active: false },
        ].filter(Boolean).map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8, alignItems: 'flex-start' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.active ? 'var(--color-primary)' : '#D3D1C7', marginTop: 5, flexShrink: 0 }} />
            <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
              <strong style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>{item.label}</strong>
              {item.sub && <span style={{ color: 'var(--color-text-muted)' }}> · {item.sub}</span>}
            </div>
          </div>
        ))}
      </div>

      {user.clubs?.length > 0 && (
        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 10, marginTop: 4 }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Clubs</div>
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {user.clubs.map(c => <Badge key={c} variant="amber">{c}</Badge>)}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        {onMessage && (
          <Button variant="success" size="sm" onClick={() => onMessage(user)}>Message</Button>
        )}
        <Button variant="secondary" size="sm">Request CV review</Button>
      </div>
    </Card>
  )
}
