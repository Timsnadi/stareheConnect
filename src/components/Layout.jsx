import { NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  Home, Users, Briefcase, Calendar, BookOpen,
  Trophy, User, Heart, Bell, Search, LogOut, MessageSquare,
} from 'lucide-react'
import Avatar from './Avatar'

function sessionProfile(session) {
  return session?.user || session
}

function displayInitials(name) {
  if (!name || typeof name !== 'string') return '?'
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function subtitleFor(session) {
  const u = sessionProfile(session)
  if (!u) return ''
  const bits = [u.stream, u.house].filter(Boolean)
  if (bits.length) return bits.join(' · ')
  if (u.role) return u.role
  return u.email || ''
}

const NAV = [
  { to: '/feed',      icon: Home,          label: 'Feed' },
  { to: '/messages',  icon: MessageSquare, label: 'Messages' },
  { to: '/alumni',    icon: Users,         label: 'Alumni' },
  { to: '/matching',  icon: Heart,     label: 'Match me' },
  { to: '/jobs',      icon: Briefcase, label: 'Jobs' },
  { to: '/events',    icon: Calendar,  label: 'Events' },
  { to: '/resources', icon: BookOpen,  label: 'Resources' },
  { to: '/community', icon: Trophy,    label: 'Community' },
  { to: '/profile',   icon: User,      label: 'My profile' },
]

export default function Layout({ userSession, onSignOut }) {
  const location = useLocation()
  const isMessages = location.pathname.startsWith('/messages')
  const profile = sessionProfile(userSession)
  const name = profile?.name || 'Member'
  const subtitle = subtitleFor(userSession)

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar name={name} subtitle={subtitle} initials={displayInitials(name)} onSignOut={onSignOut} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: 0 }}>
        <Topbar />
        <main style={isMessages ? {
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden',
          width: '100%',
          maxWidth: 'none',
        } : {
          flex: 1,
          padding: '24px',
          overflowY: 'auto',
          maxWidth: 1100,
          width: '100%',
          margin: '0 auto',
        }}>
          <Outlet context={{ userSession }} />
        </main>
      </div>
    </div>
  )
}

function Sidebar({ name, subtitle, initials, onSignOut }) {
  return (
    <aside style={{
      width: 'var(--sidebar-width)', flexShrink: 0,
      background: 'var(--color-surface)',
      borderRight: '1px solid var(--color-border)',
      display: 'flex', flexDirection: 'column',
      padding: '20px 0',
      position: 'sticky', top: 0, height: '100vh',
    }}>
      <div style={{ padding: '0 20px 24px', borderBottom: '1px solid var(--color-border)' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, letterSpacing: '-0.02em' }}>
          Starehe<span style={{ color: 'var(--color-primary)' }}>Connect</span>
        </span>
      </div>

      <nav style={{ flex: 1, padding: '16px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '9px 12px', borderRadius: 'var(--radius-md)',
            fontSize: 13, fontWeight: isActive ? 500 : 400,
            color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
            background: isActive ? 'var(--color-primary-light)' : 'transparent',
            transition: 'all 0.15s',
            textDecoration: 'none',
          })}>
            <Icon size={16} />
            {label}
            {to === '/matching' && (
              <span style={{
                marginLeft: 'auto', fontSize: 10, fontWeight: 500,
                background: '#E1F5EE', color: '#085041',
                padding: '1px 6px', borderRadius: 8,
              }}>New</span>
            )}
          </NavLink>
        ))}
      </nav>

      <div style={{ padding: '16px 14px', borderTop: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar init={initials} avc="teal" size={34} />
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)' }}>{name}</div>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{subtitle || ' '}</div>
          </div>
        </div>
        <button
          type="button"
          onClick={onSignOut}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            width: '100%', padding: '8px 10px', fontSize: 12, fontWeight: 500,
            color: 'var(--color-text-secondary)', background: 'var(--color-bg)',
            border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)',
          }}
        >
          <LogOut size={14} />
          Sign out
        </button>
      </div>
    </aside>
  )
}

function Topbar() {
  const location = useLocation()
  const label = NAV.find(n => location.pathname.startsWith(n.to))?.label || 'StareheConnect'
  return (
    <header style={{
      height: 'var(--topbar-height)', flexShrink: 0,
      background: 'var(--color-surface)',
      borderBottom: '1px solid var(--color-border)',
      display: 'flex', alignItems: 'center',
      padding: '0 24px', gap: 14,
      position: 'sticky', top: 0, zIndex: 10,
    }}>
      <h1 style={{ fontSize: 16, fontWeight: 500, color: 'var(--color-text-primary)', fontFamily: 'var(--font-display)' }}>
        {label}
      </h1>
      <div style={{
        flex: 1, maxWidth: 320, marginLeft: 'auto',
        display: 'flex', alignItems: 'center', gap: 8,
        background: 'var(--color-bg)', border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)', padding: '0 12px', height: 34,
      }}>
        <Search size={13} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
        <input
          placeholder="Search alumni, jobs, events…"
          style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: 13, color: 'var(--color-text-primary)' }}
        />
      </div>
      <button style={{
        position: 'relative', background: 'transparent', border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)', padding: '6px 8px', color: 'var(--color-text-secondary)',
        display: 'flex', alignItems: 'center',
      }}>
        <Bell size={15} />
        <span style={{
          position: 'absolute', top: 5, right: 5,
          width: 7, height: 7, borderRadius: '50%',
          background: '#D85A30', border: '1.5px solid var(--color-surface)',
        }} />
      </button>
    </header>
  )
}
