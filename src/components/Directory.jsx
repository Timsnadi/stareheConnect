import React, { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

const HOUSES = [
  'Patshaw', 'Geturo', 'Ngala', 'Gikubu', 'RoundSquare', 
  'Kibaki', 'Njonjo', 'Kirkley', 'Shell', 'Chaka', 'Pele', 'Muriuki'
]

function Directory({ onViewProfile, onStartChat }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ role: '', house: '', industry: '' })

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

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name?.toLowerCase().includes(search.toLowerCase()) || 
                          u.profession?.toLowerCase().includes(search.toLowerCase())
    const matchesRole = !filters.role || u.role === filters.role
    const matchesHouse = !filters.house || u.house === filters.house
    const matchesIndustry = !filters.industry || (u.industry && u.industry === filters.industry)
    return matchesSearch && matchesRole && matchesHouse && matchesIndustry
  })

  return (
    <div className="directory-content animate-fade-in">
      <header style={{ marginBottom: '40px' }}>
        <h1 className="page-title" style={{ marginBottom: '8px' }}>Starehian Directory</h1>
        <p className="meta-text">Connect with alumni and students across generations.</p>
      </header>

      {/* Filter Bar */}
      <div className="card" style={{ marginBottom: '40px', padding: '16px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ flex: 2, minWidth: '200px' }}>
            <input 
              placeholder="Search by name or keyword..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="body-text"
              style={{ width: '100%', padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-main)' }}
            />
          </div>
          <select 
            className="body-text" 
            style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-main)', color: 'var(--text-main)' }}
            value={filters.role}
            onChange={(e) => setFilters({...filters, role: e.target.value})}
          >
            <option value="">All Roles</option>
            <option value="student">Students</option>
            <option value="alumnus">Alumni</option>
          </select>
          <select 
            className="body-text" 
            style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-main)', color: 'var(--text-main)' }}
            value={filters.house}
            onChange={(e) => setFilters({...filters, house: e.target.value})}
          >
            <option value="">All Houses</option>
            {HOUSES.map(h => <option key={h} value={h}>{h}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px', color: 'var(--text-muted)' }}>
          Loading directory...
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
          {filteredUsers.map(u => (
            <div key={u._id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Row 1: Avatar, Name, Badges */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div className="avatar" style={{ width: '56px', height: '56px', background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                    {u.name?.charAt(0)}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 700 }}>{u.name}</h3>
                    <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                      <span className="badge badge-primary">{u.house}</span>
                      <span className="badge badge-secondary" style={{ background: u.role === 'alumnus' ? 'rgba(29, 158, 117, 0.1)' : 'rgba(237, 73, 86, 0.1)', color: u.role === 'alumnus' ? 'var(--primary)' : 'var(--secondary)' }}>
                        {u.role}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 2: Meta Info */}
              <div style={{ padding: '12px', background: 'var(--bg-main)', borderRadius: '12px' }}>
                <div className="meta-text" style={{ fontSize: '11px', textTransform: 'uppercase', marginBottom: '4px' }}>
                  {u.role === 'alumnus' ? 'Industry / Profession' : 'Class Stream'}
                </div>
                <div style={{ fontWeight: 600, fontSize: '13px' }}>
                  {u.role === 'alumnus' ? (u.profession || 'Education') : `Stream ${u.stream}`}
                </div>
                {u.location && (
                  <div className="meta-text" style={{ fontSize: '11px', marginTop: '8px' }}>📍 {u.location}</div>
                )}
              </div>

              {/* Row 3: Actions */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => onStartChat(u)}>Message</button>
                <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => onViewProfile(u)}>Profile</button>
              </div>
            </div>
          ))}

          {filteredUsers.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '80px', color: 'var(--text-muted)' }}>
              No Starehians found matching your filters.
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Directory
