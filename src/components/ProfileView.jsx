import React from 'react'
import { 
  ArrowLeft, 
  Mail, 
  LogOut, 
  Edit3, 
  MapPin, 
  Briefcase, 
  Home, 
  BookOpen, 
  Award,
  CheckCircle
} from 'lucide-react'

function ProfileView({ profile, isOwn, onBack, onStartChat, onLogout, onEdit }) {
  const isAlumnus = profile.role === 'alumnus'

  return (
    <div className="profile-page animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <header className="top-bar" style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button className="btn btn-secondary" onClick={onBack}>
          <ArrowLeft size={16} /> Back
        </button>
        <div style={{ display: 'flex', gap: '12px' }}>
          {isOwn && (
            <button className="btn btn-secondary" onClick={onEdit}>
              <Edit3 size={16} /> Edit Profile
            </button>
          )}
          {isOwn && (
            <button className="btn btn-secondary" style={{ color: 'var(--secondary)' }} onClick={onLogout}>
              <LogOut size={16} /> Sign Out
            </button>
          )}
        </div>
      </header>

      <div className="card-elevated" style={{ padding: '40px', marginBottom: '32px', position: 'relative' }}>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div className="avatar" style={{ width: '120px', height: '120px', fontSize: '48px', flexShrink: 0, background: 'var(--bg-main)', border: '2px solid var(--border)' }}>
            {profile.name?.charAt(0)}
          </div>
          
          <div style={{ flex: 1, minWidth: '300px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div>
                <h1 className="page-title" style={{ fontSize: '32px', marginBottom: '4px' }}>{profile.name}</h1>
                <p style={{ fontSize: '16px', color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {isAlumnus ? <Briefcase size={16} /> : <BookOpen size={16} />}
                  {isAlumnus ? (profile.profession || 'Starehe Alumnus') : `${profile.house} House Student`}
                </p>
              </div>
              {!isOwn && (
                <button className="btn btn-primary" onClick={() => onStartChat(profile)}>
                  <Mail size={16} /> Message
                </button>
              )}
            </div>

            <div style={{ display: 'flex', gap: '32px', margin: '24px 0', padding: '20px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 700, fontSize: '18px' }}>{profile.house}</div>
                <div className="meta-text" style={{ fontSize: '11px', textTransform: 'uppercase' }}>House</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 700, fontSize: '18px' }}>{profile.stream}</div>
                <div className="meta-text" style={{ fontSize: '11px', textTransform: 'uppercase' }}>Stream</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 700, fontSize: '18px' }}>{isAlumnus ? 'Mentor' : 'Student'}</div>
                <div className="meta-text" style={{ fontSize: '11px', textTransform: 'uppercase' }}>Role</div>
              </div>
              {isAlumnus && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 700, fontSize: '18px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}>
                    <CheckCircle size={16} /> Open
                  </div>
                  <div className="meta-text" style={{ fontSize: '11px', textTransform: 'uppercase' }}>Mentorship</div>
                </div>
              )}
            </div>

            <div style={{ lineHeight: '1.6' }}>
              <h3 className="section-heading" style={{ fontSize: '12px', marginBottom: '8px' }}>About / Bio</h3>
              <p className="body-text" style={{ color: 'var(--text-muted)' }}>
                {profile.bio || `A proud Starehian from ${profile.house} house. Committed to the school's legacy of excellence and duty.`}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        <div className="card">
          <h3 className="section-heading" style={{ marginBottom: '16px' }}>{isAlumnus ? 'Professional Background' : 'Academic Interests'}</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            <div className="card-elevated" style={{ padding: '16px', flex: 1, minWidth: '150px' }}>
              <div className="meta-text" style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Award size={14} /> {isAlumnus ? 'Industry' : 'Favorite Subjects'}
              </div>
              <div style={{ fontWeight: 600 }}>{isAlumnus ? (profile.industry || 'Tech & Innovation') : 'Mathematics, Physics'}</div>
            </div>
            <div className="card-elevated" style={{ padding: '16px', flex: 1, minWidth: '150px' }}>
              <div className="meta-text" style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={14} /> {isAlumnus ? 'Location' : 'Target Career'}
              </div>
              <div style={{ fontWeight: 600 }}>{isAlumnus ? (profile.location || 'Nairobi, Kenya') : (profile.profession || 'Engineering')}</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '16px' }}>
            <Award size={18} color="var(--accent)" />
            <h3 className="section-heading">Starehe Journey</h3>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {(profile.clubs?.length > 0 ? profile.clubs : ['School Band', 'ICT Club', 'Red Cross']).map(club => (
              <span key={club} className="badge badge-primary" style={{ padding: '6px 12px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--primary)' }}></div>
                {club}
              </span>
            ))}
          </div>
          <div style={{ marginTop: '24px' }}>
            <h4 className="meta-text" style={{ marginBottom: '8px', fontSize: '11px', textTransform: 'uppercase' }}>Leadership Roles</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(profile.roles?.length > 0 ? profile.roles : ['House Prefect', 'Library Assistant']).map(role => (
                <div key={role} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle size={12} color="var(--primary)" />
                  <span className="body-text" style={{ fontSize: '13px' }}>{role}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileView
