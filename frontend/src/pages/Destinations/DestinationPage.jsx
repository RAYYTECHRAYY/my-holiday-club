import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InquiryModal from '../../components/InquiryModal';

const DestinationPage = ({ region, title, subtitle, heroImage, type = 'national' }) => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDest, setSelectedDest] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchDests = async () => {
      try {
        const res = await axios.get(`/api/destinations?region=${region}&type=${type}`);
        setDestinations(res.data.data);
      } catch (_) {
        // fallback data
        setDestinations([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDests();
  }, [region, type]);

  const categories = ['all', ...new Set(destinations.map(d => d.category))];
  const filtered = filter === 'all' ? destinations : destinations.filter(d => d.category === filter);

  return (
    <div>
      {/* Page Header */}
      <div style={{
        height: '70vh', position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <img src={heroImage} alt={title} style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover',
          animation: 'slowZoom 20s ease infinite alternate'
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 100%)'
        }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', color: 'white', padding: '0 24px' }}>
          <div style={{
            display: 'inline-block', padding: '6px 20px',
            background: 'rgba(240,165,0,0.9)', borderRadius: '50px',
            fontSize: '0.85rem', fontWeight: 700, letterSpacing: '2px',
            textTransform: 'uppercase', marginBottom: '16px',
            animation: 'fadeInDown 0.6s ease'
          }}>
            {type === 'national' ? '🇮🇳 National Destinations' : '🌍 International Destinations'}
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            fontWeight: 700, marginBottom: '16px',
            animation: 'fadeInUp 0.6s ease 0.2s both'
          }}>{title}</h1>
          <p style={{
            fontSize: '1.2rem', opacity: 0.9, maxWidth: '600px',
            animation: 'fadeInUp 0.6s ease 0.4s both'
          }}>{subtitle}</p>
        </div>

        {/* Wave */}
        <div style={{ position: 'absolute', bottom: -2, left: 0, right: 0 }}>
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ display: 'block', height: '80px' }}>
            <path d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,40 L1440,80 L0,80 Z" fill="white"/>
          </svg>
        </div>
      </div>

      <style>{`
        @keyframes slowZoom {
          from { transform: scale(1); }
          to { transform: scale(1.08); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(30px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .dest-card { transition: all 0.35s cubic-bezier(0.4,0,0.2,1); }
        .dest-card:hover { transform: translateY(-10px); box-shadow: 0 20px 50px rgba(0,119,200,0.2) !important; }
        .dest-card:hover .card-img { transform: scale(1.05); }
        .card-img { transition: transform 0.5s ease; }
        .filter-btn { transition: all 0.25s ease; }
        .filter-btn:hover { background: #0077C8 !important; color: white !important; border-color: #0077C8 !important; }
        .amenity-tag {
          display: inline-block;
          padding: 3px 10px;
          background: #e8f4ff;
          color: #0077C8;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 500;
          margin: 2px;
        }
      `}</style>

      {/* Content */}
      <div style={{ padding: '60px 0 80px', background: 'white' }}>
        <div className="container">
          {/* Filter Bar */}
          {categories.length > 1 && (
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '40px', alignItems: 'center' }}>
              <span style={{ color: '#6b7280', fontWeight: 600, marginRight: '8px' }}>Filter:</span>
              {categories.map(cat => (
                <button key={cat} className="filter-btn" onClick={() => setFilter(cat)} style={{
                  padding: '8px 20px', borderRadius: '50px',
                  background: filter === cat ? '#0077C8' : 'white',
                  color: filter === cat ? 'white' : '#6b7280',
                  border: `2px solid ${filter === cat ? '#0077C8' : '#e2e8f0'}`,
                  cursor: 'pointer', fontWeight: 500, fontSize: '0.9rem',
                  fontFamily: "'Inter', sans-serif"
                }}>
                  {cat === 'all' ? 'All Destinations' : cat}
                </button>
              ))}
            </div>
          )}

          {loading && (
            <div style={{ textAlign: 'center', padding: '80px' }}>
              <div style={{ display: 'inline-block', width: '50px', height: '50px', border: '4px solid #e8f4ff', borderTopColor: '#0077C8', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              <p style={{ marginTop: '16px', color: '#6b7280' }}>Loading destinations...</p>
              <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🌏</div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#1a1a2e' }}>No destinations found</h3>
              <p style={{ color: '#6b7280' }}>Try a different filter</p>
            </div>
          )}

          {/* Destination Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '28px' }}>
            {filtered.map((dest, i) => (
              <div key={dest.id} className="dest-card" style={{
                borderRadius: '20px', overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                background: 'white',
                animation: `cardIn 0.5s ease ${i * 0.1}s both`
              }}>
                {/* Image */}
                <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                  <img className="card-img" src={dest.image} alt={dest.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)'
                  }} />
                  {/* Badge */}
                  <div style={{
                    position: 'absolute', top: '16px', left: '16px',
                    background: 'rgba(240,165,0,0.95)', color: 'white',
                    padding: '4px 12px', borderRadius: '20px',
                    fontSize: '0.75rem', fontWeight: 700
                  }}>{dest.category}</div>
                  {/* Rating */}
                  <div style={{
                    position: 'absolute', top: '16px', right: '16px',
                    background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
                    color: 'white', padding: '4px 10px', borderRadius: '20px',
                    fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px'
                  }}>
                    <span style={{ color: '#f0a500' }}>★</span> {dest.rating}
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                    <div>
                      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', color: '#1a1a2e', marginBottom: '4px' }}>{dest.name}</h3>
                      <p style={{ color: '#6b7280', fontSize: '0.85rem' }}>📍 {dest.state}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: '#0077C8', fontWeight: 700, fontSize: '0.9rem' }}>{dest.price}</div>
                    </div>
                  </div>

                  <p style={{ color: '#4b5563', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '16px' }}>{dest.description}</p>

                  {/* Amenities */}
                  {dest.amenities && (
                    <div style={{ marginBottom: '20px' }}>
                      {dest.amenities.slice(0, 4).map(a => (
                        <span key={a} className="amenity-tag">{a}</span>
                      ))}
                      {dest.amenities.length > 4 && <span className="amenity-tag">+{dest.amenities.length - 4}</span>}
                    </div>
                  )}

                  <button onClick={() => setSelectedDest(dest)} style={{
                    width: '100%', padding: '13px',
                    background: 'linear-gradient(135deg, #0077C8, #005a96)',
                    color: 'white', border: 'none', borderRadius: '50px',
                    fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem',
                    fontFamily: "'Inter', sans-serif", transition: 'all 0.3s',
                    letterSpacing: '0.5px'
                  }}
                    onMouseEnter={e => { e.target.style.transform = 'scale(1.02)'; e.target.style.boxShadow = '0 8px 20px rgba(0,119,200,0.3)'; }}
                    onMouseLeave={e => { e.target.style.transform = 'scale(1)'; e.target.style.boxShadow = 'none'; }}
                  >
                    🏖️ Book This Destination
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedDest && <InquiryModal destination={selectedDest} onClose={() => setSelectedDest(null)} />}
    </div>
  );
};

export default DestinationPage;
