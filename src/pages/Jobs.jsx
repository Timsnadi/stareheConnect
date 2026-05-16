import { useState, useEffect } from 'react'
import { MapPin, Clock, User, CheckCircle, Loader, AlertTriangle } from 'lucide-react'
import Card, { CardTitle } from '../components/Card'
import Avatar from '../components/Avatar'
import Badge from '../components/Badge'
import Button from '../components/Button'
import { getJobs, submitCvReview, getReviewers, getScholarships } from '../lib/api'
import { getProfile, pickAvatarVariant } from '../lib/sessionUser'
import { JOBS as FALLBACK_JOBS, SCHOLARSHIPS as FALLBACK_SCHOLARSHIPS } from '../data/mockData'

const FIELDS = ['All', 'Technology', 'Finance', 'Engineering', 'Media', 'Academia']
const TYPE_VARIANT = { Internship: 'amber', 'Full-time': 'teal', Contract: 'blue' }

function nameInitials(name = '') {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

export default function Jobs() {
  const me = getProfile()
  const [jobs, setJobs]               = useState([])
  const [scholarships, setScholarships] = useState([])
  const [reviewers, setReviewers]     = useState([])
  const [filter, setFilter]           = useState('All')
  const [loading, setLoading]         = useState(true)
  const [fallback, setFallback]       = useState(false)
  const [cvText, setCvText]           = useState('')
  const [cvReviewerId, setCvReviewerId] = useState('')
  const [cvSubmitting, setCvSubmitting] = useState(false)
  const [cvSubmitted, setCvSubmitted] = useState(false)
  const [cvError, setCvError]         = useState(null)

  useEffect(() => {
    Promise.all([
      getJobs().then(r => setJobs(r.data)).catch(() => { setJobs(FALLBACK_JOBS); setFallback(true) }),
      getScholarships().then(r => setScholarships(r.data)).catch(() => setScholarships(FALLBACK_SCHOLARSHIPS)),
      getReviewers().then(r => setReviewers(r.data)).catch(() => {}),
    ]).finally(() => setLoading(false))
  }, [])

  const filtered = jobs.filter(j => filter === 'All' || j.field === filter)

  async function handleCvSubmit() {
    if (!cvText.trim()) return
    setCvSubmitting(true)
    setCvError(null)
    try {
      await submitCvReview({ cvText, reviewerId: cvReviewerId || undefined })
      setCvSubmitted(true)
    } catch {
      setCvError('Failed to submit. Please try again.')
    } finally {
      setCvSubmitting(false)
    }
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem', gap: 10, color: 'var(--color-text-muted)' }}>
      <Loader size={18} /> Loading jobs…
    </div>
  )

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.4fr) minmax(0,1fr)', gap: 16, alignItems: 'start' }}>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {fallback && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: '#FAEEDA', color: '#412402', borderRadius: 'var(--radius-md)', fontSize: 13 }}>
            <AlertTriangle size={14} /> Showing sample listings — live jobs will appear once alumni start posting.
          </div>
        )}

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {FIELDS.map(f => (
            <Button key={f} variant={filter === f ? 'success' : 'secondary'} size="sm" onClick={() => setFilter(f)}>{f}</Button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)', fontSize: 13 }}>
            No jobs in this field right now.
          </div>
        ) : filtered.map(j => {
          const poster = j.postedBy || {}
          const posterName = poster.name || j.alumni || null
          return (
            <Card key={j._id || j.id}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <Avatar
                  init={nameInitials(j.company || j.co || '?')}
                  avc={pickAvatarVariant(poster)}
                  size={40}
                  radius="var(--radius-md)"
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{j.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 8 }}>
                    {j.company || j.co}
                    <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><MapPin size={11} /> {j.location || j.loc}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 5, marginTop: 7, flexWrap: 'wrap' }}>
                    <Badge variant={TYPE_VARIANT[j.type] || 'teal'}>{j.type}</Badge>
                    {j.field && <Badge variant="purple">{j.field}</Badge>}
                    {posterName && <Badge variant="gray"><User size={9} /> {posterName}</Badge>}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>Deadline</div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#993C1D', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={11} /> {j.deadline}
                  </div>
                  <Button variant="success" size="sm" style={{ marginTop: 8 }}>Apply</Button>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Card>
          <CardTitle>CV review request</CardTitle>
          {cvSubmitted ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', fontSize: 13, color: 'var(--color-primary)' }}>
                <CheckCircle size={16} /> CV submitted! Expect feedback within 48 hours.
              </div>
              <Button variant="secondary" size="sm" style={{ marginTop: 10 }}
                onClick={() => { setCvSubmitted(false); setCvText('') }}>
                Submit another
              </Button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {cvError && <div style={{ fontSize: 12, color: '#993C1D' }}>{cvError}</div>}
              <select
                value={cvReviewerId}
                onChange={e => setCvReviewerId(e.target.value)}
                style={{ padding: '8px 10px' }}
              >
                <option value="">Request a mentor reviewer</option>
                {reviewers.length > 0
                  ? reviewers.map(r => (
                      <option key={r._id} value={r._id}>{r.name} — {r.profession || r.field || 'Alumni'}</option>
                    ))
                  : <>
                      <option value="mock-1">Amara Odhiambo — Technology</option>
                      <option value="mock-2">Brian Mwangi — Finance</option>
                      <option value="mock-3">Grace Njeri — Academia</option>
                    </>
                }
              </select>
              <textarea
                value={cvText} onChange={e => setCvText(e.target.value)}
                placeholder="Paste your CV text here or describe the role you are applying for…"
                style={{ padding: '8px 12px', resize: 'none', height: 90, fontSize: 12 }}
              />
              <Button variant="primary" size="full"
                onClick={handleCvSubmit}
                disabled={!cvText.trim() || cvSubmitting}>
                {cvSubmitting ? 'Submitting…' : 'Submit for review'}
              </Button>
            </div>
          )}
        </Card>

        <Card>
          <CardTitle>Scholarship alerts</CardTitle>
          {scholarships.length === 0 ? (
            <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>No scholarships listed yet.</div>
          ) : scholarships.map(s => (
            <div key={s._id || s.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{s.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 3, display: 'flex', alignItems: 'center', gap: 6 }}>
                    {s.amount} · <Badge variant="blue">{s.field}</Badge>
                  </div>
                  <div style={{ fontSize: 11, color: '#993C1D', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={11} /> Deadline: {s.deadline}
                  </div>
                </div>
                <Button variant="success" size="sm" style={{ flexShrink: 0, marginTop: 2 }}>Apply</Button>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}
