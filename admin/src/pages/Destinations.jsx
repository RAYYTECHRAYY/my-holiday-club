import React, { useState, useEffect } from 'react';
import api from '../api';

const empty = { name: '', region: 'north', state: '', image: '', description: '', price: '', rating: 4.5, category: '', amenities: '', type: 'national' };

const Destinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null); // null | 'add' | 'edit'
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(true);

  const fetch = async () => { try { const r = await api.get('/api/destinations'); setDestinations(r.data.data); } catch (_) {} setLoading(false); };
  useEffect(() => { fetch(); }, []);

  const filtered = destinations.filter(d =>
    (d.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (d.region || '').toLowerCase().includes(search.toLowerCase()) ||
    (d.state || '').toLowerCase().includes(search.toLowerCase())
  );

  const save = async () => {
    const data = { ...form, amenities: typeof form.amenities === 'string' ? form.amenities.split(',').map(s => s.trim()).filter(Boolean) : form.amenities };
    if (modal === 'add') await api.post('/api/destinations', data);
    else await api.put(`/api/destinations/${form.id}`, data);
    setModal(null); setForm(empty); fetch();
  };

  const del = async (id) => { if (window.confirm('Delete destination?')) { await api.delete(`/api/destinations/${id}`); fetch(); } };

  const openEdit = (dest) => {
    setForm({ ...dest, amenities: Array.isArray(dest.amenities) ? dest.amenities.join(', ') : dest.amenities });
    setModal('edit');
  };

  const regionLabels = { north: '🏔️ North India', east: '🍵 East India', west: '🏖️ West India', south: '🌴 South India', international: '🌍 International' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Destinations ({filtered.length})</h3>
          <p style={{ color: '#6b7280', fontSize: '0.85rem' }}>Manage all resort and hotel destinations</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input className="search-input" placeholder="Search destinations..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button className="btn btn-primary" onClick={() => { setForm(empty); setModal('add'); }}>+ Add Destination</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {loading ? <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px' }}>Loading...</div>
          : filtered.length === 0 ? <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: '#9ca3af' }}>No destinations found</div>
            : filtered.map(dest => (
              <div key={dest.id} className="card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ position: 'relative', height: '160px' }}>
                  <img src={dest.image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400'} alt={dest.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: '12px', left: '12px', background: 'rgba(0,119,200,0.9)', color: 'white', padding: '3px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>
                    {regionLabels[dest.region] || dest.region}
                  </div>
                  <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.6)', color: 'white', padding: '3px 8px', borderRadius: '12px', fontSize: '0.75rem' }}>
                    ★ {dest.rating}
                  </div>
                </div>
                <div style={{ padding: '16px' }}>
                  <h4 style={{ fontWeight: 700, marginBottom: '4px' }}>{dest.name}</h4>
                  <p style={{ color: '#6b7280', fontSize: '0.85rem', marginBottom: '8px' }}>📍 {dest.state} • {dest.category}</p>
                  <p style={{ color: '#0077C8', fontWeight: 600, fontSize: '0.9rem', marginBottom: '12px' }}>{dest.price}</p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-outline" style={{ flex: 1, padding: '7px 12px', fontSize: '0.82rem' }} onClick={() => openEdit(dest)}>✏️ Edit</button>
                    <button className="btn btn-danger" style={{ flex: 1, padding: '7px 12px', fontSize: '0.82rem' }} onClick={() => del(dest.id)}>🗑️ Delete</button>
                  </div>
                </div>
              </div>
            ))}
      </div>

      {/* Add/Edit Modal */}
      {modal && (
        <div className="admin-modal-overlay" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className="admin-modal" style={{ maxWidth: '640px' }}>
            <h2>{modal === 'add' ? 'Add New Destination' : 'Edit Destination'}</h2>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Destination Name *</label><input className="form-control" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Shimla" /></div>
              <div className="form-group"><label className="form-label">State/Country *</label><input className="form-control" value={form.state} onChange={e => setForm(p => ({ ...p, state: e.target.value }))} placeholder="e.g. Himachal Pradesh" /></div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Region *</label>
                <select className="form-control" value={form.region} onChange={e => setForm(p => ({ ...p, region: e.target.value }))}>
                  <option value="north">North India</option>
                  <option value="east">East India</option>
                  <option value="west">West India</option>
                  <option value="south">South India</option>
                  <option value="international">International</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Type</label>
                <select className="form-control" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                  <option value="national">National</option>
                  <option value="international">International</option>
                </select>
              </div>
            </div>
            <div className="form-group"><label className="form-label">Image URL</label><input className="form-control" value={form.image} onChange={e => setForm(p => ({ ...p, image: e.target.value }))} placeholder="https://..." /></div>
            <div className="form-group"><label className="form-label">Description</label><textarea className="form-control" rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Brief description..." /></div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Starting Price</label><input className="form-control" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} placeholder="e.g. Starting ₹8,999/night" /></div>
              <div className="form-group"><label className="form-label">Category</label><input className="form-control" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} placeholder="e.g. Hill Station" /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Rating (0-5)</label><input className="form-control" type="number" min="0" max="5" step="0.1" value={form.rating} onChange={e => setForm(p => ({ ...p, rating: parseFloat(e.target.value) }))} /></div>
              <div className="form-group"><label className="form-label">Amenities (comma separated)</label><input className="form-control" value={form.amenities} onChange={e => setForm(p => ({ ...p, amenities: e.target.value }))} placeholder="Pool, Spa, Restaurant" /></div>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button className="btn btn-outline" onClick={() => { setModal(null); setForm(empty); }}>Cancel</button>
              <button className="btn btn-primary" onClick={save}>{modal === 'add' ? 'Add Destination' : 'Save Changes'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Destinations;
