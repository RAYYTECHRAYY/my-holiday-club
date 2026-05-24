import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

const api = axios.create({ baseURL: '' });

/* ─────────────────────────────────────────────
   DESTINATIONS helpers
───────────────────────────────────────────── */
const CITY_REGION_MAP = {
  'gurugram':'north-india','gurgaon':'north-india','delhi':'north-india','new delhi':'north-india','noida':'north-india',
  'agra':'north-india','varanasi':'north-india','lucknow':'north-india','kanpur':'north-india','prayagraj':'north-india',
  'allahabad':'north-india','chandigarh':'north-india','amritsar':'north-india','jaipur':'north-india','jodhpur':'north-india',
  'udaipur':'north-india','ajmer':'north-india','pushkar':'north-india','shimla':'north-india','manali':'north-india',
  'dharamshala':'north-india','mussoorie':'north-india','dehradun':'north-india','rishikesh':'north-india','haridwar':'north-india',
  'nainital':'north-india','gwalior':'north-india','bhopal':'north-india','indore':'north-india','jabalpur':'north-india',
  'mathura':'north-india','vrindavan':'north-india','ayodhya':'north-india','khajuraho':'north-india',
  'srinagar':'north-india','leh':'north-india','ladakh':'north-india','jammu':'north-india','pahalgam':'north-india',
  'gulmarg':'north-india','mcleodganj':'north-india','kasol':'north-india','dalhousie':'north-india',
  'chennai':'south-india','madurai':'south-india','coimbatore':'south-india','bangalore':'south-india','bengaluru':'south-india',
  'mysore':'south-india','mysuru':'south-india','ooty':'south-india','hyderabad':'south-india','kochi':'south-india',
  'cochin':'south-india','thiruvananthapuram':'south-india','munnar':'south-india','alleppey':'south-india','wayanad':'south-india',
  'puducherry':'south-india','pondicherry':'south-india','kovalam':'south-india','kodaikanal':'south-india',
  'vizag':'south-india','visakhapatnam':'south-india','hampi':'south-india','coorg':'south-india','varkala':'south-india',
  'mumbai':'west-india','pune':'west-india','nashik':'west-india','goa':'west-india','panaji':'west-india',
  'ahmedabad':'west-india','surat':'west-india','vadodara':'west-india','somnath':'west-india','dwarka':'west-india',
  'lonavala':'west-india','mahabaleshwar':'west-india','shirdi':'west-india','mount abu':'west-india',
  'kolkata':'east-india','darjeeling':'east-india','siliguri':'east-india','bhubaneswar':'east-india','puri':'east-india',
  'guwahati':'east-india','shillong':'east-india','gangtok':'east-india','patna':'east-india','ranchi':'east-india',
  'meghalaya':'east-india','sikkim':'east-india','assam':'east-india','digha':'east-india','sundarbans':'east-india',
  'dubai':'dubai','abu dhabi':'dubai','sharjah':'dubai',
  'maldives':'maldives','male':'maldives',
  'bangkok':'thailand','phuket':'thailand','pattaya':'thailand','chiang mai':'thailand','krabi':'thailand','thailand':'thailand',
};

function suggestRegion(city, state) {
  const c = (city||'').toLowerCase().trim();
  const s = (state||'').toLowerCase().trim();
  if (CITY_REGION_MAP[c]) return CITY_REGION_MAP[c];
  if (CITY_REGION_MAP[s]) return CITY_REGION_MAP[s];
  for (const [key, rid] of Object.entries(CITY_REGION_MAP)) {
    if (c.includes(key) || key.includes(c)) return rid;
    if (s.includes(key) || key.includes(s)) return rid;
  }
  return 'north-india';
}

/* ── Flexible column matcher ── */
function matchCol(headers, ...candidates) {
  const lower = headers.map(h => (h||'').toString().toLowerCase().trim());
  for (const c of candidates) {
    const idx = lower.findIndex(h => h === c.toLowerCase());
    if (idx >= 0) return headers[idx];
  }
  // partial match
  for (const c of candidates) {
    const idx = lower.findIndex(h => h.includes(c.toLowerCase()) || c.toLowerCase().includes(h));
    if (idx >= 0) return headers[idx];
  }
  return null;
}

function parseDestText(raw) {
  const lines = raw.split('\n').map(l=>l.trim()).filter(Boolean);
  const entries=[]; let currentCity=null,currentState=null,pending=null;
  const STAR_RE=/[–\-—]\s*(\d)\s*[Ss]tar/,HOME_RE=/home\s*stay|haveli|heritage|homestay/i,URL_RE=/^(https?:\/\/|google\.com\/maps|maps\.google|goo\.gl)/i;
  const push=()=>{if(pending){entries.push(pending);pending=null;}};
  for(const line of lines){
    if(URL_RE.test(line)){if(pending)pending.mapsUrl=line.startsWith('http')?line:'https://'+line;continue;}
    const sm=STAR_RE.exec(line);
    if(sm){push();const name=line.replace(STAR_RE,'').replace(/[–\-—]\s*$/,'').trim();const regionId=suggestRegion(currentCity,currentState);
      pending={name,starRating:parseInt(sm[1]),type:parseInt(sm[1])>=4?'Hotel':'Resort',city:currentCity,state:currentState,
        location:currentCity?`${currentCity}${currentState?', '+currentState:''}`:'',mapsUrl:'',regionId};continue;}
    if(HOME_RE.test(line)){push();const regionId=suggestRegion(currentCity,currentState);
      pending={name:line,starRating:0,type:'Resort',city:currentCity,state:currentState,
        location:currentCity?`${currentCity}${currentState?', '+currentState:''}`:'',mapsUrl:'',regionId};continue;}
    // Check if line has star info embedded like "Hotel Name 4 Star" or "Hotel Name (4 star)"
    const embeddedStar = /^(.+?)\s*[\(\[]*(\d)\s*[Ss]tar[\)\]]*\s*$/.exec(line);
    if(embeddedStar){push();const name=embeddedStar[1].replace(/[–\-—,]\s*$/,'').trim();const stars=parseInt(embeddedStar[2]);
      const regionId=suggestRegion(currentCity,currentState);
      pending={name,starRating:stars,type:stars>=4?'Hotel':'Resort',city:currentCity,state:currentState,
        location:currentCity?`${currentCity}${currentState?', '+currentState:''}`:'',mapsUrl:'',regionId};continue;}
    push();const parts=line.split(/\s*[-–—]\s*/);
    if(parts.length>=2){currentCity=parts[0].trim();currentState=parts[1].trim();}else{currentCity=line;currentState=null;}
  }
  push();return entries;
}

function parseDestExcel(buffer){
  const wb=XLSX.read(buffer,{type:'array'});const ws=wb.Sheets[wb.SheetNames[0]];
  const rows=XLSX.utils.sheet_to_json(ws,{defval:''});
  if(!rows.length) return [];
  const headers=Object.keys(rows[0]);

  // Flexible column matching
  const colName = matchCol(headers, 'Hotel Name','Property Name','Resort Name','Name','property','hotel','resort');
  const colCity = matchCol(headers, 'City','Town','Place','Location','city name');
  const colState = matchCol(headers, 'State','Province','Country','Region','state name');
  const colStars = matchCol(headers, 'Star Rating','Stars','Star','Rating','star rating');
  const colType = matchCol(headers, 'Type','Property Type','Category','Hotel Type','type');
  const colMaps = matchCol(headers, 'Maps URL','Google Maps','Maps Link','Map URL','Maps','maps url','map','location url');
  const colPrice = matchCol(headers, 'Price','Rate','Cost','Price Per Night','price per night','price');
  const colDesc = matchCol(headers, 'Description','Desc','About','Details');

  return rows.map(r=>{
    const name = String(r[colName] || '').trim();
    if(!name) return null;
    const city = String(r[colCity] || '').trim();
    const state = String(r[colState] || '').trim();
    const stars = parseInt(r[colStars] || 0) || 0;
    const typeVal = String(r[colType] || '').trim();
    return {
      name,
      starRating: stars,
      type: typeVal || (stars >= 4 ? 'Hotel' : 'Resort'),
      city,
      state,
      location: city ? `${city}${state ? ', '+state : ''}` : '',
      mapsUrl: String(r[colMaps] || '').trim(),
      price: parseInt(String(r[colPrice] || '0').replace(/[^0-9]/g,'')) || 0,
      description: String(r[colDesc] || '').trim(),
      regionId: suggestRegion(city, state),
    };
  }).filter(Boolean);
}

