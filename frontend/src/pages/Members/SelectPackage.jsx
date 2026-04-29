import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

const ImageSlider = ({ images }) => {
  const [idx, setIdx] = useState(0);
  if (!images || images.length === 0) return (
    <div style={{ height:'200px', background:'linear-gradient(135deg,#0077C8,#005a96)', borderRadius:'16px 16px 0 0', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'3rem' }}>🏨</div>
  );
  return (
    <div style={{ position:'relative', height:'200px', borderRadius:'16px 16px 0 0', overflow:'hidden' }}>
      <img src={images[idx]} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', transition:'opacity 0.4s' }} />
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)' }} />
      {images.length > 1 && <>
        <button onClick={e=>{e.stopPropagation();setIdx(p=>(p-1+images.length)%images.length)}}
          style={{ position:'absolute', left:'10px', top:'50%', transform:'translateY(-50%)', background:'rgba(255,255,255,0.3)', backdropFilter:'blur(6px)', border:'none', color:'white', width:'32px', height:'32px', borderRadius:'50%', cursor:'pointer', fontSize:'0.9rem', display:'flex', alignItems:'center', justifyContent:'center' }}>‹</button>
        <button onClick={e=>{e.stopPropagation();setIdx(p=>(p+1)%images.length)}}
          style={{ position:'absolute', right:'10px', top:'50%', transform:'translateY(-50%)', background:'rgba(255,255,255,0.3)', backdropFilter:'blur(6px)', border:'none', color:'white', width:'32px', height:'32px', borderRadius:'50%', cursor:'pointer', fontSize:'0.9rem', display:'flex', alignItems:'center', justifyContent:'center' }}>›</button>
        <div style={{ position:'absolute', bottom:'10px', left:'50%', transform:'translateX(-50%)', display:'flex', gap:'5px' }}>
          {images.map((_,i)=>(<div key={i} onClick={e=>{e.stopPropagation();setIdx(i)}} style={{ width:i===idx?'20px':'7px', height:'7px', borderRadius:'4px', background:i===idx?'white':'rgba(255,255,255,0.5)', transition:'all 0.3s', cursor:'pointer' }} />))}
        </div>
      </>}
    </div>
  );
};

