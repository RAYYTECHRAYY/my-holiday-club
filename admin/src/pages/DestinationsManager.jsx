import React, { useState, useEffect } from 'react';
import api from '../api';

const REGION_TYPES = ['national', 'international'];
const PROPERTY_TYPES = ['Resort', 'Hotel'];

const emptyRegion = { name: '', slug: '', type: 'national', image: '', description: '', order: 1 };
const emptyProperty = { name: '', type: 'Resort', location: '', rating: 4.5, price: 5000, priceUnit: 'per night', images: [''], description: '', amenities: '', featured: false, regionId: '' };

// ── Image Upload component ──────────────────────────────────────────
const ImageUpload = ({ value, onChange }) => {
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onChange(ev.target.result);
    reader.readAsDataURL(file);
  };
  return (
    <div>
      <label style={{ display:'block', cursor:'pointer', border:'2px dashed #d1d5db', borderRadius:'12px', padding:'16px', textAlign:'center', transition:'border-color 0.2s', background: value ? 'transparent' : '#fafafa' }}
        onMouseEnter={e => e.currentTarget.style.borderColor='#0077C8'}
        onMouseLeave={e => e.currentTarget.style.borderColor='#d1d5db'}>
        {value ? (
          <div style={{ position:'relative', display:'inline-block' }}>
            <img src={value} alt="preview" style={{ maxHeight:'120px', maxWidth:'100%', borderRadius:'8px', objectFit:'cover' }} />
            <div style={{ marginTop:'8px', color:'#0077C8', fontWeight:600, fontSize:'0.82rem' }}>Click to change image</div>
          </div>
        ) : (
          <div>
            <div style={{ fontSize:'2rem', marginBottom:'8px' }}>📷</div>
            <div style={{ color:'#6b7280', fontWeight:600, fontSize:'0.875rem' }}>Click to upload image</div>
            <div style={{ color:'#9ca3af', fontSize:'0.78rem', marginTop:'4px' }}>JPG, PNG, WEBP supported</div>
          </div>
        )}
        <input type="file" accept="image/*" style={{ display:'none' }} onChange={handleFile} />
      </label>
    </div>
  );
};

const MultiImageUpload = ({ values, onChange }) => {
  const handleFile = (e, idx) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const updated = [...values];
      updated[idx] = ev.target.result;
      onChange(updated);
    };
    reader.readAsDataURL(file);
  };
  const addSlot = () => { if (values.length < 4) onChange([...values, '']); };
  const removeSlot = (idx) => onChange(values.filter((_, i) => i !== idx));

  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(140px,1fr))', gap:'10px' }}>
        {values.map((val, idx) => (
          <div key={idx} style={{ position:'relative' }}>
            <label style={{ display:'block', cursor:'pointer', border:'2px dashed #d1d5db', borderRadius:'10px', padding:'10px', textAlign:'center', background: val ? 'transparent' : '#fafafa', transition:'border-color 0.2s', height:'110px', boxSizing:'border-box', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column' }}
              onMouseEnter={e => e.currentTarget.style.borderColor='#0077C8'}
              onMouseLeave={e => e.currentTarget.style.borderColor='#d1d5db'}>
              {val ? (
                <img src={val} alt="" style={{ width:'100%', height:'90px', objectFit:'cover', borderRadius:'6px' }} />
              ) : (
                <>
                  <div style={{ fontSize:'1.5rem' }}>📷</div>
                  <div style={{ color:'#9ca3af', fontSize:'0.75rem', marginTop:'4px' }}>Upload image</div>
                </>
              )}
              <input type="file" accept="image/*" style={{ display:'none' }} onChange={e => handleFile(e, idx)} />
            </label>
            {values.length > 1 && (
              <button onClick={() => removeSlot(idx)} style={{ position:'absolute', top:'-8px', right:'-8px', width:'22px', height:'22px', borderRadius:'50%', background:'#ef4444', color:'white', border:'none', cursor:'pointer', fontSize:'0.7rem', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700 }}>✕</button>
            )}
          </div>
        ))}
        {values.length < 4 && (
          <button onClick={addSlot} style={{ border:'2px dashed #d1d5db', borderRadius:'10px', background:'#fafafa', cursor:'pointer', height:'110px', color:'#6b7280', fontWeight:600, fontSize:'0.82rem', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'6px' }}>
            <span style={{ fontSize:'1.5rem' }}>+</span> Add Image
          </button>
        )}
      </div>
    </div>
  );
};

