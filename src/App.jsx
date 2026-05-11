import React, { useState, useEffect } from 'react'
import Auth from './components/Auth'
import Dashboard from './components/Dashboard'
import Directory from './components/Directory'
import ProfileView from './components/ProfileView'
import ChatSystem from './components/ChatSystem'
import AdminDashboard from './components/AdminDashboard'

function App() {
  const [user, setUser] = useState(null)
  const [view, setView] = useState('landing') 
  const [theme, setTheme] = useState('dark')
  const [selectedProfile, setSelectedProfile] = useState(null)
  const [activeChat, setActiveChat] = useState(null)

  useEffect(() => {
    const savedUser = localStorage.getItem('starehe_user')
    const savedTheme = localStorage.getItem('starehe_theme') || 'dark'
    if (savedUser) {
      const parsedData = JSON.parse(savedUser)
      setUser(parsedData)
      const userData = parsedData.user || parsedData
      setView(userData.role === 'admin' ? 'admin' : 'dashboard')
    }
    setTheme(savedTheme)
    document.documentElement.setAttribute('data-theme', savedTheme)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('starehe_theme', newTheme)
  }

  const handleSignOut = () => {
    localStorage.removeItem('starehe_user')
    setUser(null)
    setView('landing')
  }

  const currentUser = user?.user || user

  const Sidebar = () => (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span style={{ fontSize: '1.8rem' }}>🛡️</span>
          <span className="premium-font">StareheConnect</span>
        </div>
        
        {currentUser && (
          <div className="sidebar-user" onClick={() => { setSelectedProfile(currentUser); setView('profile'); }} style={{ cursor: 'pointer' }}>
            <div className="avatar">{currentUser.name?.charAt(0)}</div>
            <div className="sidebar-user-info">
              <div style={{ fontWeight: 600, fontSize: '14px' }}>{currentUser.name?.split(' ')[0]}</div>
              <div className="badge badge-primary" style={{ fontSize: '9px', padding: '2px 6px', marginTop: '4px' }}>
                {currentUser.house} House
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="sidebar-nav">
        <div className="nav-label">Main Menu</div>
        <div className={`sidebar-item ${view === 'dashboard' ? 'active' : ''}`} onClick={() => setView('dashboard')}>
          <span>🏠</span> <span>Home</span>
        </div>
        <div className={`sidebar-item ${view === 'directory' ? 'active' : ''}`} onClick={() => setView('directory')}>
          <span>🔍</span> <span>Directory</span>
        </div>
        <div className={`sidebar-item ${view === 'chats' ? 'active' : ''}`} onClick={() => setView('chats')}>
          <span>✉️</span> <span>Messages</span>
        </div>

        <div className="nav-label">Account</div>
        <div className={`sidebar-item ${view === 'profile' && selectedProfile?._id === currentUser?._id ? 'active' : ''}`} onClick={() => { setSelectedProfile(currentUser); setView('profile'); }}>
          <span>👤</span> <span>My Profile</span>
        </div>
        { (currentUser?.role === 'admin') && (
          <div className={`sidebar-item ${view === 'admin' ? 'active' : ''}`} onClick={() => setView('admin')}>
            <span>⚙️</span> <span>Admin</span>
          </div>
        )}
      </div>

      <div className="sidebar-nav" style={{ flexGrow: 0, marginBottom: '24px' }}>
        <div className="sidebar-item" onClick={toggleTheme}>
          <span>{theme === 'dark' ? '☀️' : '🌙'}</span> <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </div>
        <div className="sidebar-item" onClick={handleSignOut} style={{ color: 'var(--secondary)' }}>
          <span>🚪</span> <span>Sign Out</span>
        </div>
      </div>
    </div>
  )

  const LandingPage = () => (
    <div className="landing-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px', background: 'var(--bg-main)' }}>
      <div style={{ fontSize: '5rem', marginBottom: '24px' }}>🛡️</div>
      <h1 className="page-title" style={{ fontSize: '4rem', marginBottom: '16px' }}>StareheConnect</h1>
      <p className="body-text" style={{ marginBottom: '40px', fontSize: '1.2rem', maxWidth: '600px', color: 'var(--text-muted)' }}>
        The official mentorship and professional networking platform for the Starehe Boys' Centre community.
      </p>
      <button className="btn btn-primary" style={{ padding: '16px 48px', fontSize: '1.1rem' }} onClick={() => setView('auth')}>Get Started</button>
    </div>
  )

  return (
    <div className="app-root">
      {user && view !== 'landing' && view !== 'auth' && <Sidebar />}
      
      <main style={{ marginLeft: (user && view !== 'landing' && view !== 'auth') ? 'var(--nav-width)' : '0' }}>
        {view === 'landing' && <LandingPage />}
        {view === 'auth' && <Auth onComplete={(data) => {
          setUser(data)
          localStorage.setItem('starehe_user', JSON.stringify(data))
          const userData = data.user || data
          setView(userData.role === 'admin' ? 'admin' : 'dashboard')
        }} />}
        {view === 'dashboard' && user && (
          <Dashboard 
            user={currentUser} 
            onViewProfile={(p) => { setSelectedProfile(p); setView('profile'); }} 
            onStartChat={(c) => { setActiveChat(c); setView('chats'); }}
          />
        )}
        {view === 'directory' && (
          <Directory 
            onViewProfile={(p) => { setSelectedProfile(p); setView('profile'); }} 
            onStartChat={(c) => { setActiveChat(c); setView('chats'); }} 
          />
        )}
        {view === 'profile' && selectedProfile && (
          <ProfileView 
            profile={selectedProfile} 
            isOwn={selectedProfile._id === currentUser?._id || selectedProfile.id === currentUser?.id}
            onBack={() => setView('dashboard')}
            onStartChat={(c) => { setActiveChat(c); setView('chats'); }}
            onLogout={handleSignOut}
            onEdit={() => setView('auth')}
          />
        )}
        {view === 'chats' && user && (
          <ChatSystem 
            user={user} 
            initialTarget={activeChat}
            onBack={() => setView('dashboard')}
          />
        )}
        {view === 'admin' && user && (currentUser?.role === 'admin') && (
          <AdminDashboard user={currentUser} />
        )}
      </main>
    </div>
  )
}

export default App
