import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const fallbackPackages = [
  { id: 'p1', name: 'Holiday Starter', price: '₹2,99,999', duration: '3 Nights / 4 Days', highlighted: false, features: ['Access to 50+ Resorts', '1 Free Upgrade/Year', 'Priority Booking', '24/7 Support'] },
  { id: 'p2', name: 'Holiday Classic', price: '₹4,99,999', duration: '7 Nights / 8 Days', highlighted: true, popular: true, features: ['Access to 100+ Resorts', '2 Free Upgrades/Year', 'Priority Booking', 'Complimentary Meals', '24/7 Concierge'] },
  { id: 'p3', name: 'Holiday Premium', price: '₹7,99,999', duration: '14 Nights / 15 Days', highlighted: false, features: ['Access to 200+ Resorts', 'Unlimited Upgrades', 'All-Inclusive Meals', '24/7 Personal Concierge', 'Airport Transfers', 'International Destinations'] },
];

const fallbackBenefits = [
  { id: 'b1', icon: '🏨', title: 'Premium Properties', desc: 'Handpicked luxury resorts with guaranteed quality' },
  { id: 'b2', icon: '💰', title: 'Members-Only Prices', desc: 'Save up to 50% on room rates versus public pricing' },
  { id: 'b3', icon: '🎁', title: 'Annual Bonus Nights', desc: 'Free bonus nights added every membership year' },
  { id: 'b4', icon: '📱', title: 'Digital Membership Card', desc: 'Access your membership via app or mobile wallet' },
  { id: 'b5', icon: '🧳', title: 'Concierge Services', desc: 'Personal travel assistant for all your needs' },
  { id: 'b6', icon: '🔄', title: 'Flexible Booking', desc: 'Easy rescheduling with no extra fees' },
];

const PackageImageSlider = ({ images }) => {
  const [idx, setIdx] = useState(0);
  if (!images || images.length === 0) return null;
  return (
    <div style={{ position: 'relative', width: '100%', height: '180px', overflow: 'hidden', borderRadius: '16px 16px 0 0' }}>
      <img src={images[idx]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      {images.length > 1 && (
        <>
          <button onClick={e => { e.stopPropagation(); setIdx(i => (i - 1 + images.length) % images.length); }}
            style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.45)', color: 'white', border: 'none', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer', fontSize: '0.9rem' }}>‹</button>
          <button onClick={e => { e.stopPropagation(); setIdx(i => (i + 1) % images.length); }}
            style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.45)', color: 'white', border: 'none', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer', fontSize: '0.9rem' }}>›</button>
          <div style={{ position: 'absolute', bottom: '8px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '5px' }}>
            {images.map((_, i) => <span key={i} onClick={e => { e.stopPropagation(); setIdx(i); }} style={{ width: '6px', height: '6px', borderRadius: '50%', background: i === idx ? 'white' : 'rgba(255,255,255,0.45)', cursor: 'pointer', display: 'block' }} />)}
          </div>
        </>
      )}
    </div>
  );
};

