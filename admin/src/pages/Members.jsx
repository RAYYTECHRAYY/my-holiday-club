import React, { useState, useEffect, useCallback } from 'react';
import api from '../api';

const Members = ({ socket }) => {
  const [members, setMembers]       = useState([]);
  const [search, setSearch]         = useState('');
  const [editMember, setEditMember] = useState(null);
  const [loading, setLoading]       = useState(true);
  const [highlight, setHighlight]   = useState(null); // id of newly arrived row

  const fetchMembers = useCallback(async () => {
    try { const res = await api.get('/api/members'); setMembers(res.data.data); } catch (_) {}
    setLoading(false);
  }, []);

  useEffect(() => { fetchMembers(); }, [fetchMembers]);

  // ── Live socket events ──────────────────────────────────────────
  useEffect(() => {
    if (!socket) return;

    const onNew = (member) => {
      setMembers(prev => {
        if (prev.find(m => m.id === member.id)) return prev;
        return [...prev, member];
      });
      setHighlight(member.id);
      setTimeout(() => setHighlight(null), 3000);
    };
    const onUpdated = (member) => setMembers(prev => prev.map(m => m.id === member.id ? member : m));
    const onDeleted = (id)     => setMembers(prev => prev.filter(m => m.id !== id));

    socket.on('new_member',     onNew);
    socket.on('member_updated', onUpdated);
    socket.on('member_deleted', onDeleted);
    return () => {
      socket.off('new_member',     onNew);
      socket.off('member_updated', onUpdated);
      socket.off('member_deleted', onDeleted);
    };
  }, [socket]);

  const filtered = members.filter(m =>
    (m.fullName || '').toLowerCase().includes(search.toLowerCase()) ||
    (m.email    || '').toLowerCase().includes(search.toLowerCase()) ||
    (m.phone    || '').includes(search)
  );

  const updateStatus = async (id, status) => {
    await api.put(`/api/members/${id}`, { status });
    // socket will push member_updated — no manual re-fetch needed
  };
  const deleteMember = async (id) => {
    if (window.confirm('Delete this member?')) await api.delete(`/api/members/${id}`);
  };
  const saveEdit = async () => {
    await api.put(`/api/members/${editMember.id}`, editMember);
    setEditMember(null);
  };

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px', flexWrap:'wrap', gap:'12px' }}>
        <div>
          <h3 style={{ fontWeight:700, fontSize:'1.1rem' }}>
            Members ({filtered.length})
            {members.filter(m => m.status==='pending').length > 0 && (
              <span style={{ marginLeft:'10px', background:'#fee2e2', color:'#ef4444', borderRadius:'50px', padding:'2px 10px', fontSize:'0.78rem', fontWeight:800 }}>
                {members.filter(m=>m.status==='pending').length} pending
              </span>
            )}
          </h3>
          <p style={{ color:'#6b7280', fontSize:'0.85rem', marginTop:'2px' }}>Live — updates automatically when someone signs up</p>
        </div>
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input className="search-input" placeholder="Search by name, email, phone..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>#</th><th>Name</th><th>Phone</th><th>Email</th><th>Plan</th><th>City</th><th>Status</th><th>Date</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9} style={{ textAlign:'center', padding:'40px', color:'#6b7280' }}>Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={9} style={{ textAlign:'center', padding:'40px', color:'#9ca3af' }}>No members found</td></tr>
              ) : [...filtered].reverse().map((m, i) => (
                <tr key={m.id} style={{
                  background: highlight === m.id ? 'linear-gradient(90deg,#d1fae5,#f0fdf4)' : '',
                  transition: 'background 0.8s ease',
                  animation: highlight === m.id ? 'rowFlash 0.4s ease' : '',
                }}>
                  <td style={{ color:'#9ca3af' }}>{i+1}</td>
                  <td style={{ fontWeight:600 }}>
                    {highlight === m.id && <span style={{ marginRight:'6px', fontSize:'0.80rem', color:'#10b981', fontWeight:800 }}>● NEW</span>}
                    {m.fullName || '—'}
                  </td>
                  <td>{m.phone || '—'}</td>
                  <td style={{ color:'#0077C8' }}>{m.email || '—'}</td>
                  <td><span style={{ fontSize:'0.8rem', fontWeight:600, color:'#f0a500' }}>
                    {m.memberType==='premium'?'👑 Premium':m.memberType==='classic'?'💎 Classic':'🌟 Starter'}
                  </span></td>
                  <td>{m.city || '—'}</td>
                  <td>
                    <select value={m.status||'pending'} onChange={e => updateStatus(m.id, e.target.value)}
                      style={{ fontSize:'0.8rem', padding:'4px 8px', border:'1px solid #e2e8f0', borderRadius:'6px', cursor:'pointer' }}>
                      <option value="pending">Pending</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </td>
                  <td style={{ color:'#6b7280', fontSize:'0.8rem' }}>{m.createdAt ? new Date(m.createdAt).toLocaleDateString('en-IN') : '—'}</td>
                  <td>
                    <div style={{ display:'flex', gap:'6px' }}>
                      <button className="btn btn-outline" style={{ padding:'5px 10px', fontSize:'0.8rem' }} onClick={() => setEditMember({...m})}>Edit</button>
                      <button className="btn btn-danger"  style={{ padding:'5px 10px', fontSize:'0.8rem' }} onClick={() => deleteMember(m.id)}>Del</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        @keyframes rowFlash {
          0%   { background: #bbf7d0; }
          100% { background: linear-gradient(90deg,#d1fae5,#f0fdf4); }
        }
      `}</style>

      {editMember && (
        <div className="admin-modal-overlay" onClick={e => e.target===e.currentTarget && setEditMember(null)}>
          <div className="admin-modal">
            <h2>Edit Member</h2>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Full Name</label><input className="form-control" value={editMember.fullName||''} onChange={e => setEditMember(p=>({...p,fullName:e.target.value}))}/></div>
              <div className="form-group"><label className="form-label">Phone</label><input className="form-control" value={editMember.phone||''} onChange={e => setEditMember(p=>({...p,phone:e.target.value}))}/></div>
            </div>
            <div className="form-group"><label className="form-label">Email</label><input className="form-control" value={editMember.email||''} onChange={e => setEditMember(p=>({...p,email:e.target.value}))}/></div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">City</label><input className="form-control" value={editMember.city||''} onChange={e => setEditMember(p=>({...p,city:e.target.value}))}/></div>
              <div className="form-group"><label className="form-label">Status</label>
                <select className="form-control" value={editMember.status||'pending'} onChange={e => setEditMember(p=>({...p,status:e.target.value}))}>
                  <option value="pending">Pending</option><option value="active">Active</option><option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="form-group"><label className="form-label">Membership Plan</label>
              <select className="form-control" value={editMember.memberType||''} onChange={e => setEditMember(p=>({...p,memberType:e.target.value}))}>
                <option value="">Select</option><option value="starter">Starter</option><option value="classic">Classic</option><option value="premium">Premium</option>
              </select>
            </div>
            <div style={{ display:'flex', gap:'12px', justifyContent:'flex-end' }}>
              <button className="btn btn-outline" onClick={() => setEditMember(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={saveEdit}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Members;
