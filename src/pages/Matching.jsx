import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { UserCheck, X } from 'lucide-react'
import Card, { CardTitle } from '../components/Card'
import Avatar from '../components/Avatar'
import Badge from '../components/Badge'
import Button from '../components/Button'
import { MATCHING_ALUMNI } from '../data/mockData'
import { getProfile } from '../lib/sessionUser'

const HOUSES    = ['Kahawa', 'Thika', 'Nairobi', 'Mara', 'Athi', 'Ruiru']
const STREAMS   = ['Sciences', 'Arts', 'Commerce', 'Technical']
const CLUBS     = ['Scouts', 'Debate', 'Drama', 'Football', 'Basketball', 'Chess', 'Coding', 'Music', 'Photography', 'Environmental']
const GOALS     = ['Corporate career', 'Entrepreneurship', 'Academia / research', 'Public service', 'Creative arts', 'Medicine', 'Law', 'Engineering']
const INDUSTRIES= ['Technology', 'Finance & banking', 'Medicine & health', 'Law', 'Engineering', 'Education', 'Arts & media', 'Government', 'NGO / development', 'Entrepreneurship']
const AVAIL     = ['Weekly check-ins', 'Monthly check-ins', 'Ad hoc / as needed']
const MENTMODE  = ['Remote (online)', 'In-person (Nairobi)', 'Either']

const W = { house: 25, stream: 20, clubs: 15, goals: 20, industry: 10, year: 5, availability: 3, mentmode: 2 }

function scoreMatch(student, mentor) {
  let score = 0
  const reasons = []
  if (student.house && mentor.house && student.house === mentor.house) {
    score += W.house; reasons.push({ label: 'Same house: ' + student.house, type: 'match' })
  }
  if (student.stream && mentor.stream && student.stream === mentor.stream) {
    score += W.stream; reasons.push({ label: 'Same stream: ' + student.stream, type: 'match' })
  }
  const sharedClubs = (student.clubs || []).filter(c => (mentor.clubs || []).includes(c))
  if (sharedClubs.length) {
    const pts = Math.min(W.clubs, sharedClubs.length * 5)
    score += pts; reasons.push({ label: 'Clubs: ' + sharedClubs.join(', '), type: 'match' })
  }
  const sharedGoals = (student.goals || []).filter(g => (mentor.goals || []).includes(g))
  if (sharedGoals.length) {
    const pts = Math.min(W.goals, sharedGoals.length * 10)
    score += pts; reasons.push({ label: 'Goals: ' + sharedGoals.join(', '), type: 'match' })
  }
  if (student.industry && mentor.industry && student.industry === mentor.industry) {
    score += W.industry; reasons.push({ label: 'Industry: ' + student.industry, type: 'match' })
  }
  if (mentor.gradYear) {
    const gap = 2025 - parseInt(mentor.gradYear)
    if (gap >= 2 && gap <= 8)       { score += W.year; reasons.push({ label: `Recent alum (${mentor.gradYear})`, type: 'info' }) }
    else if (gap > 8 && gap <= 15)  { score += 3;      reasons.push({ label: `Experienced alum (${mentor.gradYear})`, type: 'partial' }) }
  }
  if (student.availability && mentor.availability && student.availability === mentor.availability) {
    score += W.availability; reasons.push({ label: 'Availability matches', type: 'info' })
  }
  if (student.mentmode && mentor.mentmode &&
    (student.mentmode === mentor.mentmode || mentor.mentmode === 'Either' || student.mentmode === 'Either')) {
    score += W.mentmode; reasons.push({ label: 'Mentorship mode compatible', type: 'info' })
  }
  return { score: Math.min(100, score), reasons }
}

const REASON_VARIANT = { match: 'teal', partial: 'amber', info: 'blue' }
const RANK_LABELS = ['Top match', 'Strong match', 'Good match']

