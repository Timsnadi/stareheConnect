import React, { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

const HOUSES = [
  'Patshaw', 'Geturo', 'Ngala', 'Gikubu', 'RoundSquare', 
  'Kibaki', 'Njonjo', 'Kirkley', 'Shell', 'Chaka', 'Pele', 'Muriuki'
]

function Dashboard({ user, onViewProfile, onStartChat }) {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await axios.get(`${API_URL}/users/matches/${user.id || user._id}`)
        setMatches(res.data)
      } catch (err) {
        console.error('Error fetching matches:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchMatches()
  }, [user.id, user._id])

  return (
    <div className="dashboard-container">
      {/* Stories - Houses */}
      <div className="stories-container">
        {HOUSES.map(house => (
          <div key={house} className="story-item">
            <div className="story-circle">
              <div className="story-inner">{house.charAt(0)}</div>
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-main)' }}>{house}</span>
          </div>
        ))}
      </div>

      {/* Feed - Matches */}
      <div className="feed-container">
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Finding your heritage...</div>
        ) : (
          matches.map(match => (
            <div key={match._id} className="feed-card">
              <div className="card-header">
                <div className="card-avatar" style={{ background: match.role === 'alumnus' ? 'var(--primary)' : 'var(--secondary)' }}></div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{match.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{match.house} House • Stream {match.stream}</div>
                </div>
              </div>
              <div className="card-image" onClick={() => onViewProfile(match)}>
                {match.name.charAt(0)}
              </div>
              <div className="card-actions">
                <span style={{ fontSize: '1.5rem' }} onClick={() => onStartChat(match)}>✉️</span>
                <span style={{ fontSize: '1.5rem' }} onClick={() => onViewProfile(match)}>👤</span>
              </div>
              <div className="card-info">
                <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '4px' }}>
                  {match.role === 'alumnus' ? 'Mentor' : 'Student'} Match
                </div>
                <div style={{ fontSize: '0.85rem' }}>
                  <span style={{ fontWeight: 600 }}>{match.profession || 'Student'}</span> sharing legacy from the {match.house} house.
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                  Linked via shared interests in {match.clubs?.[0] || 'Starehe Excellence'}.
                </div>
              </div>
            </div>
          ))
        )}
        
        {!loading && matches.length === 0 && (
          <div style={{ padding: '80px 40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <h3 className="premium-font">Start Exploring</h3>
            <p>Use the search icon to find more Starehians.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
