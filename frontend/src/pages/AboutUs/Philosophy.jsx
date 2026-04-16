import React from 'react';

const Philosophy = () => (
  <div>
    <div style={{ padding: '140px 0 80px', background: 'linear-gradient(135deg, #0077C8, #003d6b)', color: 'white', textAlign: 'center' }}>
      <div className="container">
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.5rem,5vw,4rem)', marginBottom: '16px' }}>Our Philosophy</h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.85, maxWidth: '600px', margin: '0 auto' }}>The principles that guide every holiday experience we create</p>
      </div>
    </div>

    <div style={{ padding: '80px 0' }}>
      <div className="container">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* Quote */}
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div style={{ fontSize: '5rem', color: '#0077C8', opacity: 0.15, fontFamily: 'serif', lineHeight: 1 }}>"</div>
            <blockquote style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: '#1a1a2e', lineHeight: 1.5, margin: '-30px 0 16px', fontStyle: 'italic' }}>
              Travel is not just a destination — it's a transformation of the soul.
            </blockquote>
            <cite style={{ color: '#6b7280', fontSize: '0.95rem' }}>— My Holiday Club Philosophy</cite>
          </div>

          {[
            { icon: '💝', title: 'People First', text: 'Every decision we make starts with one question: how does this serve our members better? From the properties we choose to the experiences we curate, our members\' happiness is our north star.' },
            { icon: '🌿', title: 'Responsible Travel', text: 'We believe in travel that gives back. We partner with eco-conscious properties, support local communities, and continuously work to minimize our environmental footprint.' },
            { icon: '✨', title: 'Uncompromising Quality', text: 'We maintain the highest standards across every touchpoint — from the properties we list to the customer service we provide. Quality is not a feature; it\'s our foundation.' },
            { icon: '🤝', title: 'Trust & Transparency', text: 'We build relationships on honesty. No hidden fees, no misleading promotions, no fine print surprises. What you see is what you get — and it\'s always exceptional.' },
            { icon: '🚀', title: 'Continuous Innovation', text: 'The travel industry evolves, and so do we. We constantly seek new destinations, improve our technology, and refine our services to stay ahead of your travel dreams.' },
            { icon: '🌍', title: 'Inclusive Luxury', text: 'Luxury should not be exclusive. Our mission is to bring world-class holiday experiences within reach of every aspirational Indian family — at prices that make sense.' },
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex', gap: '24px', marginBottom: '40px', padding: '32px',
              borderRadius: '16px', background: i % 2 === 0 ? '#f8fafc' : 'white',
              border: '1px solid #e8f4ff',
              transition: 'all 0.3s',
              animation: `fadeInLeft 0.6s ease ${i * 0.1}s both`
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#0077C8'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,119,200,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#e8f4ff'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ fontSize: '2.5rem', flexShrink: 0 }}>{item.icon}</div>
              <div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', color: '#1a1a2e', marginBottom: '10px' }}>{item.title}</h3>
                <p style={{ color: '#4b5563', lineHeight: 1.8 }}>{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default Philosophy;
