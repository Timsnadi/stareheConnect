import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { 
  Search, 
  Filter, 
  MessageCircle, 
  User as UserIcon, 
  MapPin, 
  Briefcase, 
  GraduationCap
} from 'lucide-react'

const API_URL = 'http://localhost:5000/api'

const SkeletonCard = () => (
  <div className="card skeleton" style={{ height: '240px', display: 'flex', flexDirection: 'column', gap: '16px', opacity: 0.6 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(0,0,0,0.1)' }}></div>
        <div>
          <div style={{ width: '120px', height: '16px', background: 'rgba(0,0,0,0.1)', borderRadius: '4px', marginBottom: '8px' }}></div>
          <div style={{ width: '80px', height: '12px', background: 'rgba(0,0,0,0.1)', borderRadius: '4px' }}></div>
        </div>
      </div>
    </div>
    <div style={{ width: '100%', height: '60px', background: 'rgba(0,0,0,0.1)', borderRadius: '8px' }}></div>
    <div style={{ marginTop: 'auto', display: 'flex', gap: '12px' }}>
      <div style={{ flex: 1, height: '36px', background: 'rgba(0,0,0,0.1)', borderRadius: '8px' }}></div>
      <div style={{ flex: 1, height: '36px', background: 'rgba(0,0,0,0.1)', borderRadius: '8px' }}></div>
    </div>
  </div>
)

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

  const [showFilters, setShowFilters] = useState(false)

  return (
    <div className="directory-content animate-fade-in">
      <header style={{ marginBottom: '32px' }}>
        <h1 className="page-title">Starehian Directory</h1>
        <p className="page-subtitle">Connect with alumni and students across generations.</p>
      </header>

      {/* Filter Bar Toggle (Mobile) */}
      <button 
        className="btn-secondary mobile-only full-width-mobile" 
        onClick={() => setShowFilters(!showFilters)}
        style={{ marginBottom: '16px' }}
      >
        <Filter size={16} /> {showFilters ? 'Hide Filters' : 'Show Filters'}
      </button>

      {/* Filter Bar */}
      <div className={`card directory-filters ${showFilters ? 'mobile-show' : 'mobile-hide'}`} style={{ marginBottom: '40px', padding: '16px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', width: '100%' }}>
          <div style={{ flex: 2, minWidth: '200px', position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              placeholder="Search by name or keyword..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '48px' }}
            />
          </div>
          
          <div style={{ flex: 1, minWidth: '140px', position: 'relative' }}>
            <Filter size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <select 
              style={{ paddingLeft: '36px' }}
              value={filters.role}
              onChange={(e) => setFilters({...filters, role: e.target.value})}
            >
              <option value="">All Roles</option>
              <option value="student">Students</option>
              <option value="alumnus">Alumni</option>
            </select>
          </div>

          <div style={{ flex: 1, minWidth: '140px', position: 'relative' }}>
            <GraduationCap size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <select 
              style={{ paddingLeft: '36px' }}
              value={filters.house}
              onChange={(e) => setFilters({...filters, house: e.target.value})}
            >
              <option value="">All Houses</option>
              {HOUSES.map(h => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="mobile-stack" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
          {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="mobile-stack" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
          {filteredUsers.map(u => (
            <div key={u._id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div className="avatar" style={{ width: '56px', height: '56px' }}>
                    {u.name?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="card-title">{u.name}</h3>
                    <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                      <span className="badge-house">{u.house}</span>
                      <span className="badge-role">{u.role}</span>
                    </div>
                  </div>
                </div>
                {u.role === 'alumnus' && u.mentorshipOpen && (
                  <span style={{ 
                    display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '20px', 
                    fontSize: '10px', fontWeight: 600, background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)' 
                  }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
                    Open to Mentoring
                  </span>
                )}
              </div>

              <div style={{ 
                minHeight: '56px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', 
                padding: '8px 12px', background: 'var(--bg-page)', borderRadius: '12px', marginBottom: '20px' 
              }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <Briefcase size={14} color="var(--brand-green)" />
                  <div>
                    <div className="section-heading" style={{ fontSize: '9px', margin: 0 }}>
                      {u.role === 'alumnus' ? 'Industry / Profession' : 'Class Stream'}
                    </div>
                    <div className="card-title" style={{ fontSize: '13px' }}>
                      {u.role === 'alumnus' ? (u.profession || 'Education') : `Stream ${u.stream}`}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
                <button className="btn-primary full-width-mobile" style={{ flex: 1 }} onClick={() => onStartChat(u)}>
                  <MessageCircle size={16} /> Message
                </button>
                <button className="btn-secondary full-width-mobile" style={{ flex: 1 }} onClick={() => onViewProfile(u)}>
                  <UserIcon size={16} /> Profile
                </button>
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
