import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api';

const statusColor = { active:'#10b981', pending:'#f0a500', suspended:'#ef4444' };
const payStatusColor = { confirmed:'#10b981', pending:'#f0a500', rejected:'#ef4444' };

const MemberDashboard = ({ onLogout }) => {
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('mhc_token');
    if (!token) { navigate('/members/login'); return; }
    api.get('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => { setMember(r.data.member); setLoading(false); })
      .catch(() => { localStorage.removeItem('mhc_token'); navigate('/members/login'); });
  }, []);

  const logout = () => {
    localStorage.removeItem('mhc_token');
    localStorage.removeItem('mhc_member');
    if (onLogout) onLogout();
    navigate('/');
  };

  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ width:'48px', height:'48px', border:'4px solid #e8f4ff', borderTopColor:'#0077C8', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 14px' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <p style={{ color:'#6b7280' }}>Loading your dashboard...</p>
      </div>
    </div>
  );

  const payments = member?.payments || [];
  const latestPayment = payments[payments.length - 1];

  return (
    <div style={{ minHeight:'100vh', background:'#f5f7fa', paddingTop:'90px', paddingBottom:'60px' }}>
      <style>{`
        .dash-card { background:white; border-radius:20px; padding:28px; box-shadow:0 4px 20px rgba(0,0,0,0.06); margin-bottom:20px; }
        .pay-row { padding:16px; border-radius:12px; border:1px solid #f1f5f9; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; }
        .pay-row:hover { background:#f8faff; }
        @media(max-width:768px) { .dash-grid { grid-template-columns:1fr !important; } }
      `}</style>

      <div className="container">
        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'28px', flexWrap:'wrap', gap:'12px' }}>
          <div>
            <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(1.6rem,3vw,2.2rem)', color:'#1a1a2e', margin:'0 0 4px' }}>Welcome back, {member?.fullName?.split(' ')[0]}! 👋</h1>
            <p style={{ color:'#6b7280', margin:0, fontSize:'0.95rem' }}>Member ID: <strong style={{ color:'#0077C8' }}>{member?.memberId}</strong></p>
          </div>
          <button onClick={logout} style={{ padding:'10px 22px', background:'white', color:'#ef4444', border:'2px solid #ef4444', borderRadius:'50px', fontWeight:700, cursor:'pointer', fontSize:'0.9rem', fontFamily:"'Inter',sans-serif" }}>
            Sign Out
          </button>
        </div>

        <div className="dash-grid" style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:'20px', alignItems:'start' }}>
          {/* Left column */}
          <div>
            {/* Status card */}
            <div className="dash-card">
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'start', flexWrap:'wrap', gap:'12px', marginBottom:'20px' }}>
                <div>
                  <div style={{ fontSize:'0.8rem', color:'#6b7280', fontWeight:600, letterSpacing:'1px', textTransform:'uppercase', marginBottom:'6px' }}>Membership Status</div>
                  <span style={{ display:'inline-block', padding:'5px 16px', background:`${statusColor[member?.status]||'#6b7280'}18`, color:statusColor[member?.status]||'#6b7280', borderRadius:'20px', fontWeight:700, fontSize:'0.9rem' }}>
                    {member?.status === 'active' ? '✅ Active' : member?.status === 'pending' ? '⏳ Pending Activation' : '🚫 Suspended'}
                  </span>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontSize:'0.8rem', color:'#6b7280', marginBottom:'4px' }}>Member Since</div>
                  <div style={{ fontWeight:700, color:'#1a1a2e' }}>{new Date(member?.joinDate).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}</div>
                </div>
              </div>
              {member?.status === 'pending' && (
                <div style={{ background:'#fffbeb', border:'1px solid #fde68a', borderRadius:'12px', padding:'14px 16px', color:'#92400e', fontSize:'0.88rem', lineHeight:1.6 }}>
                  ⏳ Your membership is pending payment confirmation. If you haven't selected a package yet, <Link to="/members/select-package" style={{ color:'#0077C8', fontWeight:700 }}>choose one here</Link>. After payment, admin will activate your account within 24 hours.
                </div>
              )}
            </div>

            {/* Package card */}
            <div className="dash-card">
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.2rem', color:'#1a1a2e', marginBottom:'16px' }}>Your Package</h2>
              {member?.packageName ? (
                <div style={{ display:'flex', alignItems:'center', gap:'16px', padding:'16px', background:'linear-gradient(135deg,#e8f4ff,#dbeeff)', borderRadius:'14px', border:'1px solid rgba(0,119,200,0.15)' }}>
                  <div style={{ width:'48px', height:'48px', background:'linear-gradient(135deg,#0077C8,#005a96)', borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem', flexShrink:0 }}>📦</div>
                  <div>
                    <div style={{ fontWeight:700, fontSize:'1.1rem', color:'#1a1a2e' }}>{member.packageName}</div>
                    <div style={{ color:'#6b7280', fontSize:'0.85rem' }}>Payment status: <span style={{ color:payStatusColor[latestPayment?.status]||'#6b7280', fontWeight:600 }}>{latestPayment?.status || 'pending'}</span></div>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign:'center', padding:'24px', background:'#f8faff', borderRadius:'14px', border:'2px dashed #e8f4ff' }}>
                  <div style={{ fontSize:'2.5rem', marginBottom:'10px' }}>📦</div>
                  <p style={{ color:'#6b7280', marginBottom:'16px' }}>You haven't selected a membership package yet.</p>
                  <Link to="/members/select-package" style={{ display:'inline-block', padding:'11px 28px', background:'linear-gradient(135deg,#0077C8,#005a96)', color:'white', borderRadius:'50px', textDecoration:'none', fontWeight:700, fontSize:'0.95rem' }}>
                    Choose a Package →
                  </Link>
                </div>
              )}
            </div>

            {/* Payment history */}
            <div className="dash-card">
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.2rem', color:'#1a1a2e', marginBottom:'16px' }}>Payment History</h2>
              {payments.length === 0 ? (
                <div style={{ textAlign:'center', padding:'30px', color:'#9ca3af' }}>
                  <div style={{ fontSize:'2.5rem', marginBottom:'10px' }}>💳</div>
                  <p>No payments yet.</p>
                </div>
              ) : (
                payments.map(p => (
                  <div key={p.id} className="pay-row">
                    <div>
                      <div style={{ fontWeight:700, color:'#1a1a2e', fontSize:'0.95rem' }}>{p.packageName}</div>
                      <div style={{ color:'#6b7280', fontSize:'0.82rem' }}>Ref: {p.referenceNumber || '—'} · {new Date(p.createdAt).toLocaleDateString('en-IN')}</div>
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <div style={{ fontWeight:800, color:'#0077C8', fontSize:'1.05rem' }}>₹{Number(p.amount).toLocaleString()}</div>
                      <span style={{ display:'inline-block', padding:'3px 10px', background:`${payStatusColor[p.status]||'#6b7280'}18`, color:payStatusColor[p.status]||'#6b7280', borderRadius:'20px', fontSize:'0.75rem', fontWeight:700 }}>{p.status}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right column - profile card */}
          <div>
            <div className="dash-card">
              <div style={{ textAlign:'center', marginBottom:'20px' }}>
                <div style={{ width:'72px', height:'72px', background:'linear-gradient(135deg,#0077C8,#005a96)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2rem', margin:'0 auto 12px', color:'white', fontWeight:700 }}>
                  {member?.fullName?.charAt(0) || '?'}
                </div>
                <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.15rem', color:'#1a1a2e', margin:'0 0 4px' }}>{member?.fullName}</h3>
                <p style={{ color:'#0077C8', fontSize:'0.85rem', fontWeight:600, margin:0 }}>{member?.memberId}</p>
              </div>
              <div style={{ borderTop:'1px solid #f1f5f9', paddingTop:'16px' }}>
                {[
                  { label:'Email', value:member?.email },
                  { label:'Phone', value:member?.phone || '—' },
                  { label:'City', value:member?.city || '—' },
                  { label:'State', value:member?.state || '—' },
                ].map(({label,value}) => (
                  <div key={label} style={{ display:'flex', justifyContent:'space-between', marginBottom:'12px', fontSize:'0.88rem' }}>
                    <span style={{ color:'#6b7280', fontWeight:600 }}>{label}</span>
                    <span style={{ color:'#1a1a2e', fontWeight:500, textAlign:'right', maxWidth:'60%', wordBreak:'break-all' }}>{value}</span>
                  </div>
                ))}
              </div>
              {!member?.packageName && (
                <Link to="/members/select-package" style={{ display:'block', marginTop:'16px', padding:'12px', background:'linear-gradient(135deg,#f0a500,#d4920a)', color:'white', borderRadius:'50px', textDecoration:'none', fontWeight:700, textAlign:'center', fontSize:'0.95rem' }}>
                  ⭐ Select Package
                </Link>
              )}
              <Link to="/" style={{ display:'block', marginTop:'10px', padding:'12px', background:'#f1f5f9', color:'#374151', borderRadius:'50px', textDecoration:'none', fontWeight:600, textAlign:'center', fontSize:'0.9rem' }}>
                🏠 Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MemberDashboard;
