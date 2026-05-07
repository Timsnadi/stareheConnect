import React, { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

function Directory({ onViewProfile }) {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${API_URL}/users`)
        setUsers(res.data)
      } catch (err) {
        console.error('Error fetching directory:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.house.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="directory-container">
      <div style={{ padding: '16px' }}>
        <input 
          placeholder="Search..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ 
            background: 'var(--bg-main)', 
            border: '1px solid var(--border)', 
            borderRadius: '8px',
            padding: '8px 12px',
            fontSize: '0.9rem'
          }}
        />
      </div>

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Exploring...</div>
      ) : (
        <div className="profile-grid">
          {filteredUsers.map(u => (
            <div key={u._id} className="grid-item" onClick={() => onViewProfile(u)} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '1.5rem',
              color: 'var(--text-muted)',
              border: '0.5px solid var(--border)'
            }}>
              {u.name.charAt(0)}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Directory
