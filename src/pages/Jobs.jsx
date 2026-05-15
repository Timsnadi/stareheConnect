import { useState } from 'react'
import { MapPin, Clock, User, CheckCircle } from 'lucide-react'
import Card, { CardTitle } from '../components/Card'
import Avatar from '../components/Avatar'
import Badge from '../components/Badge'
import Button from '../components/Button'
import { JOBS, SCHOLARSHIPS } from '../data/mockData'

const FIELDS = ['All', 'Technology', 'Finance', 'Engineering', 'Media', 'Academia']
const TYPE_VARIANT = { Internship: 'amber', 'Full-time': 'teal', Contract: 'blue' }

export default function Jobs() {
  const [filter, setFilter] = useState('All')
  const [cvText, setCvText] = useState('')
  const [cvReviewer, setCvReviewer] = useState('Request a mentor reviewer')
  const [cvSubmitted, setCvSubmitted] = useState(false)

  const filtered = JOBS.filter(j => filter === 'All' || j.field === filter)

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.4fr) minmax(0,1fr)', gap: 16, alignItems: 'start' }}>
      <p style={{ gridColumn: '1 / -1', fontSize: 12, color: 'var(--color-text-muted)', margin: 0 }}>
        Listings are sample data until the jobs API is connected.
      </p>

      {/* Left — job listings */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {FIELDS.map(f => (
            <Button key={f} variant={filter === f ? 'success' : 'secondary'} size="sm" onClick={() => setFilter(f)}>{f}</Button>
          ))}
        </div>

        {filtered.map(j => (
          <Card key={j.id}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <Avatar init={j.init} avc={j.avc} size={40} radius="var(--radius-md)" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{j.title}</div>
                <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 8 }}>
                  {j.co}
                  <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><MapPin size={11} /> {j.loc}</span>
                </div>
                <div style={{ display: 'flex', gap: 5, marginTop: 7, flexWrap: 'wrap' }}>
                  <Badge variant={TYPE_VARIANT[j.type]}>{j.type}</Badge>
                  <Badge variant="purple">{j.field}</Badge>
                  {j.alumni && (
                    <Badge variant="gray"><User size={9} /> {j.alumni}</Badge>
                  )}
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
        ))}

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)', fontSize: 13 }}>
            No jobs in this field right now.
          </div>
        )}
      </div>

      {/* Right — CV review + scholarships */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Card>
          <CardTitle>CV review request</CardTitle>
          {cvSubmitted ? (
            <div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 12px', background: 'var(--color-bg)',
                borderRadius: 'var(--radius-md)', fontSize: 13,
                color: 'var(--color-primary)',
              }}>
                <CheckCircle size={16} />
                CV submitted! Expect feedback within 48 hours.
              </div>
              <Button variant="secondary" size="sm" style={{ marginTop: 10 }} onClick={() => { setCvSubmitted(false); setCvText('') }}>
                Submit another
              </Button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <select
                value={cvReviewer}
                onChange={e => setCvReviewer(e.target.value)}
                style={{ padding: '8px 10px' }}
              >
                <option>Request a mentor reviewer</option>
                <option>Amara Odhiambo — Technology</option>
                <option>Brian Mwangi — Finance</option>
                <option>Grace Njeri — Academia</option>
                <option>Esther Wanjiku — Engineering</option>
              </select>
              <textarea
                value={cvText}
                onChange={e => setCvText(e.target.value)}
                placeholder="Paste your CV text here or describe the role you are applying for…"
                style={{ padding: '8px 12px', resize: 'none', height: 90, fontSize: 12 }}
              />
              <Button
                variant="primary"
                size="full"
                onClick={() => cvText.trim() && setCvSubmitted(true)}
                disabled={!cvText.trim()}
              >
                Submit for review
              </Button>
            </div>
          )}
        </Card>

        <Card>
          <CardTitle>Scholarship alerts</CardTitle>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {SCHOLARSHIPS.map(s => (
              <div key={s.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--color-border)' }}>
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
          </div>
        </Card>
      </div>
    </div>
  )
}
