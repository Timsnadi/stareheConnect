import React, { useState } from 'react'
import axios from 'axios'
import { Save, X, User, Briefcase, Info, MapPin, Award, CheckCircle } from 'lucide-react'

const API_URL = 'http://localhost:5000/api'

function ProfileEdit({ user, onComplete, onCancel }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: user.name || '',
    bio: user.bio || '',
    profession: user.profession || '',
    industry: user.industry || '',
    location: user.location || '',
    clubs: user.clubs || [],
    roles: user.roles || []
  })

  const [clubInput, setClubInput] = useState('')
  const [roleInput, setRoleInput] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await axios.put(`${API_URL}/users/${user.id || user._id}`, formData)
      
      const updatedUser = { ...JSON.parse(localStorage.getItem('starehe_user')), user: res.data }
      localStorage.setItem('starehe_user', JSON.stringify(updatedUser))
      
      setSuccess(true)
      setTimeout(() => {
        onComplete(updatedUser)
      }, 1000)
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const addTag = (type, value) => {
    if (!value.trim()) return
    setFormData(prev => ({
      ...prev,
      [type]: [...new Set([...prev[type], value.trim()])]
    }))
    if (type === 'clubs') setClubInput('')
    else setRoleInput('')
  }

  const removeTag = (type, value) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter(item => item !== value)
    }))
  }

  return (
    <div className="profile-edit-container animate-fade-in" style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
      <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Edit Profile</h1>
          <p className="meta-text">Update your professional and community details.</p>
        </div>
        <button className="btn-secondary" onClick={onCancel}><X size={18} /></button>
      </header>

      {success && (
        <div className="badge-primary" style={{ width: '100%', padding: '16px', marginBottom: '24px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <CheckCircle size={20} /> Changes saved successfully!
        </div>
      )}

      {error && <div className="badge-secondary" style={{ width: '100%', padding: '16px', marginBottom: '24px', borderRadius: '12px' }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div className="card-elevated" style={{ padding: '32px', gridColumn: '1 / -1' }}>
          <h3 className="section-heading" style={{ marginBottom: '20px', fontSize: '14px' }}>Basic Information</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="input-group">
              <label className="meta-text" style={{ display: 'block', marginBottom: '8px' }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input style={{ paddingLeft: '40px' }} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
              </div>
            </div>
            <div className="input-group">
              <label className="meta-text" style={{ display: 'block', marginBottom: '8px' }}>Profession / Target Career</label>
              <div style={{ position: 'relative' }}>
                <Briefcase size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input style={{ paddingLeft: '40px' }} value={formData.profession} onChange={(e) => setFormData({...formData, profession: e.target.value})} />
              </div>
            </div>
            <div className="input-group" style={{ gridColumn: '1 / -1' }}>
              <label className="meta-text" style={{ display: 'block', marginBottom: '8px' }}>Bio / Introduction</label>
              <div style={{ position: 'relative' }}>
                <Info size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
                <textarea style={{ paddingLeft: '40px', minHeight: '80px', resize: 'vertical' }} value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} />
              </div>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px' }}>
            <Award size={18} color="var(--brand-green)" />
            <h3 className="section-heading" style={{ fontSize: '14px' }}>Clubs & Societies</h3>
          </div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <input placeholder="Add club..." value={clubInput} onChange={(e) => setClubInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag('clubs', clubInput))} />
            <button type="button" className="btn-secondary" style={{ padding: '8px 12px' }} onClick={() => addTag('clubs', clubInput)}>Add</button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {formData.clubs.map(club => (
              <span key={club} className="badge-house" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px' }}>
                {club} <X size={12} style={{ cursor: 'pointer' }} onClick={() => removeTag('clubs', club)} />
              </span>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px' }}>
            <Award size={18} color="var(--accent)" />
            <h3 className="section-heading" style={{ fontSize: '14px' }}>Leadership Roles</h3>
          </div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <input placeholder="Add role..." value={roleInput} onChange={(e) => setRoleInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag('roles', roleInput))} />
            <button type="button" className="btn-secondary" style={{ padding: '8px 12px' }} onClick={() => addTag('roles', roleInput)}>Add</button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {formData.roles.map(role => (
              <span key={role} className="badge-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px' }}>
                {role} <X size={12} style={{ cursor: 'pointer' }} onClick={() => removeTag('roles', role)} />
              </span>
            ))}
          </div>
        </div>

        <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '16px', marginTop: '12px' }}>
          <button type="submit" className="btn-primary" style={{ flex: 1, padding: '16px' }} disabled={loading}>
            {loading ? 'Saving...' : <><Save size={18} /> Save All Changes</>}
          </button>
          <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  )
}

export default ProfileEdit
