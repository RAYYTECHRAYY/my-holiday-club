import React from 'react';
import { Link } from 'react-router-dom';

const Overview = () => (
  <div>
    <div style={{ padding: '140px 0 80px', background: 'linear-gradient(135deg, #0077C8, #003d6b)', color: 'white', textAlign: 'center' }}>
      <div className="container">
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.5rem,5vw,4rem)', marginBottom: '16px' }}>About My Holiday Club</h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.85, maxWidth: '580px', margin: '0 auto' }}>India's premier holiday membership club — creating extraordinary travel experiences since 2010</p>
      </div>
    </div>

    <div style={{ padding: '80px 0' }}>
      <div className="container">
        {/* Story */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center', marginBottom: '80px' }}>
          <div>
            <div className="badge" style={{ marginBottom: '16px' }}>Our Story</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.2rem', color: '#1a1a2e', marginBottom: '20px', lineHeight: 1.2 }}>
              Born from a Passion for Travel
            </h2>
            <p style={{ color: '#4b5563', lineHeight: 1.8, marginBottom: '16px' }}>
              My Holiday Club was founded in 2010 with a simple yet powerful vision: to make premium holiday experiences accessible to every Indian family. What started as a small operation with 5 properties has grown into India's most trusted holiday membership club.
            </p>
            <p style={{ color: '#4b5563', lineHeight: 1.8, marginBottom: '16px' }}>
              Today, we proudly serve over 50,000 members across India, offering access to 200+ carefully curated properties spanning from the majestic Himalayas to the tropical shores of Kerala, and beyond to international gems like Maldives, Bali, and Dubai.
            </p>
            <p style={{ color: '#4b5563', lineHeight: 1.8 }}>
              Our commitment is simple — deliver extraordinary holiday experiences with the warmth, care, and professionalism that every family deserves.
            </p>
          </div>
          <div style={{ position: 'relative' }}>
            <img src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=600" alt="About Us"
              style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '20px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }} />
            <div style={{
              position: 'absolute', bottom: '-24px', left: '-24px',
              background: 'linear-gradient(135deg, #0077C8, #005a96)',
              color: 'white', padding: '24px 32px', borderRadius: '16px',
              boxShadow: '0 10px 30px rgba(0,119,200,0.3)'
            }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', fontWeight: 700 }}>15+</div>
              <div style={{ fontSize: '0.9rem', opacity: 0.85 }}>Years of Excellence</div>
            </div>
          </div>
        </div>

        {/* Mission Vision */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '80px' }}>
          {[
            { icon: '🎯', title: 'Our Mission', color: '#0077C8', text: 'To democratize luxury travel by providing every Indian family with access to world-class holiday properties and seamless travel experiences at exceptional value.' },
            { icon: '🌟', title: 'Our Vision', color: '#f0a500', text: 'To be the most trusted and loved holiday membership club in Asia, synonymous with quality, innovation, and unforgettable travel memories.' },
          ].map((item, i) => (
            <div key={i} style={{ padding: '40px', borderRadius: '20px', background: `${item.color}08`, border: `2px solid ${item.color}20` }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>{item.icon}</div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', color: item.color, marginBottom: '12px' }}>{item.title}</h3>
              <p style={{ color: '#4b5563', lineHeight: 1.8 }}>{item.text}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div style={{ background: 'linear-gradient(135deg, #1a1a2e, #0a1628)', borderRadius: '24px', padding: '60px', color: 'white' }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", textAlign: 'center', fontSize: '2rem', marginBottom: '48px' }}>My Holiday Club by Numbers</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px', textAlign: 'center' }}>
            {[
              { num: '50,000+', label: 'Happy Members' },
              { num: '200+', label: 'Premium Properties' },
              { num: '15+', label: 'Countries' },
              { num: '15+', label: 'Years of Service' },
            ].map((s, i) => (
              <div key={i}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', fontWeight: 700, color: '#f0a500' }}>{s.num}</div>
                <div style={{ opacity: 0.7, marginTop: '8px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div style={{ marginTop: '60px', textAlign: 'center' }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", marginBottom: '24px', color: '#1a1a2e' }}>Explore More About Us</h3>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { label: 'Our Philosophy', path: '/about/philosophy' },
              { label: "Founder's Message", path: '/about/founders-message' },
              { label: "What's News", path: '/about/whats-news' },
              { label: 'Careers', path: '/about/careers' },
            ].map(l => (
              <Link key={l.path} to={l.path} className="btn-secondary">{l.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Overview;