/* ─────────────────────────────────────────────
   PACKAGES helpers
───────────────────────────────────────────── */
const PKG_COLORS=['#0077C8','#7c3aed','#f59e0b','#10b981','#ef4444','#0ea5e9','#db2777','#059669'];

function parsePackageText(raw) {
  const blocks = raw.split(/\n\s*[-—]{3,}\s*\n|\n{2,}/);
  const packages = [];
  for (const block of blocks) {
    if (!block.trim()) continue;
    const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
    if (!lines.length) continue;
    const pkg = { name: '', price: 0, duration: '', validity: '', badge: '', color: '', features: [], description: '', popular: false, images: [] };
    pkg.name = lines[0].replace(/^package\s*name\s*[:：]\s*/i, '').trim();
    for (const line of lines.slice(1)) {
      const [key, ...rest] = line.split(/[:：]/);
      const val = rest.join(':').trim();
      const k = key.trim().toLowerCase();
      if (k === 'price' || k === 'cost' || k === 'amount' || k === 'mrp') pkg.price = parseInt(val.replace(/[^0-9]/g,''))||0;
      else if (k === 'duration' || k === 'nights' || k === 'days' || k === 'stay') pkg.duration = val;
      else if (k === 'validity' || k === 'valid' || k === 'valid for' || k === 'expiry') pkg.validity = val;
      else if (k === 'badge' || k === 'tier' || k === 'label' || k === 'plan') pkg.badge = val;
      else if (k === 'color' || k === 'colour') pkg.color = val;
      else if (k === 'popular' || k === 'recommended') pkg.popular = /yes|true|1/i.test(val);
      else if (k === 'description' || k === 'desc' || k === 'details' || k === 'about') pkg.description = val;
      else if (k === 'features' || k === 'includes' || k === 'benefits' || k === 'amenities' || k === 'perks') pkg.features = val.split(',').map(f=>f.trim()).filter(Boolean);
      else if (k === 'image' || k === 'images' || k === 'photo' || k === 'photos') pkg.images = val.split(',').map(u=>u.trim()).filter(Boolean);
    }
    if (pkg.name) packages.push(pkg);
  }
  return packages;
}

function parsePackageExcel(buffer){
  const wb=XLSX.read(buffer,{type:'array'});const ws=wb.Sheets[wb.SheetNames[0]];
  const rows=XLSX.utils.sheet_to_json(ws,{defval:''});
  if(!rows.length) return [];
  const headers=Object.keys(rows[0]);

  const colName = matchCol(headers, 'Package Name','Name','Plan Name','Plan','Package','package name');
  const colPrice = matchCol(headers, 'Price','Cost','Amount','MRP','Rate','price');
  const colDuration = matchCol(headers, 'Duration','Nights','Days','Stay','duration');
  const colValidity = matchCol(headers, 'Validity','Valid For','Expiry','Valid','validity');
  const colBadge = matchCol(headers, 'Badge','Tier','Label','Plan','badge');
  const colColor = matchCol(headers, 'Color','Colour','Accent','color');
  const colFeatures = matchCol(headers, 'Features','Includes','Benefits','Amenities','Perks','features');
  const colPopular = matchCol(headers, 'Popular','Recommended','Featured','popular');
  const colDesc = matchCol(headers, 'Description','Desc','About','Details','description');

  return rows.map((r,i)=>{
    const name=String(r[colName]||'').trim();
    if(!name)return null;
    const features=String(r[colFeatures]||'').split(',').map(f=>f.trim()).filter(Boolean);
    return{
      name,
      price:parseInt(String(r[colPrice]||'0').replace(/[^0-9]/g,''))||0,
      duration:String(r[colDuration]||'3 Nights / 4 Days').trim(),
      validity:String(r[colValidity]||'2 Years').trim(),
      badge:String(r[colBadge]||name.split(' ')[0]).trim(),
      color:String(r[colColor]||PKG_COLORS[i%PKG_COLORS.length]).trim(),
      features,
      description:String(r[colDesc]||'').trim(),
      popular:/yes|true|1/i.test(String(r[colPopular]||'')),
      images:[],
    };
  }).filter(Boolean);
}

/* ─────────────────────────────────────────────
   SHARED components
───────────────────────────────────────────── */
const Stars=({n})=>n?<span style={{color:'#f59e0b',fontSize:'0.85rem'}}>{'★'.repeat(n)}{'☆'.repeat(5-n)}</span>:<span style={{fontSize:'0.72rem',color:'#9ca3af'}}>Home Stay</span>;

const RegionBadge=({regionId,regions})=>{
  const r=regions.find(x=>x.id===regionId);
  if(!r)return<span style={{color:'#ef4444',fontSize:'0.75rem'}}>⚠ Not set</span>;
  const intl=r.type==='international';
  return<span style={{display:'inline-flex',alignItems:'center',gap:4,background:intl?'#fef3c7':'#e8f4ff',color:intl?'#92400e':'#1e40af',padding:'2px 8px',borderRadius:20,fontSize:'0.75rem',fontWeight:600}}>{intl?'🌍':'🇮🇳'} {r.name}</span>;
};

