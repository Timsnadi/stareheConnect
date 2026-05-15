import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Layout from './components/Layout'
import Auth from './components/Auth'
import Feed from './pages/Feed'
import Alumni from './pages/Alumni'
import Jobs from './pages/Jobs'
import Events from './pages/Events'
import Resources from './pages/Resources'
import Community from './pages/Community'
import MyProfile from './pages/MyProfile'
import Matching from './pages/Matching'
import Messages from './pages/Messages'

function isStoredSession(value) {
  if (!value || typeof value !== 'object') return false
  const token = value.token
  const profile = value.user || value
  return Boolean(token && profile && (profile.email || profile.name))
}

export default function App() {
  const [session, setSession] = useState(null)
  const [hydrated, setHydrated] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    try {
      const raw = localStorage.getItem('starehe_user')
      if (raw) {
        const parsed = JSON.parse(raw)
        if (isStoredSession(parsed)) setSession(parsed)
      }
    } catch {
      localStorage.removeItem('starehe_user')
    }
    setHydrated(true)
  }, [])

  const handleAuthComplete = (data) => {
    localStorage.setItem('starehe_user', JSON.stringify(data))
    setSession(data)
    navigate('/feed', { replace: true })
  }

  const handleSignOut = () => {
    localStorage.removeItem('starehe_user')
    setSession(null)
    navigate('/', { replace: true })
  }

  if (!hydrated) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--color-bg)', color: 'var(--color-text-muted)', fontSize: 14,
      }}>
        Loading…
      </div>
    )
  }

  if (!isStoredSession(session)) {
    return <Auth onComplete={handleAuthComplete} />
  }

  return (
    <Routes>
      <Route path="/" element={<Layout userSession={session} onSignOut={handleSignOut} />}>
        <Route index element={<Navigate to="/feed" replace />} />
        <Route path="feed" element={<Feed />} />
        <Route path="messages" element={<Messages />} />
        <Route path="alumni" element={<Alumni />} />
        <Route path="jobs" element={<Jobs />} />
        <Route path="events" element={<Events />} />
        <Route path="resources" element={<Resources />} />
        <Route path="community" element={<Community />} />
        <Route path="profile" element={<MyProfile />} />
        <Route path="matching" element={<Matching />} />
      </Route>
      <Route path="*" element={<Navigate to="/feed" replace />} />
    </Routes>
  )
}