const SelectPackage = () => {
  const [packages, setPackages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [paySettings, setPaySettings] = useState(null);
  const [step, setStep] = useState('select'); // select | payment | success
  const [refNum, setRefNum] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const member = JSON.parse(localStorage.getItem('mhc_member') || '{}');

  useEffect(() => {
    if (!member.id) { navigate('/members/login'); return; }
    api.get('/api/packages').then(r => setPackages(r.data.data || [])).catch(()=>{});
    api.get('/api/payment-settings').then(r => setPaySettings(r.data.data || {})).catch(()=>{});
  }, []);

  const handleSelectPackage = (pkg) => { setSelected(pkg); setStep('payment'); };

  const handlePaymentSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem('mhc_token');
      await api.post('/api/payments', {
        memberId: member.id,
        memberName: member.fullName,
        memberEmail: member.email,
        packageId: selected.id,
        packageName: selected.name,
        amount: selected.price,
        referenceNumber: refNum,
        status: 'pending',
        note: 'Awaiting admin confirmation'
      }, { headers: { Authorization: `Bearer ${token}` }});
      setStep('success');
    } catch { alert('Error submitting payment. Please try again.'); }
    finally { setSubmitting(false); }
  };

  if (step === 'success') return (
    <div style={{ minHeight:'100vh', background:'#f5f7fa', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px', paddingTop:'100px' }}>
      <div style={{ background:'white', borderRadius:'24px', padding:'48px 40px', maxWidth:'480px', width:'100%', textAlign:'center', boxShadow:'0 8px 40px rgba(0,0,0,0.1)' }}>
        <div style={{ width:'80px', height:'80px', background:'linear-gradient(135deg,#10b981,#059669)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 24px', fontSize:'2.5rem' }}>✅</div>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.8rem', color:'#1a1a2e', marginBottom:'14px' }}>Payment Submitted!</h2>
        <p style={{ color:'#6b7280', lineHeight:1.7, marginBottom:'8px' }}>Your payment reference has been submitted for <strong>{selected?.name}</strong>.</p>
        <p style={{ color:'#6b7280', lineHeight:1.7, marginBottom:'28px' }}>Our team will verify and activate your membership within <strong>24 hours</strong>.</p>
        <div style={{ background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:'12px', padding:'16px', marginBottom:'28px', textAlign:'left' }}>
          <div style={{ fontSize:'0.85rem', color:'#166534', fontWeight:600, marginBottom:'6px' }}>📋 What happens next?</div>
          <div style={{ fontSize:'0.82rem', color:'#16a34a', lineHeight:1.7 }}>1. Admin verifies your payment<br/>2. Your account gets activated<br/>3. You receive a confirmation<br/>4. Start booking your holidays!</div>
        </div>
        <button onClick={() => navigate('/members/dashboard')} style={{ width:'100%', padding:'14px', background:'linear-gradient(135deg,#0077C8,#005a96)', color:'white', border:'none', borderRadius:'50px', fontWeight:700, cursor:'pointer', fontFamily:"'Inter',sans-serif", fontSize:'1rem' }}>
          Go to My Dashboard →
        </button>
      </div>
    </div>
  );

  if (step === 'payment') return (
    <div style={{ minHeight:'100vh', background:'#f5f7fa', padding:'20px', paddingTop:'100px' }}>
      <div style={{ maxWidth:'560px', margin:'0 auto' }}>
        <button onClick={()=>setStep('select')} style={{ background:'none', border:'none', color:'#0077C8', cursor:'pointer', fontWeight:600, marginBottom:'20px', fontSize:'0.95rem', display:'flex', alignItems:'center', gap:'6px' }}>← Back to Packages</button>
        <div style={{ background:'white', borderRadius:'20px', overflow:'hidden', boxShadow:'0 4px 20px rgba(0,0,0,0.08)', marginBottom:'20px' }}>
          <div style={{ background:`linear-gradient(135deg,${selected.color || '#0077C8'},${selected.color || '#0077C8'}aa)`, padding:'24px', color:'white' }}>
            <h2 style={{ fontFamily:"'Playfair Display',serif", margin:'0 0 4px', fontSize:'1.5rem' }}>{selected.name}</h2>
            <p style={{ margin:'0 0 12px', opacity:0.85 }}>{selected.duration} · {selected.validity} Validity</p>
            <div style={{ fontSize:'2rem', fontWeight:800 }}>₹{Number(selected.price).toLocaleString()}</div>
          </div>
          <div style={{ padding:'20px 24px' }}>
            <div style={{ fontWeight:700, marginBottom:'10px', color:'#374151' }}>Payment Instructions</div>
            <div style={{ background:'#f8faff', borderRadius:'12px', padding:'16px', border:'1px solid #e8f4ff', fontSize:'0.9rem', color:'#374151', lineHeight:1.8 }}>
              <div>🏦 <strong>Bank:</strong> {paySettings?.bankName || 'HDFC Bank'}</div>
              <div>👤 <strong>Account Name:</strong> {paySettings?.accountName || 'My Holiday Club Pvt Ltd'}</div>
              <div>🔢 <strong>Account No:</strong> {paySettings?.accountNumber || '50100123456789'}</div>
              <div>🏷️ <strong>IFSC:</strong> {paySettings?.ifsc || 'HDFC0001234'}</div>
              <div>📱 <strong>UPI:</strong> {paySettings?.upiId || 'myholidayclub@hdfcbank'}</div>
            </div>
          </div>
        </div>
        <div style={{ background:'white', borderRadius:'20px', padding:'24px', boxShadow:'0 4px 20px rgba(0,0,0,0.08)' }}>
          <h3 style={{ fontFamily:"'Playfair Display',serif", marginBottom:'16px', color:'#1a1a2e' }}>Confirm Your Payment</h3>
          <form onSubmit={handlePaymentSubmit}>
            <div style={{ marginBottom:'18px' }}>
              <label style={{ display:'block', fontWeight:700, fontSize:'0.85rem', color:'#374151', marginBottom:'8px' }}>Transaction / Reference Number *</label>
              <input value={refNum} onChange={e=>setRefNum(e.target.value)} required placeholder="Enter UTR / transaction reference number"
                style={{ width:'100%', padding:'13px 16px', border:'2px solid #e2e8f0', borderRadius:'12px', fontSize:'16px', fontFamily:"'Inter',sans-serif", outline:'none', boxSizing:'border-box' }} />
              <p style={{ color:'#6b7280', fontSize:'0.8rem', marginTop:'6px' }}>Enter the UTR number or transaction ID from your payment app</p>
            </div>
            <button type="submit" disabled={submitting} style={{ width:'100%', padding:'14px', background:submitting?'#94a3b8':'linear-gradient(135deg,#10b981,#059669)', color:'white', border:'none', borderRadius:'50px', fontWeight:700, fontSize:'1rem', cursor:submitting?'not-allowed':'pointer', fontFamily:"'Inter',sans-serif" }}>
              {submitting ? '⏳ Submitting...' : '✅ Submit Payment Confirmation'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:'#f5f7fa', paddingTop:'100px', paddingBottom:'60px' }}>
      <div style={{ textAlign:'center', padding:'0 20px 48px' }}>
        <div style={{ display:'inline-block', padding:'6px 18px', background:'#e8f4ff', color:'#0077C8', borderRadius:'50px', fontSize:'0.82rem', fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', marginBottom:'14px' }}>⭐ Choose Your Plan</div>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(1.8rem,4vw,2.8rem)', color:'#1a1a2e', marginBottom:'12px' }}>Select Your Membership Package</h1>
        <p style={{ color:'#6b7280', fontSize:'1.05rem', maxWidth:'520px', margin:'0 auto' }}>Welcome, <strong>{member.fullName}</strong>! Choose the plan that suits you best.</p>
      </div>
      <div className="container">
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:'28px', maxWidth:'1000px', margin:'0 auto' }}>
          {packages.map(pkg => (
            <div key={pkg.id} onClick={() => handleSelectPackage(pkg)} style={{ borderRadius:'20px', overflow:'hidden', background:'white', boxShadow:pkg.popular?'0 8px 40px rgba(0,119,200,0.2)':'0 4px 20px rgba(0,0,0,0.08)', border:pkg.popular?'2px solid #0077C8':'2px solid transparent', cursor:'pointer', transition:'all 0.3s', position:'relative' }}
              onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-8px)';e.currentTarget.style.boxShadow='0 20px 50px rgba(0,119,200,0.2)';}}
              onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow=pkg.popular?'0 8px 40px rgba(0,119,200,0.2)':'0 4px 20px rgba(0,0,0,0.08)';}}>
              {pkg.popular && <div style={{ position:'absolute', top:'16px', right:'16px', zIndex:2, background:'#0077C8', color:'white', padding:'4px 14px', borderRadius:'20px', fontSize:'0.75rem', fontWeight:700 }}>⭐ MOST POPULAR</div>}
              <ImageSlider images={pkg.images} />
              <div style={{ padding:'24px' }}>
                <div style={{ display:'inline-block', padding:'4px 12px', background:`${pkg.color || '#0077C8'}15`, color:pkg.color||'#0077C8', borderRadius:'20px', fontSize:'0.78rem', fontWeight:700, marginBottom:'12px' }}>{pkg.badge || 'Plan'}</div>
                <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.4rem', color:'#1a1a2e', margin:'0 0 6px' }}>{pkg.name}</h3>
                <p style={{ color:'#6b7280', fontSize:'0.88rem', marginBottom:'16px', lineHeight:1.6 }}>{pkg.description}</p>
                <div style={{ marginBottom:'16px' }}>
                  {(pkg.features||[]).map(f => <div key={f} style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'6px', fontSize:'0.88rem', color:'#374151' }}><span style={{ color:'#10b981', fontWeight:700 }}>✓</span>{f}</div>)}
                </div>
                <div style={{ borderTop:'1px solid #f1f5f9', paddingTop:'16px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div>
                    <div style={{ color:'#0077C8', fontWeight:800, fontSize:'1.5rem' }}>₹{Number(pkg.price).toLocaleString()}</div>
                    <div style={{ color:'#9ca3af', fontSize:'0.78rem' }}>{pkg.duration} · {pkg.validity}</div>
                  </div>
                  <button style={{ padding:'10px 22px', background:`linear-gradient(135deg,${pkg.color||'#0077C8'},${pkg.color||'#005a96'})`, color:'white', border:'none', borderRadius:'50px', fontWeight:700, cursor:'pointer', fontSize:'0.9rem', fontFamily:"'Inter',sans-serif" }}>
                    Select →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {packages.length === 0 && (
          <div style={{ textAlign:'center', padding:'60px', color:'#6b7280' }}>
            <div style={{ fontSize:'3rem', marginBottom:'16px' }}>📦</div>
            <p>No packages available. Please check back soon.</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default SelectPackage;
