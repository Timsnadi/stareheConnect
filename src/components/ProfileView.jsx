import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { 
  ArrowLeft, 
  Mail, 
  LogOut, 
  Edit3, 
  MapPin, 
  Briefcase, 
  Award,
  CheckCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react'

const API_URL = 'http://localhost:5000/api'

function ProfileView({ profile, isOwn, onBack, onStartChat, onLogout, onEdit }) {
  const [connections, setConnections] = useState([])
  const [loading, setLoading] = useState(true)
  const isAlumnus = profile.role === 'alumnus'

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const userId = profile._id || profile.id
        const res = await axios.get(`${API_URL}/users/${userId}/connections`)
        setConnections(res.data)
      } catch (err) {
        console.error('Error fetching profile connections:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchConnections()
  }, [profile._id, profile.id])

  const toggleMentorship = async () => {
    try {
      const res = await axios.put(`${API_URL}/users/${profile._id || profile.id}`, {
        mentorshipOpen: !profile.mentorshipOpen
      })
      // Usually would update parent state here, but for now we'll just log
      console.log('Mentorship toggled:', res.data.mentorshipOpen)
      window.location.reload() // Simple way to refresh data for now
    } catch (err) {
      console.error('Error toggling mentorship:', err)
    }
  }

  return (
    <div className="profile-page animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <header className="top-bar" style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button className="btn-secondary" onClick={onBack}>
          <ArrowLeft size={16} /> Back
        </button>
        <div style={{ display: 'flex', gap: '12px' }}>
          {isOwn && (
            <button className="btn-secondary" onClick={onEdit}>
              <Edit3 size={16} /> Edit Profile
            </button>
          )}
          {isOwn && (
            <button className="btn-secondary" style={{ color: 'var(--secondary)', borderColor: 'var(--secondary)' }} onClick={onLogout}>
              <LogOut size={16} /> Sign Out
            </button>
          )}
        </div>
      </header>

      <div className="card-elevated" style={{ padding: '40px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div className="avatar" style={{ width: '120px', height: '120px', fontSize: '40px', flexShrink: 0 }}>
            {profile.name?.charAt(0)}
          </div>
          
          <div style={{ flex: 1, minWidth: '300px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div>
                <h1 className="page-title" style={{ fontSize: '32px' }}>{profile.name}</h1>
                <p style={{ fontSize: '16px', color: 'var(--brand-green)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {isAlumnus ? <Briefcase size={16} /> : <Award size={16} />}
                  {isAlumnus ? (profile.profession || 'Starehe Alumnus') : `${profile.house} House Student`}
                </p>
              </div>
              {!isOwn && (
                <button className="btn-primary" onClick={() => onStartChat(profile)}>
                  <Mail size={16} /> Message
                </button>
              )}
            </div>

            <div className="profile-stat-grid" style={{ display: 'flex', alignItems: 'flex-start', gap: 0, margin: '24px 0' }}>
              <div className="profile-stat-item" style={{ flex: 1, padding: '0 20px 0 0', borderRight: '1px solid var(--border)' }}>
                <span className="profile-stat-value" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', display: 'block' }}>{profile.house}</span>
                <span className="profile-stat-label" style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>House</span>
              </div>
              <div className="profile-stat-item" style={{ flex: 1, padding: '0 20px', borderRight: '1px solid var(--border)' }}>
                <span className="profile-stat-value" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', display: 'block' }}>
                  {isAlumnus ? (profile.yearLeft || '2018') : profile.stream}
                </span>
                <span className="profile-stat-label" style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>
                  {isAlumnus ? 'Year Left' : 'Stream'}
                </span>
              </div>
              <div className="profile-stat-item" style={{ flex: 1, padding: '0 0 0 20px' }}>
                <span className="profile-stat-value" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', display: 'block' }}>{isAlumnus ? 'Alumnus' : 'Student'}</span>
                <span className="profile-stat-label" style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>Role</span>
              </div>
            </div>

            <div style={{ lineHeight: '1.6' }}>
              <h3 className="section-heading">About</h3>
              <p className="body-text">
                {profile.bio || `A proud Starehian from ${profile.house} house. Committed to the school's legacy of excellence and duty.`}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginBottom: '48px' }}>
        {/* Conditional Cards */}
        {isAlumnus ? (
          <>
            <div className="card">
              <h3 className="section-heading">Professional Info</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <Briefcase size={18} color="var(--brand-green)" />
                  <div>
                    <div className="card-title" style={{ fontSize: '14px' }}>{profile.profession || 'Professional'}</div>
                    <div className="card-meta">{profile.industry || 'Starehe Alumni Network'}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <MapPin size={18} color="var(--text-muted)" />
                  <div className="card-meta">{profile.location || 'Nairobi, Kenya'}</div>
                </div>
                {profile.linkedIn && (
                  <a href={profile.linkedIn} target="_blank" rel="noreferrer" className="btn-secondary" style={{ textDecoration: 'none', width: 'fit-content' }}>
                    <ExternalLink size={16} /> LinkedIn Profile
                  </a>
                )}
              </div>
            </div>
            <div className="card">
              <h3 className="section-heading">Mentorship</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className={profile.mentorshipOpen ? "badge-role" : "badge-secondary"} style={{ background: profile.mentorshipOpen ? 'var(--brand-green)' : 'var(--bg-page)', color: profile.mentorshipOpen ? 'white' : 'var(--text-muted)' }}>
                    {profile.mentorshipOpen ? 'Open to Mentoring' : 'Not Available'}
                  </span>
                </div>
                <p className="card-meta">
                  {profile.mentorshipOpen 
                    ? "Available for 1-on-1 mentorship sessions with Starehe students and junior alumni."
                    : "Not currently taking on new mentees."}
                </p>
                {isOwn && (
                  <button className="btn-secondary" onClick={toggleMentorship}>
                    Toggle Availability
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="card">
              <h3 className="section-heading">Academic Interests</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ padding: '16px', flex: 1, minWidth: '150px', background: 'var(--bg-page)', borderRadius: '12px' }}>
                  <div className="card-meta" style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Award size={14} /> Favorite Subjects
                  </div>
                  <div className="card-title">Mathematics, Physics</div>
                </div>
                <div style={{ padding: '16px', flex: 1, minWidth: '150px', background: 'var(--bg-page)', borderRadius: '12px' }}>
                  <div className="card-meta" style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} /> Target Career
                  </div>
                  <div className="card-title">{profile.profession || 'Engineering'}</div>
                </div>
              </div>
            </div>
            <div className="card">
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center', marginBottom: '16px', color: 'var(--brand-green)' }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginRight: '6px', verticalAlign: '-2px'}}>
                  <path d="M7 1L2 3v4c0 3 2.5 5 5 6 2.5-1 5-3 5-6V3L7 1z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" fill="none"/>
                </svg>
                <h3 className="section-heading" style={{ margin: 0 }}>Starehe Journey</h3>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {(profile.clubs?.length > 0 ? profile.clubs : ['School Band', 'ICT Club', 'Red Cross']).map(club => (
                  <span key={club} className="badge-house" style={{ padding: '4px 10px', fontSize: '11px' }}>
                    {club}
                  </span>
                ))}
              </div>
              <div style={{ marginTop: '24px' }}>
                <h4 className="card-meta" style={{ marginBottom: '8px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>Leadership Roles</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {(profile.roles?.length > 0 ? profile.roles : ['House Prefect', 'Library Assistant']).map(role => (
                    <div key={role} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <CheckCircle size={12} color="var(--brand-green)" />
                      <span className="card-meta" style={{ fontSize: '13px' }}>{role}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <section className="profile-connections-section">
        <h3 className="section-heading">{isOwn ? 'Your Connections' : 'Connections'}</h3>
        {loading ? (
           <p className="card-meta">Loading connections...</p>
        ) : connections.length === 0 ? (
          <p className="card-meta" style={{ padding: '16px 0' }}>No connections yet.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
            {connections.map(c => (
              <div key={c._id} className="card" onClick={() => window.location.href = `/profile/${c._id}`} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', padding: '16px' }}>
                <div className="avatar" style={{ width: '36px', height: '36px', fontSize: '14px' }}>{c.name?.charAt(0)}</div>
                <div style={{ overflow: 'hidden' }}>
                  <div className="card-title" style={{ fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</div>
                  <div className="card-meta" style={{ fontSize: '11px' }}>{c.house} House</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default ProfileView
