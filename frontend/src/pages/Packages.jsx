import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MembershipModal from '../components/MembershipModal';

const fallbackPackages = [
  { id: 'p1', name: 'Holiday Starter', price: '₹2,99,999', duration: '3 Nights / 4 Days', highlighted: false, features: ['Access to 50+ Resorts', '1 Free Upgrade/Year', 'Priority Booking', '24/7 Support'] },
  { id: 'p2', name: 'Holiday Classic', price: '₹4,99,999', duration: '7 Nights / 8 Days', highlighted: true, features: ['Access to 100+ Resorts', '2 Free Upgrades/Year', 'Priority Booking', 'Complimentary Meals', '24/7 Concierge'] },
  { id: 'p3', name: 'Holiday Premium', price: '₹7,99,999', duration: '14 Nights / 15 Days', highlighted: false, features: ['Access to 200+ Resorts', 'Unlimited Upgrades', 'All-Inclusive Meals', '24/7 Personal Concierge', 'Airport Transfers', 'International Destinations'] },
];

const Packages = () => {
  const [packages, setPackages] = useState(fallbackPackages);
  const [showMembership, setShowMembership] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    axios.get('/api/packages').then(res => {
      if (res.data.data?.length) setPackages(res.data.data);
    }).catch(() => {});
  }, []);

  const handleSelect = (pkg) => {
    setSelectedPlan(pkg.name);
    setShowMembership(true);
  };

  return (
    <div>
      {/* Hero */}
      <div style={{ padding: '140px 0 80px', background: 'linear-gradient(135deg, #0077C8, #003d6b)', color: 'white', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{ position: 'absolute', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.08)', width: `${(i+1)*200}px`, height: `${(i+1)*200}px`, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }} />
        ))}
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="badge" style={{ background: 'rgba(240,165,0,0.2)', color: '#f0a500', marginBottom: '16px' }}>Membership Plans</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '16px' }}>
            Choose Your Perfect Plan
          </h1>
          <p style={{ fontSize: '1.15rem', opacity: 0.85, maxWidth: '600px', margin: '0 auto' }}>
            Unlock exclusive access to 200+ premium resorts across India and abroad with our carefully designed membership packages.
          </p>
        </div>
      </div>

      {/* Packages Grid */}
      <div style={{ padding: '80px 0', background: '#f8fafc' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', alignItems: 'start' }}>
            {packages.map((pkg, i) => (
              <div key={pkg.id} style={{
                borderRadius: '24px', overflow: 'hidden',
                background: pkg.highlighted ? 'linear-gradient(135deg, #0077C8, #005a96)' : 'white',
                color: pkg.highlighted ? 'white' : '#1a1a2e',
                boxShadow: pkg.highlighted ? '0 20px 60px rgba(0,119,200,0.35)' : '0 4px 20px rgba(0,0,0,0.08)',
                position: 'relative',
                transform: pkg.highlighted ? 'scale(1.04)' : 'scale(1)',
                transition: 'all 0.3s ease',
                animation: `fadeInUp 0.6s ease ${i * 0.2}s both`
              }}>
                {pkg.highlighted && (
                  <div style={{
                    position: 'absolute', top: '20px', right: '-28px',
                    background: '#f0a500', color: 'white',
                    padding: '6px 32px', fontSize: '0.8rem',
                    fontWeight: 700, transform: 'rotate(45deg)',
                    letterSpacing: '1px', textTransform: 'uppercase'
                  }}>POPULAR</div>
                )}
                <div style={{ padding: '40px 32px', borderBottom: `1px solid ${pkg.highlighted ? 'rgba(255,255,255,0.15)' : '#e8f4ff'}` }}>
                  <div style={{
                    width: '56px', height: '56px', borderRadius: '50%',
                    background: pkg.highlighted ? 'rgba(255,255,255,0.15)' : '#e8f4ff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.6rem', marginBottom: '20px'
                  }}>
                    {['🌟', '💎', '👑'][i] || '⭐'}
                  </div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', marginBottom: '8px' }}>{pkg.name}</h3>
                  <p style={{ opacity: 0.7, fontSize: '0.9rem', marginBottom: '20px' }}>{pkg.duration}</p>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.2rem', fontWeight: 700 }}>
                    {pkg.price}
                  </div>
                  <p style={{ fontSize: '0.8rem', opacity: 0.6, marginTop: '4px' }}>One-time membership fee</p>
                </div>
                <div style={{ padding: '32px' }}>
                  <ul style={{ listStyle: 'none', marginBottom: '32px' }}>
                    {(pkg.features || []).map(f => (
                      <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', fontSize: '0.95rem' }}>
                        <span style={{
                          width: '22px', height: '22px', borderRadius: '50%',
                          background: pkg.highlighted ? 'rgba(255,255,255,0.2)' : '#e8f4ff',
                          color: pkg.highlighted ? 'white' : '#0077C8',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.75rem', flexShrink: 0, fontWeight: 700
                        }}>✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => handleSelect(pkg)} style={{
                    width: '100%', padding: '15px',
                    background: pkg.highlighted ? 'rgba(255,255,255,0.15)' : 'linear-gradient(135deg, #0077C8, #005a96)',
                    color: 'white', border: pkg.highlighted ? '2px solid rgba(255,255,255,0.4)' : 'none',
                    borderRadius: '50px', fontWeight: 700, cursor: 'pointer',
                    fontSize: '1rem', fontFamily: "'Inter', sans-serif",
                    transition: 'all 0.3s'
                  }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    Get Started →
                  </button>
                </div>
              </div>
            ))}
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
            {[
              { icon: '🏨', title: 'Premium Properties', desc: 'Handpicked luxury resorts with guaranteed quality' },
              { icon: '💰', title: 'Members-Only Prices', desc: 'Save up to 50% on room rates versus public pricing' },
              { icon: '🎁', title: 'Annual Bonus Nights', desc: 'Free bonus nights added every membership year' },
              { icon: '📱', title: 'Digital Membership Card', desc: 'Access your membership via app or mobile wallet' },
              { icon: '🧳', title: 'Concierge Services', desc: 'Personal travel assistant for all your needs' },
              { icon: '🔄', title: 'Flexible Booking', desc: 'Easy rescheduling with no extra fees' },
            ].map((b, i) => (
              <div key={i} style={{
                padding: '28px', borderRadius: '16px',
                border: '2px solid #e8f4ff',
                transition: 'all 0.3s ease',
                textAlign: 'center'
              }}
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

      {showMembership && <MembershipModal onClose={() => setShowMembership(false)} />}
    </div>
  );
};

export default Packages;
