import { useState, useEffect } from 'react'
import { Heart, MessageCircle, Share2, Star, Calendar, Loader } from 'lucide-react'
import Card, { CardTitle } from '../components/Card'
import Avatar from '../components/Avatar'
import Badge from '../components/Badge'
import Button from '../components/Button'
import { getFeed, createPost, likePost, getEvents, rsvpEvent } from '../lib/api'
import { getProfile, displayInitials, pickAvatarVariant } from '../lib/sessionUser'
import { EVENTS as FALLBACK_EVENTS } from '../data/mockData'

const TYPE_VARIANT  = { update: 'teal', job: 'blue', achievement: 'purple', alert: 'amber' }
const TYPE_LABEL    = { update: 'Update', job: 'Job tip', achievement: 'Achievement', alert: 'Alert' }
const EVENT_VARIANT = { Webinar: 'blue', Workshop: 'amber', 'In-person': 'teal' }

function nameInitials(name = '') {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

export default function Feed() {
  const me = getProfile()
  const [feed, setFeed]       = useState([])
  const [events, setEvents]   = useState([])
  const [post, setPost]       = useState('')
  const [type, setType]       = useState('update')
  const [loading, setLoading] = useState(true)
  const [posting, setPosting] = useState(false)
  const [error, setError]     = useState(null)

  useEffect(() => {
    Promise.all([
      getFeed().then(r => setFeed(r.data)).catch(() => setError('Could not load feed.')),
      getEvents().then(r => setEvents(r.data)).catch(() => setEvents(FALLBACK_EVENTS)),
    ]).finally(() => setLoading(false))
  }, [])

  async function handlePost() {
    if (!post.trim()) return
    setPosting(true)
    try {
      const res = await createPost({ text: post, type })
      setFeed(f => [res.data, ...f])
      setPost('')
    } catch {
      setError('Failed to post. Please try again.')
    } finally {
      setPosting(false)
    }
  }

  async function handleLike(id) {
    try {
      const res = await likePost(id)
      setFeed(f => f.map(item =>
        item._id === id
          ? { ...item, likes: Array(res.data.likes).fill(null), _liked: res.data.liked }
          : item
      ))
    } catch { /* silent */ }
  }

  async function handleRsvp(id) {
    try {
      const res = await rsvpEvent(id)
      setEvents(e => e.map(ev =>
        (ev._id || ev.id) === id ? { ...ev, rsvp: res.data.rsvp } : ev
      ))
    } catch { /* silent */ }
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem', gap: 10, color: 'var(--color-text-muted)' }}>
      <Loader size={18} /> Loading feed…
    </div>
  )

  const spotlight = feed.find(p => p.author?.house === me?.house && p.author?.role === 'alumnus')?.author
    || feed.find(p => p.author?.role === 'alumnus')?.author

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.4fr) minmax(0,1fr)', gap: 16, alignItems: 'start' }}>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {error && (
          <div style={{ padding: '8px 12px', background: '#FCEBEB', color: '#501313', borderRadius: 'var(--radius-md)', fontSize: 13 }}>
            {error}
          </div>
        )}

        <Card>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <Avatar init={displayInitials(me)} avc={pickAvatarVariant(me)} size={36} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <textarea
                value={post} onChange={e => setPost(e.target.value)}
                placeholder="Share an update, opportunity or resource…"
                style={{ padding: '8px 12px', resize: 'none', height: 68, fontSize: 13, borderRadius: 'var(--radius-md)' }}
              />
              <div style={{ display: 'flex', gap: 6, justifyContent: 'space-between', alignItems: 'center' }}>
                <select value={type} onChange={e => setType(e.target.value)} style={{ padding: '5px 8px', fontSize: 12 }}>
                  <option value="update">Update</option>
                  <option value="job">Job tip</option>
                  <option value="achievement">Achievement</option>
                  <option value="alert">Alert</option>
                </select>
                <Button variant="primary" size="md" onClick={handlePost} disabled={posting || !post.trim()}>
                  {posting ? 'Posting…' : 'Post'}
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {feed.length === 0 && !error && (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)', fontSize: 13 }}>
            No posts yet. Be the first to share something!
          </div>
        )}

        {feed.map(item => {
          const author = item.author || {}
          const likeCount = Array.isArray(item.likes) ? item.likes.length : 0
          const liked = item._liked || (Array.isArray(item.likes) && item.likes.some(id =>
            (typeof id === 'string' ? id : id?._id?.toString?.()) === me?.id
          ))
          return (
            <Card key={item._id}>
              <div style={{ display: 'flex', gap: 10 }}>
                <Avatar init={nameInitials(author.name)} avc={pickAvatarVariant(author)} size={36} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{author.name || 'Unknown'}</span>
                    <Badge variant={TYPE_VARIANT[item.type] || 'teal'}>{TYPE_LABEL[item.type] || 'Update'}</Badge>
                    <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--color-text-muted)' }}>
                      {new Date(item.createdAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 1 }}>
                    {author.profession || author.role || ''}{author.house ? ` · ${author.house} House` : ''}
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 6, lineHeight: 1.55 }}>{item.text}</p>
                  <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                    <Button variant={liked ? 'success' : 'secondary'} onClick={() => handleLike(item._id)}
                      style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Heart size={12} fill={liked ? '#1D9E75' : 'none'} /> {likeCount}
                    </Button>
                    <Button variant="secondary" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <MessageCircle size={12} /> {item.comments?.length || 0}
                    </Button>
                    <Button variant="secondary" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Share2 size={12} />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {spotlight && (
          <Card>
            <CardTitle icon={Star}>Alumni spotlight</CardTitle>
            <div style={{ display: 'flex', gap: 12 }}>
              <Avatar init={nameInitials(spotlight.name)} avc={pickAvatarVariant(spotlight)} size={50} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{spotlight.name}</div>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 1 }}>
                  {spotlight.profession || 'Alumni'} · {spotlight.house} House
                </div>
                <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 8, lineHeight: 1.55, fontStyle: 'italic' }}>
                  Alumni spotlight stories will appear here once profiles are updated.
                </p>
                <Button variant="success" size="sm" style={{ marginTop: 8 }}>View profile</Button>
              </div>
            </div>
          </Card>
        )}

        <Card>
          <CardTitle icon={Calendar}>Upcoming events</CardTitle>
          {events.length === 0 ? (
            <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>No upcoming events.</div>
          ) : events.slice(0, 3).map(ev => (
            <div key={ev._id || ev.id} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--color-border)' }}>
              <div style={{ width: 42, flexShrink: 0, textAlign: 'center', background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', padding: '6px 4px' }}>
                <div style={{ fontSize: 9, fontWeight: 500, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>{ev.month || ev.mon}</div>
                <div style={{ fontSize: 20, fontWeight: 500, lineHeight: 1.1 }}>{ev.day}</div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{ev.title}</span>
                  <Badge variant={EVENT_VARIANT[ev.type]}>{ev.type}</Badge>
                </div>
                <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 2 }}>{ev.description || ev.desc}</div>
                <Button variant={ev.rsvp ? 'success' : 'secondary'} size="sm" style={{ marginTop: 6 }}
                  onClick={() => handleRsvp(ev._id || ev.id)}>
                  {ev.rsvp ? '✓ Going' : 'RSVP'}
                </Button>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}
