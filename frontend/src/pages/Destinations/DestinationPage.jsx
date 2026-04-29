import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

const DestinationPage = ({ region, title, subtitle, heroImage, type = 'national' }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [regionData, setRegionData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get region info
        const regRes = await api.get(`/api/regions?type=${type}`);
        const reg = regRes.data.data.find(r => r.slug === region);
        setRegionData(reg);

        // Get properties for this region
        if (reg) {
          const propRes = await api.get(`/api/properties?regionId=${reg.id}`);
          setProperties(propRes.data.data);
        }
      } catch (_) {
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [region, type]);

  const types = ['all', ...new Set(properties.map(p => p.type))];
  const filtered = filter === 'all' ? properties : properties.filter(p => p.type === filter);

  return (
    <div>
      {/* Hero */}
      <div className='dest-hero-section' style={{ height: '70vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0a1628 0%, #0077C8 60%, #003d6b 100%)' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', animation: 'slowZoom 20s ease infinite alternate' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.65) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', color: 'white', padding: '0 24px' }}>
          <div style={{ display: 'inline-block', padding: '6px 20px', background: 'rgba(240,165,0,0.9)', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px' }}>
            {type === 'national' ? '🇮🇳 National' : '🌍 International'} · Resorts & Hotels
          </div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(2.5rem,6vw,5rem)', fontWeight: 700, marginBottom: '16px' }}>{title}</h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto' }}>{subtitle}</p>
        </div>
        <div style={{ position: 'absolute', bottom: -2, left: 0, right: 0 }}>
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ display: 'block', height: '80px' }}>
            <path d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,40 L1440,80 L0,80 Z" fill="white"/>
          </svg>
        </div>
      </div>

      <style>{`
        @keyframes slowZoom { from { transform:scale(1); } to { transform:scale(1.08); } }
        @keyframes cardIn { from { opacity:0; transform:translateY(30px) scale(0.95); } to { opacity:1; transform:translateY(0) scale(1); } }
        .prop-card { transition:all 0.35s cubic-bezier(0.4,0,0.2,1); cursor:pointer; }
        .prop-card:hover { transform:translateY(-10px); box-shadow:0 20px 50px rgba(0,119,200,0.2) !important; }
        .prop-card:hover .card-img { transform:scale(1.05); }
        .card-img { transition:transform 0.5s ease; }
        .filter-btn { transition:all 0.25s ease; }
        .filter-btn:hover { background:#0077C8 !important; color:white !important; border-color:#0077C8 !important; }
        .amenity-tag { display:inline-block; padding:3px 10px; background:#e8f4ff; color:#0077C8; border-radius:20px; font-size:0.75rem; font-weight:500; margin:2px; }
        @media (max-width: 768px) {
          .dest-hero-section { height: 50vh !important; min-height: 320px !important; }
          .dest-hero-section h1 { font-size: clamp(1.8rem, 7vw, 2.8rem) !important; }
          .dest-hero-section p  { font-size: 1rem !important; }
          .prop-cards-grid { grid-template-columns: 1fr !important; gap: 18px !important; }
        }
        @media (max-width: 480px) {
          .dest-hero-section { height: 42vh !important; }
        }

      `}</style>

      <div style={{ padding: '60px 0 80px', background: 'white' }}>
        <div className="container">
          {/* Breadcrumb */}
          <div style={{ marginBottom: '32px', color: '#6b7280', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span onClick={() => navigate('/')} style={{ cursor: 'pointer', color: '#0077C8' }}>Home</span>
            <span>›</span>
            <span onClick={() => navigate('/destinations')} style={{ cursor: 'pointer', color: '#0077C8' }}>Destinations</span>
            <span>›</span>
            <span onClick={() => navigate(type === 'national' ? '/destinations/national' : '/destinations/international')} style={{ cursor: 'pointer', color: '#0077C8' }}>{type === 'national' ? 'National' : 'International'}</span>
            <span>›</span>
            <span style={{ color: '#1a1a2e', fontWeight: 600 }}>{title}</span>
          </div>

          {/* Filter */}
          {types.length > 1 && (
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '40px', alignItems: 'center' }}>
              <span style={{ color: '#6b7280', fontWeight: 600, marginRight: '8px' }}>Filter:</span>
              {types.map(t => (
                <button key={t} className="filter-btn" onClick={() => setFilter(t)} style={{
                  padding: '8px 20px', borderRadius: '50px',
                  background: filter === t ? '#0077C8' : 'white',
                  color: filter === t ? 'white' : '#6b7280',
                  border: `2px solid ${filter === t ? '#0077C8' : '#e2e8f0'}`,
                  cursor: 'pointer', fontWeight: 500, fontSize: '0.9rem', fontFamily: "'Inter',sans-serif"
                }}>
                  {t === 'all' ? 'All' : t + 's'}
                </button>
              ))}
            </div>
          )}

          {loading && (
            <div style={{ textAlign: 'center', padding: '80px' }}>
              <div style={{ display: 'inline-block', width: '50px', height: '50px', border: '4px solid #e8f4ff', borderTopColor: '#0077C8', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🏨</div>
              <h3 style={{ fontFamily: "'Playfair Display',serif", color: '#1a1a2e' }}>No properties yet</h3>
              <p style={{ color: '#6b7280' }}>Check back soon — we're adding properties to this region.</p>
            </div>
          )}

          <div className='prop-cards-grid' style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: '28px' }}>
            {filtered.map((prop, i) => (
              <div key={prop.id} className="prop-card"
                onClick={() => navigate(`/destinations/property/${prop.id}`)}
                style={{ borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', background: 'white', animation: `cardIn 0.5s ease ${i * 0.08}s both` }}>
                <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                  <img className="card-img" src={prop.images?.[0] || 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'} alt={prop.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)' }} />
                  <div style={{ position: 'absolute', top: '16px', left: '16px', background: prop.type === 'Resort' ? 'rgba(0,119,200,0.95)' : 'rgba(240,165,0,0.95)', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>{prop.type}</div>
                  <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ color: '#f0a500' }}>★</span> {prop.rating}
                  </div>
                  {prop.featured && (
                    <div style={{ position: 'absolute', bottom: '16px', left: '16px', background: 'rgba(240,165,0,0.95)', color: 'white', padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700 }}>⭐ FEATURED</div>
                  )}
                </div>
                <div style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                    <div>
                      <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.2rem', color: '#1a1a2e', marginBottom: '4px' }}>{prop.name}</h3>
                      <p style={{ color: '#6b7280', fontSize: '0.85rem' }}>📍 {prop.location}</p>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '8px' }}>
                      <div style={{ color: '#0077C8', fontWeight: 700, fontSize: '1rem' }}>₹{prop.price?.toLocaleString()}</div>
                      <div style={{ color: '#9ca3af', fontSize: '0.75rem' }}>{prop.priceUnit}</div>
                    </div>
                  </div>
                  <p style={{ color: '#4b5563', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{prop.description}</p>
                  {prop.amenities && (
                    <div style={{ marginBottom: '18px' }}>
                      {prop.amenities.slice(0, 3).map(a => <span key={a} className="amenity-tag">{a}</span>)}
                      {prop.amenities.length > 3 && <span className="amenity-tag">+{prop.amenities.length - 3} more</span>}
                    </div>
                  )}
                  <button style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg,#0077C8,#005a96)', color: 'white', border: 'none', borderRadius: '50px', fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem', fontFamily: "'Inter',sans-serif", transition: 'all 0.3s' }}>
                    View Details & Book →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationPage;
