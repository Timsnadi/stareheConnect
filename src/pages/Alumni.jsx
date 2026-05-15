import { useState, useEffect } from 'react'
import { useOutletContext, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { MapPin, X, MessageCircle } from 'lucide-react'
import Card, { CardTitle } from '../components/Card'
import Avatar from '../components/Avatar'
import Badge from '../components/Badge'
import Button from '../components/Button'
import WorldMap from '../components/WorldMap'
import { ALUMNI } from '../data/mockData'
import { getProfile, displayInitials, pickAvatarVariant, currentUserId } from '../lib/sessionUser'

const API_URL = 'http://localhost:5000/api'

const FIELDS = ['All', 'Technology', 'Finance', 'Medicine', 'Law', 'Engineering', 'Education', 'Entrepreneurship']

function inferField(profession, stream) {
  const p = (profession || '').toLowerCase()
  const rules = [
    ['Technology', ['software', 'engineer', 'developer', 'data', 'tech', 'it ', 'it,', 'code']],
    ['Finance', ['bank', 'finance', 'investment', 'analyst', 'accounting']],
    ['Medicine', ['doctor', 'medical', 'health', 'nurse', 'clinical']],
    ['Law', ['law', 'advocate', 'legal', 'court']],
    ['Engineering', ['engineer', 'civil', 'construction', 'infrastructure']],
    ['Education', ['lecturer', 'teacher', 'education', 'academic', 'professor']],
    ['Entrepreneurship', ['founder', 'entrepreneur', 'self-employed', 'startup']],
  ]
  for (const [label, keys] of rules) {
    if (keys.some(k => p.includes(k))) return label
  }
  const s = (stream || '').toLowerCase()
  if (s.includes('science')) return 'Technology'
  if (s.includes('commerce')) return 'Finance'
  if (s.includes('art')) return 'Education'
  return 'Technology'
}

function mapApiUser(u, index) {
  const name = u.name || 'Member'
  const id = String(u._id)
  return {
    _id: id,
    source: 'api',
    init: displayInitials(name),
    avc: pickAvatarVariant(id + index),
    name,
    role: u.profession || (u.role === 'alumnus' ? 'Alumnus' : u.role === 'student' ? 'Student' : u.role || 'Member'),
    co: [u.stream, u.house].filter(Boolean).join(' · ') || 'Starehe Boys Centre',
    house: u.house || '—',
    year: u.yearLeft != null ? String(u.yearLeft) : u.yearJoined != null ? String(u.yearJoined) : '—',
    loc: u.location || 'Kenya',
    field: inferField(u.profession, u.stream),
    bio: u.bio || '',
    stream: u.stream,
    profession: u.profession,
  }
}

export default function Alumni() {
  const { userSession } = useOutletContext()
  const navigate = useNavigate()
  const me = getProfile(userSession)
  const myId = currentUserId(me)

  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [openProfile, setOpenProfile] = useState(null)
  const [loadState, setLoadState] = useState({ status: 'loading', rows: [] })
  const [fetchError, setFetchError] = useState(null)

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      setFetchError(null)
      setLoadState({ status: 'loading', rows: [] })
      try {
        const headers = {}
        if (userSession?.token) headers.Authorization = `Bearer ${userSession.token}`
        const res = await axios.get(`${API_URL}/users`, { headers })
        if (cancelled) return
        const mapped = (res.data || [])
          .map((u, i) => mapApiUser(u, i))
          .filter(r => myId == null || String(r._id) !== String(myId))
        if (mapped.length > 0) {
          setLoadState({ status: 'live', rows: mapped })
        } else {
          setLoadState({ status: 'empty', rows: [] })
        }
      } catch (e) {
        if (!cancelled) {
          console.error(e)
          setFetchError('Could not load directory from the server.')
          setLoadState({
            status: 'mock',
            rows: ALUMNI.map((a, i) => ({ ...a, _id: `mock-${i}`, source: 'mock' })),
          })
        }
      }
    }
    run()
    return () => { cancelled = true }
  }, [userSession?.token, myId])

  const { status, rows: directory } = loadState
  const usingMock = status === 'mock'
  const isEmpty = status === 'empty'
  const loading = status === 'loading'

  const filtered = directory.filter(a => {
    const fMatch = filter === 'All' || a.field === filter
    const q = search.toLowerCase()
    const sMatch = !q || a.name.toLowerCase().includes(q) || String(a.co).toLowerCase().includes(q) || String(a.role).toLowerCase().includes(q)
    return fMatch && sMatch
  })

  const mapBlurb = usingMock
    ? 'Map dots are sample locations for the prototype.'
    : isEmpty
      ? 'Add more members to see the network grow. Map is illustrative until locations are stored on profiles.'
      : `${directory.length} registered members (non-admin). Map is illustrative until locations are stored on profiles.`

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {fetchError && (
        <div style={{ fontSize: 13, color: 'var(--color-text-primary)', background: 'var(--color-amber-bg)', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
          {fetchError} Showing demo alumni until the API is reachable.
        </div>
      )}
      {!usingMock && !isEmpty && (
        <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
          Directory shows live accounts from the database (you are excluded from your own list).
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
            <Button key={f} variant={filter === f ? 'success' : 'secondary'} size="sm" onClick={() => setFilter(f)}>{f}</Button>
          ))}
        </div>
      </div>

      {loading && (
        <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Loading directory…</div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.3fr) minmax(0,1fr)', gap: 14, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(a => (
            <Card key={a._id} onClick={() => setOpenProfile(openProfile?._id === a._id ? null : a)}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <Avatar init={a.init} avc={a.avc} size={44} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{a.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 2 }}>{a.role} · {a.co}</div>
                  <div style={{ display: 'flex', gap: 5, marginTop: 6, flexWrap: 'wrap' }}>
                    <Badge variant="teal">{a.house} House</Badge>
                    <Badge variant="blue">Class of {a.year}</Badge>
                    <Badge variant="purple">{a.field}</Badge>
                    <Badge variant="gray"><MapPin size={9} /> {a.loc}</Badge>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <Button variant="success" size="sm" onClick={e => e.stopPropagation()}>Connect</Button>
                  {a.source === 'api' && (
                    <Button
                      variant="secondary"
                      size="sm"
                      style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate('/messages', { state: { startChatWith: { _id: a._id, id: a._id, name: a.name } } })
                      }}
                    >
                      <MessageCircle size={12} /> Message
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
          {!loading && isEmpty && (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)', fontSize: 13 }}>
              No other members in the directory yet (or you are the only non-admin account). Invite others to register.
            </div>
          )}
          {!loading && !isEmpty && filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)', fontSize: 13 }}>
              No alumni match your filter.
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {openProfile && <ProfilePanel alum={openProfile} onClose={() => setOpenProfile(null)} onMessage={(row) => navigate('/messages', { state: { startChatWith: { _id: row._id, id: row._id, name: row.name } } })} />}
          <Card>
            <CardTitle>Alumni world map</CardTitle>
            <WorldMap />
            <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 8 }}>
              {mapBlurb}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function ProfilePanel({ alum, onClose, onMessage }) {
  if (!alum) return null
  const isApi = alum.source === 'api'

  return (
    <Card style={{ border: '1px solid var(--color-border-strong)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <Avatar init={alum.init} avc={alum.avc} size={52} />
          <div>
            <div style={{ fontSize: 16, fontWeight: 500 }}>{alum.name}</div>
            <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 2 }}>{alum.role} · {alum.co}</div>
            <div style={{ display: 'flex', gap: 5, marginTop: 8, flexWrap: 'wrap' }}>
              <Badge variant="teal">{alum.house} House</Badge>
              <Badge variant="blue">Class of {alum.year}</Badge>
              <Badge variant="purple">{alum.field}</Badge>
            </div>
          </div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', padding: 4, cursor: 'pointer' }} aria-label="Close">
          <X size={16} />
        </button>
      </div>

      <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 12, marginTop: 4 }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10 }}>
          {isApi ? 'About' : 'Career timeline'}
        </div>
        {isApi ? (
          <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
            {alum.bio ? <p style={{ margin: '0 0 10px' }}>{alum.bio}</p> : <p style={{ margin: 0 }}>No bio yet. Connect to learn more.</p>}
            <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>Stream: {alum.stream || '—'} · Location: {alum.loc}</p>
          </div>
        ) : (
          [
            { label: `${alum.co} · ${alum.role}`, sub: '2023–present', active: true },
            { label: 'Graduate role at previous company', sub: '2020–2023', active: false },
            { label: `University of Nairobi · ${alum.field}`, sub: '2018–2022', active: false },
            { label: `Starehe Boys Centre · Class of ${alum.year}`, sub: '', active: false },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8, alignItems: 'flex-start' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.active ? 'var(--color-primary)' : '#D3D1C7', marginTop: 5, flexShrink: 0 }} />
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                <strong style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>{item.label}</strong>
                {item.sub && <span style={{ color: 'var(--color-text-muted)' }}> · {item.sub}</span>}
              </div>
            </div>
          ))
        )}
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
        <Button variant="success" size="sm">Connect</Button>
        <Button variant="secondary" size="sm">Request CV review</Button>
        {isApi && (
          <Button variant="secondary" size="sm" style={{ display: 'flex', alignItems: 'center', gap: 4 }} onClick={() => onMessage(alum)}>
            <MessageCircle size={14} /> Message
          </Button>
        )}
      </div>
    </Card>
  )
}
