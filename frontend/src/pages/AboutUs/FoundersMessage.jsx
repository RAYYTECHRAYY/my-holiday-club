import React from 'react';

const FoundersMessage = () => (
  <div>
    <div style={{ padding: '140px 0 80px', background: 'linear-gradient(135deg, #0077C8, #003d6b)', color: 'white', textAlign: 'center' }}>
      <div className="container">
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.5rem,5vw,4rem)', marginBottom: '16px' }}>Founder's Message</h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.85 }}>A personal note from the heart of My Holiday Club</p>
      </div>
    </div>

    <div style={{ padding: '80px 0' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '60px', alignItems: 'start' }}>
          {/* Founder card */}
          <div style={{ position: 'sticky', top: '100px' }}>
            <div style={{ borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.12)' }}>
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400" alt="Founder"
                style={{ width: '100%', height: '320px', objectFit: 'cover', objectPosition: 'top' }} />
              <div style={{ padding: '24px', background: 'white' }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', color: '#1a1a2e' }}>Rajiv Sharma</h3>
                <p style={{ color: '#0077C8', fontWeight: 600, marginBottom: '12px' }}>Founder & Managing Director</p>
                <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: 1.6 }}>MBA (IIM Ahmedabad) | 25+ years in hospitality & travel</p>
              </div>
            </div>

            {/* Signature */}
            <div style={{ marginTop: '24px', padding: '20px', background: '#f8fafc', borderRadius: '12px', borderLeft: '4px solid #0077C8' }}>
              <p style={{ color: '#6b7280', fontSize: '0.85rem', fontStyle: 'italic' }}>"Every family deserves to experience the joy of a perfect holiday. That dream is what drives me every day."</p>
            </div>
          </div>

          {/* Message */}
          <div>
            <div className="badge" style={{ marginBottom: '20px' }}>A Personal Note</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: '#1a1a2e', marginBottom: '32px', lineHeight: 1.3 }}>
              The Dream That Started It All
            </h2>

            {[
              "Dear Members and Friends,\n\nWhen I founded My Holiday Club in 2010, I had one dream: to create a world where every Indian family could experience the magic of a truly luxurious holiday without compromise. Growing up in a middle-class family in New Delhi, I remember watching my parents save for years for a single trip to Shimla. That memory stayed with me.",
              "After spending over two decades in the hospitality industry — working with some of the world's finest hotel brands — I realized that the gap between aspiration and access in travel was enormous. Millions of families dreamed of luxury travel, but felt it was beyond their reach. I knew something had to change.",
              "My Holiday Club was born from that conviction. We created a membership model that gives you the buying power of a large community, access to premium properties at members-only rates, and the assurance of consistent quality no matter where you travel.",
              "Fifteen years later, I am humbled and grateful to have 50,000+ families trust us with their most precious memories — their holidays. Every time I hear a member tell me about their child's first time seeing snow in Shimla, or a couple celebrating their anniversary in a Maldives overwater villa, I know we are fulfilling our purpose.",
              "We are not just a holiday company. We are the architects of your family's most treasured moments. And we take that responsibility with the utmost seriousness and joy.\n\nThank you for being part of the My Holiday Club family. The best is always yet to come.\n\nWith warm regards and a spirit of adventure,"
            ].map((para, i) => (
              <div key={i} style={{ marginBottom: '24px' }}>
                {para.split('\n').map((line, j) => (
                  <p key={j} style={{ color: '#4b5563', lineHeight: 1.9, fontSize: '1rem', marginBottom: '8px' }}>{line}</p>
                ))}
              </div>
            ))}

            <div style={{ marginTop: '32px', padding: '24px', background: 'linear-gradient(135deg, #e8f4ff, #f8fafc)', borderRadius: '16px' }}>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', color: '#1a1a2e', fontStyle: 'italic' }}>Rajiv Sharma</p>
              <p style={{ color: '#0077C8', fontWeight: 600 }}>Founder & Managing Director, My Holiday Club</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default FoundersMessage;
