import React from 'react';

const pressItems = [
  { date: 'March 2024', source: 'The Economic Times', title: 'My Holiday Club Crosses 50,000 Member Milestone', excerpt: "India's premier holiday membership club celebrates a major milestone, cementing its position as the market leader in organized holiday memberships." },
  { date: 'January 2024', source: 'Business Standard', title: 'MHC Raises ₹100 Crore to Accelerate Expansion', excerpt: 'My Holiday Club announces a successful funding round, with plans to double its property portfolio and expand into Southeast Asian markets by 2025.' },
  { date: 'November 2023', source: 'Times of India', title: 'MHC Wins India Travel Award for 3rd Consecutive Year', excerpt: 'Recognized for excellence in customer service, property quality, and innovation in the holiday membership space.' },
  { date: 'September 2023', source: 'Hindustan Times', title: 'My Holiday Club Launches International Partnerships', excerpt: 'New partnerships with luxury resort chains in Maldives, Bali, and Dubai to offer international options to MHC members.' },
];

const PressRelease = () => (
  <div>
    {/* Hero with background photo */}
    <div style={{ height: '60vh', minHeight: '400px', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0a1628 0%, #0077C8 60%, #003d6b 100%)' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1920&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,20,60,0.55) 0%, rgba(0,50,100,0.75) 100%)' }} />
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', color: 'white', padding: '0 24px' }}>
        <div style={{ display: 'inline-block', padding: '5px 18px', background: 'rgba(240,165,0,0.9)', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '20px' }}>Media</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.2rem,5vw,4rem)', marginBottom: '16px', textShadow: '0 2px 12px rgba(0,0,0,0.3)' }}>Press Release</h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.9, maxWidth: '640px', margin: '0 auto' }}>My Holiday Club in the news — media coverage and official statements</p>
      </div>
      <div style={{ position: 'absolute', bottom: -2, left: 0, right: 0 }}>
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ display: 'block', height: '60px' }}>
          <path d="M0,60 C360,0 1080,0 1440,60 L1440,60 L0,60 Z" fill="white"/>
        </svg>
      </div>
    </div>

    {/* Content */}
    <div style={{ padding: '80px 0' }}>
      <div className="container">
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          {/* Media contact */}
          <div style={{ background: 'linear-gradient(135deg, #e8f4ff, #f8fafc)', borderRadius: '16px', padding: '32px', marginBottom: '48px', display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ fontSize: '3rem' }}>📰</div>
            <div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#1a1a2e', marginBottom: '8px' }}>Media Inquiries</h3>
              <p style={{ color: '#4b5563', marginBottom: '4px' }}>For press queries, interviews, and media partnerships:</p>
              <p style={{ color: '#0077C8', fontWeight: 600 }}>press@myholidayclub.co.in | +91 98765 43210</p>
            </div>
          </div>

          {pressItems.map((item, i) => (
            <div key={i} style={{
              display: 'flex', gap: '24px', marginBottom: '32px',
              padding: '32px', background: 'white', borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
              borderLeft: '4px solid #0077C8',
              transition: 'all 0.3s'
            }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,119,200,0.12)'; e.currentTarget.style.transform = 'translateX(4px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'translateX(0)'; }}
            >
              <div style={{ flexShrink: 0, textAlign: 'center' }}>
                <div style={{ background: '#e8f4ff', borderRadius: '12px', padding: '12px 16px', minWidth: '100px' }}>
                  <div style={{ color: '#0077C8', fontWeight: 700, fontSize: '0.9rem' }}>{item.date}</div>
                  <div style={{ color: '#6b7280', fontSize: '0.8rem', marginTop: '4px' }}>{item.source}</div>
                </div>
              </div>
              <div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', color: '#1a1a2e', marginBottom: '10px' }}>{item.title}</h3>
                <p style={{ color: '#4b5563', lineHeight: 1.7 }}>{item.excerpt}</p>
                <button style={{ marginTop: '12px', background: 'none', border: 'none', color: '#0077C8', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem', fontFamily: "'Inter', sans-serif" }}>
                  Read Full Release →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    <style>{`@keyframes fadeInLeft { from { opacity:0; transform:translateX(-20px); } to { opacity:1; transform:translateX(0); } }`}</style>
  </div>
);

export default PressRelease;
