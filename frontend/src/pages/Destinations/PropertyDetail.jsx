import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api';
import BookingModal from '../../components/BookingModal';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    api.get(`/api/properties/${id}`)
      .then(res => { setProperty(res.data.data); setLoading(false); })
      .catch(() => { setLoading(false); });
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '56px', height: '56px', border: '4px solid #e8f4ff', borderTopColor: '#0077C8', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
        <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
        <p style={{ color: '#6b7280', fontFamily: "'Inter',sans-serif" }}>Loading property details...</p>
      </div>
    </div>
  );

  if (!property) return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <div>
        <div style={{ fontSize: '4rem', marginBottom: '16px' }}>😕</div>
        <h2 style={{ fontFamily: "'Playfair Display',serif" }}>Property not found</h2>
        <button onClick={() => navigate(-1)} style={{ marginTop: '20px', padding: '12px 28px', background: '#0077C8', color: 'white', border: 'none', borderRadius: '50px', cursor: 'pointer', fontFamily: "'Inter',sans-serif", fontWeight: 600 }}>Go Back</button>
      </div>
    </div>
  );

  const images = property.images?.length ? property.images : ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'];

  return (
    <div style={{ background: '#f5f7fa', minHeight: '100vh' }}>
      <style>{`
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        .thumb { transition:all 0.2s; cursor:pointer; border:3px solid transparent; }
        .thumb:hover { border-color:#0077C8; transform:scale(1.05); }
        .thumb.active { border-color:#0077C8; }
        .amenity-chip { display:inline-flex; align-items:center; gap:6px; padding:8px 16px; background:white; border:1.5px solid #e2e8f0; border-radius:50px; font-size:0.85rem; color:#374151; font-weight:500; margin:4px; }
        @media (max-width: 900px) {
          .prop-detail-grid { grid-template-columns: 1fr !important; }
          .booking-sticky { position: static !important; top: auto !important; }
        }
        @media (max-width: 768px) {
          .prop-hero { height: 42vh !important; min-height: 260px !important; }
          .prop-back-btn { top: 76px !important; left: 14px !important; padding: 8px 14px !important; font-size: 0.82rem !important; }
          .prop-thumb-row { bottom: 8px !important; gap: 5px !important; }
          .prop-thumb-row img { width: 44px !important; height: 34px !important; }
        }

      `}</style>

      {/* Hero Image Gallery */}
      <div className='prop-hero' style={{ position: 'relative', height: '60vh', overflow: 'hidden', background: '#1a1a2e' }}>
        <img src={images[activeImg]} alt={property.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', animation: 'fadeIn 0.4s ease' }}
          key={activeImg} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 100%)' }} />

        {/* Back button */}
        <button onClick={() => navigate(-1)} className='prop-back-btn' style={{
          position: 'absolute', top: '90px', left: '24px',
          background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.3)', color: 'white',
          padding: '10px 20px', borderRadius: '50px', cursor: 'pointer',
          fontFamily: "'Inter',sans-serif", fontWeight: 600, fontSize: '0.9rem',
          display: 'flex', alignItems: 'center', gap: '8px'
        }}>← Back</button>

        {/* Image thumbnails */}
        {images.length > 1 && (
          <div className='prop-thumb-row' style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px' }}>
            {images.map((img, i) => (
              <img key={i} src={img} alt="" className={`thumb ${i === activeImg ? 'active' : ''}`}
                onClick={() => setActiveImg(i)}
                style={{ width: '60px', height: '45px', objectFit: 'cover', borderRadius: '8px' }} />
            ))}
          </div>
        )}

        {/* Bottom wave */}
        <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0 }}>
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ display: 'block', height: '60px' }}>
            <path d="M0,30 C360,60 720,0 1080,30 C1260,45 1380,38 1440,30 L1440,60 L0,60 Z" fill="#f5f7fa"/>
          </svg>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
        {/* Breadcrumb */}
        <div style={{ marginBottom: '24px', color: '#6b7280', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span onClick={() => navigate('/')} style={{ cursor: 'pointer', color: '#0077C8' }}>Home</span>
          <span>›</span>
          <span onClick={() => navigate('/destinations')} style={{ cursor: 'pointer', color: '#0077C8' }}>Destinations</span>
          <span>›</span>
          <span onClick={() => navigate(-1)} style={{ cursor: 'pointer', color: '#0077C8' }}>{property.regionName}</span>
          <span>›</span>
          <span style={{ color: '#1a1a2e', fontWeight: 600 }}>{property.name}</span>
        </div>

        <div className='prop-detail-grid' style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '32px', alignItems: 'start' }}>
          {/* Left: Details */}
          <div>
            <div style={{ background: 'white', borderRadius: '20px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
                    <span style={{ background: property.type === 'Resort' ? '#e8f4ff' : '#fef3c7', color: property.type === 'Resort' ? '#0077C8' : '#d97706', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>{property.type}</span>
                    {property.featured && <span style={{ background: '#fef3c7', color: '#d97706', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>⭐ Featured</span>}
                    <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>★ {property.rating}/5</span>
                  </div>
                  <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(1.6rem,3vw,2.2rem)', color: '#1a1a2e', marginBottom: '8px' }}>{property.name}</h1>
                  <p style={{ color: '#6b7280', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    📍 {property.location}
                  </p>
                </div>
              </div>
              <p style={{ color: '#4b5563', lineHeight: 1.8, fontSize: '1rem', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>{property.description}</p>
            </div>

            {/* Amenities */}
            {property.amenities?.length > 0 && (
              <div style={{ background: 'white', borderRadius: '20px', padding: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.4rem', color: '#1a1a2e', marginBottom: '20px' }}>Amenities & Facilities</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {property.amenities.map(a => (
                    <span key={a} className="amenity-chip">✓ {a}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Booking Card */}
          <div className='booking-sticky' style={{ position: 'sticky', top: '100px' }}>
            <div style={{ background: 'white', borderRadius: '20px', padding: '28px', boxShadow: '0 8px 40px rgba(0,119,200,0.15)', border: '1px solid #e8f4ff' }}>
              <div style={{ textAlign: 'center', marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: '4px', fontFamily: "'Inter',sans-serif" }}>Starting from</div>
                <div style={{ color: '#0077C8', fontWeight: 800, fontSize: '2rem', fontFamily: "'Inter',sans-serif" }}>
                  ₹{property.price?.toLocaleString()}
                </div>
                <div style={{ color: '#9ca3af', fontSize: '0.85rem' }}>{property.priceUnit}</div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                {['Free Cancellation', 'Best Price Guarantee', 'Instant Confirmation'].map(b => (
                  <div key={b} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', color: '#374151', fontSize: '0.9rem', fontFamily: "'Inter',sans-serif" }}>
                    <span style={{ color: '#16a34a', fontWeight: 700 }}>✓</span> {b}
                  </div>
                ))}
              </div>

              <button onClick={() => setShowBooking(true)} style={{
                width: '100%', padding: '16px',
                background: 'linear-gradient(135deg,#0077C8,#005a96)',
                color: 'white', border: 'none', borderRadius: '50px',
                fontWeight: 700, cursor: 'pointer', fontSize: '1.05rem',
                fontFamily: "'Inter',sans-serif", transition: 'all 0.3s',
                boxShadow: '0 6px 20px rgba(0,119,200,0.35)', marginBottom: '12px',
                letterSpacing: '0.3px'
              }}
                onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 10px 28px rgba(0,119,200,0.45)'; }}
                onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 6px 20px rgba(0,119,200,0.35)'; }}
              >
                🏨 Book Now
              </button>

              <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '0.8rem', fontFamily: "'Inter',sans-serif" }}>
                No payment required to submit request
              </p>
            </div>
          </div>
        </div>
      </div>

      {showBooking && <BookingModal property={property} onClose={() => setShowBooking(false)} />}
    </div>
  );
};

export default PropertyDetail;
