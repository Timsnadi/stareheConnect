import { useState } from 'react'
import { Download, Upload, Clock, FileText, GraduationCap, TrendingUp, Code2, Heart } from 'lucide-react'
import Card, { CardTitle } from '../components/Card'
import Badge from '../components/Badge'
import Button from '../components/Button'
import { RESOURCES, SCHOLARSHIPS } from '../data/mockData'

const ICON_MAP = { FileText, GraduationCap, TrendingUp, Code2, Heart }

export default function Resources() {
  const [upload, setUpload] = useState({ title: '', type: 'Guide' })
  const [uploaded, setUploaded] = useState(false)

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.4fr) minmax(0,1fr)', gap: 16, alignItems: 'start' }}>
      <p style={{ gridColumn: '1 / -1', fontSize: 12, color: 'var(--color-text-muted)', margin: 0 }}>
        Resources are sample entries until uploads are stored on the server.
      </p>

      {/* Left — resource library */}
      <Card>
        <CardTitle>Resource library</CardTitle>
        {RESOURCES.map(r => {
          const Icon = ICON_MAP[r.icon] || FileText
          return (
            <div key={r.id} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--color-border)' }}>
              <div style={{
                width: 36, height: 36, borderRadius: 'var(--radius-md)',
                background: r.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Icon size={16} style={{ color: r.ic }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{r.title}</div>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>
                  {r.type} · by {r.author} · {r.reads} reads
                </div>
              </div>
              <Button variant="secondary" size="sm" style={{ flexShrink: 0 }}>
                <Download size={12} />
              </Button>
            </div>
          )
        })}
      </Card>

      {/* Right — scholarships + upload */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Card>
          <CardTitle>Scholarship alerts</CardTitle>
          {SCHOLARSHIPS.map(s => (
            <div key={s.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{s.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 3, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    {s.amount} · <Badge variant="blue">{s.field}</Badge>
                  </div>
                  <div style={{ fontSize: 11, color: '#993C1D', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={11} /> {s.deadline}
                  </div>
                </div>
                <Button variant="success" size="sm" style={{ flexShrink: 0 }}>Apply</Button>
              </div>
            </div>
          ))}
        </Card>

        <Card>
          <CardTitle icon={Upload}>Share a resource</CardTitle>
          {uploaded ? (
            <div style={{ fontSize: 13, color: 'var(--color-primary)', padding: '6px 0' }}>
              ✓ Resource uploaded. It will appear in the library after review.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input
                placeholder="Resource title"
                value={upload.title}
                onChange={e => setUpload(u => ({ ...u, title: e.target.value }))}
                style={{ padding: '8px 12px' }}
              />
              <select
                value={upload.type}
                onChange={e => setUpload(u => ({ ...u, type: e.target.value }))}
                style={{ padding: '8px 12px' }}
              >
                {['Guide', 'Article', 'Roadmap', 'Checklist', 'Video'].map(t => <option key={t}>{t}</option>)}
              </select>
              <Button
                variant="primary"
                size="full"
                onClick={() => upload.title.trim() && setUploaded(true)}
                disabled={!upload.title.trim()}
              >
                Upload resource
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
