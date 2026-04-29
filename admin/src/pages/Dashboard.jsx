import React, { useState, useEffect, useCallback } from 'react';
import api from '../api';

const Dashboard = ({ socket }) => {
  const [stats, setStats]           = useState({ totalMembers:0, totalInquiries:0, totalContacts:0, totalDestinations:0, newMembers:0, newInquiries:0 });
  const [recentMembers, setRM]      = useState([]);
  const [recentInquiries, setRI]    = useState([]);
  const [loading, setLoading]       = useState(true);
  const [pulse, setPulse]           = useState(null); // which stat card to flash

  const fetchData = useCallback(async () => {
    try {
      const [sRes, mRes, iRes] = await Promise.all([
        api.get('/api/stats'), api.get('/api/members'), api.get('/api/inquiries')
      ]);
      setStats(sRes.data.data);
      setRM(mRes.data.data.slice(-5).reverse());
      setRI(iRes.data.data.slice(-5).reverse());
    } catch (_) {}
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── Socket live updates ─────────────────────────────────────────
  useEffect(() => {
    if (!socket) return;

    const flash = (key) => { setPulse(key); setTimeout(() => setPulse(null), 1500); };

    const onStats   = (s)   => { setStats(s); };
    const onMember  = (m)   => { setRM(prev => [m, ...prev].slice(0,5)); flash('members'); };
    const onInquiry = (inq) => { setRI(prev => [inq, ...prev].slice(0,5)); flash('inquiries'); };

    socket.on('stats_update',  onStats);
    socket.on('new_member',    onMember);
    socket.on('new_inquiry',   onInquiry);
    return () => {
      socket.off('stats_update', onStats);
      socket.off('new_member',   onMember);
      socket.off('new_inquiry',  onInquiry);
    };
  }, [socket]);

  const statCards = [
    { key:'members',      label:'Total Members',      value:stats.totalMembers,      icon:'⭐', color:'#0077C8', bg:'#e8f4ff' },
    { key:'inquiries',    label:'New Inquiries',       value:stats.newInquiries,      icon:'🏖️', color:'#f0a500', bg:'#fef3c7' },
    { key:'contacts',     label:'Contact Messages',    value:stats.totalContacts,     icon:'📨', color:'#10b981', bg:'#d1fae5' },
    { key:'destinations', label:'Total Destinations',  value:stats.totalDestinations, icon:'🗺️', color:'#8b5cf6', bg:'#ede9fe' },
    { key:'pending',      label:'Pending Members',     value:stats.newMembers,        icon:'⏳', color:'#ef4444', bg:'#fee2e2' },
    { key:'total_inq',   label:'Total Inquiries',     value:stats.totalInquiries,    icon:'📋', color:'#6b7280', bg:'#f3f4f6' },
  ];

  return (
    <div>
      <style>{`
        @keyframes statPulse {
          0%   { transform:scale(1);    box-shadow:0 2px 12px rgba(0,0,0,0.06); }
          30%  { transform:scale(1.04); box-shadow:0 8px 28px rgba(0,119,200,0.22); }
          100% { transform:scale(1);    box-shadow:0 2px 12px rgba(0,0,0,0.06); }
        }
      `}</style>

      {loading ? (
        <div style={{ textAlign:'center', padding:'80px' }}>
          <div style={{ width:'40px', height:'40px', border:'3px solid #e8f4ff', borderTopColor:'#0077C8', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto' }}/>
          <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="stat-grid">
            {statCards.map((s) => (
              <div className="stat-card" key={s.key} style={{
                animation: pulse===s.key ? 'statPulse 0.6s ease' : '',
              }}>
                <div className="stat-icon" style={{ background:s.bg }}>{s.icon}</div>
                <div>
                  <div className="stat-num" style={{ color:s.color }}>{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent tables */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px', marginTop:'24px' }}>

            {/* Recent Members */}
            <div className="card">
              <h3 style={{ fontWeight:700, marginBottom:'16px', fontSize:'1rem' }}>⭐ Recent Members</h3>
              {recentMembers.length === 0
                ? <p style={{ color:'#9ca3af', textAlign:'center', padding:'20px' }}>No members yet</p>
                : recentMembers.map((m, i) => (
                  <div key={m.id} style={{
                    display:'flex', alignItems:'center', gap:'12px', padding:'10px 0',
                    borderBottom: i < recentMembers.length-1 ? '1px solid #f1f5f9' : '',
                    animation: i===0 && pulse==='members' ? 'statPulse 0.6s ease' : '',
                  }}>
                    <div style={{ width:'36px', height:'36px', background:'linear-gradient(135deg,#0077C8,#0095f0)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:800, fontSize:'0.9rem', flexShrink:0 }}>
                      {(m.fullName||'?')[0].toUpperCase()}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontWeight:700, fontSize:'0.92rem', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{m.fullName}</div>
                      <div style={{ fontSize:'0.78rem', color:'#6b7280' }}>{m.phone} · {m.memberType||'starter'}</div>
                    </div>
                    <span style={{
                      fontSize:'0.75rem', fontWeight:700, padding:'3px 10px', borderRadius:'50px',
                      background: m.status==='active'?'#d1fae5':m.status==='inactive'?'#fee2e2':'#fef3c7',
                      color: m.status==='active'?'#065f46':m.status==='inactive'?'#991b1b':'#92400e',
                    }}>{m.status}</span>
                  </div>
                ))
              }
            </div>

            {/* Recent Inquiries */}
            <div className="card">
              <h3 style={{ fontWeight:700, marginBottom:'16px', fontSize:'1rem' }}>🏖️ Recent Inquiries</h3>
              {recentInquiries.length === 0
                ? <p style={{ color:'#9ca3af', textAlign:'center', padding:'20px' }}>No inquiries yet</p>
                : recentInquiries.map((inq, i) => (
                  <div key={inq.id} style={{
                    display:'flex', alignItems:'center', gap:'12px', padding:'10px 0',
                    borderBottom: i < recentInquiries.length-1 ? '1px solid #f1f5f9' : '',
                    animation: i===0 && pulse==='inquiries' ? 'statPulse 0.6s ease' : '',
                  }}>
                    <div style={{ width:'36px', height:'36px', background:'linear-gradient(135deg,#f0a500,#ff8c00)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem', flexShrink:0 }}>📍</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontWeight:700, fontSize:'0.92rem', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{inq.fullName}</div>
                      <div style={{ fontSize:'0.78rem', color:'#6b7280' }}>{inq.destination||'—'} · {inq.checkIn||'—'}</div>
                    </div>
                    <span style={{
                      fontSize:'0.75rem', fontWeight:700, padding:'3px 10px', borderRadius:'50px',
                      background: inq.status==='new'?'#fef3c7':inq.status==='contacted'?'#d1fae5':'#f3f4f6',
                      color: inq.status==='new'?'#92400e':inq.status==='contacted'?'#065f46':'#6b7280',
                    }}>{inq.status}</span>
                  </div>
                ))
              }
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default Dashboard;
