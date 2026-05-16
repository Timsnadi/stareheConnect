import { useState, useEffect } from 'react'
import { Loader, AlertTriangle } from 'lucide-react'
import Card, { CardTitle } from '../components/Card'
import Badge from '../components/Badge'
import Button from '../components/Button'
import { getEvents, rsvpEvent, suggestEvent } from '../lib/api'
import { EVENTS as FALLBACK_EVENTS } from '../data/mockData'

const TYPE_VARIANT = { Webinar: 'blue', Workshop: 'amber', 'In-person': 'teal' }

export default function Events() {
  const [events, setEvents]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [fallback, setFallback] = useState(false)
  const [suggest, setSuggest]   = useState({ title: '', date: '', type: 'Webinar' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted]   = useState(false)
  const [suggestError, setSuggestError] = useState(null)

  useEffect(() => {
    getEvents()
      .then(r => setEvents(r.data))
      .catch(() => { setEvents(FALLBACK_EVENTS); setFallback(true) })
      .finally(() => setLoading(false))
  }, [])

  async function handleRsvp(id) {
    try {
      const res = await rsvpEvent(id)
      setEvents(e => e.map(ev =>
        (ev._id || ev.id) === id ? { ...ev, rsvp: res.data.rsvp } : ev
      ))
    } catch { /* silent */ }
  }

  async function handleSuggest() {
    if (!suggest.title.trim() || !suggest.date.trim()) return
    setSubmitting(true)
    setSuggestError(null)
    try {
      await suggestEvent(suggest)
      setSubmitted(true)
    } catch {
      setSuggestError('Failed to submit. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const rsvped = events.filter(e => e.rsvp)

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem', gap: 10, color: 'var(--color-text-muted)' }}>
      <Loader size={18} /> Loading events…
    </div>
  )

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.4fr) minmax(0,1fr)', gap: 16, alignItems: 'start' }}>

      {/* Left — all events */}
      <Card>
        <CardTitle>All events</CardTitle>
        {fallback && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: '#FAEEDA', color: '#412402', borderRadius: 'var(--radius-md)', fontSize: 12, marginBottom: 12 }}>
            <AlertTriangle size={13} /> Sample events — live events will appear once approved by admins.
          </div>
        )}
        {events.length === 0 ? (
          <div style={{ fontSize: 13, color: 'var(--color-text-muted)', padding: '6px 0' }}>No events yet.</div>
        ) : events.map(ev => (
          <div key={ev._id || ev.id} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--color-border)' }}>
            <div style={{
              width: 44, flexShrink: 0, textAlign: 'center',
              background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', padding: '6px 4px',
            }}>
              <div style={{ fontSize: 9, fontWeight: 500, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '.04em' }}>
                {ev.month || ev.mon}
              </div>
              <div style={{ fontSize: 20, fontWeight: 500, lineHeight: 1.1 }}>{ev.day}</div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{ev.title}</span>
                <Badge variant={TYPE_VARIANT[ev.type] || 'teal'}>{ev.type}</Badge>
                {ev.rsvp && <Badge variant="green">Going</Badge>}
              </div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 4, lineHeight: 1.5 }}>
                {ev.description || ev.desc}
              </div>
              <Button
                variant={ev.rsvp ? 'success' : 'secondary'}
                size="sm"
                style={{ marginTop: 8 }}
                onClick={() => handleRsvp(ev._id || ev.id)}
              >
                {ev.rsvp ? '✓ Cancel RSVP' : 'RSVP'}
              </Button>
            </div>
          </div>
        ))}
      </Card>

      {/* Right — my RSVPs + suggest */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Card>
          <CardTitle>My RSVPs</CardTitle>
          {rsvped.length === 0 ? (
            <div style={{ fontSize: 13, color: 'var(--color-text-muted)', padding: '6px 0' }}>
              No events yet — RSVP to events on the left.
            </div>
          ) : rsvped.map(ev => (
            <div key={ev._id || ev.id} style={{ padding: '8px 0', borderBottom: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{ev.title}</div>
              <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                {ev.month || ev.mon} {ev.day} · <Badge variant={TYPE_VARIANT[ev.type] || 'teal'}>{ev.type}</Badge>
              </div>
            </div>
          ))}
        </Card>

        <Card>
          <CardTitle>Suggest an event</CardTitle>
          {submitted ? (
            <div style={{ fontSize: 13, color: 'var(--color-primary)', padding: '6px 0' }}>
              ✓ Suggestion submitted. We'll review it shortly.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {suggestError && <div style={{ fontSize: 12, color: '#993C1D' }}>{suggestError}</div>}
              <input
                placeholder="Event title"
                value={suggest.title}
                onChange={e => setSuggest(s => ({ ...s, title: e.target.value }))}
                style={{ padding: '8px 12px' }}
              />
              <input
                placeholder="Date (e.g. Jul 20)"
                value={suggest.date}
                onChange={e => setSuggest(s => ({ ...s, date: e.target.value }))}
                style={{ padding: '8px 12px' }}
              />
              <select
                value={suggest.type}
                onChange={e => setSuggest(s => ({ ...s, type: e.target.value }))}
                style={{ padding: '8px 12px' }}
              >
                <option>Webinar</option>
                <option>In-person</option>
                <option>Workshop</option>
              </select>
              <Button
                variant="primary" size="full"
                onClick={handleSuggest}
                disabled={!suggest.title.trim() || !suggest.date.trim() || submitting}
              >
                {submitting ? 'Submitting…' : 'Submit suggestion'}
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
