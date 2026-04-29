import { useEffect, useState } from 'react';
import './SplashScreen.css';

export default function SplashScreen({ onDone }) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const duration = 2800;
    const interval = 30;
    const steps = duration / interval;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      // Ease-out progress curve
      const t = step / steps;
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(Math.min(100, Math.round(eased * 100)));

      if (step >= steps) {
        clearInterval(timer);
        setTimeout(() => setFadeOut(true), 200);
        setTimeout(() => onDone(), 700);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onDone]);

  return (
    <div className={`splash ${fadeOut ? 'fade-out' : ''}`}>
      {/* Animated background particles */}
      <div className="splash-particles">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="particle" style={{ '--i': i }} />
        ))}
      </div>

      <div className="splash-content">
        {/* Logo */}
        <div className="splash-logo-wrap">
          <div className="splash-logo-ring" />
          <div className="splash-logo-ring ring2" />
          <div className="splash-logo-box">
            <img
              src="https://i.ibb.co/nQRcwHm/mhc-logo.png"
              alt="MHC"
              onError={e => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="splash-logo-fallback" style={{ display: 'none' }}>
              <span className="fallback-m">M</span>
              <span className="fallback-hc">HC</span>
            </div>
          </div>
        </div>

        {/* Brand name */}
        <div className="splash-brand">
          <span className="brand-my">My</span>
          <span className="brand-holiday">Holiday</span>
          <span className="brand-club">Club</span>
        </div>

        <p className="splash-tagline">Discover the World in Luxury</p>

        {/* Progress bar */}
        <div className="splash-progress-wrap">
          <div className="splash-progress-bar">
            <div
              className="splash-progress-fill"
              style={{ width: `${progress}%` }}
            />
            <div
              className="splash-progress-glow"
              style={{ left: `${progress}%` }}
            />
          </div>
          <span className="splash-percent">{progress}%</span>
        </div>

        <p className="splash-loading-text">
          {progress < 40 ? 'Preparing your journey...' :
           progress < 70 ? 'Loading destinations...' :
           progress < 90 ? 'Almost ready...' :
           'Welcome aboard!'}
        </p>
      </div>

      {/* Bottom decoration */}
      <div className="splash-bottom-deco">
        <div className="deco-line" />
        <span>Exclusive Member Experience</span>
        <div className="deco-line" />
      </div>
    </div>
  );
}
