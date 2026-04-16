import React, { useEffect, useState } from 'react';

const SplashScreen = () => {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); return 100; }
        return p + 2;
      });
    }, 55);

    const fadeTimer = setTimeout(() => setFadeOut(true), 3000);
    return () => { clearInterval(interval); clearTimeout(fadeTimer); };
  }, []);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'linear-gradient(135deg, #0077C8 0%, #005a96 50%, #003d6b 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      opacity: fadeOut ? 0 : 1,
      transition: 'opacity 0.5s ease',
      overflow: 'hidden'
    }}>
      {/* Background animated circles */}
      {[...Array(6)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.1)',
          width: `${(i + 1) * 150}px`,
          height: `${(i + 1) * 150}px`,
          animation: `pulse ${2 + i * 0.5}s ease-in-out infinite alternate`,
          opacity: 0.3 - i * 0.04
        }} />
      ))}

      {/* Flying planes */}
      <div style={{ position: 'absolute', fontSize: '2rem', animation: 'flyAcross 4s linear infinite', top: '20%', opacity: 0.4 }}>✈</div>
      <div style={{ position: 'absolute', fontSize: '1.5rem', animation: 'flyAcross 6s linear 2s infinite', top: '70%', opacity: 0.3 }}>✈</div>

      <style>{`
        @keyframes flyAcross {
          from { left: -10%; }
          to { left: 110%; }
        }
        @keyframes pulse {
          from { transform: scale(0.95); opacity: 0.2; }
          to { transform: scale(1.05); opacity: 0.4; }
        }
        @keyframes logoEntrance {
          0% { opacity: 0; transform: scale(0.5) translateY(30px); }
          60% { transform: scale(1.05) translateY(-5px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes textSlide {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes progressAnim {
          from { width: 0; }
        }
        @keyframes dot1 { 0%,80%,100% { transform: scale(0); } 40% { transform: scale(1); } }
        @keyframes dot2 { 0%,80%,100% { transform: scale(0); } 40% { transform: scale(1); } }
        @keyframes dot3 { 0%,80%,100% { transform: scale(0); } 40% { transform: scale(1); } }
      `}</style>

      {/* Logo Area */}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        {/* Logo icon */}
        <div style={{
          animation: 'logoEntrance 1s ease forwards',
          marginBottom: '24px'
        }}>
          <div style={{
            width: '130px', height: '130px', margin: '0 auto',
            borderRadius: '28px',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
            border: '3px solid rgba(255,255,255,0.4)',
          }}>
            <img
              src="/logo.jpeg"
              alt="My Holiday Club"
              style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}
            />
          </div>
        </div>

        {/* Brand name */}
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          color: 'white',
          fontWeight: 700,
          letterSpacing: '2px',
          animation: 'textSlide 0.8s ease 0.5s both',
          marginBottom: '8px'
        }}>
          My Holiday Club
        </h1>
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '1.1rem',
          color: 'rgba(255,255,255,0.8)',
          letterSpacing: '4px',
          textTransform: 'uppercase',
          animation: 'textSlide 0.8s ease 0.8s both',
          marginBottom: '48px'
        }}>
          Travel Made Easier
        </p>

        {/* Progress bar */}
        <div style={{
          width: '240px', height: '3px',
          background: 'rgba(255,255,255,0.2)',
          borderRadius: '4px', margin: '0 auto 16px',
          overflow: 'hidden'
        }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #f0a500, white)',
            borderRadius: '4px',
            transition: 'width 0.1s ease'
          }} />
        </div>

        {/* Loading dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
          {[0, 0.2, 0.4].map((delay, i) => (
            <div key={i} style={{
              width: '8px', height: '8px',
              background: 'rgba(255,255,255,0.7)',
              borderRadius: '50%',
              animation: `dot${i + 1} 1.2s ease ${delay}s infinite`
            }} />
          ))}
        </div>

        <p style={{
          color: 'rgba(255,255,255,0.5)',
          fontSize: '0.85rem',
          marginTop: '16px',
          letterSpacing: '2px'
        }}>
          {progress < 100 ? 'Loading your experience...' : 'Welcome!'}
        </p>
      </div>

      {/* Bottom tagline */}
      <div style={{
        position: 'absolute', bottom: '40px',
        color: 'rgba(255,255,255,0.4)',
        fontSize: '0.8rem', letterSpacing: '2px',
        textTransform: 'uppercase'
      }}>
        Premium Holiday Memberships Since 2010
      </div>
    </div>
  );
};

export default SplashScreen;