// Inline login/signup modal shown when non-member clicks a plan
const MemberAuthModal = ({ selectedPkg, onClose, onSuccess }) => {
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ email: '', password: '', fullName: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const endpoint = tab === 'login' ? '/api/auth/login' : '/api/auth/signup';
      const payload = tab === 'login'
        ? { email: form.email, password: form.password }
        : { email: form.email, password: form.password, fullName: form.fullName, phone: form.phone };
      const res = await api.post(endpoint, payload);
      if (res.data.success) {
        localStorage.setItem('mhc_token', res.data.token);
        localStorage.setItem('mhc_member', JSON.stringify(res.data.member));
        onSuccess(res.data.member, selectedPkg);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: 'white', borderRadius: '24px', width: '100%', maxWidth: '420px', overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,0.4)', animation: 'modalIn 0.3s ease' }}>
        <style>{`@keyframes modalIn { from { opacity:0; transform:scale(0.92) translateY(20px); } to { opacity:1; transform:scale(1) translateY(0); } }`}</style>

        {/* Header with selected package info */}
        <div style={{ background: 'linear-gradient(135deg, #0077C8, #005a96)', padding: '28px 28px 20px', textAlign: 'center', position: 'relative' }}>
          <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🔐</div>
          <h2 style={{ color: 'white', fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', margin: '0 0 6px' }}>
            {tab === 'login' ? 'Sign In to Continue' : 'Create Your Account'}
          </h2>
          {selectedPkg && (
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '8px', padding: '8px 14px', display: 'inline-block', marginTop: '8px' }}>
              <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem' }}>Selected: </span>
              <span style={{ color: 'white', fontWeight: 700, fontSize: '0.9rem' }}>{selectedPkg.name}</span>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '2px solid #f1f5f9' }}>
          {['login', 'signup'].map(t => (
            <button key={t} onClick={() => { setTab(t); setError(''); }}
              style={{ flex: 1, padding: '14px', border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem', fontFamily: "'Inter',sans-serif", borderBottom: tab === t ? '3px solid #0077C8' : '3px solid transparent', color: tab === t ? '#0077C8' : '#6b7280', transition: 'all 0.2s' }}>
              {t === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={submit} style={{ padding: '24px 28px 28px' }}>
          <style>{`.auth-input { width:100%; padding:12px 14px; border:2px solid #e2e8f0; border-radius:10px; font-size:15px; font-family:'Inter',sans-serif; outline:none; box-sizing:border-box; transition:border-color 0.2s; } .auth-input:focus { border-color:#0077C8; }`}</style>

          {tab === 'signup' && (
            <>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.82rem', color: '#374151', marginBottom: '6px' }}>Full Name *</label>
                <input className="auth-input" name="fullName" value={form.fullName} onChange={handle} placeholder="Your full name" required />
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.82rem', color: '#374151', marginBottom: '6px' }}>Phone Number</label>
                <input className="auth-input" name="phone" value={form.phone} onChange={handle} placeholder="+91 98765 43210" />
              </div>
            </>
          )}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '0.82rem', color: '#374151', marginBottom: '6px' }}>Email Address *</label>
            <input className="auth-input" type="email" name="email" value={form.email} onChange={handle} placeholder="your@email.com" required />
          </div>
          <div style={{ marginBottom: error ? '12px' : '20px' }}>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '0.82rem', color: '#374151', marginBottom: '6px' }}>Password *</label>
            <input className="auth-input" type="password" name="password" value={form.password} onChange={handle} placeholder="Enter your password" required />
          </div>

          {error && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px' }}>⚠️ {error}</div>}

          <button type="submit" disabled={loading}
            style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #0077C8, #005a96)', color: 'white', border: 'none', borderRadius: '50px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontSize: '1rem', fontFamily: "'Inter',sans-serif", opacity: loading ? 0.8 : 1 }}>
            {loading ? '⏳ Please wait...' : tab === 'login' ? '🔑 Sign In & Continue' : '🚀 Create Account & Continue'}
          </button>

          <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '0.82rem', marginTop: '16px', marginBottom: 0 }}>
            {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button type="button" onClick={() => { setTab(tab === 'login' ? 'signup' : 'login'); setError(''); }}
              style={{ background: 'none', border: 'none', color: '#0077C8', fontWeight: 700, cursor: 'pointer', fontSize: '0.82rem', fontFamily: "'Inter',sans-serif" }}>
              {tab === 'login' ? 'Create one' : 'Sign in'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

const Packages = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState(fallbackPackages);
  const [benefits, setBenefits] = useState(fallbackBenefits);
  const [member, setMember] = useState(null);
  const [authModal, setAuthModal] = useState(null); // holds selectedPkg when modal open

  useEffect(() => {
    const memberData = localStorage.getItem('mhc_member');
    const token = localStorage.getItem('mhc_token');
    if (memberData && token) setMember(JSON.parse(memberData));

    api.get('/api/packages').then(res => { if (res.data.data?.length) setPackages(res.data.data); }).catch(() => {});
    api.get('/api/membership-benefits').then(res => { if (res.data.data?.length) setBenefits(res.data.data); }).catch(() => {});
  }, []);

  const handleSelect = (pkg) => {
    if (member) {
      navigate('/members/select-package', { state: { selectedPackage: pkg } });
    } else {
      setAuthModal(pkg);
    }
  };

  const handleAuthSuccess = (memberData, pkg) => {
    setMember(memberData);
    setAuthModal(null);
    navigate('/members/select-package', { state: { selectedPackage: pkg } });
  };

  return (
    <div>
      <style>{`
        @keyframes fadeInUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
        @media (max-width: 768px) {
          .pkg-cards-grid { grid-template-columns: 1fr !important; gap: 20px !important; }
          .pkg-features-grid { grid-template-columns: 1fr 1fr !important; gap: 14px !important; }
          .pkg-page-hero { padding: 110px 0 50px !important; }
          .pkg-card-scaled { transform: scale(1) !important; }
        }
        @media (max-width: 480px) { .pkg-features-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      {/* Hero with background photo */}
      <div className="pkg-page-hero" style={{ padding: '140px 0 80px', position: 'relative', overflow: 'hidden', color: 'white', textAlign: 'center', background: 'linear-gradient(135deg, #0a1628, #0077C8, #003d6b)' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1920&q=80')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,20,60,0.65) 0%, rgba(0,60,120,0.75) 100%)' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          {member ? (
            <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: '50px', display: 'inline-block', padding: '6px 20px', marginBottom: '16px', fontSize: '0.9rem', fontWeight: 600 }}>
              👋 Welcome back, {member.name || member.fullName}! Choose your membership plan below.
            </div>
          ) : (
            <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: '50px', display: 'inline-block', padding: '6px 20px', marginBottom: '16px', fontSize: '0.9rem', fontWeight: 600 }}>
              🔐 Sign in or create an account to join
            </div>
          )}
          <div className="badge" style={{ background: 'rgba(240,165,0,0.25)', color: '#f0a500', marginBottom: '16px' }}>Membership Plans</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem,5vw,4rem)', marginBottom: '16px', textShadow: '0 2px 12px rgba(0,0,0,0.3)' }}>
            Choose Your Perfect Plan
          </h1>
          <p style={{ fontSize: '1.15rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto' }}>
            Unlock exclusive access to 200+ premium resorts across India and abroad. Select a plan and sign up to get started.
          </p>
        </div>
      </div>

      {/* Packages Grid */}
      <div style={{ padding: '80px 0', background: '#f8fafc' }}>
        <div className="container">
          <div className='pkg-cards-grid' style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', alignItems: 'start' }}>
            {packages.map((pkg, i) => {
              const isHighlighted = pkg.highlighted || pkg.popular;
              return (
                <div key={pkg.id} className={isHighlighted ? 'pkg-card-scaled' : ''} style={{
                  borderRadius: '24px', overflow: 'hidden',
                  background: isHighlighted ? `linear-gradient(135deg, ${pkg.color || '#0077C8'}, #005a96)` : 'white',
                  color: isHighlighted ? 'white' : '#1a1a2e',
                  boxShadow: isHighlighted ? '0 20px 60px rgba(0,119,200,0.35)' : '0 4px 20px rgba(0,0,0,0.08)',
                  position: 'relative',
                  transform: isHighlighted ? 'scale(1.04)' : 'scale(1)',
                  transition: 'all 0.3s ease',
                  animation: `fadeInUp 0.6s ease ${i * 0.2}s both`
                }}>
                  {isHighlighted && (
                    <div style={{ position: 'absolute', top: '20px', right: '-28px', background: '#f0a500', color: 'white', padding: '6px 32px', fontSize: '0.8rem', fontWeight: 700, transform: 'rotate(45deg)', letterSpacing: '1px', textTransform: 'uppercase', zIndex: 2 }}>
                      {pkg.badge || 'POPULAR'}
                    </div>
                  )}
                  {pkg.images && pkg.images.length > 0 && <PackageImageSlider images={pkg.images} />}
                  <div style={{ padding: '40px 32px', borderBottom: `1px solid ${isHighlighted ? 'rgba(255,255,255,0.15)' : '#e8f4ff'}` }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: isHighlighted ? 'rgba(255,255,255,0.15)' : '#e8f4ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', marginBottom: '20px' }}>
                      {['🌟', '💎', '👑'][i] || '⭐'}
                    </div>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', marginBottom: '8px' }}>{pkg.name}</h3>
                    <p style={{ opacity: 0.7, fontSize: '0.9rem', marginBottom: '20px' }}>{pkg.duration}</p>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.2rem', fontWeight: 700 }}>
                      {pkg.price ? (typeof pkg.price === 'number' ? `₹${pkg.price.toLocaleString('en-IN')}` : pkg.price) : ''}
                    </div>
                    <p style={{ fontSize: '0.8rem', opacity: 0.6, marginTop: '4px' }}>One-time membership fee</p>
                    {pkg.description && <p style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: '12px' }}>{pkg.description}</p>}
                  </div>
                  <div style={{ padding: '32px' }}>
                    <ul style={{ listStyle: 'none', marginBottom: '32px' }}>
                      {(pkg.features || []).map(f => (
                        <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', fontSize: '0.95rem' }}>
                          <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: isHighlighted ? 'rgba(255,255,255,0.2)' : '#e8f4ff', color: isHighlighted ? 'white' : '#0077C8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', flexShrink: 0, fontWeight: 700 }}>✓</span>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <button onClick={() => handleSelect(pkg)} style={{
                      width: '100%', padding: '15px',
                      background: isHighlighted ? 'rgba(255,255,255,0.15)' : 'linear-gradient(135deg, #0077C8, #005a96)',
                      color: 'white', border: isHighlighted ? '2px solid rgba(255,255,255,0.4)' : 'none',
                      borderRadius: '50px', fontWeight: 700, cursor: 'pointer', fontSize: '1rem',
                      fontFamily: "'Inter', sans-serif", transition: 'all 0.3s'
                    }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
                    >
                      {member ? 'Select This Plan →' : '🔐 Join & Select This Plan'}
                    </button>
                    {!member && (
                      <p style={{ textAlign: 'center', fontSize: '0.78rem', opacity: 0.6, marginTop: '10px', color: isHighlighted ? 'white' : '#6b7280' }}>
                        Sign in or create an account to proceed
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div style={{ padding: '80px 0', background: 'white' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 className="section-title">Membership Benefits</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>Every plan includes these exclusive benefits</p>
          </div>
          <div className='pkg-features-grid' style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
            {benefits.map((b, i) => (
              <div key={b.id || i} style={{ padding: '28px', borderRadius: '16px', border: '2px solid #e8f4ff', transition: 'all 0.3s ease', textAlign: 'center' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#0077C8'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e8f4ff'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>{b.icon}</div>
                <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.05rem', marginBottom: '8px', color: '#1a1a2e' }}>{b.title}</h4>
                <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Auth modal — shown when non-member clicks a plan */}
      {authModal && (
        <MemberAuthModal
          selectedPkg={authModal}
          onClose={() => setAuthModal(null)}
          onSuccess={handleAuthSuccess}
        />
      )}
    </div>
  );
};

export default Packages;
