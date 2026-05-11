import React, { useState, useEffect } from 'react'
import { 
  Home, 
  Users, 
  Mail, 
  User as UserIcon, 
  Settings, 
  LogOut, 
  Sun, 
  Moon,
  Shield
} from 'lucide-react'
import Auth from './components/Auth'
import Dashboard from './components/Dashboard'
import Directory from './components/Directory'
import ProfileView from './components/ProfileView'
import ChatSystem from './components/ChatSystem'
import AdminDashboard from './components/AdminDashboard'
import ProfileEdit from './components/ProfileEdit'

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
          <Shield size={32} color="var(--primary)" strokeWidth={2.5} />
          <span className="logo-font" style={{ fontSize: '1.4rem' }}>StareheConnect</span>
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
          <Home size={18} /> <span>Home</span>
        </div>
        <div className={`sidebar-item ${view === 'directory' ? 'active' : ''}`} onClick={() => setView('directory')}>
          <Users size={18} /> <span>Directory</span>
        </div>
        <div className={`sidebar-item ${view === 'chats' ? 'active' : ''}`} onClick={() => setView('chats')}>
          <Mail size={18} /> <span>Messages</span>
        </div>

        <div className="nav-label">Account</div>
        <div className={`sidebar-item ${view === 'profile' && selectedProfile?._id === currentUser?._id ? 'active' : ''}`} onClick={() => { setSelectedProfile(currentUser); setView('profile'); }}>
          <UserIcon size={18} /> <span>My Profile</span>
        </div>
        { (currentUser?.role === 'admin') && (
          <div className={`sidebar-item ${view === 'admin' ? 'active' : ''}`} onClick={() => setView('admin')}>
            <Settings size={18} /> <span>Admin</span>
          </div>
        )}
      </div>

      <div className="sidebar-nav" style={{ flexGrow: 0, marginBottom: '24px' }}>
        <div className="sidebar-item" onClick={toggleTheme}>
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />} 
          <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </div>
        <div className="sidebar-item" onClick={handleSignOut} style={{ color: 'var(--secondary)' }}>
          <LogOut size={18} /> <span>Sign Out</span>
        </div>
      </div>
    </div>
  )

  const LandingPage = () => (
    <div className="landing-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px', background: 'var(--bg-main)' }}>
      <Shield size={120} color="var(--primary)" style={{ marginBottom: '32px' }} strokeWidth={1.5} />
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
            onViewDirectory={() => setView('directory')}
            onUpdateProfile={() => setView('edit-profile')}
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
            onEdit={() => setView('edit-profile')}
          />
        )}
        {view === 'edit-profile' && currentUser && (
          <ProfileEdit 
            user={currentUser}
            onComplete={(updated) => {
              setUser(updated)
              setSelectedProfile(updated.user || updated)
              setView('profile')
            }}
            onCancel={() => setView('profile')}
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
