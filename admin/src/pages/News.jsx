import React, { useState, useEffect } from 'react';
import axios from 'axios';

const emptyNews = { title: '', date: '', category: 'New Launch', excerpt: '', image: '' };
const categories = ['New Launch', 'Expansion', 'Award', 'Technology', 'Partnership', 'General'];

const News = () => {
  const [news, setNews] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyNews);
  const [loading, setLoading] = useState(true);

  const fetch = async () => { try { const r = await axios.get('/api/news'); setNews(r.data.data); } catch (_) {} setLoading(false); };
  useEffect(() => { fetch(); }, []);

  const save = async () => {
    if (modal === 'add') await axios.post('/api/news', form);
    else await axios.put(`/api/news/${form.id}`, form);
    setModal(null); setForm(emptyNews); fetch();
  };

  const del = async (id) => { if (window.confirm('Delete this news item?')) { await axios.delete(`/api/news/${id}`); fetch(); } };
  const openEdit = (item) => { setForm({ ...item }); setModal('edit'); };

  const catColors = { 'New Launch': '#10b981', 'Expansion': '#0077C8', 'Award': '#f0a500', 'Technology': '#8b5cf6', 'Partnership': '#ef4444', 'General': '#6b7280' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontWeight: 700, fontSize: '1.1rem' }}>News & Updates ({news.length})</h3>
          <p style={{ color: '#6b7280', fontSize: '0.85rem' }}>Manage news items shown on the website</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setForm(emptyNews); setModal('add'); }}>+ Add News</button>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>#</th><th>Image</th><th>Title</th><th>Category</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px' }}>Loading...</td></tr>
                : news.length === 0 ? <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>No news items yet</td></tr>
                  : news.map((item, i) => (
                    <tr key={item.id}>
                      <td style={{ color: '#9ca3af' }}>{i + 1}</td>
                      <td>
                        {item.image ? <img src={item.image} alt="" style={{ width: '64px', height: '40px', objectFit: 'cover', borderRadius: '6px' }} /> : <div style={{ width: '64px', height: '40px', background: '#f1f5f9', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>📰</div>}
                      </td>
                      <td style={{ fontWeight: 600, maxWidth: '300px' }}>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</div>
                        <div style={{ color: '#9ca3af', fontSize: '0.8rem', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '280px' }}>{item.excerpt}</div>
                      </td>
                      <td><span style={{ background: `${catColors[item.category] || '#6b7280'}20`, color: catColors[item.category] || '#6b7280', padding: '3px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 600 }}>{item.category}</span></td>
                      <td style={{ fontSize: '0.85rem', color: '#6b7280' }}>{item.date ? new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button className="btn btn-outline" style={{ padding: '5px 10px', fontSize: '0.8rem' }} onClick={() => openEdit(item)}>Edit</button>
                          <button className="btn btn-danger" style={{ padding: '5px 10px', fontSize: '0.8rem' }} onClick={() => del(item.id)}>Del</button>
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="admin-modal-overlay" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className="admin-modal">
            <h2>{modal === 'add' ? 'Add News Item' : 'Edit News Item'}</h2>
            <div className="form-group"><label className="form-label">Title</label><input className="form-control" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="News headline..." /></div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-control" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group"><label className="form-label">Date</label><input className="form-control" type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} /></div>
            </div>
            <div className="form-group"><label className="form-label">Image URL</label><input className="form-control" value={form.image} onChange={e => setForm(p => ({ ...p, image: e.target.value }))} placeholder="https://..." /></div>
            <div className="form-group"><label className="form-label">Excerpt</label><textarea className="form-control" rows={4} value={form.excerpt} onChange={e => setForm(p => ({ ...p, excerpt: e.target.value }))} placeholder="Short description of the news..." /></div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button className="btn btn-outline" onClick={() => { setModal(null); setForm(emptyNews); }}>Cancel</button>
              <button className="btn btn-primary" onClick={save}>Save News</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default News;
