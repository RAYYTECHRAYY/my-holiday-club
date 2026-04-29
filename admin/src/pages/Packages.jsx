import React, { useState, useEffect, useRef } from 'react';
import api from '../api';

const MultiImageUpload = ({ values = [], onChange }) => {
  const fileRef = useRef();
  const [preview, setPreview] = useState(0);

  const addImages = async (files) => {
    const newImgs = [];
    for (const file of Array.from(files)) {
      await new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = e => { newImgs.push(e.target.result); resolve(); };
        reader.readAsDataURL(file);
      });
    }
    onChange([...values, ...newImgs]);
  };

  const removeImg = (i) => {
    const updated = values.filter((_,idx)=>idx!==i);
    onChange(updated);
    if (preview >= updated.length) setPreview(Math.max(0, updated.length-1));
  };

  return (
    <div>
      {values.length > 0 && (
        <div style={{ marginBottom:'12px' }}>
          <div style={{ position:'relative', height:'180px', borderRadius:'12px', overflow:'hidden', marginBottom:'8px', background:'#f1f5f9' }}>
            <img src={values[preview]} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
            {values.length > 1 && <>
              <button type="button" onClick={()=>setPreview(p=>(p-1+values.length)%values.length)} style={{ position:'absolute', left:'8px', top:'50%', transform:'translateY(-50%)', background:'rgba(0,0,0,0.5)', color:'white', border:'none', borderRadius:'50%', width:'28px', height:'28px', cursor:'pointer', fontSize:'0.9rem' }}>‹</button>
              <button type="button" onClick={()=>setPreview(p=>(p+1)%values.length)} style={{ position:'absolute', right:'8px', top:'50%', transform:'translateY(-50%)', background:'rgba(0,0,0,0.5)', color:'white', border:'none', borderRadius:'50%', width:'28px', height:'28px', cursor:'pointer', fontSize:'0.9rem' }}>›</button>
              <div style={{ position:'absolute', bottom:'8px', left:'50%', transform:'translateX(-50%)', display:'flex', gap:'4px' }}>
                {values.map((_,i)=><div key={i} onClick={()=>setPreview(i)} style={{ width:i===preview?'16px':'6px', height:'6px', borderRadius:'3px', background:i===preview?'white':'rgba(255,255,255,0.5)', transition:'all 0.2s', cursor:'pointer' }} />)}
              </div>
            </>}
          </div>
          <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
            {values.map((img,i)=>(
              <div key={i} style={{ position:'relative', width:'60px', height:'50px' }}>
                <img src={img} alt="" onClick={()=>setPreview(i)} style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:'6px', border:i===preview?'2px solid #0077C8':'2px solid transparent', cursor:'pointer' }} />
                <button type="button" onClick={()=>removeImg(i)} style={{ position:'absolute', top:'-6px', right:'-6px', background:'#ef4444', color:'white', border:'none', borderRadius:'50%', width:'18px', height:'18px', cursor:'pointer', fontSize:'0.7rem', display:'flex', alignItems:'center', justifyContent:'center', padding:0 }}>✕</button>
              </div>
            ))}
          </div>
        </div>
      )}
      <button type="button" onClick={()=>fileRef.current?.click()} style={{ width:'100%', padding:'12px', border:'2px dashed #cbd5e1', borderRadius:'10px', background:'#f8faff', color:'#0077C8', cursor:'pointer', fontWeight:600, fontSize:'0.88rem' }}>
        📷 {values.length>0?'Add More Photos':'Upload Photos'} (Multiple Allowed)
      </button>
      <input ref={fileRef} type="file" accept="image/*" multiple style={{ display:'none' }} onChange={e=>addImages(e.target.files)} />
    </div>
  );
};

