import React, { useState, useEffect } from 'react';
import api from '../api';

const PAY_COLOR = { confirmed:'#10b981', pending:'#f0a500', rejected:'#ef4444' };

const Payments = ({ socket }) => {
  const [payments, setPayments] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState('');

  const showToast = msg => { setToast(msg); setTimeout(()=>setToast(''), 3000); };

  useEffect(() => {
    fetchPayments();
    if (socket) {
      socket.on('new_payment', () => fetchPayments());
      socket.on('payment_updated', () => fetchPayments());
      return () => { socket.off('new_payment'); socket.off('payment_updated'); };
    }
  }, [socket]);

  const fetchPayments = async () => {
    const r = await api.get('/api/payments');
    setPayments(r.data.data || []);
  };

  const updateStatus = async (id, status) => {
    await api.put(`/api/payments/${id}`, { status, confirmedAt: new Date().toISOString() });
    fetchPayments();
    if (selected?.id === id) setSelected(s => ({...s, status}));
    showToast(status === 'confirmed' ? '✅ Payment confirmed — member activated!' : '❌ Payment rejected');
  };

  const filtered = filter === 'all' ? payments : payments.filter(p => p.status === filter);

  const stats = {
    total: payments.length,
    pending: payments.filter(p=>p.status==='pending').length,
    confirmed: payments.filter(p=>p.status==='confirmed').length,
    value: payments.filter(p=>p.status==='confirmed').reduce((s,p)=>s+Number(p.amount||0), 0)
  };

  return (
    <div style={{ padding:'28px' }}>
      {toast && <div style={{ position:'fixed', top:'24px', right:'24px', background:'#1a1a2e', color:'white', padding:'12px 22px', borderRadius:'12px', zIndex:9999, fontWeight:600 }}>{toast}</div>}

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px', flexWrap:'wrap', gap:'12px' }}>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.8rem', color:'#1a1a2e', margin:0 }}>Payments</h1>
        <div style={{ display:'flex', gap:'8px' }}>
          {['all','pending','confirmed','rejected'].map(s=>(
            <button key={s} onClick={()=>setFilter(s)} style={{ padding:'8px 18px', borderRadius:'50px', border:'2px solid', borderColor:filter===s?'#0077C8':'#e2e8f0', background:filter===s?'#0077C8':'white', color:filter===s?'white':'#6b7280', fontWeight:600, cursor:'pointer', fontSize:'0.85rem', textTransform:'capitalize' }}>{s}</button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))', gap:'14px', marginBottom:'24px' }}>
        {[['Total',stats.total,'#0077C8','💳'],['Pending',stats.pending,'#f0a500','⏳'],['Confirmed',stats.confirmed,'#10b981','✅'],['Revenue','₹'+stats.value.toLocaleString(),'#6c63ff','💰']].map(([l,v,c,ic])=>(
          <div key={l} style={{ background:'white', borderRadius:'14px', padding:'18px 20px', boxShadow:'0 2px 10px rgba(0,0,0,0.05)', borderLeft:`4px solid ${c}` }}>
            <div style={{ fontSize:'1.1rem', marginBottom:'4px' }}>{ic}</div>
            <div style={{ fontSize:'1.5rem', fontWeight:800, color:c }}>{v}</div>
            <div style={{ color:'#6b7280', fontSize:'0.82rem', fontWeight:600 }}>{l}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:selected?'1fr 380px':'1fr', gap:'24px', alignItems:'start' }}>
        {/* List */}
        <div style={{ background:'white', borderRadius:'20px', overflow:'hidden', boxShadow:'0 4px 20px rgba(0,0,0,0.06)' }}>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ background:'#f8faff', borderBottom:'2px solid #e8f4ff' }}>
                  {['Member','Package','Amount','Ref. No.','Date','Status','Actions'].map(h=>(
                    <th key={h} style={{ padding:'14px 16px', textAlign:'left', fontSize:'0.78rem', fontWeight:700, color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.5px', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length===0 && <tr><td colSpan={7} style={{ textAlign:'center', padding:'48px', color:'#9ca3af' }}>No payments found</td></tr>}
                {filtered.map(p=>(
                  <tr key={p.id} onClick={()=>setSelected(p)} style={{ borderBottom:'1px solid #f1f5f9', cursor:'pointer', background:selected?.id===p.id?'#f0f8ff':'white', transition:'background 0.15s' }}
                    onMouseEnter={e=>{if(selected?.id!==p.id)e.currentTarget.style.background='#f8faff'}}
                    onMouseLeave={e=>{if(selected?.id!==p.id)e.currentTarget.style.background='white'}}>
                    <td style={{ padding:'14px 16px' }}>
                      <div style={{ fontWeight:700, color:'#1a1a2e', fontSize:'0.9rem' }}>{p.memberName}</div>
                      <div style={{ color:'#6b7280', fontSize:'0.78rem' }}>{p.memberEmail}</div>
                    </td>
                    <td style={{ padding:'14px 16px', fontSize:'0.88rem', color:'#374151' }}>{p.packageName}</td>
                    <td style={{ padding:'14px 16px', fontWeight:800, color:'#0077C8' }}>₹{Number(p.amount).toLocaleString()}</td>
                    <td style={{ padding:'14px 16px', fontSize:'0.82rem', color:'#6b7280', fontFamily:'monospace' }}>{p.referenceNumber||'—'}</td>
                    <td style={{ padding:'14px 16px', fontSize:'0.82rem', color:'#6b7280', whiteSpace:'nowrap' }}>{new Date(p.createdAt).toLocaleDateString('en-IN')}</td>
                    <td style={{ padding:'14px 16px' }}>
                      <span style={{ display:'inline-block', padding:'3px 12px', background:`${PAY_COLOR[p.status]||'#6b7280'}18`, color:PAY_COLOR[p.status]||'#6b7280', borderRadius:'20px', fontSize:'0.78rem', fontWeight:700, textTransform:'capitalize' }}>{p.status}</span>
                    </td>
                    <td style={{ padding:'14px 16px' }}>
                      {p.status==='pending' && (
                        <div style={{ display:'flex', gap:'5px' }} onClick={e=>e.stopPropagation()}>
                          <button onClick={()=>updateStatus(p.id,'confirmed')} style={{ padding:'5px 12px', background:'#f0fdf4', color:'#10b981', border:'none', borderRadius:'20px', fontWeight:700, cursor:'pointer', fontSize:'0.78rem' }}>✅ Confirm</button>
                          <button onClick={()=>updateStatus(p.id,'rejected')} style={{ padding:'5px 12px', background:'#fff1f2', color:'#ef4444', border:'none', borderRadius:'20px', fontWeight:700, cursor:'pointer', fontSize:'0.78rem' }}>❌ Reject</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail panel */}
        {selected && (
          <div style={{ background:'white', borderRadius:'20px', padding:'24px', boxShadow:'0 4px 20px rgba(0,0,0,0.08)', position:'sticky', top:'24px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px' }}>
              <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.15rem', color:'#1a1a2e', margin:0 }}>Payment Detail</h3>
              <button onClick={()=>setSelected(null)} style={{ background:'#f1f5f9', border:'none', borderRadius:'50%', width:'30px', height:'30px', cursor:'pointer' }}>✕</button>
            </div>
            <div style={{ textAlign:'center', marginBottom:'20px', padding:'20px', background:'linear-gradient(135deg,#f0f8ff,#e8f4ff)', borderRadius:'14px' }}>
              <div style={{ fontSize:'2rem', fontWeight:800, color:'#0077C8' }}>₹{Number(selected.amount).toLocaleString()}</div>
              <div style={{ color:'#374151', fontWeight:600, marginTop:'4px' }}>{selected.packageName}</div>
              <span style={{ display:'inline-block', marginTop:'10px', padding:'4px 16px', background:`${PAY_COLOR[selected.status]||'#6b7280'}18`, color:PAY_COLOR[selected.status]||'#6b7280', borderRadius:'20px', fontWeight:700, fontSize:'0.85rem' }}>{selected.status}</span>
            </div>
            {[['Member',selected.memberName],['Email',selected.memberEmail],['Reference',selected.referenceNumber||'—'],['Submitted',new Date(selected.createdAt).toLocaleString('en-IN')],['Note',selected.note||'—']].map(([k,v])=>(
              <div key={k} style={{ display:'flex', justifyContent:'space-between', marginBottom:'12px', fontSize:'0.88rem', gap:'12px' }}>
                <span style={{ color:'#6b7280', fontWeight:600, flexShrink:0 }}>{k}</span>
                <span style={{ color:'#1a1a2e', textAlign:'right', wordBreak:'break-all' }}>{v}</span>
              </div>
            ))}
            {selected.status==='pending' && (
              <div style={{ display:'flex', gap:'10px', marginTop:'20px' }}>
                <button onClick={()=>updateStatus(selected.id,'confirmed')} style={{ flex:1, padding:'12px', background:'linear-gradient(135deg,#10b981,#059669)', color:'white', border:'none', borderRadius:'50px', fontWeight:700, cursor:'pointer' }}>✅ Confirm</button>
                <button onClick={()=>updateStatus(selected.id,'rejected')} style={{ flex:1, padding:'12px', background:'#fee2e2', color:'#dc2626', border:'none', borderRadius:'50px', fontWeight:700, cursor:'pointer' }}>❌ Reject</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Payments;
