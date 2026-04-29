import React from 'react';

const Philosophy = () => (
  <div>
    <div style={{ height: '60vh', minHeight: '400px', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0a1628 0%, #0077C8 60%, #003d6b 100%)' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1920&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,20,60,0.55) 0%, rgba(0,50,100,0.75) 100%)' }} />
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', color: 'white', padding: '0 24px' }}>
        <div style={{ display: 'inline-block', padding: '5px 18px', background: 'rgba(240,165,0,0.9)', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '20px' }}>About Us</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.2rem,5vw,4rem)', marginBottom: '16px', textShadow: '0 2px 12px rgba(0,0,0,0.3)' }}>Our Philosophy</h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.9, maxWidth: '640px', margin: '0 auto' }}>The principles that guide every holiday experience we create</p>
      </div>
      <div style={{ position: 'absolute', bottom: -2, left: 0, right: 0 }}>
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ display: 'block', height: '60px' }}>
          <path d="M0,60 C360,0 1080,0 1440,60 L1440,60 L0,60 Z" fill="white"/>
        </svg>
      </div>
    </div>

    <div style={{ padding: '80px 0' }}>
      <div className="container">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div style={{ fontSize: '5rem', color: '#0077C8', opacity: 0.15, fontFamily: 'serif', lineHeight: 1 }}>"</div>
            <blockquote style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: '#1a1a2e', lineHeight: 1.5, margin: '-30px 0 16px', fontStyle: 'italic' }}>
              Travel is not just a destination — it's a transformation of the soul.
            </blockquote>
            <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>— My Holiday Club</p>
          </div>

          {[
            { num: '01', title: 'Member First', icon: '🤝', desc: 'Every decision we make starts with one question: is this the best for our members? From property selection to pricing to support, our members\' joy is our north star.' },
            { num: '02', title: 'Quality Without Compromise', icon: '⭐', desc: 'We personally visit and verify every property in our portfolio. If it doesn\'t meet our standards, it doesn\'t make the cut — no exceptions.' },
            { num: '03', title: 'Transparency Always', icon: '🔍', desc: 'No hidden fees. No misleading promises. We believe in clear, honest communication at every step of your membership journey.' },
            { num: '04', title: 'Sustainable Travel', icon: '🌿', desc: 'We partner with eco-conscious properties and promote responsible tourism that preserves India\'s natural and cultural heritage for generations to come.' },
            { num: '05', title: 'Continuous Innovation', icon: '💡', desc: 'The travel world evolves, and so do we. We continuously invest in technology, partnerships, and experiences to stay ahead of our members\' needs.' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '32px', marginBottom: '48px', alignItems: 'flex-start' }}>
              <div style={{ flexShrink: 0, width: '64px', height: '64px', borderRadius: '20px', background: 'linear-gradient(135deg, #0077C8, #005a96)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem' }}>{item.icon}</div>
              <div>
                <div style={{ color: '#0077C8', fontWeight: 800, fontSize: '0.8rem', letterSpacing: '2px', marginBottom: '6px' }}>{item.num}</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', color: '#1a1a2e', marginBottom: '10px' }}>{item.title}</h3>
                <p style={{ color: '#4b5563', lineHeight: 1.8 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default Philosophy;
