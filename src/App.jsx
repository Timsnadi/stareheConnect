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
          <Shield size={28} color="var(--brand-green)" strokeWidth={2.5} />
          <span className="logo-font" style={{ fontSize: '1.25rem' }}>StareheConnect</span>
        </div>
        
        {currentUser && (
          <div className="sidebar-user" onClick={() => { setSelectedProfile(currentUser); setView('profile'); }} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'var(--bg-page)', borderRadius: '12px', marginBottom: '12px' }}>
            <div className="avatar" style={{ width: '36px', height: '36px', fontSize: '14px' }}>{currentUser.name?.charAt(0)}</div>
            <div className="sidebar-user-info">
              <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>{currentUser.name?.split(' ')[0]}</div>
              <div className="badge-house" style={{ fontSize: '8px', padding: '1px 6px', marginTop: '2px' }}>
                {currentUser.house}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="sidebar-nav" style={{ flex: 1, overflowY: 'auto' }}>
        <span className="sidebar-section-label">Main Menu</span>
        <div className={`nav-item ${view === 'dashboard' ? 'active' : ''}`} onClick={() => setView('dashboard')}>
          <Home size={18} /> <span>Home</span>
        </div>
        <div className={`nav-item ${view === 'directory' ? 'active' : ''}`} onClick={() => setView('directory')}>
          <Users size={18} /> <span>Directory</span>
        </div>
        <div className={`nav-item ${view === 'chats' ? 'active' : ''}`} onClick={() => setView('chats')}>
          <Mail size={18} /> <span>Messages</span>
        </div>

        <span className="sidebar-section-label">Account</span>
        <div className={`nav-item ${view === 'profile' && selectedProfile?._id === currentUser?._id ? 'active' : ''}`} onClick={() => { setSelectedProfile(currentUser); setView('profile'); }}>
          <UserIcon size={18} /> <span>My Profile</span>
        </div>
        { (currentUser?.role === 'admin') && (
          <div className={`nav-item ${view === 'admin' ? 'active' : ''}`} onClick={() => setView('admin')}>
            <Settings size={18} /> <span>Admin Panel</span>
          </div>
        )}
      </div>

      <div className="sidebar-footer" style={{ borderTop: 'var(--border-subtle)', padding: '12px 0' }}>
        <div className="nav-item" onClick={toggleTheme}>
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />} 
          <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </div>
        <div className="nav-item" onClick={handleSignOut} style={{ color: 'var(--secondary)' }}>
          <LogOut size={18} /> <span>Sign Out</span>
        </div>
      </div>
    </div>
  )

  const MobileNav = () => (
    <nav className="mobile-nav">
      <div className={`mobile-nav-item ${view === 'dashboard' ? 'active' : ''}`} onClick={() => setView('dashboard')}>
        <Home size={20} />
        <span>Home</span>
      </div>
      <div className={`mobile-nav-item ${view === 'directory' ? 'active' : ''}`} onClick={() => setView('directory')}>
        <Users size={20} />
        <span>Directory</span>
      </div>
      <div className={`mobile-nav-item ${view === 'chats' ? 'active' : ''}`} onClick={() => setView('chats')}>
        <Mail size={20} />
        <span>Messages</span>
      </div>
      <div className={`mobile-nav-item ${view === 'profile' && selectedProfile?._id === currentUser?._id ? 'active' : ''}`} onClick={() => { setSelectedProfile(currentUser); setView('profile'); }}>
        <UserIcon size={20} />
        <span>Profile</span>
      </div>
    </nav>
  )

  const LandingPage = () => (
    <div className="landing-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px', background: 'var(--bg-page)' }}>
      <Shield size={100} color="var(--brand-green)" style={{ marginBottom: '32px' }} strokeWidth={1.5} />
      <h1 className="page-title" style={{ fontSize: '3.5rem', marginBottom: '16px' }}>StareheConnect</h1>
      <p className="page-subtitle" style={{ fontSize: '1.1rem', maxWidth: '600px' }}>
        The official mentorship and professional networking platform for the Starehe Boys' Centre community.
      </p>
      <button className="btn-primary" style={{ padding: '14px 40px', fontSize: '1rem' }} onClick={() => setView('auth')}>Get Started</button>
    </div>
  )

  return (
    <div className="app-root">
      {user && view !== 'landing' && view !== 'auth' && (
        <>
          <Sidebar />
          <MobileNav />
        </>
      )}
      
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
