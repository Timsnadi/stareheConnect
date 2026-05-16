import { useState, useEffect } from 'react'
import { Download, Upload, Clock, FileText, GraduationCap, TrendingUp, Code2, Heart, Loader, AlertTriangle } from 'lucide-react'
import Card, { CardTitle } from '../components/Card'
import Badge from '../components/Badge'
import Button from '../components/Button'
import { getResources, uploadResource, markRead, getScholarships } from '../lib/api'
import { RESOURCES as FALLBACK_RESOURCES, SCHOLARSHIPS as FALLBACK_SCHOLARSHIPS } from '../data/mockData'

const ICON_MAP = { FileText, GraduationCap, TrendingUp, Code2, Heart }

export default function Resources() {
  const [resources, setResources]     = useState([])
  const [scholarships, setScholarships] = useState([])
  const [loading, setLoading]         = useState(true)
  const [fallback, setFallback]       = useState(false)
  const [upload, setUpload]           = useState({ title: '', type: 'Guide' })
  const [uploading, setUploading]     = useState(false)
  const [uploaded, setUploaded]       = useState(false)
  const [uploadError, setUploadError] = useState(null)

  useEffect(() => {
    Promise.all([
      getResources()
        .then(r => setResources(r.data))
        .catch(() => { setResources(FALLBACK_RESOURCES); setFallback(true) }),
      getScholarships()
        .then(r => setScholarships(r.data))
        .catch(() => setScholarships(FALLBACK_SCHOLARSHIPS)),
    ]).finally(() => setLoading(false))
  }, [])

  async function handleRead(id) {
    try {
      const res = await markRead(id)
      setResources(prev => prev.map(r =>
        (r._id || r.id) === id ? { ...r, reads: res.data.reads } : r
      ))
    } catch { /* silent */ }
  }

  async function handleUpload() {
    if (!upload.title.trim()) return
    setUploading(true)
    setUploadError(null)
    try {
      await uploadResource(upload)
      setUploaded(true)
    } catch {
      setUploadError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem', gap: 10, color: 'var(--color-text-muted)' }}>
      <Loader size={18} /> Loading resources…
    </div>
  )

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.4fr) minmax(0,1fr)', gap: 16, alignItems: 'start' }}>

      {/* Left — resource library */}
      <Card>
        <CardTitle>Resource library</CardTitle>
        {fallback && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: '#FAEEDA', color: '#412402', borderRadius: 'var(--radius-md)', fontSize: 12, marginBottom: 12 }}>
            <AlertTriangle size={13} /> Sample resources — live uploads will appear once alumni contribute.
          </div>
        )}
        {resources.length === 0 ? (
          <div style={{ fontSize: 13, color: 'var(--color-text-muted)', padding: '6px 0' }}>
            No resources yet. Be the first to upload one!
          </div>
        ) : resources.map(r => {
          const Icon = ICON_MAP[r.icon] || FileText
          const authorName = r.uploadedBy?.name || r.author || 'Alumni'
          const readCount  = typeof r.reads === 'number'
            ? r.reads >= 1000 ? `${(r.reads / 1000).toFixed(1)}k` : r.reads
            : r.reads
          return (
            <div key={r._id || r.id} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--color-border)' }}>
              <div style={{
                width: 36, height: 36, borderRadius: 'var(--radius-md)',
                background: r.bg || '#E6F1FB',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Icon size={16} style={{ color: r.ic || '#042C53' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{r.title}</div>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>
                  {r.type} · by {authorName} · {readCount} reads
                </div>
              </div>
              <Button
                variant="secondary" size="sm"
                style={{ flexShrink: 0 }}
                onClick={() => handleRead(r._id || r.id)}
              >
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
          {scholarships.length === 0 ? (
            <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>No scholarships listed yet.</div>
          ) : scholarships.map(s => (
            <div key={s._id || s.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--color-border)' }}>
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
              ✓ Resource submitted for review. It will appear in the library once approved.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {uploadError && <div style={{ fontSize: 12, color: '#993C1D' }}>{uploadError}</div>}
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
                variant="primary" size="full"
                onClick={handleUpload}
                disabled={!upload.title.trim() || uploading}
              >
                {uploading ? 'Uploading…' : 'Upload resource'}
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