export default function Matching() {
  const { userSession } = useOutletContext()
  const profile = getProfile(userSession)

  const [tab, setTab] = useState('profile')
  const [student, setStudent] = useState(() => ({
    house: profile.house || '',
    stream: profile.stream || '',
    clubs: Array.isArray(profile.clubs) ? [...profile.clubs] : [],
    goals: [],
    industry: '',
    availability: '',
    mentmode: '',
  }))
  const [matches, setMatches] = useState(null)
  const [connected, setConnected] = useState(new Set())

  function toggleChip(field, val) {
    setStudent(s => ({
      ...s,
      [field]: s[field].includes(val) ? s[field].filter(x => x !== val) : [...s[field], val],
    }))
  }

  function runMatch() {
    const scored = MATCHING_ALUMNI
      .map(m => { const { score, reasons } = scoreMatch(student, m); return { ...m, score, reasons } })
      .filter(m => m.score > 0)
      .sort((a, b) => b.score - a.score)
    setMatches(scored)
    setTab('matches')
  }

  function toggleConnect(id) {
    setConnected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <div style={{ maxWidth: 700 }}>
      <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 14 }}>
        Your house, stream, and clubs are pre-filled from your account. Mentor matches still use sample alumni until the matching API is connected.
      </p>
      {/* Tabs */}
      <div style={{
        display: 'flex', gap: 2,
        background: 'var(--color-bg)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)', padding: 3, marginBottom: 20,
      }}>
        {[
          { key: 'profile', label: 'My profile' },
          { key: 'matches', label: `My matches${matches ? ` (${matches.length})` : ''}` },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              flex: 1, padding: '8px 0', fontSize: 13, fontWeight: 500,
              background: tab === t.key ? 'var(--color-surface)' : 'transparent',
              border: tab === t.key ? '1px solid var(--color-border)' : '1px solid transparent',
              borderRadius: 'var(--radius-sm)', color: tab === t.key ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
              cursor: 'pointer', transition: 'all 0.15s',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'profile' && (
        <Card>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
            {[
              { label: 'House', field: 'house', options: HOUSES },
              { label: 'Stream', field: 'stream', options: STREAMS },
              { label: 'Aspiring industry', field: 'industry', options: INDUSTRIES },
              { label: 'Availability', field: 'availability', options: AVAIL },
              { label: 'Mentorship mode', field: 'mentmode', options: MENTMODE },
            ].map(({ label, field, options }) => (
              <div key={field} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-text-secondary)' }}>{label}</label>
                <select
                  value={student[field]}
                  onChange={e => setStudent(s => ({ ...s, [field]: e.target.value }))}
                  style={{ padding: '7px 10px' }}
                >
                  <option value="">Select {label.toLowerCase()}</option>
                  {options.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>

          {[
            { label: 'Clubs & activities', field: 'clubs', options: CLUBS },
            { label: 'Career goals', field: 'goals', options: GOALS },
          ].map(({ label, field, options }) => (
            <div key={field} style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: 8 }}>{label}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {options.map(o => {
                  const on = student[field].includes(o)
                  return (
                    <span
                      key={o}
                      onClick={() => toggleChip(field, o)}
                      style={{
                        padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500,
                        cursor: 'pointer', userSelect: 'none', transition: 'all 0.15s',
                        background: on ? '#E1F5EE' : 'var(--color-surface)',
                        border: on ? '1px solid #1D9E75' : '1px solid var(--color-border)',
                        color: on ? '#085041' : 'var(--color-text-secondary)',
                      }}
                    >
                      {o}
                    </span>
                  )
                })}
              </div>
            </div>
          ))}

          <Button variant="primary" size="full" onClick={runMatch}>
            Find my mentors →
          </Button>
        </Card>
      )}

      {tab === 'matches' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {!matches || matches.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--color-text-muted)', fontSize: 13 }}>
              {!matches ? 'Fill in your profile to find mentors.' : 'No mentors matched. Try updating your profile.'}
            </div>
          ) : (
            matches.map((m, i) => {
              const isConn = connected.has(m.id)
              const rankLabel = RANK_LABELS[i] || 'Match'
              return (
                <Card key={m.id}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                    <Avatar init={m.init} avc={m.avc} size={46} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 14, fontWeight: 500 }}>{m.name}</span>
                        {isConn && <Badge variant="green">✓ Connected</Badge>}
                        <Badge variant={i === 0 ? 'amber' : i === 1 ? 'teal' : 'blue'}>{rankLabel}</Badge>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 2 }}>{m.role}</div>
                    </div>
                    <div style={{ textAlign: 'center', flexShrink: 0 }}>
                      <div style={{ fontSize: 22, fontWeight: 500, color: 'var(--color-primary)' }}>{m.score}%</div>
                      <div style={{ fontSize: 10, color: 'var(--color-text-muted)', letterSpacing: '.04em' }}>match</div>
                    </div>
                  </div>

                  {/* Match bar */}
                  <div style={{ height: 4, background: 'var(--color-bg)', borderRadius: 2, overflow: 'hidden', marginBottom: 10 }}>
                    <div style={{ height: '100%', background: 'var(--color-primary)', borderRadius: 2, width: `${m.score}%`, transition: 'width 0.6s ease' }} />
                  </div>

                  {/* Reason tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 10 }}>
                    {m.reasons.slice(0, 4).map((r, ri) => (
                      <Badge key={ri} variant={REASON_VARIANT[r.type]}>{r.label}</Badge>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <Button
                      variant={isConn ? 'secondary' : 'success'}
                      size="sm"
                      onClick={() => toggleConnect(m.id)}
                    >
                      {isConn ? 'Disconnect' : 'Send connect request'}
                    </Button>
                  </div>
                </Card>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
