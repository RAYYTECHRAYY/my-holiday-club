import React from 'react';

const pressItems = [
  { date: 'March 2024', source: 'The Economic Times', title: 'My Holiday Club Crosses 50,000 Member Milestone', excerpt: 'India\'s premier holiday membership club celebrates a major milestone, cementing its position as the market leader in organized holiday memberships.' },
  { date: 'January 2024', source: 'Business Standard', title: 'MHC Raises ₹100 Crore to Accelerate Expansion', excerpt: 'My Holiday Club announces a successful funding round, with plans to double its property portfolio and expand into Southeast Asian markets by 2025.' },
  { date: 'November 2023', source: 'Times of India', title: 'MHC Wins India Travel Award for 3rd Consecutive Year', excerpt: 'Recognized for excellence in customer service, property quality, and innovation in the holiday membership space.' },
  { date: 'September 2023', source: 'Hindustan Times', title: 'My Holiday Club Launches International Partnerships', excerpt: 'New partnerships with luxury resort chains in Maldives, Bali, and Dubai to offer international options to MHC members.' },
];

const PressRelease = () => (
  <div>
    <div style={{ padding: '140px 0 80px', background: 'linear-gradient(135deg, #0077C8, #003d6b)', color: 'white', textAlign: 'center' }}>
      <div className="container">
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.5rem,5vw,4rem)', marginBottom: '16px' }}>Press Release</h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.85 }}>My Holiday Club in the news — media coverage and official statements</p>
      </div>
    </div>

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
              transition: 'all 0.3s', animation: `fadeInLeft 0.6s ease ${i * 0.1}s both`
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
                <button style={{
                  marginTop: '12px', background: 'none', border: 'none',
                  color: '#0077C8', fontWeight: 600, cursor: 'pointer',
                  fontSize: '0.9rem', fontFamily: "'Inter', sans-serif"
                }}>Read Full Release →</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default PressRelease;
