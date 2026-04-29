import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

const DestinationsHub = () => {
  const [nationals, setNationals] = useState([]);
  const [internationals, setInternationals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      api.get('/api/regions?type=national'),
      api.get('/api/regions?type=international')
    ]).then(([n, i]) => {
      setNationals(n.data.data);
      setInternationals(i.data.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const defaultNationals = [
    { id: 'north-india', slug: 'north-india', name: 'North India', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', description: 'Himalayas, Rajasthan & the Golden Triangle' },
    { id: 'east-india', slug: 'east-india', name: 'East India', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', description: 'Tea gardens, temples & tiger reserves' },
    { id: 'west-india', slug: 'west-india', name: 'West India', image: 'https://images.unsplash.com/photo-1477587458883-47145ed31c3e?w=800', description: 'Goa beaches, caves & desert landscapes' },
    { id: 'south-india', slug: 'south-india', name: 'South India', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800', description: 'Backwaters, hill stations & pristine coast' }
  ];

  const regions = nationals.length ? nationals : defaultNationals;
  const intl = internationals.length ? internationals : [
    { id: 'maldives', slug: 'maldives', name: 'Maldives', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800', description: 'Overwater villas & crystal lagoons' },
    { id: 'thailand', slug: 'thailand', name: 'Thailand', image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800', description: 'Golden temples & tropical islands' },
    { id: 'dubai', slug: 'dubai', name: 'Dubai', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800', description: 'Skyline, desert safaris & luxury' }
  ];

  return (
    <div style={{ background: '#f5f7fa', minHeight: '100vh' }}>
      <style>{`
        @keyframes fadeInUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slowZoom { from { transform:scale(1); } to { transform:scale(1.08); } }
        .region-card { transition:all 0.35s cubic-bezier(0.4,0,0.2,1); cursor:pointer; }
        .region-card:hover { transform:translateY(-10px); box-shadow:0 24px 56px rgba(0,0,0,0.18) !important; }
        .region-card:hover .rc-img { transform:scale(1.08); }
        .rc-img { transition:transform 0.6s ease; }
        @media (max-width: 768px) {
          .dest-hub-hero { height: 50vh !important; min-height: 320px !important; }
          .dest-hub-hero h1 { font-size: clamp(1.7rem, 7vw, 2.6rem) !important; }
          .dest-hub-hero p  { font-size: 0.92rem !important; }
          .region-grid { grid-template-columns: 1fr 1fr !important; gap: 14px !important; }
          .intl-grid   { grid-template-columns: 1fr !important; gap: 16px !important; }
        }
        @media (max-width: 480px) {
          .dest-hub-hero { height: 45vh !important; }
          .region-grid { grid-template-columns: 1fr !important; }
        }

      `}</style>

      {/* Hero */}
      <div className='dest-hub-hero' style={{ height: '65vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src="https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1600" alt="Destinations"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', animation: 'slowZoom 20s ease infinite alternate' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,30,80,0.7) 0%, rgba(0,119,200,0.5) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', color: 'white', padding: '0 24px', animation: 'fadeInUp 0.8s ease' }}>
          <div style={{ display: 'inline-block', padding: '6px 20px', background: 'rgba(240,165,0,0.9)', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '20px' }}>
            ✈️ Explore Destinations
          </div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(2.5rem,6vw,4.5rem)', fontWeight: 800, marginBottom: '18px', lineHeight: 1.15 }}>
            Find Your Perfect<br />Holiday Escape
          </h1>
          <p style={{ fontSize: '1.15rem', opacity: 0.9, maxWidth: '540px', margin: '0 auto' }}>
            Discover handpicked resorts and hotels across India and the world's most breathtaking destinations
          </p>
        </div>
        <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0 }}>
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ display: 'block', height: '80px' }}>
            <path d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,40 L1440,80 L0,80 Z" fill="#f5f7fa"/>
          </svg>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '80px' }}>

        {/* ── NATIONAL ── */}
        <div style={{ marginBottom: '72px' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px', paddingTop: '60px' }}>
            <div style={{ display: 'inline-block', padding: '6px 18px', background: '#e8f4ff', color: '#0077C8', borderRadius: '50px', fontSize: '0.82rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '14px' }}>🇮🇳 National Destinations</div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(1.8rem,4vw,2.8rem)', color: '#1a1a2e', marginBottom: '14px' }}>Resorts & Hotels Across India</h2>
            <p style={{ color: '#6b7280', fontSize: '1.05rem', maxWidth: '540px', margin: '0 auto' }}>Explore our curated collection of premium stays across India's most iconic regions</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
            {regions.map((r, i) => (
              <div key={r.id} className="region-card"
                onClick={() => navigate(`/destinations/${r.slug}`)}
                style={{ borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.09)', background: 'white', animation: `fadeInUp 0.5s ease ${i * 0.1}s both` }}>
                <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                  <img className="rc-img" src={r.image} alt={r.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)' }} />
                  <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px' }}>
                    <h3 style={{ fontFamily: "'Playfair Display',serif", color: 'white', fontSize: '1.3rem', fontWeight: 700, marginBottom: '4px' }}>{r.name}</h3>
                    <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: '0.82rem' }}>{r.description}</p>
                  </div>
                  <div style={{ position: 'absolute', top: '14px', right: '14px', background: 'rgba(0,119,200,0.9)', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700 }}>View Stays →</div>
                </div>
                <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280', fontSize: '0.85rem', fontFamily: "'Inter',sans-serif" }}>Resorts & Hotels</span>
                  <span style={{ color: '#0077C8', fontWeight: 700, fontSize: '0.85rem', fontFamily: "'Inter',sans-serif" }}>Explore →</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── INTERNATIONAL ── */}
        <div>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{ display: 'inline-block', padding: '6px 18px', background: '#fef3c7', color: '#d97706', borderRadius: '50px', fontSize: '0.82rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '14px' }}>🌍 International Destinations</div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(1.8rem,4vw,2.8rem)', color: '#1a1a2e', marginBottom: '14px' }}>World-Class Stays Abroad</h2>
            <p style={{ color: '#6b7280', fontSize: '1.05rem', maxWidth: '540px', margin: '0 auto' }}>From Maldives overwater villas to Dubai luxury — hand-selected for our members</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {intl.map((r, i) => (
              <div key={r.id} className="region-card"
                onClick={() => navigate(`/destinations/${r.slug}`)}
                style={{ borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.09)', background: 'white', animation: `fadeInUp 0.5s ease ${i * 0.1}s both` }}>
                <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                  <img className="rc-img" src={r.image} alt={r.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 50%)' }} />
                  <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px' }}>
                    <h3 style={{ fontFamily: "'Playfair Display',serif", color: 'white', fontSize: '1.4rem', fontWeight: 700, marginBottom: '4px' }}>{r.name}</h3>
                    <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: '0.85rem' }}>{r.description}</p>
                  </div>
                  <div style={{ position: 'absolute', top: '14px', left: '14px', background: 'rgba(240,165,0,0.9)', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700 }}>🌍 International</div>
                </div>
                <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280', fontSize: '0.85rem', fontFamily: "'Inter',sans-serif" }}>Resorts & Hotels</span>
                  <span style={{ color: '#0077C8', fontWeight: 700, fontSize: '0.85rem', fontFamily: "'Inter',sans-serif" }}>Explore →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationsHub;
