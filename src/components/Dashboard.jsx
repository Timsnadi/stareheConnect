import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { 
  Sparkles, 
  MessageCircle, 
  User as UserIcon,
  ChevronRight,
  Users,
  Zap
} from 'lucide-react'
import DiscoveryFeed from './DiscoveryFeed'

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

function Dashboard({ user, onViewProfile, onStartChat, onViewDirectory, onUpdateProfile, connections: propConnections = [] }) {
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)

  const completionPercent = getProfileCompletion(user)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const userId = user.id || user._id
        const matchRes = await axios.get(`${API_URL}/users/matches/${userId}`)
        let data = matchRes.data
        
        if (data.length === 0) {
          const allRes = await axios.get(`${API_URL}/users`)
          data = allRes.data.filter(u => u.role === 'alumnus' && (u._id !== userId && u.id !== userId)).slice(0, 3)
        }
        setRecommendations(data)
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboardData()
  }, [user])

  return (
    <div className="dashboard-content animate-fade-in">
      <header style={{ marginBottom: '40px' }}>
        <h1 className="page-title">Welcome back, {user.name?.split(' ')[0]}</h1>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '8px' }}>
          <span className="card-meta" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#1D9E75' }} />
            {user.house} House • {user.role === 'alumnus' ? 'Alumnus' : 'Student'} • Class of {user.yearLeft || '2024'}
          </span>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '48px', alignItems: 'flex-start' }} className="dashboard-grid mobile-column">
        <div className="main-col">
          {completionPercent < 100 && (
            <div className="card-elevated" style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '4px solid var(--brand-green)', flexWrap: 'wrap', gap: '12px' }}>
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

          <section className="dashboard-section" style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '20px', flexWrap: 'wrap', gap: '8px' }}>
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
                [1, 2, 3].map(i => <div key={i} className="card" style={{ height: '180px', opacity: 0.5 }}></div>)
              ) : recommendations.length > 0 ? (
                recommendations.map(u => (
                  <div key={u._id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', alignItems: 'center' }}>
                      <div className="avatar" style={{ width: '40px', height: '40px', fontSize: '16px' }}>{u.name?.charAt(0)}</div>
                      <div style={{ flex: 1, overflow: 'hidden' }}>
                        <h3 className="card-title" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '14px' }}>{u.name}</h3>
                        <p className="card-meta" style={{ fontSize: '11px' }}>{u.house} House</p>
                      </div>
                    </div>
                    
                    <div style={{ background: 'rgba(0,0,0,0.02)', padding: '10px', borderRadius: '8px', marginBottom: '16px' }}>
                      <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--brand-green)', marginBottom: '2px' }}>{u.profession || 'Starehe Alumnus'}</p>
                      <p className="card-meta" style={{ fontSize: '11px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {u.bio || 'Available for mentorship and career guidance.'}
                      </p>
                    </div>

                    <div style={{ marginTop: 'auto', display: 'flex', gap: '8px' }}>
                      <button className="btn-primary" style={{ flex: 1, padding: '6px', fontSize: '12px' }} onClick={() => onStartChat(u)}>
                        <MessageCircle size={14} /> Message
                      </button>
                      <button className="btn-secondary" style={{ padding: '6px', opacity: 0.7 }} onClick={() => onViewProfile(u)}>
                        <UserIcon size={14} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="card" style={{ padding: '24px', textAlign: 'center', gridColumn: '1 / -1' }}>
                  <p className="card-meta">No recommendations yet.</p>
                </div>
              )}
            </div>
          </section>

          <section className="dashboard-section">
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '20px' }}>
              <Users size={18} color="var(--brand-green)" />
              <h2 className="section-heading" style={{ margin: 0 }}>Your Connections</h2>
            </div>
            
            <div className="mobile-stack" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
              {propConnections.length > 0 ? (
                propConnections.slice(0, 4).map(conn => (
                  <div key={conn._id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', cursor: 'pointer' }} onClick={() => onViewProfile(conn)}>
                    <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '12px' }}>{conn.name?.charAt(0)}</div>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <h4 style={{ fontSize: '12px', fontWeight: 600, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{conn.name}</h4>
                      <p style={{ fontSize: '10px', color: 'var(--text-muted)', margin: 0 }}>{conn.house} House</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="card" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', gridColumn: '1 / -1' }}>
                  <p style={{ fontSize: '13px', margin: 0 }}>No active connections yet.</p>
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="side-col">
          <DiscoveryFeed />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
