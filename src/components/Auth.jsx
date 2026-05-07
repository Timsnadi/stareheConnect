import React, { useState } from 'react'
import axios from 'axios'
import Onboarding from './Onboarding'

// In production, this would be your Render URL
const API_URL = 'http://localhost:5000/api'

function Auth({ onComplete }) {
  const [mode, setMode] = useState('login')
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await axios.post(`${API_URL}/auth/login`, loginData)
      onComplete(res.data.user)
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed. Check your connection.')
    }
  }

  const handleSignupComplete = async (formData) => {
    try {
      const res = await axios.post(`${API_URL}/auth/register`, formData)
      onComplete(res.data.user)
    } catch (err) {
      alert(err.response?.data?.msg || 'Registration failed.')
    }
  }

  return (
    <div className="auth-page animate-fade-in" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      {mode === 'login' ? (
        <div className="glass" style={{ padding: '40px', maxWidth: '450px', width: '100%' }}>
          <h2 className="premium-font" style={{ fontSize: '2rem', marginBottom: '8px' }}>Sign In</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '0.9rem' }}>Welcome back to StareheConnect.</p>
          
          {error && <p style={{ color: 'var(--secondary)', marginBottom: '20px', fontSize: '0.85rem' }}>{error}</p>}

          <form onSubmit={handleLoginSubmit}>
            <div className="input-group">
              <label className="input-label">Email</label>
              <input 
                required 
                type="email" 
                value={loginData.email}
                onChange={(e) => setLoginData({...loginData, email: e.target.value})}
              />
            </div>
            <div className="input-group">
              <label className="input-label">Password</label>
              <input 
                required 
                type="password" 
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }}>
              Sign In
            </button>
          </form>

          <p style={{ marginTop: '32px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            New user? <span 
              style={{ color: 'var(--secondary)', cursor: 'pointer', fontWeight: 600 }}
              onClick={() => setMode('signup')}
            >Create Account</span>
          </p>
        </div>
      ) : (
        <div style={{ width: '100%' }}>
          <Onboarding onComplete={handleSignupComplete} onSwitchToLogin={() => setMode('login')} />
        </div>
      )}
    </div>
  )
}

export default Auth
