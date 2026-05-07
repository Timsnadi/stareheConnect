import React from 'react'

function ProfileView({ profile, isOwn, onBack, onStartChat, onLogout }) {
  return (
    <div className="profile-container animate-fade-in" style={{ paddingBottom: '60px' }}>
      {/* Top Header for Profile */}
      <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
        <h3 style={{ fontWeight: 800 }}>{profile.name}</h3>
        {isOwn && <span style={{ fontSize: '1.2rem' }} onClick={onLogout}>⚙️</span>}
      </div>

      {/* Profile Header */}
      <div style={{ padding: '24px 16px', display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(45deg, #f09433, #e6683c)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '2rem', fontWeight: 800 }}>
          {profile.name.charAt(0)}
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
          <div>
            <div style={{ fontWeight: 700 }}>{profile.house}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>House</div>
          </div>
          <div>
            <div style={{ fontWeight: 700 }}>{profile.stream}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Stream</div>
          </div>
          <div>
            <div style={{ fontWeight: 700 }}>{profile.role === 'alumnus' ? 'Mentor' : 'Student'}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Role</div>
          </div>
        </div>
      </div>

      {/* Bio */}
      <div style={{ padding: '0 16px 24px' }}>
        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{profile.profession || 'Pursuing Excellence'}</div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginTop: '4px' }}>
          Heritage from Starehe Boys Centre. Member of {profile.clubs?.join(', ') || 'the Prefect Body'}.
        </div>
      </div>

      {/* Actions */}
      <div style={{ padding: '0 16px 24px', display: 'flex', gap: '8px' }}>
        {!isOwn ? (
          <>
            <button className="btn-insta" style={{ flex: 1 }} onClick={() => onStartChat(profile)}>Message</button>
            <button className="btn-insta-secondary" style={{ flex: 1, border: '1px solid var(--border)', borderRadius: '8px', padding: '8px' }}>Follow</button>
          </>
        ) : (
          <button className="btn-insta-secondary" style={{ width: '100%', border: '1px solid var(--border)', borderRadius: '8px', padding: '8px', fontWeight: 600 }}>Edit Profile</button>
        )}
      </div>

      {/* Grid Placeholder */}
      <div className="profile-grid">
        {[1,2,3,4,5,6,7,8,9].map(i => (
          <div key={i} className="grid-item"></div>
        ))}
      </div>
    </div>
  )
}

export default ProfileView
