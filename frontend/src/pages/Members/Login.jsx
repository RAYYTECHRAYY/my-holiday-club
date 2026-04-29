import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api';

const MemberLogin = ({ onLogin }) => {
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ email:'', password:'', fullName:'', phone:'' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const endpoint = tab === 'login' ? '/api/auth/login' : '/api/auth/signup';
      const payload = tab === 'login'
        ? { email: form.email, password: form.password }
        : { email: form.email, password: form.password, fullName: form.fullName, phone: form.phone };
      const res = await api.post(endpoint, payload);
      if (res.data.success) {
        localStorage.setItem('mhc_token', res.data.token);
        localStorage.setItem('mhc_member', JSON.stringify(res.data.member));
        if (onLogin) onLogin(res.data.member);
        if (tab === 'signup') {
          navigate('/members/select-package');
        } else {
          navigate('/members/dashboard');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', position:'relative', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px', paddingTop:'100px', overflow:'hidden' }}>
      {/* Travel background photo */}
      <div style={{ position:'absolute', inset:0, backgroundImage:"url('https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1920&q=80')", backgroundSize:'cover', backgroundPosition:'center', backgroundRepeat:'no-repeat' }} />
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg, rgba(5,15,50,0.78) 0%, rgba(0,80,160,0.72) 50%, rgba(5,15,50,0.78) 100%)' }} />
      <style>{`
        .ml-input { width:100%; padding:13px 16px; border:2px solid #e2e8f0; border-radius:12px; font-size:16px; font-family:'Inter',sans-serif; outline:none; transition:border-color 0.2s,box-shadow 0.2s; background:#fafafa; box-sizing:border-box; }
        .ml-input:focus { border-color:#0077C8; background:white; box-shadow:0 0 0 3px rgba(0,119,200,0.1); }
        .ml-tab { flex:1; padding:12px; border:none; background:transparent; cursor:pointer; font-weight:700; font-size:0.95rem; font-family:'Inter',sans-serif; transition:all 0.25s; border-bottom:3px solid transparent; color:#6b7280; }
        .ml-tab.active { color:#0077C8; border-bottom-color:#0077C8; }
      `}</style>
      <div style={{ background:'white', borderRadius:'24px', maxWidth:'440px', width:'100%', boxShadow:'0 30px 80px rgba(0,0,0,0.3)', overflow:'hidden' }}>
        <div style={{ background:'linear-gradient(135deg,#0077C8,#005a96)', padding:'32px 32px 24px', textAlign:'center' }}>
          <Link to="/"><img src="/logo.png" alt="MHC" style={{ width:'56px', height:'56px', borderRadius:'12px', objectFit:'cover', border:'2px solid rgba(255,255,255,0.3)', marginBottom:'14px', display:'block', margin:'0 auto 14px' }} /></Link>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.6rem', color:'white', margin:'0 0 6px' }}>My Holiday Club</h1>
          <p style={{ color:'rgba(255,255,255,0.75)', fontSize:'0.9rem', margin:0 }}>Member Portal</p>
        </div>
        <div style={{ display:'flex', borderBottom:'2px solid #f1f5f9' }}>
          <button className={'ml-tab'+(tab==='login'?' active':'')} onClick={()=>{setTab('login');setError('');}}>Sign In</button>
          <button className={'ml-tab'+(tab==='signup'?' active':'')} onClick={()=>{setTab('signup');setError('');}}>Create Account</button>
        </div>
        <div style={{ padding:'28px 32px 32px' }}>
          <form onSubmit={submit}>
            {tab==='signup' && <>
              <div style={{ marginBottom:'16px' }}>
                <label style={{ display:'block', fontWeight:700, fontSize:'0.85rem', color:'#374151', marginBottom:'6px' }}>Full Name *</label>
                <input className="ml-input" name="fullName" placeholder="Enter your full name" value={form.fullName} onChange={handle} required />
              </div>
              <div style={{ marginBottom:'16px' }}>
                <label style={{ display:'block', fontWeight:700, fontSize:'0.85rem', color:'#374151', marginBottom:'6px' }}>Phone Number</label>
                <input className="ml-input" name="phone" type="tel" placeholder="10-digit mobile number" value={form.phone} onChange={handle} />
              </div>
            </>}
            <div style={{ marginBottom:'16px' }}>
              <label style={{ display:'block', fontWeight:700, fontSize:'0.85rem', color:'#374151', marginBottom:'6px' }}>Email Address *</label>
              <input className="ml-input" name="email" type="email" placeholder="Enter your email" value={form.email} onChange={handle} required />
            </div>
            <div style={{ marginBottom:'20px' }}>
              <label style={{ display:'block', fontWeight:700, fontSize:'0.85rem', color:'#374151', marginBottom:'6px' }}>Password *</label>
              <input className="ml-input" name="password" type="password" placeholder={tab==='login'?'Enter your password':'Create a password (min 6 chars)'} value={form.password} onChange={handle} required minLength={6} />
            </div>
            {error && <div style={{ background:'#fef2f2', border:'1px solid #fecaca', borderRadius:'10px', padding:'12px 14px', color:'#dc2626', fontSize:'0.88rem', marginBottom:'16px' }}>⚠️ {error}</div>}
            <button type="submit" disabled={loading} style={{ width:'100%', padding:'14px', background:loading?'#94a3b8':'linear-gradient(135deg,#0077C8,#005a96)', color:'white', border:'none', borderRadius:'50px', fontWeight:700, fontSize:'1rem', cursor:loading?'not-allowed':'pointer', fontFamily:"'Inter',sans-serif" }}>
              {loading ? '⏳ Please wait...' : tab==='login' ? '🔐 Sign In to Portal' : '✨ Create My Account'}
            </button>
            {tab==='signup' && <p style={{ textAlign:'center', marginTop:'12px', color:'#6b7280', fontSize:'0.82rem', lineHeight:1.6 }}>After signing up, select your membership package to complete enrollment.</p>}
          </form>
          <div style={{ marginTop:'18px', textAlign:'center' }}>
            <Link to="/" style={{ color:'#0077C8', fontSize:'0.88rem', textDecoration:'none' }}>← Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MemberLogin;
