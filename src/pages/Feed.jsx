import { useState, useMemo } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Heart, MessageCircle, Share2, Star, Calendar } from 'lucide-react'
import Card, { CardTitle } from '../components/Card'
import Avatar from '../components/Avatar'
import Badge from '../components/Badge'
import Button from '../components/Button'
import { FEED, EVENTS, ALUMNI } from '../data/mockData'
import { getProfile, displayInitials, pickAvatarVariant } from '../lib/sessionUser'

const TYPE_VARIANT = { update: 'teal', job: 'blue', achievement: 'purple', alert: 'amber' }
const TYPE_LABEL   = { update: 'Update', job: 'Job tip', achievement: 'Achievement', alert: 'Alert' }
const EVENT_VARIANT = { Webinar: 'blue', Workshop: 'amber', 'In-person': 'teal' }

export default function Feed() {
  const { userSession } = useOutletContext()
  const me = getProfile(userSession)
  const myInitials = displayInitials(me?.name)
  const myAvc = pickAvatarVariant(me?.id || me?.email || 'me')

  const spotlight = useMemo(() => {
    const house = me?.house
    return (house && ALUMNI.find(a => a.house === house)) || ALUMNI[0]
  }, [me?.house])

  const [feed, setFeed] = useState(FEED)
  const [events, setEvents] = useState(EVENTS)
  const [post, setPost] = useState('')

  function toggleLike(id) {
    setFeed(f => f.map(item =>
      item.id === id
        ? { ...item, liked: !item.liked, likes: item.likes + (item.liked ? -1 : 1) }
        : item
    ))
  }

  function toggleRsvp(id) {
    setEvents(e => e.map(ev => ev.id === id ? { ...ev, rsvp: !ev.rsvp } : ev))
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.4fr) minmax(0,1fr)', gap: 16, alignItems: 'start' }}>

      {/* Left — feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Card>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <Avatar init={myInitials} avc={myAvc} size={36} />
            <textarea
              value={post}
              onChange={e => setPost(e.target.value)}
              placeholder="Share an update, opportunity or resource with the community…"
              style={{ flex: 1, padding: '8px 12px', resize: 'none', height: 68, fontSize: 13, borderRadius: 'var(--radius-md)' }}
            />
            <Button variant="primary" size="md" onClick={() => setPost('')}>Post</Button>
          </div>
        </Card>

        {feed.map(item => (
          <Card key={item.id}>
            <div style={{ display: 'flex', gap: 10 }}>
              <Avatar init={item.init} avc={item.avc} size={36} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{item.name}</span>
                  <Badge variant={TYPE_VARIANT[item.type]}>{TYPE_LABEL[item.type]}</Badge>
                  <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--color-text-muted)' }}>{item.time}</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 1 }}>{item.role}</div>
                <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 6, lineHeight: 1.55 }}>{item.text}</p>
                <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                  <Button
                    variant={item.liked ? 'success' : 'secondary'}
                    onClick={() => toggleLike(item.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: 5 }}
                  >
                    <Heart size={12} fill={item.liked ? '#1D9E75' : 'none'} /> {item.likes}
                  </Button>
                  <Button variant="secondary" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <MessageCircle size={12} /> {item.comments}
                  </Button>
                  <Button variant="secondary" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Share2 size={12} />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Right — spotlight + events */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Card>
          <CardTitle icon={Star}>Alumni spotlight</CardTitle>
          <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 10 }}>
            Sample story for inspiration — visit <strong>Alumni</strong> for real members on the platform.
          </p>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <Avatar init={spotlight.init} avc={spotlight.avc} size={50} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{spotlight.name}</div>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 1 }}>{spotlight.role} @ {spotlight.co} · Class of {spotlight.year}</div>
              <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 8, lineHeight: 1.55 }}>
                &ldquo;Starehe taught me discipline and grit. The Coding Club was where I wrote my first program. Now I mentor the next generation.&rdquo;
              </p>
              <Button variant="success" size="sm" style={{ marginTop: 8 }}>View profile</Button>
            </div>
          </div>
        </Card>

        <Card>
          <CardTitle icon={Calendar}>Upcoming events</CardTitle>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {events.slice(0, 3).map(ev => (
              <div key={ev.id} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--color-border)' }}>
                <div style={{
                  width: 42, flexShrink: 0, textAlign: 'center',
                  background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', padding: '6px 4px',
                }}>
                  <div style={{ fontSize: 9, fontWeight: 500, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '.04em' }}>{ev.mon}</div>
                  <div style={{ fontSize: 20, fontWeight: 500, lineHeight: 1.1 }}>{ev.day}</div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{ev.title}</span>
                    <Badge variant={EVENT_VARIANT[ev.type]}>{ev.type}</Badge>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 2, lineHeight: 1.4 }}>{ev.desc}</div>
                  <Button
                    variant={ev.rsvp ? 'success' : 'secondary'}
                    size="sm"
                    style={{ marginTop: 6 }}
                    onClick={() => toggleRsvp(ev.id)}
                  >
                    {ev.rsvp ? '✓ Going' : 'RSVP'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
