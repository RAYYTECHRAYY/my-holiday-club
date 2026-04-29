import React, { useState, useEffect } from 'react';
import api from '../api';

const STATUS_COLOR = { active:'#10b981', pending:'#f0a500', suspended:'#ef4444' };
const PAY_COLOR = { confirmed:'#10b981', pending:'#f0a500', rejected:'#ef4444' };

const MemberAccounts = ({ socket }) => {
  const [members, setMembers] = useState([]);
  const [packages, setPackages] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ fullName:'', email:'', phone:'', password:'', city:'', state:'', pincode:'', status:'active', packageId:'' });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(''), 3000); };

  useEffect(() => {
    fetchAll();
    if (socket) {
      socket.on('new_member', () => fetchAll());
      socket.on('member_updated', () => fetchAll());
      return () => { socket.off('new_member'); socket.off('member_updated'); };
    }
  }, [socket]);

  const fetchAll = async () => {
    const [m, p] = await Promise.all([
      api.get('/api/member-accounts'),
      api.get('/api/packages')
    ]);
    setMembers(m.data.data || []);
    setPackages(p.data.data || []);
  };

  const filtered = members.filter(m => {
    const matchSearch = m.fullName?.toLowerCase().includes(search.toLowerCase()) || m.email?.toLowerCase().includes(search.toLowerCase()) || m.memberId?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || m.status === filter;
    return matchSearch && matchFilter;
  });

  const openCreate = () => { setEditing(null); setForm({ fullName:'', email:'', phone:'', password:'', city:'', state:'', pincode:'', status:'active', packageId:'' }); setShowForm(true); };
  const openEdit = (m) => { setEditing(m); setForm({ fullName:m.fullName, email:m.email, phone:m.phone||'', password:'', city:m.city||'', state:m.state||'', pincode:m.pincode||'', status:m.status, packageId:m.packageId||'' }); setShowForm(true); };

  const save = async () => {
    setSaving(true);
    try {
      if (editing) await api.put(`/api/member-accounts/${editing.id}`, form);
      else await api.post('/api/member-accounts', form);
      await fetchAll();
      setShowForm(false);
      showToast(editing ? '✅ Member updated' : '✅ Member created');
    } catch { showToast('❌ Error saving member'); }
    setSaving(false);
  };

  const deleteMember = async (id) => {
    if (!window.confirm('Delete this member?')) return;
    await api.delete(`/api/member-accounts/${id}`);
    setSelected(null); fetchAll(); showToast('🗑️ Member deleted');
  };

  const changeStatus = async (id, status) => {
    await api.put(`/api/member-accounts/${id}`, { status });
    fetchAll(); showToast('✅ Status updated');
    if (selected?.id === id) setSelected(s => ({...s, status}));
  };

  // Detail view
  if (selected) return (
    <div style={{ padding:'28px' }}>
      {toast && <div style={{ position:'fixed', top:'24px', right:'24px', background:'#1a1a2e', color:'white', padding:'12px 22px', borderRadius:'12px', zIndex:9999, fontWeight:600 }}>{toast}</div>}
      <button onClick={()=>setSelected(null)} style={{ background:'none', border:'none', color:'#0077C8', cursor:'pointer', fontWeight:700, marginBottom:'20px', fontSize:'0.95rem', display:'flex', alignItems:'center', gap:'6px' }}>← Back to Members</button>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:'24px', alignItems:'start' }}>
        <div>
          <div style={{ background:'white', borderRadius:'20px', padding:'28px', boxShadow:'0 4px 20px rgba(0,0,0,0.06)', marginBottom:'20px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'start', marginBottom:'24px', flexWrap:'wrap', gap:'12px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'14px' }}>
                <div style={{ width:'56px', height:'56px', background:'linear-gradient(135deg,#0077C8,#005a96)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:800, fontSize:'1.4rem' }}>{selected.fullName?.charAt(0)}</div>
                <div>
                  <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.4rem', color:'#1a1a2e', margin:'0 0 4px' }}>{selected.fullName}</h2>
                  <div style={{ color:'#0077C8', fontWeight:700, fontSize:'0.9rem' }}>{selected.memberId}</div>
                </div>
              </div>
              <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
                <button onClick={()=>openEdit(selected)} style={{ padding:'8px 18px', background:'#e8f4ff', color:'#0077C8', border:'none', borderRadius:'50px', fontWeight:700, cursor:'pointer', fontSize:'0.88rem' }}>✏️ Edit</button>
                {selected.status!=='active' && <button onClick={()=>changeStatus(selected.id,'active')} style={{ padding:'8px 18px', background:'#f0fdf4', color:'#10b981', border:'none', borderRadius:'50px', fontWeight:700, cursor:'pointer', fontSize:'0.88rem' }}>✅ Activate</button>}
                {selected.status!=='suspended' && <button onClick={()=>changeStatus(selected.id,'suspended')} style={{ padding:'8px 18px', background:'#fff1f2', color:'#ef4444', border:'none', borderRadius:'50px', fontWeight:700, cursor:'pointer', fontSize:'0.88rem' }}>🚫 Suspend</button>}
                <button onClick={()=>deleteMember(selected.id)} style={{ padding:'8px 18px', background:'#fee2e2', color:'#dc2626', border:'none', borderRadius:'50px', fontWeight:700, cursor:'pointer', fontSize:'0.88rem' }}>🗑️ Delete</button>
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
              {[['Email', selected.email],['Phone', selected.phone||'—'],['City', selected.city||'—'],['State', selected.state||'—'],['Pincode', selected.pincode||'—'],['Joined', new Date(selected.joinDate).toLocaleDateString('en-IN')]].map(([k,v])=>(
                <div key={k} style={{ background:'#f8faff', borderRadius:'10px', padding:'12px 16px' }}>
                  <div style={{ fontSize:'0.78rem', color:'#6b7280', fontWeight:600, marginBottom:'4px', textTransform:'uppercase', letterSpacing:'0.5px' }}>{k}</div>
                  <div style={{ color:'#1a1a2e', fontWeight:600, wordBreak:'break-all' }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment History */}
          <div style={{ background:'white', borderRadius:'20px', padding:'28px', boxShadow:'0 4px 20px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.2rem', color:'#1a1a2e', marginBottom:'18px' }}>Payment History</h3>
            {(selected.payments||[]).length === 0 ? <p style={{ color:'#9ca3af', textAlign:'center', padding:'24px' }}>No payments yet.</p> : (
              (selected.payments||[]).map(p => (
                <div key={p.id} style={{ padding:'16px', background:'#f8faff', borderRadius:'12px', marginBottom:'10px', border:'1px solid #e8f4ff' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'start', flexWrap:'wrap', gap:'8px' }}>
                    <div>
                      <div style={{ fontWeight:700, color:'#1a1a2e', marginBottom:'4px' }}>{p.packageName}</div>
                      <div style={{ color:'#6b7280', fontSize:'0.82rem' }}>Ref: {p.referenceNumber||'—'}</div>
                      <div style={{ color:'#6b7280', fontSize:'0.82rem' }}>{new Date(p.createdAt).toLocaleString('en-IN')}</div>
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <div style={{ fontWeight:800, color:'#0077C8', fontSize:'1.1rem', marginBottom:'6px' }}>₹{Number(p.amount).toLocaleString()}</div>
                      <span style={{ display:'inline-block', padding:'3px 12px', background:`${PAY_COLOR[p.status]||'#6b7280'}18`, color:PAY_COLOR[p.status]||'#6b7280', borderRadius:'20px', fontSize:'0.78rem', fontWeight:700 }}>{p.status}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Status & Package */}
        <div style={{ background:'white', borderRadius:'20px', padding:'24px', boxShadow:'0 4px 20px rgba(0,0,0,0.06)' }}>
          <div style={{ marginBottom:'20px' }}>
            <div style={{ fontSize:'0.78rem', color:'#6b7280', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'8px' }}>Status</div>
            <span style={{ display:'inline-block', padding:'6px 18px', background:`${STATUS_COLOR[selected.status]||'#6b7280'}18`, color:STATUS_COLOR[selected.status]||'#6b7280', borderRadius:'20px', fontWeight:700 }}>{selected.status}</span>
          </div>
          <div>
            <div style={{ fontSize:'0.78rem', color:'#6b7280', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'8px' }}>Package</div>
            {selected.packageName ? <div style={{ background:'#e8f4ff', borderRadius:'12px', padding:'12px 16px', color:'#0077C8', fontWeight:700 }}>📦 {selected.packageName}</div> : <div style={{ color:'#9ca3af', fontSize:'0.9rem' }}>No package selected</div>}
          </div>
        </div>
      </div>

      {showForm && <MemberForm form={form} setForm={setForm} packages={packages} editing={editing} saving={saving} onSave={save} onClose={()=>setShowForm(false)} />}
    </div>
  );

  return (
    <div style={{ padding:'28px' }}>
      {toast && <div style={{ position:'fixed', top:'24px', right:'24px', background:'#1a1a2e', color:'white', padding:'12px 22px', borderRadius:'12px', zIndex:9999, fontWeight:600 }}>{toast}</div>}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px', flexWrap:'wrap', gap:'12px' }}>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.8rem', color:'#1a1a2e', margin:0 }}>Member Accounts</h1>
        <button onClick={openCreate} style={{ padding:'11px 24px', background:'linear-gradient(135deg,#0077C8,#005a96)', color:'white', border:'none', borderRadius:'50px', fontWeight:700, cursor:'pointer', fontSize:'0.95rem' }}>+ Create Member</button>
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap:'10px', marginBottom:'20px', flexWrap:'wrap' }}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search name, email, member ID..." style={{ flex:1, minWidth:'200px', padding:'10px 16px', border:'2px solid #e2e8f0', borderRadius:'50px', fontSize:'0.9rem', outline:'none' }} />
        {['all','active','pending','suspended'].map(s=>(
          <button key={s} onClick={()=>setFilter(s)} style={{ padding:'9px 18px', borderRadius:'50px', border:'2px solid', borderColor:filter===s?'#0077C8':'#e2e8f0', background:filter===s?'#0077C8':'white', color:filter===s?'white':'#6b7280', fontWeight:600, cursor:'pointer', fontSize:'0.85rem', textTransform:'capitalize' }}>{s}</button>
        ))}
      </div>

      {/* Stats bar */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:'14px', marginBottom:'24px' }}>
        {[['Total',members.length,'#0077C8'],['Active',members.filter(m=>m.status==='active').length,'#10b981'],['Pending',members.filter(m=>m.status==='pending').length,'#f0a500'],['Suspended',members.filter(m=>m.status==='suspended').length,'#ef4444']].map(([l,v,c])=>(
          <div key={l} style={{ background:'white', borderRadius:'14px', padding:'16px 20px', boxShadow:'0 2px 10px rgba(0,0,0,0.05)', borderLeft:`4px solid ${c}` }}>
            <div style={{ fontSize:'1.6rem', fontWeight:800, color:c }}>{v}</div>
            <div style={{ color:'#6b7280', fontSize:'0.82rem', fontWeight:600 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background:'white', borderRadius:'20px', overflow:'hidden', boxShadow:'0 4px 20px rgba(0,0,0,0.06)' }}>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ background:'#f8faff', borderBottom:'2px solid #e8f4ff' }}>
                {['Member','ID','Package','Status','Joined','Actions'].map(h=>(
                  <th key={h} style={{ padding:'14px 16px', textAlign:'left', fontSize:'0.78rem', fontWeight:700, color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.5px', whiteSpace:'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && <tr><td colSpan={6} style={{ textAlign:'center', padding:'48px', color:'#9ca3af' }}>No members found</td></tr>}
              {filtered.map(m=>(
                <tr key={m.id} style={{ borderBottom:'1px solid #f1f5f9', transition:'background 0.15s' }}
                  onMouseEnter={e=>e.currentTarget.style.background='#f8faff'}
                  onMouseLeave={e=>e.currentTarget.style.background='white'}>
                  <td style={{ padding:'14px 16px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                      <div style={{ width:'36px', height:'36px', borderRadius:'50%', background:'linear-gradient(135deg,#0077C8,#005a96)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:700, flexShrink:0 }}>{m.fullName?.charAt(0)}</div>
                      <div>
                        <div style={{ fontWeight:700, color:'#1a1a2e', fontSize:'0.9rem' }}>{m.fullName}</div>
                        <div style={{ color:'#6b7280', fontSize:'0.78rem' }}>{m.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding:'14px 16px', color:'#0077C8', fontWeight:700, fontSize:'0.85rem', whiteSpace:'nowrap' }}>{m.memberId}</td>
                  <td style={{ padding:'14px 16px', fontSize:'0.85rem', color:'#374151' }}>{m.packageName||<span style={{ color:'#d1d5db' }}>None</span>}</td>
                  <td style={{ padding:'14px 16px' }}>
                    <span style={{ display:'inline-block', padding:'3px 12px', background:`${STATUS_COLOR[m.status]||'#6b7280'}18`, color:STATUS_COLOR[m.status]||'#6b7280', borderRadius:'20px', fontSize:'0.78rem', fontWeight:700 }}>{m.status}</span>
                  </td>
                  <td style={{ padding:'14px 16px', color:'#6b7280', fontSize:'0.82rem', whiteSpace:'nowrap' }}>{new Date(m.joinDate).toLocaleDateString('en-IN')}</td>
                  <td style={{ padding:'14px 16px' }}>
                    <div style={{ display:'flex', gap:'6px' }}>
                      <button onClick={()=>{ api.get(`/api/member-accounts/${m.id}`).then(r=>setSelected(r.data.data)); }} style={{ padding:'6px 14px', background:'#e8f4ff', color:'#0077C8', border:'none', borderRadius:'20px', fontWeight:600, cursor:'pointer', fontSize:'0.8rem' }}>View</button>
                      <button onClick={()=>openEdit(m)} style={{ padding:'6px 14px', background:'#f0fdf4', color:'#10b981', border:'none', borderRadius:'20px', fontWeight:600, cursor:'pointer', fontSize:'0.8rem' }}>Edit</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && <MemberForm form={form} setForm={setForm} packages={packages} editing={editing} saving={saving} onSave={save} onClose={()=>setShowForm(false)} />}
    </div>
  );
};

const MemberForm = ({ form, setForm, packages, editing, saving, onSave, onClose }) => {
  const h = e => setForm(p=>({...p,[e.target.name]:e.target.value}));
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
      <div style={{ background:'white', borderRadius:'20px', padding:'32px', maxWidth:'540px', width:'100%', maxHeight:'90vh', overflowY:'auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px' }}>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.4rem', color:'#1a1a2e', margin:0 }}>{editing?'Edit Member':'Create Member'}</h2>
          <button onClick={onClose} style={{ background:'#f1f5f9', border:'none', borderRadius:'50%', width:'34px', height:'34px', cursor:'pointer', fontSize:'1.1rem' }}>✕</button>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
          {[['fullName','Full Name','text',true],['email','Email','email',true],['phone','Phone','tel',false],['city','City','text',false],['state','State','text',false],['pincode','Pincode','text',false]].map(([name,label,type,req])=>(
            <div key={name}>
              <label style={{ display:'block', fontSize:'0.82rem', fontWeight:700, color:'#374151', marginBottom:'6px' }}>{label}{req&&' *'}</label>
              <input name={name} type={type} value={form[name]||''} onChange={h} required={req}
                style={{ width:'100%', padding:'10px 14px', border:'2px solid #e2e8f0', borderRadius:'10px', fontSize:'0.9rem', outline:'none', boxSizing:'border-box' }} />
            </div>
          ))}
          <div>
            <label style={{ display:'block', fontSize:'0.82rem', fontWeight:700, color:'#374151', marginBottom:'6px' }}>{editing?'New Password (leave blank to keep)':'Password *'}</label>
            <input name="password" type="password" value={form.password||''} onChange={h} required={!editing}
              style={{ width:'100%', padding:'10px 14px', border:'2px solid #e2e8f0', borderRadius:'10px', fontSize:'0.9rem', outline:'none', boxSizing:'border-box' }} />
          </div>
          <div>
            <label style={{ display:'block', fontSize:'0.82rem', fontWeight:700, color:'#374151', marginBottom:'6px' }}>Status</label>
            <select name="status" value={form.status} onChange={h} style={{ width:'100%', padding:'10px 14px', border:'2px solid #e2e8f0', borderRadius:'10px', fontSize:'0.9rem', outline:'none', boxSizing:'border-box' }}>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
          <div style={{ gridColumn:'1/-1' }}>
            <label style={{ display:'block', fontSize:'0.82rem', fontWeight:700, color:'#374151', marginBottom:'6px' }}>Package</label>
            <select name="packageId" value={form.packageId||''} onChange={h} style={{ width:'100%', padding:'10px 14px', border:'2px solid #e2e8f0', borderRadius:'10px', fontSize:'0.9rem', outline:'none', boxSizing:'border-box' }}>
              <option value="">No Package</option>
              {packages.map(p=><option key={p.id} value={p.id}>{p.name} — ₹{Number(p.price).toLocaleString()}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display:'flex', gap:'10px', marginTop:'24px', justifyContent:'flex-end' }}>
          <button onClick={onClose} style={{ padding:'11px 24px', background:'#f1f5f9', border:'none', borderRadius:'50px', fontWeight:600, cursor:'pointer' }}>Cancel</button>
          <button onClick={onSave} disabled={saving} style={{ padding:'11px 28px', background:'linear-gradient(135deg,#0077C8,#005a96)', color:'white', border:'none', borderRadius:'50px', fontWeight:700, cursor:'pointer' }}>{saving?'Saving...':'Save Member'}</button>
        </div>
      </div>
    </div>
  );
};

export default MemberAccounts;
