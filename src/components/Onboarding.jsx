import React, { useState } from 'react'

const HOUSES = [
  'Patshaw', 'Geturo', 'Ngala', 'Gikubu', 'RoundSquare', 
  'Kibaki', 'Njonjo', 'Kirkley', 'Shell', 'Chaka', 'Pele', 'Muriuki'
]

const STREAMS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']

const CLUBS = [
  'School Band', 'Science Club', 'ICT Club', 'Drama Club', 'Choir', 
  'St. John Ambulance', 'Scouts', 'Red Cross', 'Journalism Club', 
  'Chess Club', 'Art Club', 'Environment Club', 'Wildlife Club', 
  'French Club', 'Debate Club', 'CU (Christian Union)', 'YCS', 'Muslim Association'
]

const ROLES = [
  'School Captain', 'Deputy School Captain', 'House Captain', 'House Prefect', 
  'Games Captain', 'Entertainment Prefect', 'Library Prefect', 'Dining Hall Prefect',
  'Academic Prefect', 'Dormitory Prefect', 'Club Chairman', 'Club Secretary'
]

function Onboarding({ onComplete, onSwitchToLogin }) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    userType: 'student', // student or alumnus
    house: '',
    stream: '',
    clubs: [],
    roles: [],
    yearJoined: '',
    yearLeft: '',
    profession: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const toggleSelection = (field, item) => {
    setFormData(prev => {
      const current = prev[field]
      const updated = current.includes(item) 
        ? current.filter(i => i !== item)
        : [...current, item]
      return { ...prev, [field]: updated }
    })
  }

  const nextStep = () => setStep(s => s + 1)
  const prevStep = () => setStep(s => s - 1)

  const handleSubmit = (e) => {
    e.preventDefault()
    onComplete(formData)
  }

  return (
    <div className="onboarding-page animate-fade-in" style={{ padding: '40px 20px', maxWidth: '650px', margin: '0 auto' }}>
      <div className="glass" style={{ padding: 'clamp(20px, 8vw, 56px)' }}>
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ 
                height: '5px', 
                flex: 1, 
                borderRadius: '3px',
                background: i <= step ? (i === step ? 'var(--primary)' : 'var(--secondary)') : 'var(--glass-border)',
                transition: 'var(--transition)'
              }}></div>
            ))}
          </div>
          <h2 className="premium-font" style={{ fontSize: 'clamp(1.5rem, 6vw, 2.2rem)', fontWeight: 700, marginBottom: '8px' }}>
            {step === 1 && "Create Your Identity"}
            {step === 2 && "The Starehe Legacy"}
            {step === 3 && "Interests & Leadership"}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            {step === 1 && "Tell us who you are."}
            {step === 2 && "Select your house and stream."}
            {step === 3 && "Define your Starehe journey."}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="animate-fade-in">
              <div className="input-group">
                <label className="input-label">Full Name</label>
                <input required name="name" value={formData.name} onChange={handleChange} placeholder="e.g. John Doe" />
              </div>
              <div className="input-group">
                <label className="input-label">Email Address</label>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@starehe.ac.ke" />
              </div>
              <div className="input-group">
                <label className="input-label">Password</label>
                <input required type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" />
              </div>
              <div className="input-group">
                <label className="input-label">Account Type</label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    type="button"
                    className={`btn ${formData.userType === 'student' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ flex: 1 }}
                    onClick={() => setFormData(p => ({ ...p, userType: 'student' }))}
                  >Student</button>
                  <button 
                    type="button"
                    className={`btn ${formData.userType === 'alumnus' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ flex: 1 }}
                    onClick={() => setFormData(p => ({ ...p, userType: 'alumnus' }))}
                  >Alumnus</button>
                </div>
              </div>
              {formData.userType === 'alumnus' && (
                <div className="input-group animate-fade-in">
                  <label className="input-label">Current Profession</label>
                  <input name="profession" value={formData.profession} onChange={handleChange} placeholder="e.g. Software Engineer" />
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in">
              <div className="input-group">
                <label className="input-label">House</label>
                <select required name="house" value={formData.house} onChange={handleChange}>
                  <option value="">Select House</option>
                  {HOUSES.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Stream</label>
                <select required name="stream" value={formData.stream} onChange={handleChange}>
                  <option value="">Select Stream</option>
                  {STREAMS.map(s => <option key={s} value={s}>Stream {s}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <div className="input-group" style={{ flex: '1 1 120px' }}>
                  <label className="input-label">Year Joined</label>
                  <input type="number" name="yearJoined" value={formData.yearJoined} onChange={handleChange} placeholder="2020" />
                </div>
                <div className="input-group" style={{ flex: '1 1 120px' }}>
                  <label className="input-label">{formData.userType === 'alumnus' ? 'Year Left' : 'Expected Completion'}</label>
                  <input type="number" name="yearLeft" value={formData.yearLeft} onChange={handleChange} placeholder="2024" />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in">
              <div className="input-group">
                <label className="input-label">Clubs & Societies</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', maxHeight: '180px', overflowY: 'auto', padding: '12px', border: '1px solid var(--glass-border)', borderRadius: '12px', background: 'var(--bg-main)' }}>
                  {CLUBS.map(c => (
                    <button 
                      key={c}
                      type="button"
                      className={`btn ${formData.clubs.includes(c) ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                      onClick={() => toggleSelection('clubs', c)}
                    >{c}</button>
                  ))}
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">Leadership Roles</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', maxHeight: '180px', overflowY: 'auto', padding: '12px', border: '1px solid var(--glass-border)', borderRadius: '12px', background: 'var(--bg-main)' }}>
                  {ROLES.map(r => (
                    <button 
                      key={r}
                      type="button"
                      className={`btn ${formData.roles.includes(r) ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                      onClick={() => toggleSelection('roles', r)}
                    >{r}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px', marginTop: '40px' }}>
            {step > 1 && (
              <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={prevStep}>Back</button>
            )}
            {step < 3 ? (
              <button type="button" className="btn btn-primary" style={{ flex: 1 }} onClick={nextStep}>Next</button>
            ) : (
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Finish</button>
            )}
          </div>
          
          {step === 1 && (
            <p style={{ marginTop: '32px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Already have an account? <span 
                style={{ color: 'var(--secondary)', cursor: 'pointer', fontWeight: 600 }}
                onClick={onSwitchToLogin}
              >Sign In</span>
            </p>
          )}
        </form>
      </div>
    </div>
  )
}

export default Onboarding
