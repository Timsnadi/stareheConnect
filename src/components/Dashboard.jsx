import React, { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

function Dashboard({ user, onViewProfile, onStartChat }) {
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Try to get matches
        const matchRes = await axios.get(`${API_URL}/users/matches/${user.id || user._id}`)
        let data = matchRes.data
        
        // If no matches, fetch general alumni/mentors to avoid empty state
        if (data.length === 0) {
          const allRes = await axios.get(`${API_URL}/users`)
          data = allRes.data.filter(u => u.role === 'alumnus' && (u._id !== user._id && u.id !== user.id)).slice(0, 6)
        }
        
        setRecommendations(data)
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboardData()
  }, [user.id, user._id])

  return (
    <div className="dashboard-content animate-fade-in">
      <header style={{ marginBottom: '40px' }}>
        <h1 className="page-title" style={{ marginBottom: '8px' }}>Welcome back, {user.name?.split(' ')[0]}</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="meta-text">{user.house} House</span>
          <span style={{ color: 'var(--border)' }}>•</span>
          <span className="meta-text">{user.role === 'alumnus' ? 'Alumnus' : 'Student'}</span>
          <span style={{ color: 'var(--border)' }}>•</span>
          <span className="meta-text">Class of {user.yearLeft || user.yearJoined || '2024'}</span>
        </div>
      </header>

      {!user.bio && (
        <div className="card-elevated animate-fade-in" style={{ marginBottom: '40px', borderLeft: '4px solid var(--primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ marginBottom: '4px', fontSize: '16px' }}>Complete your profile</h3>
            <p className="meta-text" style={{ fontSize: '13px' }}>Add your professional interests to get better mentor recommendations.</p>
          </div>
          <button className="btn btn-primary" style={{ padding: '8px 20px' }}>Edit Profile</button>
        </div>
      )}

      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '24px' }}>
          <h2 className="section-heading">Recommended Mentors</h2>
          <span className="meta-text" style={{ cursor: 'pointer', fontSize: '13px' }}>View all Starehians →</span>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {loading ? (
            [1, 2, 3].map(i => <div key={i} className="card" style={{ height: '200px', opacity: 0.5 }}></div>)
          ) : (
            recommendations.map(mentor => (
              <div key={mentor._id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div className="avatar" style={{ width: '48px', height: '48px', fontSize: '18px', background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                      {mentor.name?.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '15px' }}>{mentor.name}</div>
                      <div className="meta-text" style={{ fontSize: '12px' }}>{mentor.house} House · {mentor.role}</div>
                    </div>
                  </div>
                  <div className="badge badge-primary">Mentor</div>
                </div>

                <div>
                  <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--primary)', marginBottom: '4px' }}>
                    {mentor.profession || 'Starehe Excellence'}
                  </div>
                  <p className="body-text" style={{ fontSize: '13px', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    Interested in {mentor.clubs?.slice(0, 2).join(', ') || 'Leadership and Community Service'}.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
                  <button className="btn btn-primary" style={{ flex: 1, padding: '8px' }} onClick={() => onStartChat(mentor)}>Message</button>
                  <button className="btn btn-secondary" style={{ flex: 1, padding: '8px' }} onClick={() => onViewProfile(mentor)}>Profile</button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  )
}

export default Dashboard
