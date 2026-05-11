import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { 
  Sparkles, 
  MessageCircle, 
  User as UserIcon,
  Search,
  ExternalLink,
  ChevronRight
} from 'lucide-react'

const API_URL = 'http://localhost:5000/api'

function getProfileCompletion(user) {
  const fields = [
    user.bio,
    user.industry || user.profession,
    user.location,
    user.house,
    user.role,
    user.name
  ];
  const filled = fields.filter(Boolean).length;
  return Math.round((filled / fields.length) * 100);
}

function Dashboard({ user, onViewProfile, onStartChat, onViewDirectory, onUpdateProfile }) {
  const [recommendations, setRecommendations] = useState([])
  const [connections, setConnections] = useState([])
  const [loading, setLoading] = useState(true)
  const [connLoading, setConnLoading] = useState(true)

  const completionPercent = getProfileCompletion(user)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const userId = user.id || user._id
        const matchRes = await axios.get(`${API_URL}/users/matches/${userId}`)
        let data = matchRes.data
        
        if (data.length === 0) {
          const allRes = await axios.get(`${API_URL}/users`)
          data = allRes.data.filter(u => u.role === 'alumnus' && (u._id !== userId && u.id !== userId)).slice(0, 6)
        }
        setRecommendations(data)

        // Fetch Connections
        const connRes = await axios.get(`${API_URL}/users/${userId}/connections`)
        setConnections(connRes.data)
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
      } finally {
        setLoading(false)
        setConnLoading(false)
      }
    }
    fetchDashboardData()
  }, [user.id, user._id])

  return (
    <div className="dashboard-content animate-fade-in">
      <header style={{ marginBottom: '32px' }}>
        <h1 className="page-title">Welcome back, {user.name?.split(' ')[0]}</h1>
        <p className="page-subtitle">
          {user.house} House · {user.role === 'alumnus' ? 'Alumnus' : 'Student'} · Class of {user.yearLeft || user.yearJoined || '2024'}
        </p>
      </header>

      {completionPercent < 100 && (
        <div className="card-elevated" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '4px solid var(--brand-green)', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flex: 1, minWidth: '240px', flexWrap: 'wrap' }}>
            <div>
              <h3 className="card-title" style={{ marginBottom: '2px' }}>Complete your profile</h3>
              <p className="card-meta">Add interests for better matches.</p>
            </div>
            
            <div className="completion-bar-wrap" style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '150px' }}>
              <div className="completion-bar-track" style={{ flex: 1, height: '4px', background: 'rgba(15, 110, 86, 0.1)', borderRadius: '99px', overflow: 'hidden', maxWidth: '150px' }}>
                <div
                  className="completion-bar-fill"
                  style={{ width: `${completionPercent}%`, height: '100%', background: 'var(--brand-green)', borderRadius: '99px', transition: 'width 0.4s ease' }}
                />
              </div>
              <span className="completion-label" style={{ fontSize: '11px', fontWeight: 600, color: 'var(--brand-green)', whiteSpace: 'nowrap' }}>
                {completionPercent}%
              </span>
            </div>
          </div>
          
          <button className="btn-secondary full-width-mobile" onClick={onUpdateProfile} style={{ padding: '8px' }}>
            Update Profile <ChevronRight size={14} />
          </button>
        </div>
      )}

      <section className="dashboard-section" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Sparkles size={16} color="var(--accent)" />
            <h2 className="section-heading" style={{ margin: 0 }}>Recommended Mentors</h2>
          </div>
          <span 
            className="meta-text" 
            style={{ cursor: 'pointer', fontSize: '12px', fontWeight: 500, color: 'var(--brand-green)', display: 'flex', alignItems: 'center', gap: '4px' }} 
            onClick={onViewDirectory}
          >
            Directory →
          </span>
        </div>
        
        <div className="mobile-stack" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {loading ? (
            [1, 2, 3].map(i => <div key={i} className="card" style={{ height: '220px', opacity: 0.5 }}></div>)
          ) : (
            recommendations.map(mentor => (
              <div key={mentor._id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div className="avatar" style={{ width: '48px', height: '48px', fontSize: '18px' }}>
                      {mentor.name?.charAt(0)}
                    </div>
                    <div>
                      <h4 className="card-title">{mentor.name}</h4>
                      <p className="card-meta">{mentor.house} House · {mentor.role}</p>
                    </div>
                  </div>
                  <span className="badge-role">Mentor</span>
                </div>

                <div style={{ padding: '12px', background: 'var(--bg-page)', borderRadius: '12px' }}>
                  <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--brand-green)', marginBottom: '4px' }}>
                    {mentor.profession || 'Starehe Excellence'}
                  </div>
                  <p className="card-meta" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    Interested in {mentor.clubs?.slice(0, 2).join(', ') || 'Leadership and Community Service'}.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
                  <button className="btn-primary" style={{ flex: 1 }} onClick={() => onStartChat(mentor)}>
                    <MessageCircle size={16} /> Message
                  </button>
                  <button className="btn-secondary" style={{ flex: 1 }} onClick={() => onViewProfile(mentor)}>
                    <UserIcon size={16} /> Profile
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="dashboard-section">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <h2 className="section-heading" style={{ margin: 0 }}>Your Connections</h2>
          <span style={{ fontSize: '11px', fontWeight: 700, background: 'var(--border)', color: 'var(--text-secondary)', padding: '1px 7px', borderRadius: '20px' }}>
            {connections.length}
          </span>
        </div>

        {connLoading ? (
          <div className="card" style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p className="meta-text">Loading connections...</p>
          </div>
        ) : connections.length === 0 ? (
          <p className="meta-text" style={{ padding: '16px 0', margin: 0 }}>
            Connect with mentors from the directory to build your network.
          </p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
            {connections.map(c => (
              <div key={c._id} className="card" onClick={() => onViewProfile(c)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', padding: '16px' }}>
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

export default Dashboard
