import { useState, useEffect, useCallback, useRef } from 'react';
import DestinationCard from './DestinationCard';
import './Slider.css';

const AUTO_ADVANCE = 6000;

export default function Slider({ destinations }) {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState(null);
  const [direction, setDirection] = useState('next');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [bgLoaded, setBgLoaded] = useState({});
  const timerRef = useRef(null);
  const total = destinations.length;

  const goTo = useCallback((index, dir = 'next') => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setDirection(dir);
    setPrev(current);
    setCurrent(index);
    setTimeout(() => {
      setPrev(null);
      setIsTransitioning(false);
    }, 900);
  }, [current, isTransitioning]);

  const next = useCallback(() => {
    goTo((current + 1) % total, 'next');
  }, [current, total, goTo]);

  const prev_slide = useCallback(() => {
    goTo((current - 1 + total) % total, 'prev');
  }, [current, total, goTo]);

  // Auto advance
  useEffect(() => {
    timerRef.current = setTimeout(next, AUTO_ADVANCE);
    return () => clearTimeout(timerRef.current);
  }, [current, next]);

  // Keyboard navigation
  useEffect(() => {
    const handler = e => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev_slide();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [next, prev_slide]);

  // Preload images
  useEffect(() => {
    destinations.forEach((d, i) => {
      const img = new Image();
      img.src = d.image;
      img.onload = () => setBgLoaded(prev => ({ ...prev, [i]: true }));
    });
  }, [destinations]);

  const dest = destinations[current];
  const prevDest = prev !== null ? destinations[prev] : null;

  // Cards: next 3 destinations after current
  const cardDests = [1, 2, 3].map(offset => destinations[(current + offset) % total]);

  const pad = n => String(n + 1).padStart(2, '0');

  return (
    <div className="slider">
      {/* Background layers */}
      {destinations.map((d, i) => (
        <div
          key={d.id}
          className={`slide-bg ${i === current ? 'bg-active' : ''} ${i === prev ? `bg-exit bg-exit-${direction}` : ''}`}
          style={{ backgroundImage: `url(${d.image})` }}
        />
      ))}

      {/* Dark gradient overlays */}
      <div className="slide-overlay-left" />
      <div className="slide-overlay-right" />
      <div className="slide-overlay-bottom" />

      {/* Slide counter ghost text */}
      <div className="ghost-text" key={current}>
        {dest.name.toUpperCase()}
      </div>

      {/* Left panel — slide indicators */}
      <div className="slide-indicators">
        {destinations.map((d, i) => (
          <button
            key={d.id}
            className={`indicator ${i === current ? 'ind-active' : ''}`}
            onClick={() => goTo(i, i > current ? 'next' : 'prev')}
            aria-label={`Go to ${d.name}`}
          >
            <span className="ind-number">{pad(i)}</span>
            <div className="ind-dot-wrap">
              <div className="ind-dot" />
              {i === current && <div className="ind-progress" style={{ '--duration': `${AUTO_ADVANCE}ms` }} />}
            </div>
            <span className="ind-name">{d.name}</span>
          </button>
        ))}
      </div>

      {/* Main content — bottom left */}
      <div className="slide-content" key={`content-${current}`}>
        <div className="slide-meta">
          <span className="slide-category">{dest.category}</span>
          <span className="slide-divider">·</span>
          <span className="slide-country">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {dest.country}
          </span>
        </div>

        <h1 className="slide-title">
          {dest.name.split('').map((char, i) => (
            <span key={i} style={{ '--i': i }}>{char === ' ' ? ' ' : char}</span>
          ))}
        </h1>

        <p className="slide-tagline">{dest.tagline}</p>
        <p className="slide-subtitle">{dest.subtitle}</p>

        {/* Highlights */}
        <div className="slide-highlights">
          {dest.highlights.slice(0, 3).map((h, i) => (
            <span key={i} className="highlight-tag" style={{ '--i': i }}>
              <span className="tag-dot" />
              {h}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div className="slide-cta-wrap">
          <button className="slide-cta-primary">
            Explore Now
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
          <button className="slide-cta-secondary">
            View Packages
          </button>
        </div>
      </div>

      {/* Right panel — destination cards */}
      <div className="slide-cards">
        {cardDests.map((d, i) => (
          <DestinationCard
            key={`${d.id}-${current}`}
            dest={d}
            index={i}
            isActive={false}
            onClick={() => {
              const idx = destinations.findIndex(x => x.id === d.id);
              goTo(idx, 'next');
            }}
          />
        ))}
      </div>

      {/* Bottom controls */}
      <div className="slide-controls">
        <div className="ctrl-left">
          <button className="ctrl-btn" onClick={prev_slide} aria-label="Previous">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button className="ctrl-btn ctrl-btn-next" onClick={next} aria-label="Next">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        <div className="ctrl-counter">
          <span className="counter-current">{pad(current)}</span>
          <div className="counter-track">
            <div
              className="counter-fill"
              style={{ width: `${((current + 1) / total) * 100}%` }}
            />
          </div>
          <span className="counter-total">{pad(total - 1)}</span>
        </div>

        {/* Progress timer */}
        <div className="ctrl-timer" key={current}>
          <div className="timer-arc" style={{ '--duration': `${AUTO_ADVANCE}ms` }} />
        </div>
      </div>
    </div>
  );
}
