import React from 'react';

const FoundersMessage = () => (
  <div>
    <div style={{ height: '60vh', minHeight: '400px', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0a1628 0%, #0077C8 60%, #003d6b 100%)' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,20,60,0.55) 0%, rgba(0,50,100,0.75) 100%)' }} />
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', color: 'white', padding: '0 24px' }}>
        <div style={{ display: 'inline-block', padding: '5px 18px', background: 'rgba(240,165,0,0.9)', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '20px' }}>Leadership</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.2rem,5vw,4rem)', marginBottom: '16px', textShadow: '0 2px 12px rgba(0,0,0,0.3)' }}>Founder's Message</h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.9, maxWidth: '640px', margin: '0 auto' }}>A personal note from the heart of My Holiday Club</p>
      </div>
      <div style={{ position: 'absolute', bottom: -2, left: 0, right: 0 }}>
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ display: 'block', height: '60px' }}>
          <path d="M0,60 C360,0 1080,0 1440,60 L1440,60 L0,60 Z" fill="white"/>
        </svg>
      </div>
    </div>

    <div style={{ padding: '80px 0' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '60px', alignItems: 'start' }}>
          <div style={{ position: 'sticky', top: '100px' }}>
            <div style={{ borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.12)' }}>
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80" alt="Founder"
                style={{ width: '100%', height: '320px', objectFit: 'cover', objectPosition: 'top' }} />
              <div style={{ padding: '24px', background: 'white' }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', color: '#1a1a2e', marginBottom: '4px' }}>Rajesh Kumar</h3>
                <p style={{ color: '#0077C8', fontSize: '0.85rem', fontWeight: 600 }}>Founder & Managing Director</p>
                <p style={{ color: '#6b7280', fontSize: '0.8rem', marginTop: '8px' }}>My Holiday Club</p>
              </div>
            </div>
          </div>
          <div>
            <div style={{ fontSize: '4rem', color: '#0077C8', opacity: 0.15, fontFamily: 'serif', lineHeight: 1, marginBottom: '-10px' }}>"</div>
            {[
              'Dear Friends and Members, When I started My Holiday Club in 2010, people called it a dream. I called it a mission — a mission to ensure that every Indian family could experience the joy of a truly premium holiday without burning a hole in their pocket.',
              'I had seen firsthand how fragmented and complicated travel planning was. Families would spend weeks researching, only to end up with disappointing experiences. I knew we could do better. We had to do better.',
              'Today, 15 years later, I am humbled by the trust over 50,000 families have placed in us. Every time I hear a member tell me about their magical vacation in Coorg, their kids\' first beach holiday in Goa, or their anniversary getaway in Udaipur — I know why we do what we do.',
              'My promise to you is simple: we will never stop caring. Every policy we make, every property we add, every innovation we build — it will always begin and end with your happiness.',
              'Thank you for being part of this beautiful journey. The best holidays are yet to come.',
            ].map((para, i) => (
              <p key={i} style={{ color: i === 0 ? '#1a1a2e' : '#4b5563', lineHeight: 1.9, marginBottom: '20px', fontSize: i === 0 ? '1.05rem' : '0.97rem', fontWeight: i === 0 ? 600 : 400 }}>{para}</p>
            ))}
            <div style={{ borderTop: '2px solid #e8f4ff', paddingTop: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=60&q=80" alt="" style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover' }} />
              <div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: '1.1rem', color: '#1a1a2e' }}>Rajesh Kumar</div>
                <div style={{ color: '#0077C8', fontSize: '0.85rem', fontWeight: 600 }}>Founder & MD, My Holiday Club</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default FoundersMessage;