export default function DestinationsManager({ socket }) {
  const [regions, setRegions] = useState([]);
  const [properties, setProperties] = useState([]);
  const [activeRegion, setActiveRegion] = useState(null);
  const [tab, setTab] = useState('regions'); // 'regions' | 'properties'
  const [showRegionForm, setShowRegionForm] = useState(false);
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [regionForm, setRegionForm] = useState(emptyRegion);
  const [propertyForm, setPropertyForm] = useState(emptyProperty);
  const [editingRegion, setEditingRegion] = useState(null);
  const [editingProperty, setEditingProperty] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchAll = async () => {
    const [rRes, pRes] = await Promise.all([api.get('/api/regions'), api.get('/api/properties')]);
    setRegions(rRes.data.data);
    setProperties(pRes.data.data);
  };
  useEffect(() => { fetchAll(); }, []);
  useEffect(() => {
    if (!socket) return;
    socket.on('regions_changed', fetchAll);
    socket.on('properties_changed', fetchAll);
    return () => { socket.off('regions_changed'); socket.off('properties_changed'); };
  }, [socket]);

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  // Regions
  const saveRegion = async () => {
    setSaving(true);
    try {
      const data = { ...regionForm, slug: regionForm.slug || regionForm.name.toLowerCase().replace(/\s+/g, '-') };
      if (editingRegion) await api.put(`/api/regions/${editingRegion}`, data);
      else await api.post('/api/regions', data);
      flash(editingRegion ? 'Region updated!' : 'Region added!');
      setShowRegionForm(false); setRegionForm(emptyRegion); setEditingRegion(null);
      fetchAll();
    } catch { flash('Error saving region'); } finally { setSaving(false); }
  };
  const deleteRegion = async (id) => {
    if (!window.confirm('Delete this region and all its properties?')) return;
    await api.delete(`/api/regions/${id}`); fetchAll(); flash('Region deleted');
  };
  const editRegion = (r) => { setRegionForm(r); setEditingRegion(r.id); setShowRegionForm(true); };

  // Properties
  const saveProperty = async () => {
    setSaving(true);
    try {
      const amenitiesArr = typeof propertyForm.amenities === 'string'
        ? propertyForm.amenities.split(',').map(a => a.trim()).filter(Boolean)
        : propertyForm.amenities;
      const imagesArr = typeof propertyForm.images === 'string'
        ? propertyForm.images.split(',').map(i => i.trim()).filter(Boolean)
        : propertyForm.images.filter(Boolean);
      const data = { ...propertyForm, amenities: amenitiesArr, images: imagesArr };
      if (editingProperty) await api.put(`/api/properties/${editingProperty}`, data);
      else await api.post('/api/properties', data);
      flash(editingProperty ? 'Property updated!' : 'Property added!');
      setShowPropertyForm(false); setPropertyForm(emptyProperty); setEditingProperty(null);
      fetchAll();
    } catch { flash('Error saving property'); } finally { setSaving(false); }
  };
  const deleteProperty = async (id) => {
    if (!window.confirm('Delete this property?')) return;
    await api.delete(`/api/properties/${id}`); fetchAll(); flash('Property deleted');
  };
  const editProperty = (p) => {
    setPropertyForm({ ...p, amenities: Array.isArray(p.amenities) ? p.amenities.join(', ') : p.amenities || '', images: Array.isArray(p.images) ? p.images : [p.images || ''] });
    setEditingProperty(p.id); setShowPropertyForm(true);
  };

  const filteredProperties = activeRegion ? properties.filter(p => p.regionId === activeRegion) : properties;
  const styles = {
    card: { background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '16px' },
    btn: (color='#0077C8') => ({ padding: '8px 16px', background: color, color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', fontFamily: "'Inter',sans-serif" }),
    input: { width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontFamily: "'Inter',sans-serif", fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' },
    label: { display: 'block', fontWeight: 600, fontSize: '0.82rem', color: '#374151', marginBottom: '5px', fontFamily: "'Inter',sans-serif" },
    modal: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' },
    modalBox: { background: 'white', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflow: 'auto' },
  };

  return (
    <div style={{ padding: '28px', fontFamily: "'Inter',sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.8rem', color: '#1a1a2e', margin: 0 }}>Destinations Manager</h1>
          <p style={{ color: '#6b7280', margin: '4px 0 0', fontSize: '0.9rem' }}>Manage regions, resorts & hotels</p>
        </div>
        {msg && <div style={{ padding: '10px 20px', background: '#f0fdf4', color: '#16a34a', borderRadius: '10px', fontWeight: 600, fontSize: '0.9rem' }}>{msg}</div>}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', borderBottom: '2px solid #f1f5f9', paddingBottom: '0' }}>
        {['regions', 'properties'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: '10px 24px', border: 'none', background: 'none', fontWeight: 600, fontSize: '0.95rem', fontFamily: "'Inter',sans-serif", cursor: 'pointer', color: tab === t ? '#0077C8' : '#6b7280', borderBottom: tab === t ? '3px solid #0077C8' : '3px solid transparent', marginBottom: '-2px', textTransform: 'capitalize' }}>{t}</button>
        ))}
      </div>

      {/* ── REGIONS TAB ── */}
      {tab === 'regions' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
            <button style={styles.btn()} onClick={() => { setRegionForm(emptyRegion); setEditingRegion(null); setShowRegionForm(true); }}>+ Add Region</button>
          </div>
          {['national', 'international'].map(type => (
            <div key={type} style={{ marginBottom: '32px' }}>
              <h3 style={{ color: '#374151', fontWeight: 700, fontSize: '1rem', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {type === 'national' ? '🇮🇳' : '🌍'} {type}
              </h3>
              {regions.filter(r => r.type === type).map(r => (
                <div key={r.id} style={styles.card}>
                  {r.image && <img src={r.image} alt={r.name} style={{ width: '70px', height: '55px', objectFit: 'cover', borderRadius: '10px', flexShrink: 0 }} />}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: '#1a1a2e', fontSize: '1rem' }}>{r.name}</div>
                    <div style={{ color: '#6b7280', fontSize: '0.82rem' }}>{r.description}</div>
                    <div style={{ color: '#9ca3af', fontSize: '0.78rem', marginTop: '2px' }}>slug: {r.slug}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                    <button style={styles.btn('#6b7280')} onClick={() => { setActiveRegion(r.id); setTab('properties'); }}>View Properties</button>
                    <button style={styles.btn('#f59e0b')} onClick={() => editRegion(r)}>Edit</button>
                    <button style={styles.btn('#ef4444')} onClick={() => deleteRegion(r.id)}>Delete</button>
                  </div>
                </div>
              ))}
              {regions.filter(r => r.type === type).length === 0 && <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>No regions yet.</p>}
            </div>
          ))}
        </div>
      )}

      {/* ── PROPERTIES TAB ── */}
      {tab === 'properties' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button onClick={() => setActiveRegion(null)} style={{ ...styles.btn(activeRegion ? '#e2e8f0' : '#0077C8'), color: activeRegion ? '#374151' : 'white' }}>All</button>
              {regions.map(r => (
                <button key={r.id} onClick={() => setActiveRegion(r.id)} style={{ ...styles.btn(activeRegion === r.id ? '#0077C8' : '#e2e8f0'), color: activeRegion === r.id ? 'white' : '#374151' }}>{r.name}</button>
              ))}
            </div>
            <button style={styles.btn()} onClick={() => { setPropertyForm({ ...emptyProperty, regionId: activeRegion || '' }); setEditingProperty(null); setShowPropertyForm(true); }}>+ Add Property</button>
          </div>

          {filteredProperties.map(p => (
            <div key={p.id} style={styles.card}>
              <img src={p.images?.[0] || ''} alt={p.name} style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '10px', flexShrink: 0, background: '#f1f5f9' }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 700, color: '#1a1a2e' }}>{p.name}</span>
                  <span style={{ background: '#e8f4ff', color: '#0077C8', padding: '2px 8px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700 }}>{p.type}</span>
                  {p.featured && <span style={{ background: '#fef3c7', color: '#d97706', padding: '2px 8px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700 }}>Featured</span>}
                </div>
                <div style={{ color: '#6b7280', fontSize: '0.82rem' }}>📍 {p.location} · ★ {p.rating} · ₹{Number(p.price).toLocaleString()} {p.priceUnit}</div>
                <div style={{ color: '#9ca3af', fontSize: '0.78rem' }}>{p.regionName}</div>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                <button style={styles.btn('#f59e0b')} onClick={() => editProperty(p)}>Edit</button>
                <button style={styles.btn('#ef4444')} onClick={() => deleteProperty(p.id)}>Delete</button>
              </div>
            </div>
          ))}
          {filteredProperties.length === 0 && <p style={{ color: '#9ca3af', textAlign: 'center', padding: '40px' }}>No properties found.</p>}
        </div>
      )}

      {/* ── REGION FORM MODAL ── */}
      {showRegionForm && (
        <div style={styles.modal} onClick={() => setShowRegionForm(false)}>
          <div style={styles.modalBox} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontFamily: "'Playfair Display',serif", marginBottom: '24px', color: '#1a1a2e' }}>{editingRegion ? 'Edit' : 'Add'} Region</h2>
            <div style={{ display: 'grid', gap: '16px' }}>
              {[['name','Region Name','text'],['slug','Slug (auto-filled)','text'],['description','Description','text'],['order','Display Order','number']].map(([k,l,t]) => (
                <div key={k}><label style={styles.label}>{l}</label>
                  <input style={styles.input} type={t} value={regionForm[k] || ''} onChange={e => setRegionForm(f => ({ ...f, [k]: e.target.value }))} /></div>
              ))}
              <div>
                <label style={styles.label}>Region Image</label>
                <ImageUpload value={regionForm.image} onChange={val => setRegionForm(f => ({ ...f, image: val }))} />
              </div>
              <div><label style={styles.label}>Type</label>
                <select style={styles.input} value={regionForm.type} onChange={e => setRegionForm(f => ({ ...f, type: e.target.value }))}>
                  {REGION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
              <button style={styles.btn('#6b7280')} onClick={() => setShowRegionForm(false)}>Cancel</button>
              <button style={styles.btn()} onClick={saveRegion} disabled={saving}>{saving ? 'Saving…' : 'Save Region'}</button>
            </div>
          </div>
        </div>
      )}

      {/* ── PROPERTY FORM MODAL ── */}
      {showPropertyForm && (
        <div style={styles.modal} onClick={() => setShowPropertyForm(false)}>
          <div style={styles.modalBox} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontFamily: "'Playfair Display',serif", marginBottom: '24px', color: '#1a1a2e' }}>{editingProperty ? 'Edit' : 'Add'} Property</h2>
            <div style={{ display: 'grid', gap: '14px' }}>
              <div><label style={styles.label}>Region *</label>
                <select style={styles.input} value={propertyForm.regionId} onChange={e => setPropertyForm(f => ({ ...f, regionId: e.target.value }))}>
                  <option value="">Select region…</option>
                  {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div><label style={styles.label}>Property Name *</label><input style={styles.input} value={propertyForm.name} onChange={e => setPropertyForm(f => ({ ...f, name: e.target.value }))} /></div>
                <div><label style={styles.label}>Type</label>
                  <select style={styles.input} value={propertyForm.type} onChange={e => setPropertyForm(f => ({ ...f, type: e.target.value }))}>
                    {PROPERTY_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div><label style={styles.label}>Location</label><input style={styles.input} value={propertyForm.location} onChange={e => setPropertyForm(f => ({ ...f, location: e.target.value }))} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
                <div><label style={styles.label}>Rating (0-5)</label><input style={styles.input} type="number" step="0.1" min="0" max="5" value={propertyForm.rating} onChange={e => setPropertyForm(f => ({ ...f, rating: e.target.value }))} /></div>
                <div><label style={styles.label}>Price (₹)</label><input style={styles.input} type="number" value={propertyForm.price} onChange={e => setPropertyForm(f => ({ ...f, price: e.target.value }))} /></div>
                <div><label style={styles.label}>Price Unit</label><input style={styles.input} value={propertyForm.priceUnit} onChange={e => setPropertyForm(f => ({ ...f, priceUnit: e.target.value }))} /></div>
              </div>
              <div>
                <label style={styles.label}>Property Images (upload up to 4)</label>
                <MultiImageUpload values={Array.isArray(propertyForm.images) ? propertyForm.images : [propertyForm.images || '']} onChange={vals => setPropertyForm(f => ({ ...f, images: vals }))} />
              </div>
              <div><label style={styles.label}>Description</label>
                <textarea style={{ ...styles.input, resize: 'vertical' }} rows={3} value={propertyForm.description} onChange={e => setPropertyForm(f => ({ ...f, description: e.target.value }))} /></div>
              <div><label style={styles.label}>Amenities (comma-separated)</label>
                <input style={styles.input} value={propertyForm.amenities} onChange={e => setPropertyForm(f => ({ ...f, amenities: e.target.value }))} placeholder="Pool, Spa, WiFi, Dining…" /></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input type="checkbox" id="featured" checked={!!propertyForm.featured} onChange={e => setPropertyForm(f => ({ ...f, featured: e.target.checked }))} />
                <label htmlFor="featured" style={{ fontWeight: 600, color: '#374151', cursor: 'pointer' }}>Mark as Featured</label>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
              <button style={styles.btn('#6b7280')} onClick={() => setShowPropertyForm(false)}>Cancel</button>
              <button style={styles.btn()} onClick={saveProperty} disabled={saving}>{saving ? 'Saving…' : 'Save Property'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
