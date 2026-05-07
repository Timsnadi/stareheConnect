import React, { useState, useEffect } from 'react'
import Auth from './components/Auth'
import Dashboard from './components/Dashboard'
import Directory from './components/Directory'
import ProfileView from './components/ProfileView'
import ChatSystem from './components/ChatSystem'
import AdminDashboard from './components/AdminDashboard'

function App() {
  const [user, setUser] = useState(null)
  const [view, setView] = useState('landing') // landing, auth, dashboard, directory, profile, chats, admin
  const [theme, setTheme] = useState('dark')
  const [selectedProfile, setSelectedProfile] = useState(null)
  const [activeChat, setActiveChat] = useState(null)

  useEffect(() => {
    const savedUser = localStorage.getItem('starehe_user')
    const savedTheme = localStorage.getItem('starehe_theme') || 'dark'
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser)
      setUser(parsedUser)
      setView(parsedUser.role === 'admin' ? 'admin' : 'dashboard')
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

  const BottomNav = () => (
    <div className="bottom-nav">
      <div className={`nav-item ${view === 'dashboard' ? 'active' : ''}`} onClick={() => setView('dashboard')}>🏠</div>
      <div className={`nav-item ${view === 'directory' ? 'active' : ''}`} onClick={() => setView('directory')}>🔍</div>
      <div className={`nav-item ${view === 'chats' ? 'active' : ''}`} onClick={() => setView('chats')}>✉️</div>
      <div className={`nav-item ${view === 'profile' && selectedProfile?.name === user?.name ? 'active' : ''}`} onClick={() => { setSelectedProfile(user); setView('profile'); }}>👤</div>
      <div className="nav-item" onClick={toggleTheme}>{theme === 'dark' ? '☀️' : '🌙'}</div>
    </div>
  )

  const TopHeader = () => (
    <div className="top-header">
      <div className="logo-font">StareheConnect</div>
      <div style={{ display: 'flex', gap: '16px' }}>
        <span style={{ fontSize: '1.4rem' }} onClick={() => setView('chats')}>❤️</span>
        <span style={{ fontSize: '1.4rem' }} onClick={() => setView('chats')}>✉️</span>
      </div>
    </div>
  )

  const LandingPage = () => (
    <div className="landing-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px' }}>
      <h1 className="logo-font" style={{ fontSize: '3.5rem', marginBottom: '16px' }}>StareheConnect</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '40px' }}>Mentorship. Networking. Legacy.</p>
      <button className="btn-insta" style={{ padding: '12px 40px' }} onClick={() => setView('auth')}>Log In</button>
    </div>
  )

  return (
    <div className="app-root">
      {user && view !== 'landing' && view !== 'auth' && <TopHeader />}
      
      <main style={{ paddingBottom: user ? '80px' : '0' }}>
        {view === 'landing' && <LandingPage />}
        {view === 'auth' && <Auth onComplete={(data) => {
          setUser(data)
          localStorage.setItem('starehe_user', JSON.stringify(data))
          setView(data.role === 'admin' ? 'admin' : 'dashboard')
        }} />}
        {view === 'dashboard' && user && (
          <Dashboard 
            user={user} 
            onViewProfile={(p) => { setSelectedProfile(p); setView('profile'); }} 
            onStartChat={(c) => { setActiveChat(c); setView('chats'); }}
            onEditProfile={() => setView('auth')}
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
            isOwn={selectedProfile.name === user?.name}
            onBack={() => setView('dashboard')}
            onStartChat={(c) => { setActiveChat(c); setView('chats'); }}
            onLogout={handleSignOut}
          />
        )}
        {view === 'chats' && user && (
          <ChatSystem 
            user={user} 
            initialTarget={activeChat}
            onBack={() => setView('dashboard')}
          />
        )}
        {view === 'admin' && user?.role === 'admin' && (
          <AdminDashboard user={user} />
        )}
      </main>

      {user && view !== 'landing' && view !== 'auth' && <BottomNav />}
    </div>
  )
}

export default App
