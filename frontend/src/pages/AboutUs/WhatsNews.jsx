import React, { useState, useEffect } from 'react';
import axios from 'axios';

const fallbackNews = [
  { id: 'n1', title: 'My Holiday Club Launches New Maldives Package', date: '2024-01-15', category: 'New Launch', excerpt: 'We are thrilled to announce our exclusive overwater bungalow packages in the Maldives, offering unparalleled luxury at member-exclusive rates.', image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=600' },
  { id: 'n2', title: 'Expansion to 50 New Destinations Across India', date: '2024-02-01', category: 'Expansion', excerpt: 'My Holiday Club expands its portfolio with 50 new premium properties across India, bringing total count to 200+ curated resorts.', image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=600' },
  { id: 'n3', title: 'Award: Best Holiday Club of the Year 2024', date: '2024-03-10', category: 'Award', excerpt: 'My Holiday Club wins the prestigious Best Holiday Club of the Year award at the India Travel Awards ceremony in New Delhi.', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600' },
  { id: 'n4', title: 'New Mobile App Launch with Seamless Booking', date: '2024-04-05', category: 'Technology', excerpt: 'Our brand new mobile app makes holiday planning easier than ever, with instant booking, exclusive app-only deals, and real-time availability.', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600' },
];

const WhatsNews = () => {
  const [news, setNews] = useState(fallbackNews);
  useEffect(() => { axios.get('/api/news').then(r => { if (r.data.data?.length) setNews(r.data.data); }).catch(() => {}); }, []);

  const categoryColors = { 'New Launch': '#10b981', 'Expansion': '#0077C8', 'Award': '#f0a500', 'Technology': '#8b5cf6' };

  return (
    <div>
      <div style={{ padding: '140px 0 80px', background: 'linear-gradient(135deg, #0077C8, #003d6b)', color: 'white', textAlign: 'center' }}>
        <div className="container">
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.5rem,5vw,4rem)', marginBottom: '16px' }}>What's News</h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.85 }}>Latest updates, launches and milestones from My Holiday Club</p>
        </div>
      </div>

      <div style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '32px' }}>
            {news.map((item, i) => (
              <div key={item.id} className="card-hover" style={{
                borderRadius: '20px', overflow: 'hidden',
                background: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                animation: `fadeInUp 0.6s ease ${i * 0.1}s both`
              }}>
                <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                  <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} className="news-img" />
                  <div style={{
                    position: 'absolute', top: '16px', left: '16px',
                    background: categoryColors[item.category] || '#0077C8',
                    color: 'white', padding: '4px 14px', borderRadius: '20px',
                    fontSize: '0.78rem', fontWeight: 700
                  }}>{item.category}</div>
                </div>
                <div style={{ padding: '24px' }}>
                  <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: '10px' }}>
                    📅 {new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.15rem', color: '#1a1a2e', marginBottom: '12px', lineHeight: 1.4 }}>{item.title}</h3>
                  <p style={{ color: '#4b5563', fontSize: '0.9rem', lineHeight: 1.6 }}>{item.excerpt}</p>
                  <button style={{
                    marginTop: '16px', padding: '8px 20px',
                    background: 'transparent', color: '#0077C8',
                    border: '2px solid #0077C8', borderRadius: '50px',
                    cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
                    transition: 'all 0.3s', fontFamily: "'Inter', sans-serif"
                  }}
                    onMouseEnter={e => { e.target.style.background = '#0077C8'; e.target.style.color = 'white'; }}
                    onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#0077C8'; }}
                  >Read More →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`.news-img:hover { transform: scale(1.05); }`}</style>
    </div>
  );
};

export default WhatsNews;
