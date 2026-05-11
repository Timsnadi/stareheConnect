import React, { useState } from 'react'
import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

function Auth({ onComplete }) {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', 
    role: 'student', house: 'Patshaw', stream: 'A'
  })

  const HOUSES = [
    'Patshaw', 'Geturo', 'Ngala', 'Gikubu', 'RoundSquare', 
    'Kibaki', 'Njonjo', 'Kirkley', 'Shell', 'Chaka', 'Pele', 'Muriuki'
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register'
      // Correctly map role to userType for the backend register route
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : { ...formData, userType: formData.role };
        
      const res = await axios.post(`${API_URL}${endpoint}`, payload)
      onComplete(res.data)
    } catch (err) {
      setError(err.response?.data?.msg || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container animate-fade-in" style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '20px',
      background: 'var(--bg-main)'
    }}>
      <div className="card-elevated" style={{ width: '100%', maxWidth: '440px', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div className="logo-font" style={{ fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '8px' }}>🛡️ StareheConnect</div>
          <h1 className="page-title" style={{ fontSize: '24px', marginBottom: '8px' }}>
            {isLogin ? 'Sign In' : 'Create Account'}
          </h1>
          <p className="meta-text">
            {isLogin ? 'Access the mentorship portal' : 'Join the Starehian network'}
          </p>
        </div>

        {error && (
          <div style={{ padding: '12px', background: 'rgba(237, 73, 86, 0.1)', color: 'var(--secondary)', borderRadius: '8px', fontSize: '13px', marginBottom: '24px', textAlign: 'center', border: '1px solid rgba(237, 73, 86, 0.2)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="input-group">
              <label className="meta-text" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Full Name</label>
              <input 
                type="text" 
                placeholder="John Doe" 
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
          )}

          <div className="input-group">
            <label className="meta-text" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>School Email</label>
            <input 
              type="email" 
              placeholder="name@starehe.ac.ke" 
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="input-group" style={{ marginBottom: '24px' }}>
            <label className="meta-text" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          {!isLogin && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div className="input-group">
                <label className="meta-text" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Role</label>
                <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
                  <option value="student">Student</option>
                  <option value="alumnus">Alumnus</option>
                </select>
              </div>
              <div className="input-group">
                <label className="meta-text" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>House</label>
                <select value={formData.house} onChange={(e) => setFormData({...formData, house: e.target.value})}>
                  {HOUSES.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
            </div>
          )}

          <button className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: '15px' }} disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Register')}
          </button>
        </form>

        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <p className="meta-text" style={{ fontSize: '14px' }}>
            {isLogin ? "Don't have an account?" : "Already a member?"} 
            <span 
              onClick={() => setIsLogin(!isLogin)} 
              style={{ color: 'var(--primary)', fontWeight: 700, marginLeft: '8px', cursor: 'pointer' }}
            >
              {isLogin ? 'Create Account' : 'Sign In'}
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Auth