/* ─────────────────────────────────────────────
   DESTINATIONS edit modal
───────────────────────────────────────────── */
const DestEditModal=({row,regions,onSave,onClose})=>{
  const[form,setForm]=useState({...row});const f=(k,v)=>setForm(p=>({...p,[k]:v}));
  const inp={width:'100%',padding:'8px 11px',border:'1.5px solid #e5e7eb',borderRadius:'7px',fontSize:'0.88rem',fontFamily:'inherit',boxSizing:'border-box'};
  const lbl={fontSize:'0.78rem',fontWeight:600,color:'#374151',display:'block',marginBottom:4};
  const nationals=regions.filter(r=>r.type==='national'),intls=regions.filter(r=>r.type==='international');
  return(
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.45)',zIndex:2000,display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
      <div style={{background:'#fff',borderRadius:16,padding:28,width:'100%',maxWidth:520,maxHeight:'90vh',overflowY:'auto',boxShadow:'0 24px 60px rgba(0,0,0,0.18)'}}>
        <h3 style={{margin:'0 0 20px',fontSize:'1.05rem',fontWeight:800,color:'#1a1a2e'}}>Edit Property</h3>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
          <div style={{gridColumn:'1/-1'}}><label style={lbl}>Property Name</label><input style={inp} value={form.name||''} onChange={e=>f('name',e.target.value)}/></div>
          <div><label style={lbl}>City</label><input style={inp} value={form.city||''} onChange={e=>f('city',e.target.value)}/></div>
          <div><label style={lbl}>State</label><input style={inp} value={form.state||''} onChange={e=>f('state',e.target.value)}/></div>
          <div><label style={lbl}>Star Rating</label>
            <select style={inp} value={form.starRating||0} onChange={e=>f('starRating',parseInt(e.target.value))}>
              <option value={0}>— Home Stay</option>{[1,2,3,4,5].map(n=><option key={n} value={n}>{n} Star</option>)}
            </select></div>
          <div><label style={lbl}>Type</label>
            <select style={inp} value={form.type||'Hotel'} onChange={e=>f('type',e.target.value)}>
              {['Hotel','Resort','Heritage','Homestay','Boutique Hotel','Service Apartment'].map(t=><option key={t}>{t}</option>)}
            </select></div>
          <div style={{gridColumn:'1/-1'}}><label style={lbl}>Assign to Region</label>
            <select style={inp} value={form.regionId||''} onChange={e=>f('regionId',e.target.value)}>
              <optgroup label="🇮🇳 National">{nationals.map(r=><option key={r.id} value={r.id}>{r.name}</option>)}</optgroup>
              <optgroup label="🌍 International">{intls.map(r=><option key={r.id} value={r.id}>{r.name}</option>)}</optgroup>
            </select></div>
          <div style={{gridColumn:'1/-1'}}><label style={lbl}>Google Maps URL</label>
            <input style={inp} value={form.mapsUrl||''} onChange={e=>f('mapsUrl',e.target.value)} placeholder="https://maps.google.com/..."/></div>
        </div>
        <div style={{display:'flex',gap:12,marginTop:22,justifyContent:'flex-end'}}>
          <button onClick={onClose} style={{padding:'9px 18px',background:'#f3f4f6',border:'none',borderRadius:8,cursor:'pointer',fontWeight:600}}>Cancel</button>
          <button onClick={()=>{onSave(form);onClose();}} style={{padding:'9px 20px',background:'linear-gradient(135deg,#0077C8,#005fa3)',color:'#fff',border:'none',borderRadius:8,cursor:'pointer',fontWeight:700}}>Save</button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   PACKAGE edit modal
───────────────────────────────────────────── */
const PkgEditModal=({row,onSave,onClose})=>{
  const[form,setForm]=useState({...row,features:Array.isArray(row.features)?row.features.join(', '):row.features||''});
  const f=(k,v)=>setForm(p=>({...p,[k]:v}));
  const inp={width:'100%',padding:'8px 11px',border:'1.5px solid #e5e7eb',borderRadius:'7px',fontSize:'0.88rem',fontFamily:'inherit',boxSizing:'border-box'};
  const lbl={fontSize:'0.78rem',fontWeight:600,color:'#374151',display:'block',marginBottom:4};
  const save=()=>{onSave({...form,features:form.features.split(',').map(x=>x.trim()).filter(Boolean)});onClose();};
  return(
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.45)',zIndex:2000,display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
      <div style={{background:'#fff',borderRadius:16,padding:28,width:'100%',maxWidth:560,maxHeight:'90vh',overflowY:'auto',boxShadow:'0 24px 60px rgba(0,0,0,0.18)'}}>
        <h3 style={{margin:'0 0 20px',fontSize:'1.05rem',fontWeight:800,color:'#1a1a2e'}}>Edit Package</h3>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
          <div style={{gridColumn:'1/-1'}}><label style={lbl}>Package Name *</label><input style={inp} value={form.name||''} onChange={e=>f('name',e.target.value)}/></div>
          <div><label style={lbl}>Price (₹)</label><input style={inp} type="number" value={form.price||0} onChange={e=>f('price',parseInt(e.target.value)||0)}/></div>
          <div><label style={lbl}>Badge / Tier</label><input style={inp} value={form.badge||''} onChange={e=>f('badge',e.target.value)} placeholder="e.g. Starter"/></div>
          <div><label style={lbl}>Duration</label><input style={inp} value={form.duration||''} onChange={e=>f('duration',e.target.value)} placeholder="3 Nights / 4 Days"/></div>
          <div><label style={lbl}>Validity</label><input style={inp} value={form.validity||''} onChange={e=>f('validity',e.target.value)} placeholder="2 Years"/></div>
          <div style={{gridColumn:'1/-1'}}><label style={lbl}>Description</label><textarea style={{...inp,minHeight:70,resize:'vertical'}} value={form.description||''} onChange={e=>f('description',e.target.value)}/></div>
          <div style={{gridColumn:'1/-1'}}><label style={lbl}>Features (comma-separated)</label><textarea style={{...inp,minHeight:80,resize:'vertical'}} value={form.features||''} onChange={e=>f('features',e.target.value)} placeholder="3 Nights Stay, Breakfast, Airport Transfers"/></div>
          <div><label style={lbl}>Accent Color</label>
            <div style={{display:'flex',gap:8,flexWrap:'wrap',marginTop:4}}>
              {PKG_COLORS.map(c=><div key={c} onClick={()=>f('color',c)} style={{width:28,height:28,borderRadius:'50%',background:c,cursor:'pointer',border:form.color===c?'3px solid #1a1a2e':'3px solid transparent',transition:'border 0.15s'}}/>)}
            </div></div>
          <div><label style={lbl}>Popular</label>
            <label style={{display:'flex',alignItems:'center',gap:8,marginTop:8,cursor:'pointer'}}>
              <input type="checkbox" checked={!!form.popular} onChange={e=>f('popular',e.target.checked)} style={{width:16,height:16,accentColor:'#0077C8'}}/>
              <span style={{fontSize:'0.88rem',color:'#374151'}}>Mark as Popular</span>
            </label></div>
        </div>
        <div style={{display:'flex',gap:12,marginTop:22,justifyContent:'flex-end'}}>
          <button onClick={onClose} style={{padding:'9px 18px',background:'#f3f4f6',border:'none',borderRadius:8,cursor:'pointer',fontWeight:600}}>Cancel</button>
          <button onClick={save} style={{padding:'9px 20px',background:'linear-gradient(135deg,#0077C8,#005fa3)',color:'#fff',border:'none',borderRadius:8,cursor:'pointer',fontWeight:700}}>Save</button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   BULK REMOVE COMPONENT
───────────────────────────────────────────── */
const BulkRemove = () => {
  const [removeMode, setRemoveMode] = useState('destinations');
  const [search, setSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [result, setResult] = useState(null);
  const [regions, setRegions] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => { api.get('/api/regions').then(r => setRegions(r.data.data || [])); }, []);

  const nationals = regions.filter(r => r.type === 'national');
  const internationals = regions.filter(r => r.type === 'international');

  const fetchItems = async () => {
    setLoading(true); setResult(null); setSelected([]);
    try {
      if (removeMode === 'destinations') {
        const params = {};
        if (search.trim()) params.q = search.trim();
        if (regionFilter) params.regionId = regionFilter;
        const res = await api.get('/api/search-properties', { params });
        setItems(res.data.data || []);
      } else {
        const params = {};
        if (search.trim()) params.q = search.trim();
        const res = await api.get('/api/search-packages', { params });
        setItems(res.data.data || []);
      }
      setHasSearched(true);
    } catch { setItems([]); }
    setLoading(false);
  };

  const loadAll = async () => {
    setLoading(true); setResult(null); setSelected([]); setSearch(''); setRegionFilter('');
    try {
      if (removeMode === 'destinations') {
        const res = await api.get('/api/properties');
        setItems(res.data.data || []);
      } else {
        const res = await api.get('/api/packages');
        setItems(res.data.data || []);
      }
      setHasSearched(true);
    } catch { setItems([]); }
    setLoading(false);
  };

  const toggleSelect = id => setSelected(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id]);
  const toggleAll = () => setSelected(selected.length === items.length ? [] : items.map(i => i.id));

  const handleRemove = async () => {
    setRemoving(true); setShowConfirm(false);
    try {
      if (removeMode === 'destinations') {
        const res = await api.post('/api/bulk-remove-properties', { propertyIds: selected });
        setResult({ removed: res.data.removed, remaining: res.data.remaining, mode: 'destinations' });
      } else {
        const res = await api.post('/api/bulk-remove-packages', { packageIds: selected });
        setResult({ removed: res.data.removed, remaining: res.data.remaining, mode: 'packages' });
      }
      setItems(prev => prev.filter(i => !selected.includes(i.id)));
      setSelected([]);
    } catch { alert('Remove failed. Please try again.'); }
    setRemoving(false);
  };

  const switchMode = m => { setRemoveMode(m); setItems([]); setSelected([]); setSearch(''); setRegionFilter(''); setResult(null); setHasSearched(false); };

  const regionName = id => { const r = regions.find(x => x.id === id); return r ? r.name : id; };

  const MODE = active => ({ padding: '12px 28px', border: 'none', borderRadius: 10, background: active ? 'linear-gradient(135deg,#dc2626,#b91c1c)' : '#f3f4f6', color: active ? '#fff' : '#6b7280', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' });
  const inp = { padding: '10px 14px', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: '0.9rem', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' };

  return (
    <div>
      {/* Mode switcher */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, background: '#f8fafc', padding: 6, borderRadius: 14, width: 'fit-content', border: '1.5px solid #e5e7eb' }}>
        <button style={MODE(removeMode === 'destinations')} onClick={() => switchMode('destinations')}>🏨 Remove Properties</button>
        <button style={MODE(removeMode === 'packages')} onClick={() => switchMode('packages')}>📋 Remove Packages</button>
      </div>

      {/* Success */}
      {result && (
        <div style={{ background: '#fef2f2', border: '1.5px solid #fca5a5', borderRadius: 12, padding: '18px 24px', marginBottom: 20, display: 'flex', gap: 16, alignItems: 'center' }}>
          <span style={{ fontSize: '2rem' }}>🗑️</span>
          <div>
            <div style={{ fontWeight: 800, color: '#991b1b', fontSize: '1rem' }}>Removed {result.removed} {result.mode === 'packages' ? 'packages' : 'properties'}</div>
            <div style={{ fontSize: '0.85rem', color: '#b91c1c', marginTop: 3 }}>{result.remaining} remaining in database</div>
          </div>
        </div>
      )}

      {/* Search bar */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #e5e7eb', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', padding: 24, marginBottom: 20 }}>
        <div style={{ fontWeight: 800, color: '#1a1a2e', fontSize: '1rem', marginBottom: 14 }}>
          🔍 Search & Filter {removeMode === 'destinations' ? 'Properties' : 'Packages'}
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>Search by name{removeMode === 'destinations' ? ', city, or type' : ' or description'}</label>
            <input style={{ ...inp, width: '100%' }} value={search} onChange={e => setSearch(e.target.value)}
              placeholder={removeMode === 'destinations' ? 'e.g. Oberoi, Goa, Resort...' : 'e.g. Premium, Starter...'}
              onKeyDown={e => e.key === 'Enter' && fetchItems()} />
          </div>
          {removeMode === 'destinations' && (
            <div style={{ minWidth: 180 }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>Filter by Region</label>
              <select style={{ ...inp, width: '100%' }} value={regionFilter} onChange={e => setRegionFilter(e.target.value)}>
                <option value="">All Regions</option>
                <optgroup label="🇮🇳 National">{nationals.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}</optgroup>
                <optgroup label="🌍 International">{internationals.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}</optgroup>
              </select>
            </div>
          )}
          <button onClick={fetchItems} style={{ padding: '10px 24px', background: 'linear-gradient(135deg,#0077C8,#005fa3)', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem' }}>🔍 Search</button>
          <button onClick={loadAll} style={{ padding: '10px 24px', background: '#f3f4f6', border: '1.5px solid #e5e7eb', borderRadius: 10, cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem', color: '#374151' }}>Show All</button>
        </div>
      </div>

      {/* Results */}
      {loading && <div style={{ textAlign: 'center', padding: 40, color: '#0077C8', fontWeight: 700 }}>Loading...</div>}

      {!loading && hasSearched && items.length === 0 && (
        <div style={{ textAlign: 'center', padding: 40, color: '#9ca3af' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>📭</div>
          <div style={{ fontWeight: 700, color: '#374151' }}>No {removeMode === 'destinations' ? 'properties' : 'packages'} found</div>
          <div style={{ fontSize: '0.85rem', marginTop: 4 }}>Try a different search or filter</div>
        </div>
      )}

      {!loading && items.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
            <div style={{ fontWeight: 800, color: '#1a1a2e', fontSize: '1rem' }}>
              {items.length} {removeMode === 'destinations' ? 'properties' : 'packages'} found
              <span style={{ fontSize: '0.82rem', fontWeight: 500, color: '#6b7280', marginLeft: 8 }}>{selected.length} selected for removal</span>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={toggleAll} style={{ padding: '8px 16px', background: '#f3f4f6', border: '1.5px solid #e5e7eb', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: '0.83rem', color: '#374151' }}>
                {selected.length === items.length ? 'Deselect All' : 'Select All'}
              </button>
              <button onClick={() => setShowConfirm(true)} disabled={removing || selected.length === 0}
                style={{ padding: '8px 22px', background: removing ? '#fca5a5' : selected.length === 0 ? '#e5e7eb' : 'linear-gradient(135deg,#dc2626,#b91c1c)', color: selected.length === 0 ? '#9ca3af' : '#fff', border: 'none', borderRadius: 8, cursor: removing || selected.length === 0 ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: '0.9rem' }}>
                {removing ? 'Removing…' : `🗑️ Remove ${selected.length}`}
              </button>
            </div>
          </div>

          {/* Items list */}
          {removeMode === 'destinations' ? (
            <div style={{ background: '#fff', borderRadius: 12, border: '1.5px solid #e5e7eb', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    <th style={{ padding: '10px 14px', width: 36 }}>
                      <input type="checkbox" checked={selected.length === items.length && items.length > 0} onChange={toggleAll} style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#dc2626' }} />
                    </th>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: '#374151' }}>Property Name</th>
                    <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 700, color: '#374151' }}>City</th>
                    <th style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 700, color: '#374151', width: 80 }}>Stars</th>
                    <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 700, color: '#374151', width: 90 }}>Type</th>
                    <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 700, color: '#374151' }}>Region</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(p => {
                    const isSel = selected.includes(p.id);
                    return (
                      <tr key={p.id} style={{ borderTop: '1px solid #f3f4f6', background: isSel ? '#fef2f2' : '#fff', cursor: 'pointer' }} onClick={() => toggleSelect(p.id)}>
                        <td style={{ padding: '10px 14px' }}>
                          <input type="checkbox" checked={isSel} onChange={() => toggleSelect(p.id)} style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#dc2626' }} />
                        </td>
                        <td style={{ padding: '10px 14px', fontWeight: 600, color: isSel ? '#dc2626' : '#1a1a2e' }}>{p.name}</td>
                        <td style={{ padding: '10px 12px', color: '#6b7280' }}>{p.city || p.location || '—'}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'center' }}><Stars n={p.starRating} /></td>
                        <td style={{ padding: '10px 12px' }}>
                          <span style={{ background: '#f3f4f6', padding: '2px 8px', borderRadius: 20, fontSize: '0.74rem', fontWeight: 600, color: '#374151' }}>{p.type}</span>
                        </td>
                        <td style={{ padding: '10px 12px', fontSize: '0.8rem', color: '#6b7280' }}>{regionName(p.regionId)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
              {items.map(pkg => {
                const isSel = selected.includes(pkg.id);
                return (
                  <div key={pkg.id} onClick={() => toggleSelect(pkg.id)}
                    style={{ background: '#fff', border: `2px solid ${isSel ? '#dc2626' : '#e5e7eb'}`, borderRadius: 14, padding: 18, cursor: 'pointer', transition: 'all 0.2s', boxShadow: isSel ? '0 4px 16px rgba(220,38,38,0.1)' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                      <input type="checkbox" checked={isSel} onChange={() => toggleSelect(pkg.id)} style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#dc2626' }} />
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: pkg.color || '#0077C8', flexShrink: 0 }} />
                      <div style={{ fontWeight: 800, color: isSel ? '#dc2626' : '#1a1a2e', fontSize: '0.95rem', flex: 1 }}>{pkg.name}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ background: '#f3f4f6', color: '#374151', padding: '2px 8px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600 }}>₹{(pkg.price || 0).toLocaleString('en-IN')}</span>
                      {pkg.duration && <span style={{ background: '#e8f4ff', color: '#1e40af', padding: '2px 8px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600 }}>{pkg.duration}</span>}
                      {pkg.badge && <span style={{ background: pkg.color || '#0077C8', color: '#fff', padding: '2px 8px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700 }}>{pkg.badge}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Bottom action */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
            <button onClick={() => setShowConfirm(true)} disabled={removing || selected.length === 0}
              style={{ padding: '12px 32px', background: removing ? '#fca5a5' : selected.length === 0 ? '#e5e7eb' : 'linear-gradient(135deg,#dc2626,#b91c1c)', color: selected.length === 0 ? '#9ca3af' : '#fff', border: 'none', borderRadius: 10, cursor: removing || selected.length === 0 ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: '1rem', boxShadow: selected.length > 0 ? '0 4px 14px rgba(220,38,38,0.3)' : 'none' }}>
              {removing ? 'Removing…' : `🗑️ Remove ${selected.length} ${removeMode === 'destinations' ? 'Properties' : 'Packages'}`}
            </button>
          </div>
        </div>
      )}

      {/* Confirmation modal */}
      {showConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: '36px 32px', maxWidth: 420, textAlign: 'center', boxShadow: '0 24px 80px rgba(0,0,0,0.20)' }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>⚠️</div>
            <h3 style={{ margin: '0 0 8px', fontWeight: 800, color: '#991b1b' }}>Confirm Bulk Remove</h3>
            <p style={{ color: '#6b7280', marginBottom: 8, fontSize: '0.9rem' }}>
              You are about to permanently remove <strong style={{ color: '#dc2626' }}>{selected.length}</strong> {removeMode === 'destinations' ? 'properties' : 'packages'}.
            </p>
            <p style={{ color: '#ef4444', fontSize: '0.82rem', marginBottom: 24, fontWeight: 600 }}>This action cannot be undone!</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button onClick={() => setShowConfirm(false)} style={{ padding: '10px 24px', background: '#f3f4f6', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
              <button onClick={handleRemove} style={{ padding: '10px 24px', background: 'linear-gradient(135deg,#dc2626,#b91c1c)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                🗑️ Yes, Remove {selected.length}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
const BulkUpload = () => {
  const [topMode, setTopMode]       = useState('upload'); // upload | remove
  const [mode, setMode]             = useState('destinations'); // destinations | packages
  const [tab, setTab]               = useState('text');
  const [textInput, setTextInput]   = useState('');
  const [entries, setEntries]       = useState([]);
  const [regions, setRegions]       = useState([]);
  const [importing, setImporting]   = useState(false);
  const [result, setResult]         = useState(null);
  const [editIdx, setEditIdx]       = useState(null);
  const [selected, setSelected]     = useState([]);
  const [parsing, setParsing]       = useState(false);
  const [parseErrors, setParseErrors] = useState([]);
  const fileRef = useRef();

  const nationals      = regions.filter(r=>r.type==='national');
  const internationals = regions.filter(r=>r.type==='international');

  useEffect(()=>{api.get('/api/regions').then(r=>setRegions(r.data.data||[]));}, []);

  const resetAll = () => { setEntries([]); setSelected([]); setResult(null); setTextInput(''); setParseErrors([]); };
  const switchMode = m => { setMode(m); resetAll(); setTab('text'); };

  // ── Parse
  const doParseText = () => {
    if (!textInput.trim()) return;
    const errors = [];
    const parsed = mode==='packages' ? parsePackageText(textInput) : parseDestText(textInput);
    if (parsed.length === 0) errors.push('No entries could be parsed. Check your format.');
    else {
      // Validate parsed entries
      parsed.forEach((e, i) => {
        if (mode === 'destinations') {
          if (!e.name) errors.push(`Row ${i+1}: Missing property name`);
          if (!e.city && !e.location) errors.push(`Row ${i+1}: Missing city for "${e.name}"`);
        } else {
          if (!e.name) errors.push(`Row ${i+1}: Missing package name`);
          if (!e.price) errors.push(`Row ${i+1}: Missing price for "${e.name}"`);
        }
      });
    }
    setParseErrors(errors);
    setEntries(parsed); setSelected(parsed.map((_,i)=>i)); setResult(null);
  };
  const handleExcelFile = file => {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const parsed = mode==='packages' ? parsePackageExcel(new Uint8Array(e.target.result)) : parseDestExcel(new Uint8Array(e.target.result));
        const errors = [];
        if (parsed.length === 0) errors.push('No entries found. Check that your Excel has the correct column headers.');
        setParseErrors(errors);
        setEntries(parsed); setSelected(parsed.map((_,i)=>i)); setResult(null);
      } catch(err) {
        setParseErrors(['Could not parse Excel file: ' + (err.message || 'Check column headers and file format.')]);
      }
    };
    reader.readAsArrayBuffer(file);
  };
  const handlePdfFile = async file => {
    setParsing(true); setParseErrors([]);
    const fd=new FormData(); fd.append('file',file);
    try {
      const res=await api.post('/api/parse-pdf',fd,{headers:{'Content-Type':'multipart/form-data'}});
      if(res.data.success){
        const rawText = res.data.text || '';
        if (!rawText.trim()) {
          setParseErrors(['PDF appears to be empty or contains only images/scans. Try pasting the text manually.']);
          setParsing(false); return;
        }
        const parsed=mode==='packages'?parsePackageText(rawText):parseDestText(rawText);
        const errors = [];
        if (parsed.length === 0) errors.push('Could not extract structured data from PDF. The text was extracted but did not match the expected format. Try pasting it in the Text tab and adjusting the format.');
        setParseErrors(errors);
        setEntries(parsed); setSelected(parsed.map((_,i)=>i)); setResult(null);
      }
    } catch(err) {
      setParseErrors(['PDF parsing failed: ' + (err.response?.data?.message || err.message || 'Try pasting the text manually.')]);
    }
    setParsing(false);
  };
  const handleDrop=e=>{e.preventDefault();const f=e.dataTransfer.files?.[0];if(!f)return;
    if(f.name.match(/\.xlsx?$/i))handleExcelFile(f);else if(f.name.endsWith('.pdf'))handlePdfFile(f);};

  // ── Entry management
  const toggleSelect=idx=>setSelected(p=>p.includes(idx)?p.filter(i=>i!==idx):[...p,idx]);
  const toggleAll=()=>setSelected(selected.length===entries.length?[]:entries.map((_,i)=>i));
  const updateEntry=(idx,upd)=>setEntries(p=>p.map((e,i)=>i===idx?upd:e));
  const removeEntry=idx=>{setEntries(p=>p.filter((_,i)=>i!==idx));setSelected(p=>p.filter(i=>i!==idx).map(i=>i>idx?i-1:i));};
  const removeSelected=()=>{if(!selected.length)return;setEntries(p=>p.filter((_,i)=>!selected.includes(i)));setSelected([]);};
  const bulkAssign=(regionId,scope)=>{if(!regionId)return;
    setEntries(p=>p.map((e,i)=>{if(!selected.includes(i))return e;
      if(scope==='national'&&regions.find(r=>r.id===regionId)?.type!=='national')return e;
      if(scope==='international'&&regions.find(r=>r.id===regionId)?.type!=='international')return e;
      return{...e,regionId};}));};

  // ── Import
  const handleImport=async()=>{
    const toImport=entries.filter((_,i)=>selected.includes(i));
    if(!toImport.length)return alert('Select at least one entry to import.');
    if(mode==='destinations'){
      const invalid=toImport.filter(e=>!regions.find(r=>r.id===e.regionId));
      if(invalid.length)return alert(`${invalid.length} entries have no valid region. Please assign all rows first.`);
    }
    setImporting(true);
    try{
      const endpoint=mode==='packages'?'/api/bulk-import-packages':'/api/bulk-import';
      const body=mode==='packages'?{packages:toImport}:{entries:toImport};
      const res=await api.post(endpoint,body);
      setResult({...res.data.created,mode});
      resetAll();
    }catch{alert('Import failed. Please try again.');}
    setImporting(false);
  };

  // ── Group destinations by city
  const grouped=mode==='destinations'?entries.reduce((acc,e,i)=>{const key=e.city||'Unknown';if(!acc[key])acc[key]=[];acc[key].push({...e,_idx:i});return acc;},{}):null;

  const TAB=active=>({padding:'10px 22px',border:'none',borderRadius:'10px 10px 0 0',background:active?'#fff':'transparent',color:active?'#0077C8':'#6b7280',fontWeight:active?700:500,fontSize:'0.9rem',cursor:'pointer',borderBottom:active?'2px solid #0077C8':'2px solid transparent',fontFamily:'inherit'});
  const MODE=active=>({padding:'12px 28px',border:'none',borderRadius:10,background:active?'linear-gradient(135deg,#0077C8,#005fa3)':'#f3f4f6',color:active?'#fff':'#6b7280',fontWeight:700,fontSize:'0.9rem',cursor:'pointer',fontFamily:'inherit',transition:'all 0.2s'});
  const TOPMODE=active=>({padding:'12px 32px',border:'none',borderRadius:12,background:active?'linear-gradient(135deg,#1a1a2e,#374151)':'#f3f4f6',color:active?'#fff':'#6b7280',fontWeight:800,fontSize:'0.95rem',cursor:'pointer',fontFamily:'inherit',transition:'all 0.2s'});

  const inputBox=(
    <div style={{background:'#fff',borderRadius:16,border:'1.5px solid #e5e7eb',boxShadow:'0 2px 12px rgba(0,0,0,0.05)',overflow:'hidden',marginBottom:24}}>
      <div style={{display:'flex',borderBottom:'1.5px solid #e5e7eb',padding:'0 20px',background:'#f8fafc'}}>
        {[['text','📝 Paste Text'],['excel','📊 Excel (.xlsx)'],['pdf','📄 PDF']].map(([k,l])=>(
          <button key={k} style={TAB(tab===k)} onClick={()=>{setTab(k);setEntries([]);setSelected([]);setResult(null);setParseErrors([]);}}>{l}</button>
        ))}
      </div>
      <div style={{padding:24}}>
        {tab==='text'&&(
          <div>
            {mode==='destinations'
              ? <div style={{fontSize:'0.82rem',color:'#6b7280',marginBottom:10,lineHeight:1.6}}>Format: <code style={{background:'#f3f4f6',padding:'1px 6px',borderRadius:4}}>City - State</code> → <code style={{background:'#f3f4f6',padding:'1px 6px',borderRadius:4}}>Hotel Name – 4 Star</code> → Maps URL</div>
              : <div style={{fontSize:'0.82rem',color:'#6b7280',marginBottom:10,lineHeight:1.6}}>
                  Each package separated by <code style={{background:'#f3f4f6',padding:'1px 6px',borderRadius:4}}>---</code> or a blank line. Fields: <strong>Name</strong> (first line), then <code style={{background:'#f3f4f6',padding:'1px 6px',borderRadius:4}}>Price:</code> <code style={{background:'#f3f4f6',padding:'1px 6px',borderRadius:4}}>Duration:</code> <code style={{background:'#f3f4f6',padding:'1px 6px',borderRadius:4}}>Validity:</code> <code style={{background:'#f3f4f6',padding:'1px 6px',borderRadius:4}}>Badge:</code> <code style={{background:'#f3f4f6',padding:'1px 6px',borderRadius:4}}>Features:</code> <code style={{background:'#f3f4f6',padding:'1px 6px',borderRadius:4}}>Color:</code> <code style={{background:'#f3f4f6',padding:'1px 6px',borderRadius:4}}>Popular: Yes/No</code>
                </div>
            }
            {mode==='packages'&&(
              <div style={{background:'#f0f9ff',border:'1px solid #bae6fd',borderRadius:10,padding:'12px 16px',marginBottom:12,fontSize:'0.8rem',color:'#0369a1',fontFamily:'monospace',whiteSpace:'pre-wrap'}}>
{`Holiday Starter
Price: 299999
Duration: 3 Nights / 4 Days
Validity: 2 Years
Badge: Starter
Color: #0077C8
Features: 3 Nights Stay, Breakfast, Airport Transfers, Welcome Kit
Popular: No
---
Premium Holidays
Price: 599999
Duration: 5 Nights / 6 Days
Validity: 3 Years
Badge: Premium
Color: #7c3aed
Features: 5 Nights, All Meals, Spa, 2 Destinations
Popular: Yes`}
              </div>
            )}
            <textarea value={textInput} onChange={e=>setTextInput(e.target.value)}
              placeholder={mode==='packages'?'Holiday Starter\nPrice: 299999\nDuration: 3 Nights / 4 Days\nValidity: 2 Years\nBadge: Starter\nFeatures: 3 Nights Stay, Breakfast, Airport Transfers\n---\nNext Package...':'Gurugram - Haryana\nRegenta Inn Gurugram – 3 Star\nhttps://maps.google.com/...'}
              style={{width:'100%',minHeight:200,padding:12,border:'1.5px solid #e5e7eb',borderRadius:10,fontSize:'0.88rem',fontFamily:'monospace',resize:'vertical',boxSizing:'border-box',outline:'none'}}/>
            <button onClick={doParseText} style={{marginTop:12,padding:'11px 28px',background:'linear-gradient(135deg,#0077C8,#005fa3)',color:'#fff',border:'none',borderRadius:10,cursor:'pointer',fontWeight:700,fontSize:'0.9rem'}}>🔍 Parse & Preview</button>
          </div>
        )}
        {tab==='excel'&&(
          <div>
            <div style={{background:'#f0f9ff',border:'1px solid #bae6fd',borderRadius:10,padding:'12px 16px',marginBottom:14,fontSize:'0.82rem',color:'#0369a1'}}>
              {mode==='packages'
                ? <><strong>Columns:</strong> Package Name · Price · Duration · Validity · Badge · Color · Features · Popular · Description<br/><span style={{fontSize:'0.76rem',color:'#6b7280'}}>Column names are flexible — e.g. "Name", "Plan Name", "Cost", "Amount" all work</span></>
                : <><strong>Columns:</strong> City · State · Hotel Name · Star Rating · Type · Maps URL · Price<br/><span style={{fontSize:'0.76rem',color:'#6b7280'}}>Column names are flexible — e.g. "Property Name", "Resort Name", "Stars", "Google Maps" all work</span></>}
            </div>
            <div onDrop={handleDrop} onDragOver={e=>e.preventDefault()} onClick={()=>fileRef.current.click()}
              style={{border:'2px dashed #d1d5db',borderRadius:12,padding:'40px 20px',textAlign:'center',cursor:'pointer',background:'#f9fafb'}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor='#0077C8';e.currentTarget.style.background='#f0f9ff';}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor='#d1d5db';e.currentTarget.style.background='#f9fafb';}}>
              <input ref={fileRef} type="file" accept=".xlsx,.xls" style={{display:'none'}} onChange={e=>e.target.files?.[0]&&handleExcelFile(e.target.files[0])}/>
              <div style={{fontSize:'2.5rem',marginBottom:10}}>📊</div>
              <div style={{fontWeight:700,color:'#374151',marginBottom:4}}>Click to upload or drag & drop</div>
              <div style={{fontSize:'0.78rem',color:'#9ca3af'}}>.xlsx / .xls</div>
            </div>
          </div>
        )}
        {tab==='pdf'&&(
          <div onDrop={handleDrop} onDragOver={e=>e.preventDefault()} onClick={()=>!parsing&&fileRef.current.click()}
            style={{border:'2px dashed #d1d5db',borderRadius:12,padding:'40px 20px',textAlign:'center',cursor:parsing?'wait':'pointer',background:'#f9fafb'}}>
            <input ref={fileRef} type="file" accept=".pdf" style={{display:'none'}} onChange={e=>e.target.files?.[0]&&handlePdfFile(e.target.files[0])}/>
            {parsing?<><div style={{fontSize:'2.5rem',marginBottom:10}}>⏳</div><div style={{fontWeight:700,color:'#0077C8'}}>Extracting…</div></>
              :<><div style={{fontSize:'2.5rem',marginBottom:10}}>📄</div><div style={{fontWeight:700,color:'#374151',marginBottom:4}}>Upload PDF</div><div style={{fontSize:'0.78rem',color:'#9ca3af'}}>Text-based · max 10 MB</div></>}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div style={{maxWidth:1000,margin:'0 auto',paddingBottom:60}}>
      {/* Header */}
      <div style={{marginBottom:24}}>
        <h2 style={{fontSize:'1.4rem',fontWeight:800,color:'#1a1a2e',margin:0}}>📦 Bulk Operations</h2>
        <p style={{fontSize:'0.83rem',color:'#6b7280',margin:'5px 0 0'}}>Import or remove destinations & packages in bulk.</p>
      </div>

      {/* Top mode switcher: Upload vs Remove */}
      <div style={{display:'flex',gap:10,marginBottom:24,background:'#f0f4f9',padding:6,borderRadius:14,width:'fit-content',border:'1.5px solid #e5e7eb'}}>
        <button style={TOPMODE(topMode==='upload')} onClick={()=>{setTopMode('upload');resetAll();}}>⬆ Bulk Upload</button>
        <button style={TOPMODE(topMode==='remove')} onClick={()=>{setTopMode('remove');resetAll();}}>🗑️ Bulk Remove</button>
      </div>

      {/* ── REMOVE MODE ── */}
      {topMode==='remove' && <BulkRemove />}

      {/* ── UPLOAD MODE ── */}
      {topMode==='upload' && (
        <>
          {/* Mode switcher */}
          <div style={{display:'flex',gap:10,marginBottom:24,background:'#f8fafc',padding:6,borderRadius:14,width:'fit-content',border:'1.5px solid #e5e7eb'}}>
            <button style={MODE(mode==='destinations')} onClick={()=>switchMode('destinations')}>🏨 Hotels & Resorts</button>
            <button style={MODE(mode==='packages')} onClick={()=>switchMode('packages')}>📋 Membership Packages</button>
          </div>

          {/* Download Templates */}
          <div style={{background:'#fff',borderRadius:14,border:'1.5px solid #e5e7eb',padding:'16px 22px',marginBottom:20,display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
            <div>
              <div style={{fontWeight:700,color:'#1a1a2e',fontSize:'0.92rem'}}>📥 Download Template</div>
              <div style={{fontSize:'0.78rem',color:'#6b7280',marginTop:2}}>Use these templates for the correct format</div>
            </div>
            <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
              <a href={mode==='packages'?'/templates/MHC_Packages_Template.xlsx':'/templates/MHC_Destinations_Template.xlsx'} download style={{padding:'8px 16px',background:'linear-gradient(135deg,#10b981,#059669)',color:'#fff',borderRadius:8,textDecoration:'none',fontWeight:700,fontSize:'0.83rem',display:'inline-flex',alignItems:'center',gap:6}}>📊 Excel Template</a>
              <a href={mode==='packages'?'/templates/MHC_Packages_Format_Guide.pdf':'/templates/MHC_Destinations_Format_Guide.pdf'} download style={{padding:'8px 16px',background:'linear-gradient(135deg,#0077C8,#005fa3)',color:'#fff',borderRadius:8,textDecoration:'none',fontWeight:700,fontSize:'0.83rem',display:'inline-flex',alignItems:'center',gap:6}}>📄 Format Guide (PDF)</a>
            </div>
          </div>

          {/* Region map (destinations only) */}
          {mode==='destinations'&&(
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:20}}>
              <div style={{background:'#f0f9ff',border:'1px solid #bae6fd',borderRadius:12,padding:'14px 18px'}}>
                <div style={{fontWeight:700,color:'#0369a1',fontSize:'0.85rem',marginBottom:8}}>🇮🇳 National Regions</div>
                <div style={{display:'flex',flexWrap:'wrap',gap:6}}>{nationals.map(r=><span key={r.id} style={{background:'#e8f4ff',color:'#1e40af',padding:'3px 10px',borderRadius:20,fontSize:'0.75rem',fontWeight:600}}>{r.name}</span>)}</div>
              </div>
              <div style={{background:'#fefce8',border:'1px solid #fde68a',borderRadius:12,padding:'14px 18px'}}>
                <div style={{fontWeight:700,color:'#92400e',fontSize:'0.85rem',marginBottom:8}}>🌍 International Regions</div>
                <div style={{display:'flex',flexWrap:'wrap',gap:6}}>{internationals.map(r=><span key={r.id} style={{background:'#fef3c7',color:'#92400e',padding:'3px 10px',borderRadius:20,fontSize:'0.75rem',fontWeight:600}}>{r.name}</span>)}</div>
              </div>
            </div>
          )}

          {/* Parse errors */}
          {parseErrors.length > 0 && (
            <div style={{background:'#fef2f2',border:'1.5px solid #fca5a5',borderRadius:12,padding:'14px 20px',marginBottom:20}}>
              <div style={{fontWeight:700,color:'#991b1b',fontSize:'0.88rem',marginBottom:6}}>⚠️ Parsing Issues</div>
              {parseErrors.map((err,i)=><div key={i} style={{fontSize:'0.82rem',color:'#b91c1c',marginBottom:3}}>• {err}</div>)}
            </div>
          )}

          {/* Success */}
          {result&&(
            <div style={{background:'#d1fae5',border:'1.5px solid #6ee7b7',borderRadius:12,padding:'18px 24px',marginBottom:24,display:'flex',gap:16,alignItems:'center',flexWrap:'wrap'}}>
              <span style={{fontSize:'2rem'}}>✅</span>
              <div>
                <div style={{fontWeight:800,color:'#065f46',fontSize:'1rem'}}>Import complete!</div>
                <div style={{fontSize:'0.85rem',color:'#047857',marginTop:3}}>
                  {result.mode==='packages'?`${result.packages} packages added`:`${result.properties} properties added`}
                  {result.skipped>0&&` · ${result.skipped} skipped (duplicates)`}
                </div>
              </div>
              <button onClick={()=>setResult(null)} style={{marginLeft:'auto',background:'none',border:'1.5px solid #6ee7b7',borderRadius:8,padding:'6px 14px',cursor:'pointer',color:'#065f46',fontWeight:600,fontSize:'0.83rem'}}>Upload More</button>
            </div>
          )}

          {inputBox}

          {/* ── DESTINATIONS PREVIEW ── */}
          {mode==='destinations'&&entries.length>0&&(
            <div>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14,flexWrap:'wrap',gap:10}}>
                <div style={{fontWeight:800,color:'#1a1a2e',fontSize:'1rem'}}>{entries.length} properties <span style={{fontSize:'0.82rem',fontWeight:500,color:'#6b7280'}}>{selected.length} selected</span></div>
                <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
                  <button onClick={toggleAll} style={{padding:'8px 16px',background:'#f3f4f6',border:'1.5px solid #e5e7eb',borderRadius:8,cursor:'pointer',fontWeight:600,fontSize:'0.83rem',color:'#374151'}}>{selected.length===entries.length?'Deselect All':'Select All'}</button>
                  {selected.length>0&&<button onClick={removeSelected} style={{padding:'8px 18px',background:'linear-gradient(135deg,#dc2626,#b91c1c)',color:'#fff',border:'none',borderRadius:8,cursor:'pointer',fontWeight:700,fontSize:'0.83rem'}}>🗑️ Remove {selected.length}</button>}
                  <button onClick={handleImport} disabled={importing||selected.length===0} style={{padding:'8px 22px',background:importing?'#93c5fd':'linear-gradient(135deg,#10b981,#059669)',color:'#fff',border:'none',borderRadius:8,cursor:importing?'wait':'pointer',fontWeight:700,fontSize:'0.9rem'}}>{importing?'Importing…':`⬆ Import ${selected.length}`}</button>
                </div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:16}}>
                <div style={{background:'#f0f9ff',border:'1px solid #bae6fd',borderRadius:10,padding:'12px 16px'}}>
                  <div style={{fontSize:'0.8rem',fontWeight:700,color:'#0369a1',marginBottom:6}}>🇮🇳 Bulk assign → National</div>
                  <select onChange={e=>bulkAssign(e.target.value,'national')} defaultValue="" style={{width:'100%',padding:'7px 10px',border:'1.5px solid #bae6fd',borderRadius:7,fontSize:'0.85rem',background:'#fff'}}>
                    <option value="">— Choose —</option>{nationals.map(r=><option key={r.id} value={r.id}>{r.name}</option>)}
                  </select>
                </div>
                <div style={{background:'#fefce8',border:'1px solid #fde68a',borderRadius:10,padding:'12px 16px'}}>
                  <div style={{fontSize:'0.8rem',fontWeight:700,color:'#92400e',marginBottom:6}}>🌍 Bulk assign → International</div>
                  <select onChange={e=>bulkAssign(e.target.value,'international')} defaultValue="" style={{width:'100%',padding:'7px 10px',border:'1.5px solid #fde68a',borderRadius:7,fontSize:'0.85rem',background:'#fff'}}>
                    <option value="">— Choose —</option>{internationals.map(r=><option key={r.id} value={r.id}>{r.name}</option>)}
                  </select>
                </div>
              </div>
              {Object.entries(grouped).map(([city,items])=>(
                <div key={city} style={{marginBottom:20}}>
                  <div style={{background:'linear-gradient(135deg,#0077C8,#005fa3)',color:'#fff',borderRadius:'12px 12px 0 0',padding:'10px 18px',fontWeight:800,fontSize:'0.88rem',display:'flex',alignItems:'center',gap:10}}>
                    📍 {city} <span style={{fontWeight:500,opacity:0.75,fontSize:'0.8rem'}}>{items.length} properties</span>
                    {items[0]&&<RegionBadge regionId={items[0].regionId} regions={regions}/>}
                  </div>
                  <div style={{border:'1.5px solid #e5e7eb',borderTop:'none',borderRadius:'0 0 12px 12px',overflow:'hidden'}}>
                    <table style={{width:'100%',borderCollapse:'collapse',fontSize:'0.85rem',tableLayout:'fixed'}}>
                      <thead><tr style={{background:'#f8fafc'}}>
                        <th style={{padding:'9px 10px',width:36}}>✓</th>
                        <th style={{padding:'9px 10px',textAlign:'left',fontWeight:700,color:'#374151',width:'30%'}}>Property Name</th>
                        <th style={{padding:'9px 8px',textAlign:'center',fontWeight:700,color:'#374151',width:80}}>Stars</th>
                        <th style={{padding:'9px 8px',textAlign:'left',fontWeight:700,color:'#374151',width:80}}>Type</th>
                        <th style={{padding:'9px 8px',textAlign:'left',fontWeight:700,color:'#374151',width:'22%'}}>Region</th>
                        <th style={{padding:'9px 8px',textAlign:'center',fontWeight:700,color:'#374151',width:40}}>Map</th>
                        <th style={{padding:'9px 8px',textAlign:'center',fontWeight:700,color:'#374151',width:90}}>Actions</th>
                      </tr></thead>
                      <tbody>{items.map(e=>{const idx=e._idx,isSel=selected.includes(idx);return(
                        <tr key={idx} style={{borderTop:'1px solid #f3f4f6',background:isSel?'#f8fbff':'#fff',opacity:isSel?1:0.45}}>
                          <td style={{padding:'9px 14px'}}><input type="checkbox" checked={isSel} onChange={()=>toggleSelect(idx)} style={{width:16,height:16,cursor:'pointer',accentColor:'#0077C8'}}/></td>
                          <td style={{padding:'9px 10px',fontWeight:600,color:'#1a1a2e',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}} title={e.name}>{e.name}</td>
                          <td style={{padding:'9px 12px',textAlign:'center'}}><Stars n={e.starRating}/></td>
                          <td style={{padding:'9px 12px'}}><span style={{background:'#f3f4f6',padding:'2px 8px',borderRadius:20,fontSize:'0.74rem',fontWeight:600,color:'#374151'}}>{e.type}</span></td>
                          <td style={{padding:'9px 12px'}}>
                            <select value={e.regionId||''} onChange={ev=>updateEntry(idx,{...e,regionId:ev.target.value})} style={{padding:'4px 6px',border:'1.5px solid #e5e7eb',borderRadius:6,fontSize:'0.75rem',background:'#fff',width:'100%',boxSizing:'border-box'}}>
                              <optgroup label="🇮🇳 National">{nationals.map(r=><option key={r.id} value={r.id}>{r.name}</option>)}</optgroup>
                              <optgroup label="🌍 International">{internationals.map(r=><option key={r.id} value={r.id}>{r.name}</option>)}</optgroup>
                            </select>
                          </td>
                          <td style={{padding:'9px 12px',textAlign:'center'}}>{e.mapsUrl?<a href={e.mapsUrl} target="_blank" rel="noreferrer" style={{fontSize:'1.1rem',textDecoration:'none'}}>🗺️</a>:<span style={{color:'#d1d5db'}}>—</span>}</td>
                          <td style={{padding:'9px 12px',textAlign:'center'}}><div style={{display:'flex',gap:5,justifyContent:'center'}}>
                            <button onClick={()=>setEditIdx(idx)} style={{padding:'4px 9px',background:'#e8f4ff',color:'#0077C8',border:'none',borderRadius:6,cursor:'pointer',fontSize:'0.76rem',fontWeight:600}}>Edit</button>
                            <button onClick={()=>removeEntry(idx)} style={{padding:'4px 9px',background:'#fee2e2',color:'#dc2626',border:'none',borderRadius:6,cursor:'pointer',fontSize:'0.76rem',fontWeight:600}}>✕</button>
                          </div></td>
                        </tr>);})}</tbody>
                    </table>
                  </div>
                </div>
              ))}
              <div style={{display:'flex',justifyContent:'flex-end',marginTop:8}}>
                <button onClick={handleImport} disabled={importing||selected.length===0} style={{padding:'12px 32px',background:importing?'#93c5fd':'linear-gradient(135deg,#10b981,#059669)',color:'#fff',border:'none',borderRadius:10,cursor:importing?'wait':'pointer',fontWeight:700,fontSize:'1rem',boxShadow:'0 4px 14px rgba(16,185,129,0.3)'}}>
                  {importing?'Importing…':`⬆ Import ${selected.length} Properties`}
                </button>
              </div>
            </div>
          )}

          {/* ── PACKAGES PREVIEW ── */}
          {mode==='packages'&&entries.length>0&&(
            <div>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14,flexWrap:'wrap',gap:10}}>
                <div style={{fontWeight:800,color:'#1a1a2e',fontSize:'1rem'}}>{entries.length} packages <span style={{fontSize:'0.82rem',fontWeight:500,color:'#6b7280'}}>{selected.length} selected</span></div>
                <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
                  <button onClick={toggleAll} style={{padding:'8px 16px',background:'#f3f4f6',border:'1.5px solid #e5e7eb',borderRadius:8,cursor:'pointer',fontWeight:600,fontSize:'0.83rem',color:'#374151'}}>{selected.length===entries.length?'Deselect All':'Select All'}</button>
                  {selected.length>0&&<button onClick={removeSelected} style={{padding:'8px 18px',background:'linear-gradient(135deg,#dc2626,#b91c1c)',color:'#fff',border:'none',borderRadius:8,cursor:'pointer',fontWeight:700,fontSize:'0.83rem'}}>🗑️ Remove {selected.length}</button>}
                  <button onClick={handleImport} disabled={importing||selected.length===0} style={{padding:'8px 22px',background:importing?'#93c5fd':'linear-gradient(135deg,#10b981,#059669)',color:'#fff',border:'none',borderRadius:8,cursor:importing?'wait':'pointer',fontWeight:700,fontSize:'0.9rem'}}>{importing?'Importing…':`⬆ Import ${selected.length}`}</button>
                </div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:16,marginBottom:20}}>
                {entries.map((pkg,i)=>{const isSel=selected.includes(i);return(
                  <div key={i} style={{background:'#fff',border:`2px solid ${isSel?pkg.color||'#0077C8':'#e5e7eb'}`,borderRadius:14,padding:18,opacity:isSel?1:0.5,transition:'all 0.2s',boxShadow:isSel?'0 4px 16px rgba(0,119,200,0.1)':'none'}}>
                    <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
                      <input type="checkbox" checked={isSel} onChange={()=>toggleSelect(i)} style={{width:16,height:16,cursor:'pointer',accentColor:'#0077C8'}}/>
                      <div style={{width:10,height:10,borderRadius:'50%',background:pkg.color||'#0077C8',flexShrink:0}}/>
                      <div style={{fontWeight:800,color:'#1a1a2e',fontSize:'0.95rem',flex:1,minWidth:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{pkg.name}</div>
                      {pkg.popular&&<span style={{background:'#fef3c7',color:'#92400e',padding:'2px 8px',borderRadius:20,fontSize:'0.7rem',fontWeight:700}}>⭐ Popular</span>}
                    </div>
                    <div style={{display:'flex',gap:8,marginBottom:8,flexWrap:'wrap'}}>
                      <span style={{background:'#f3f4f6',color:'#374151',padding:'2px 8px',borderRadius:20,fontSize:'0.75rem',fontWeight:600}}>₹{(pkg.price||0).toLocaleString('en-IN')}</span>
                      {pkg.duration&&<span style={{background:'#e8f4ff',color:'#1e40af',padding:'2px 8px',borderRadius:20,fontSize:'0.75rem',fontWeight:600}}>{pkg.duration}</span>}
                      {pkg.validity&&<span style={{background:'#d1fae5',color:'#065f46',padding:'2px 8px',borderRadius:20,fontSize:'0.75rem',fontWeight:600}}>{pkg.validity}</span>}
                      {pkg.badge&&<span style={{background:pkg.color||'#0077C8',color:'#fff',padding:'2px 8px',borderRadius:20,fontSize:'0.75rem',fontWeight:700}}>{pkg.badge}</span>}
                    </div>
                    {pkg.features?.length>0&&(
                      <ul style={{margin:'0 0 10px',paddingLeft:18,fontSize:'0.78rem',color:'#6b7280',lineHeight:1.6}}>
                        {pkg.features.slice(0,4).map((f,fi)=><li key={fi}>{f}</li>)}
                        {pkg.features.length>4&&<li style={{color:'#9ca3af'}}>+{pkg.features.length-4} more</li>}
                      </ul>
                    )}
                    <div style={{display:'flex',gap:6,justifyContent:'flex-end'}}>
                      <button onClick={()=>setEditIdx(i)} style={{padding:'5px 12px',background:'#e8f4ff',color:'#0077C8',border:'none',borderRadius:6,cursor:'pointer',fontSize:'0.78rem',fontWeight:600}}>Edit</button>
                      <button onClick={()=>removeEntry(i)} style={{padding:'5px 12px',background:'#fee2e2',color:'#dc2626',border:'none',borderRadius:6,cursor:'pointer',fontSize:'0.78rem',fontWeight:600}}>✕</button>
                    </div>
                  </div>);
                })}
              </div>
              <div style={{display:'flex',justifyContent:'flex-end'}}>
                <button onClick={handleImport} disabled={importing||selected.length===0} style={{padding:'12px 32px',background:importing?'#93c5fd':'linear-gradient(135deg,#10b981,#059669)',color:'#fff',border:'none',borderRadius:10,cursor:importing?'wait':'pointer',fontWeight:700,fontSize:'1rem',boxShadow:'0 4px 14px rgba(16,185,129,0.3)'}}>
                  {importing?'Importing…':`⬆ Import ${selected.length} Packages`}
                </button>
              </div>
            </div>
          )}

          {/* Edit modals */}
          {editIdx!==null&&mode==='destinations'&&<DestEditModal row={entries[editIdx]} regions={regions} onSave={upd=>updateEntry(editIdx,upd)} onClose={()=>setEditIdx(null)}/>}
          {editIdx!==null&&mode==='packages'&&<PkgEditModal row={entries[editIdx]} onSave={upd=>updateEntry(editIdx,upd)} onClose={()=>setEditIdx(null)}/>}
        </>
      )}
    </div>
  );
};

export default BulkUpload;
