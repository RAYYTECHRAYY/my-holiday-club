import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => {
      if (form.username === 'admin' && form.password === 'mhc@2024') {
        onLogin();
      } else {
        setError('Invalid credentials. Use admin / mhc@2024');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a1628 0%, #0077C8 50%, #003d6b 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px', position: 'relative', overflow: 'hidden'
    }}>
      {[...Array(5)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute', borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.06)',
          width: `${(i + 1) * 200}px`, height: `${(i + 1) * 200}px`,
          top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          pointerEvents: 'none'
        }} />
      ))}

      <div style={{
        background: 'white', borderRadius: '24px', padding: '48px',
        width: '100%', maxWidth: '420px',
        boxShadow: '0 30px 80px rgba(0,0,0,0.3)',
        position: 'relative', zIndex: 1,
        animation: 'loginIn 0.5s ease'
      }}>
        <style>{`@keyframes loginIn { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }`}</style>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '64px', height: '64px', margin: '0 auto 16px',
            background: 'linear-gradient(135deg, #0077C8, #005a96)',
            borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <svg width="32" height="32" viewBox="0 0 100 100">
              <polygon points="10,85 60,10 85,85" fill="white"/>
              <g transform="translate(18,48) rotate(-30)" fill="#0077C8">
                <ellipse cx="18" cy="8" rx="15" ry="5"/>
                <polygon points="3,8 3,5 -3,6.5"/>
              </g>
            </svg>
          </div>
          <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.3rem', fontWeight: 700, color: '#1a1a2e' }}>
            My Holiday Club
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.85rem', marginTop: '4px' }}>Admin Panel</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input className="form-control" value={form.username} onChange={e => setForm(p => ({ ...p, username: e.target.value }))} placeholder="Enter username" required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-control" type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} placeholder="Enter password" required />
          </div>

          {error && (
            <div style={{ background: '#fee2e2', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px' }}>
              ⚠️ {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '13px', fontSize: '0.95rem', borderRadius: '10px' }} disabled={loading}>
            {loading ? 'Authenticating...' : '🔐 Login to Admin Panel'}
          </button>
        </form>

        <div style={{ marginTop: '20px', padding: '14px', background: '#f8fafc', borderRadius: '10px', textAlign: 'center' }}>
          <p style={{ color: '#6b7280', fontSize: '0.8rem' }}>
            Demo: <strong>admin</strong> / <strong>mhc@2024</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
