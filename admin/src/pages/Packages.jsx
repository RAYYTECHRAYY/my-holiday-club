import React, { useState, useEffect } from 'react';
import axios from 'axios';

const emptyPkg = { name: '', price: '', duration: '', features: '', highlighted: false };

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyPkg);
  const [loading, setLoading] = useState(true);

  const fetch = async () => { try { const r = await axios.get('/api/packages'); setPackages(r.data.data); } catch (_) {} setLoading(false); };
  useEffect(() => { fetch(); }, []);

  const save = async () => {
    const data = { ...form, features: typeof form.features === 'string' ? form.features.split('\n').map(s => s.trim()).filter(Boolean) : form.features };
    if (modal === 'add') await axios.post('/api/packages', data);
    else await axios.put(`/api/packages/${form.id}`, data);
    setModal(null); setForm(emptyPkg); fetch();
  };

  const del = async (id) => { if (window.confirm('Delete package?')) { await axios.delete(`/api/packages/${id}`); fetch(); } };
  const openEdit = (pkg) => { setForm({ ...pkg, features: Array.isArray(pkg.features) ? pkg.features.join('\n') : pkg.features }); setModal('edit'); };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Membership Packages ({packages.length})</h3>
          <p style={{ color: '#6b7280', fontSize: '0.85rem' }}>Manage pricing plans and features</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setForm(emptyPkg); setModal('add'); }}>+ Add Package</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {loading ? <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
          : packages.map(pkg => (
            <div key={pkg.id} className="card" style={{ border: pkg.highlighted ? '2px solid #0077C8' : '1px solid #e2e8f0', position: 'relative' }}>
              {pkg.highlighted && <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#0077C8', color: 'white', padding: '3px 16px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>POPULAR</div>}
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <h4 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '4px' }}>{pkg.name}</h4>
                <div style={{ color: '#0077C8', fontWeight: 700, fontSize: '1.4rem' }}>{pkg.price}</div>
                <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>{pkg.duration}</div>
              </div>
              <ul style={{ listStyle: 'none', marginBottom: '20px' }}>
                {(Array.isArray(pkg.features) ? pkg.features : (pkg.features || '').split('\n').filter(Boolean)).map((f, i) => (
                  <li key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px', fontSize: '0.85rem', color: '#4b5563' }}>
                    <span style={{ color: '#10b981', fontWeight: 700 }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-outline" style={{ flex: 1, fontSize: '0.82rem' }} onClick={() => openEdit(pkg)}>✏️ Edit</button>
                <button className="btn btn-danger" style={{ flex: 1, fontSize: '0.82rem' }} onClick={() => del(pkg.id)}>🗑️ Delete</button>
              </div>
            </div>
          ))}
      </div>

      {modal && (
        <div className="admin-modal-overlay" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className="admin-modal">
            <h2>{modal === 'add' ? 'Add New Package' : 'Edit Package'}</h2>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Package Name</label><input className="form-control" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Holiday Classic" /></div>
              <div className="form-group"><label className="form-label">Price</label><input className="form-control" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} placeholder="₹4,99,999" /></div>
            </div>
            <div className="form-group"><label className="form-label">Duration</label><input className="form-control" value={form.duration} onChange={e => setForm(p => ({ ...p, duration: e.target.value }))} placeholder="7 Nights / 8 Days" /></div>
            <div className="form-group">
              <label className="form-label">Features (one per line)</label>
              <textarea className="form-control" rows={6} value={form.features} onChange={e => setForm(p => ({ ...p, features: e.target.value }))} placeholder="Access to 100+ Resorts&#10;2 Free Upgrades/Year&#10;Priority Booking" />
            </div>
            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input type="checkbox" id="highlighted" checked={form.highlighted} onChange={e => setForm(p => ({ ...p, highlighted: e.target.checked }))} />
              <label htmlFor="highlighted" style={{ cursor: 'pointer', fontWeight: 500 }}>Mark as Popular/Featured</label>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button className="btn btn-outline" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={save}>Save Package</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Packages;
