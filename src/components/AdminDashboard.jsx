import React, { useState } from 'react'

const INITIAL_USERS = [
  { id: 1, name: 'Dr. Evans Kidero', type: 'Alumnus', house: 'Patshaw', email: 'evans@example.com', joined: '2026-01-15' },
  { id: 2, name: 'Maina Kageni', type: 'Alumnus', house: 'Shell', email: 'maina@example.com', joined: '2026-02-10' },
  { id: 3, name: 'Alex Otieno', type: 'Student', house: 'Patshaw', email: 'alex@example.com', joined: '2026-03-05' },
  { id: 4, name: 'Brian Kamau', type: 'Student', house: 'RoundSquare', email: 'brian@example.com', joined: '2026-04-12' },
]

function AdminDashboard() {
  const [users, setUsers] = useState(INITIAL_USERS)
  const [announcement, setAnnouncement] = useState('')
  const [logs] = useState([
    { id: 1, event: 'New user registered: Brian Kamau', time: '10 mins ago' },
    { id: 2, event: 'Mentor connection: Dr. Kidero & Alex', time: '1 hour ago' },
    { id: 3, event: 'System update: Red/Blue theme deployed', time: '3 hours ago' },
  ])

  const deleteUser = (id) => {
    if (window.confirm('Are you sure you want to remove this user?')) {
      setUsers(users.filter(u => u.id !== id))
    }
  }

  const postAnnouncement = (e) => {
    e.preventDefault()
    alert('Announcement posted to all users: ' + announcement)
    setAnnouncement('')
  }

  return (
    <div className="admin-dashboard animate-fade-in" style={{ padding: '40px 8%', maxWidth: '1400px', margin: '0 auto' }}>
      <header style={{ marginBottom: '40px' }}>
        <h1 className="premium-font" style={{ fontSize: '2.5rem', fontWeight: 700 }}>
          System <span className="gradient-text">Administration</span>
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Monitoring StareheConnect health and community engagement.</p>
      </header>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '48px' }}>
        <div className="glass" style={{ padding: '24px', textAlign: 'center' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Members</p>
          <h2 className="premium-font" style={{ fontSize: '2.5rem', color: 'var(--primary)' }}>{users.length + 142}</h2>
        </div>
        <div className="glass" style={{ padding: '24px', textAlign: 'center' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Mentorship Connections</p>
          <h2 className="premium-font" style={{ fontSize: '2.5rem', color: 'var(--secondary)' }}>84</h2>
        </div>
        <div className="glass" style={{ padding: '24px', textAlign: 'center' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active Houses</p>
          <h2 className="premium-font" style={{ fontSize: '2.5rem', color: 'var(--success)' }}>12</h2>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '40px' }}>
        {/* User Management */}
        <section>
          <h3 className="premium-font" style={{ marginBottom: '24px' }}>User Management</h3>
          <div className="glass" style={{ overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--glass-border)' }}>
                <tr>
                  <th style={{ padding: '16px 24px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>NAME</th>
                  <th style={{ padding: '16px 24px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>TYPE</th>
                  <th style={{ padding: '16px 24px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>HOUSE</th>
                  <th style={{ padding: '16px 24px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ fontWeight: 600 }}>{u.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.email}</div>
                    </td>
                    <td style={{ padding: '16px 24px', fontSize: '0.9rem' }}>{u.type}</td>
                    <td style={{ padding: '16px 24px', fontSize: '0.9rem' }}>{u.house}</td>
                    <td style={{ padding: '16px 24px' }}>
                      <button 
                        className="btn btn-secondary" 
                        style={{ padding: '6px 12px', fontSize: '0.75rem', borderColor: 'rgba(225, 29, 72, 0.3)', color: 'var(--secondary)' }}
                        onClick={() => deleteUser(u.id)}
                      >Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Sidebar Tools */}
        <aside style={{ display: 'grid', gap: '32px' }}>
          <div className="glass" style={{ padding: '32px' }}>
            <h3 className="premium-font" style={{ marginBottom: '20px' }}>Post Announcement</h3>
            <form onSubmit={postAnnouncement}>
              <textarea 
                placeholder="Type system-wide update..." 
                value={announcement}
                onChange={(e) => setAnnouncement(e.target.value)}
                style={{ minHeight: '100px', marginBottom: '16px' }}
                required
              />
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Broadcast Update</button>
            </form>
          </div>

          <div className="glass" style={{ padding: '32px' }}>
            <h3 className="premium-font" style={{ marginBottom: '20px' }}>Live System Logs</h3>
            <div style={{ display: 'grid', gap: '16px' }}>
              {logs.map(log => (
                <div key={log.id} style={{ fontSize: '0.85rem', paddingBottom: '12px', borderBottom: '1px solid var(--glass-border)' }}>
                  <p style={{ marginBottom: '4px' }}>{log.event}</p>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{log.time}</span>
                </div>
              ))}
            </div>
            <button className="btn btn-secondary" style={{ width: '100%', marginTop: '24px', fontSize: '0.8rem' }}>View All Logs</button>
          </div>
        </aside>
      </div>

      <style>{`
        tr:hover { background: rgba(255, 255, 255, 0.01); }
        @media (max-width: 1000px) {
          .admin-dashboard > div:last-child { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}

export default AdminDashboard