const emptyPkg = { name:'', price:'', duration:'', validity:'', description:'', images:[], features:[], color:'#0077C8', badge:'', popular:false };

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyPkg);
  const [featureInput, setFeatureInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [sliderIdx, setSliderIdx] = useState({});

  const showToast = msg => { setToast(msg); setTimeout(()=>setToast(''), 3000); };

  useEffect(() => { fetchPkgs(); }, []);
  const fetchPkgs = async () => { const r = await api.get('/api/packages'); setPackages(r.data.data||[]); };

  const openCreate = () => { setEditing(null); setForm(emptyPkg); setFeatureInput(''); setShowForm(true); };
  const openEdit = p => { setEditing(p); setForm({...p, features:[...(p.features||[])], images:[...(p.images||[])]}); setFeatureInput(''); setShowForm(true); };

  const addFeature = () => { if (!featureInput.trim()) return; setForm(f=>({...f, features:[...f.features, featureInput.trim()]})); setFeatureInput(''); };
  const removeFeature = i => setForm(f=>({...f, features:f.features.filter((_,idx)=>idx!==i)}));

  const save = async () => {
    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price) };
      if (editing) await api.put(`/api/packages/${editing.id}`, payload);
      else await api.post('/api/packages', payload);
      fetchPkgs(); setShowForm(false);
      showToast(editing?'✅ Package updated':'✅ Package created');
    } catch { showToast('❌ Error saving'); }
    setSaving(false);
  };

  const deletePkg = async (id) => {
    if (!window.confirm('Delete this package?')) return;
    await api.delete(`/api/packages/${id}`); fetchPkgs(); showToast('🗑️ Package deleted');
  };

  const slideImg = (pkgId, dir, total) => setSliderIdx(s => ({ ...s, [pkgId]: ((s[pkgId]||0)+dir+total)%total }));

  return (
    <div style={{ padding:'28px' }}>
      {toast && <div style={{ position:'fixed', top:'24px', right:'24px', background:'#1a1a2e', color:'white', padding:'12px 22px', borderRadius:'12px', zIndex:9999, fontWeight:600 }}>{toast}</div>}

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'28px', flexWrap:'wrap', gap:'12px' }}>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.8rem', color:'#1a1a2e', margin:0 }}>Membership Packages</h1>
        <button onClick={openCreate} style={{ padding:'11px 24px', background:'linear-gradient(135deg,#0077C8,#005a96)', color:'white', border:'none', borderRadius:'50px', fontWeight:700, cursor:'pointer', fontSize:'0.95rem' }}>+ Add Package</button>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:'24px' }}>
        {packages.map(pkg=>{
          const imgs = pkg.images||[];
          const idx = sliderIdx[pkg.id]||0;
          return (
            <div key={pkg.id} style={{ background:'white', borderRadius:'20px', overflow:'hidden', boxShadow:'0 4px 20px rgba(0,0,0,0.08)', border:pkg.popular?'2px solid #0077C8':'2px solid transparent' }}>
              {/* Image slider */}
              <div style={{ position:'relative', height:'200px', background:'#f1f5f9' }}>
                {imgs.length>0 ? <>
                  <img src={imgs[idx]} alt={pkg.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  {imgs.length>1 && <>
                    <button onClick={()=>slideImg(pkg.id,-1,imgs.length)} style={{ position:'absolute', left:'10px', top:'50%', transform:'translateY(-50%)', background:'rgba(0,0,0,0.5)', color:'white', border:'none', borderRadius:'50%', width:'30px', height:'30px', cursor:'pointer' }}>‹</button>
                    <button onClick={()=>slideImg(pkg.id,1,imgs.length)} style={{ position:'absolute', right:'10px', top:'50%', transform:'translateY(-50%)', background:'rgba(0,0,0,0.5)', color:'white', border:'none', borderRadius:'50%', width:'30px', height:'30px', cursor:'pointer' }}>›</button>
                    <div style={{ position:'absolute', bottom:'8px', left:'50%', transform:'translateX(-50%)', display:'flex', gap:'4px' }}>
                      {imgs.map((_,i)=><div key={i} style={{ width:i===idx?'16px':'6px', height:'6px', borderRadius:'3px', background:i===idx?'white':'rgba(255,255,255,0.5)', transition:'all 0.2s', cursor:'pointer' }} onClick={()=>setSliderIdx(s=>({...s,[pkg.id]:i}))} />)}
                    </div>
                  </>}
                  <div style={{ position:'absolute', top:'10px', left:'10px', background:pkg.color||'#0077C8', color:'white', padding:'3px 12px', borderRadius:'20px', fontSize:'0.75rem', fontWeight:700 }}>{pkg.badge||'Package'}</div>
                  {pkg.popular && <div style={{ position:'absolute', top:'10px', right:'10px', background:'#f0a500', color:'white', padding:'3px 10px', borderRadius:'20px', fontSize:'0.72rem', fontWeight:700 }}>⭐ Popular</div>}
                </> : (
                  <div style={{ height:'100%', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', color:'#9ca3af' }}>
                    <div style={{ fontSize:'2.5rem', marginBottom:'8px' }}>📷</div>
                    <span style={{ fontSize:'0.85rem' }}>No images</span>
                  </div>
                )}
              </div>

              <div style={{ padding:'22px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'start', marginBottom:'8px' }}>
                  <div>
                    <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.2rem', color:'#1a1a2e', margin:'0 0 4px' }}>{pkg.name}</h3>
                    <div style={{ color:'#6b7280', fontSize:'0.82rem' }}>{pkg.duration} · {pkg.validity}</div>
                  </div>
                  <div style={{ color:'#0077C8', fontWeight:800, fontSize:'1.2rem' }}>₹{Number(pkg.price).toLocaleString()}</div>
                </div>
                <p style={{ color:'#4b5563', fontSize:'0.85rem', lineHeight:1.6, marginBottom:'12px' }}>{pkg.description}</p>
                <div style={{ marginBottom:'16px' }}>
                  {(pkg.features||[]).slice(0,3).map(f=><div key={f} style={{ fontSize:'0.82rem', color:'#374151', marginBottom:'3px' }}>✓ {f}</div>)}
                  {(pkg.features||[]).length>3 && <div style={{ fontSize:'0.8rem', color:'#0077C8', fontWeight:600 }}>+{pkg.features.length-3} more</div>}
                </div>
                <div style={{ display:'flex', gap:'8px' }}>
                  <button onClick={()=>openEdit(pkg)} style={{ flex:1, padding:'9px', background:'#e8f4ff', color:'#0077C8', border:'none', borderRadius:'50px', fontWeight:700, cursor:'pointer', fontSize:'0.88rem' }}>✏️ Edit</button>
                  <button onClick={()=>deletePkg(pkg.id)} style={{ flex:1, padding:'9px', background:'#fee2e2', color:'#dc2626', border:'none', borderRadius:'50px', fontWeight:700, cursor:'pointer', fontSize:'0.88rem' }}>🗑️ Delete</button>
                </div>
              </div>
            </div>
          );
        })}
        {packages.length===0 && (
          <div style={{ gridColumn:'1/-1', textAlign:'center', padding:'60px', color:'#9ca3af' }}>
            <div style={{ fontSize:'3rem', marginBottom:'12px' }}>📦</div>
            <p>No packages yet. Create your first one!</p>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.55)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
          <div style={{ background:'white', borderRadius:'20px', padding:'32px', maxWidth:'600px', width:'100%', maxHeight:'92vh', overflowY:'auto' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px' }}>
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.4rem', color:'#1a1a2e', margin:0 }}>{editing?'Edit Package':'Add Package'}</h2>
              <button onClick={()=>setShowForm(false)} style={{ background:'#f1f5f9', border:'none', borderRadius:'50%', width:'34px', height:'34px', cursor:'pointer', fontSize:'1.1rem' }}>✕</button>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px', marginBottom:'14px' }}>
              {[['name','Package Name','text'],['price','Price (₹)','number'],['duration','Duration','text'],['validity','Validity','text'],['badge','Badge Label','text'],['color','Accent Color','color']].map(([name,label,type])=>(
                <div key={name}>
                  <label style={{ display:'block', fontSize:'0.82rem', fontWeight:700, color:'#374151', marginBottom:'6px' }}>{label}</label>
                  <input name={name} type={type} value={form[name]||''} onChange={e=>setForm(f=>({...f,[name]:e.target.value}))}
                    placeholder={label} style={{ width:'100%', padding:'10px 14px', border:'2px solid #e2e8f0', borderRadius:'10px', fontSize:'0.9rem', outline:'none', boxSizing:'border-box' }} />
                </div>
              ))}
            </div>

            <div style={{ marginBottom:'14px' }}>
              <label style={{ display:'block', fontSize:'0.82rem', fontWeight:700, color:'#374151', marginBottom:'6px' }}>Description</label>
              <textarea value={form.description||''} onChange={e=>setForm(f=>({...f,description:e.target.value}))} rows={2}
                style={{ width:'100%', padding:'10px 14px', border:'2px solid #e2e8f0', borderRadius:'10px', fontSize:'0.9rem', outline:'none', resize:'vertical', boxSizing:'border-box' }} />
            </div>

            <div style={{ marginBottom:'14px' }}>
              <label style={{ display:'flex', alignItems:'center', gap:'8px', fontSize:'0.82rem', fontWeight:700, color:'#374151', cursor:'pointer' }}>
                <input type="checkbox" checked={form.popular||false} onChange={e=>setForm(f=>({...f,popular:e.target.checked}))} />
                Mark as Most Popular
              </label>
            </div>

            <div style={{ marginBottom:'14px' }}>
              <label style={{ display:'block', fontSize:'0.82rem', fontWeight:700, color:'#374151', marginBottom:'6px' }}>Features</label>
              <div style={{ display:'flex', gap:'8px', marginBottom:'8px' }}>
                <input value={featureInput} onChange={e=>setFeatureInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&(e.preventDefault(),addFeature())}
                  placeholder="Add a feature and press Enter"
                  style={{ flex:1, padding:'9px 14px', border:'2px solid #e2e8f0', borderRadius:'10px', fontSize:'0.88rem', outline:'none' }} />
                <button type="button" onClick={addFeature} style={{ padding:'9px 18px', background:'#0077C8', color:'white', border:'none', borderRadius:'10px', fontWeight:700, cursor:'pointer' }}>Add</button>
              </div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:'6px' }}>
                {(form.features||[]).map((f,i)=>(
                  <span key={i} style={{ display:'inline-flex', alignItems:'center', gap:'6px', padding:'4px 12px', background:'#e8f4ff', color:'#0077C8', borderRadius:'20px', fontSize:'0.82rem', fontWeight:600 }}>
                    {f} <button type="button" onClick={()=>removeFeature(i)} style={{ background:'none', border:'none', cursor:'pointer', color:'#0077C8', fontWeight:700, padding:0, fontSize:'0.9rem' }}>×</button>
                  </span>
                ))}
              </div>
            </div>

            <div style={{ marginBottom:'20px' }}>
              <label style={{ display:'block', fontSize:'0.82rem', fontWeight:700, color:'#374151', marginBottom:'8px' }}>Package Photos</label>
              <MultiImageUpload values={form.images||[]} onChange={imgs=>setForm(f=>({...f,images:imgs}))} />
            </div>

            <div style={{ display:'flex', gap:'10px', justifyContent:'flex-end' }}>
              <button onClick={()=>setShowForm(false)} style={{ padding:'11px 24px', background:'#f1f5f9', border:'none', borderRadius:'50px', fontWeight:600, cursor:'pointer' }}>Cancel</button>
              <button onClick={save} disabled={saving} style={{ padding:'11px 28px', background:'linear-gradient(135deg,#0077C8,#005a96)', color:'white', border:'none', borderRadius:'50px', fontWeight:700, cursor:'pointer' }}>{saving?'Saving...':'Save Package'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Packages;
