import { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Slider from '../components/Slider';
import { destinations } from '../data/destinations';
import { packages } from '../data/packages';
import './Home.css';

/* ── Animated counter ── */
function CountUp({ target, suffix = '', duration = 2000 }) {
  const [val, setVal] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let start = null;
    const step = ts => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);

  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

const testimonials = [
  { name: 'Ananya Krishnan', role: 'Gold Member since 2020', avatar: 'AK', text: 'MHC transformed how I travel. The Maldives package was flawless — private villa, transfers, everything arranged perfectly. Worth every rupee.' },
  { name: 'Suresh Patel', role: 'Platinum Member since 2018', avatar: 'SP', text: 'I\'ve tried other travel clubs, but nothing compares to the exclusivity and service here. My Thailand family trip was the best holiday we\'ve ever had.' },
  { name: 'Divya Menon', role: 'Silver Member since 2022', avatar: 'DM', text: 'Joined as a Silver member and upgraded to Gold within 3 months. The savings on hotel rates alone paid for my membership twice over.' },
  { name: 'Rajan Sharma', role: 'Gold Member since 2019', avatar: 'RS', text: 'The concierge team is phenomenal. They arranged a surprise anniversary dinner in Bali at the most incredible cliffside restaurant. Absolutely magical.' },
];

export default function Home() {
  const navigate = useNavigate();
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial(v => (v + 1) % testimonials.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="home-page">

      {/* ── HERO SLIDER ── */}
      <div className="home-slider-wrap">
        <Slider destinations={destinations} />
      </div>

      {/* ── MARQUEE STRIP ── */}
      <div className="home-marquee">
        <div className="marquee-track">
          {[...Array(3)].map((_, r) =>
            ['North India', 'Goa', 'Kerala', 'Maldives', 'Dubai', 'Thailand', 'Bali',
             '✦', 'North India', 'Goa', 'Kerala', 'Maldives', 'Dubai', 'Thailand', 'Bali', '✦'].map((t, i) => (
              <span key={`${r}-${i}`} className={t === '✦' ? 'marquee-dot' : 'marquee-item'}>{t}</span>
            ))
          )}
        </div>
      </div>

      {/* ── FEATURED DESTINATIONS ── */}
      <section className="home-section home-featured">
        <div className="home-section-head">
          <div className="gold-line" />
          <h2 className="section-title">Featured Destinations</h2>
          <p className="section-sub">Handpicked escapes exclusively for MHC members</p>
          <Link to="/destinations" className="btn-ghost home-see-all">
            View All Destinations
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </Link>
        </div>

        <div className="home-dest-grid">
          {/* Large featured card */}
          <div className="hd-card hd-large glass-card" onClick={() => navigate(`/destinations/${destinations[0].id}`)}>
            <div className="hd-img-wrap">
              <img src={destinations[0].image} alt={destinations[0].name} />
              <div className="hd-img-overlay" />
            </div>
            <div className="hd-body">
              <span className="hd-cat">{destinations[0].category}</span>
              <h3 className="hd-name">{destinations[0].name}</h3>
              <p className="hd-desc">{destinations[0].description}</p>
              <div className="hd-footer">
                <span className="hd-price">{destinations[0].price}</span>
                <span className="hd-rating">⭐ {destinations[0].rating}</span>
              </div>
            </div>
          </div>

          {/* 3 smaller cards */}
          <div className="hd-small-grid">
            {destinations.slice(1, 4).map((d, i) => (
              <div key={d.id} className="hd-card hd-small glass-card" style={{ '--i': i }} onClick={() => navigate(`/destinations/${d.id}`)}>
                <div className="hd-img-wrap">
                  <img src={d.image} alt={d.name} />
                  <div className="hd-img-overlay" />
                </div>
                <div className="hd-body">
                  <span className="hd-cat">{d.category}</span>
                  <h4 className="hd-name">{d.name}</h4>
                  <div className="hd-footer">
                    <span className="hd-price">{d.price}</span>
                    <span className="hd-rating">⭐ {d.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BAND ── */}
      <div className="home-stats">
        {[
          { value: 50000, suffix: '+', label: 'Happy Members' },
          { value: 100,   suffix: '+', label: 'Destinations' },
          { value: 12,    suffix: '',  label: 'Years of Excellence' },
          { value: 50,    suffix: '%', label: 'Avg Savings' },
          { value: 99,    suffix: '%', label: 'Satisfaction Rate' },
        ].map((s, i) => (
          <div key={i} className="home-stat">
            <strong><CountUp target={s.value} suffix={s.suffix} /></strong>
            <span>{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── WHY MHC ── */}
      <section className="home-section home-why">
        <div className="home-section-head">
          <div className="gold-line" />
          <h2 className="section-title">Why My Holiday Club?</h2>
          <p className="section-sub">The privileges that set us apart from every other travel club</p>
        </div>
        <div className="home-why-grid">
          {[
            { icon: '🏨', title: 'Premium Properties', desc: 'Every resort, hotel and villa is personally vetted by our travel team. Only the best makes the cut.' },
            { icon: '💰', title: 'Unbeatable Rates', desc: 'Members save 20–50% on luxury stays. Your first booking typically pays for your entire membership.' },
            { icon: '✈️', title: 'End-to-End Planning', desc: 'Flights, transfers, experiences — we handle every detail so you simply show up and enjoy.' },
            { icon: '🎖️', title: 'Dedicated Concierge', desc: 'Gold and Platinum members get a personal travel concierge available 24/7, just a call away.' },
            { icon: '🌍', title: '100+ Destinations', desc: 'From Himalayas to Maldives, Rajasthan to Bali — our collection spans the most coveted spots on earth.' },
            { icon: '🔒', title: 'Exclusive Access', desc: 'Members-only room categories, early booking windows, and exclusive properties not listed publicly.' },
          ].map((w, i) => (
            <div key={i} className="why-card glass-card" style={{ '--i': i }}>
              <span className="why-icon">{w.icon}</span>
              <h4 className="why-title">{w.title}</h4>
              <p className="why-desc">{w.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── MEMBERSHIP TEASER ── */}
      <section className="home-section home-plans">
        <div className="home-section-head">
          <div className="gold-line" />
          <h2 className="section-title">Membership Plans</h2>
          <p className="section-sub">Choose the tier that matches your travel ambitions</p>
        </div>
        <div className="home-plans-row">
          {packages.map((pkg, i) => (
            <div key={pkg.id} className={`home-plan-card glass-card ${pkg.popular ? 'hpc-popular' : ''}`} style={{ '--i': i }}>
              {pkg.popular && <span className="hpc-badge">Most Popular</span>}
              <div className="hpc-top" style={{ background: pkg.gradient }}>
                <span className="hpc-icon">{pkg.badge}</span>
                <h3 className="hpc-name">{pkg.name}</h3>
                <div className="hpc-price">
                  <span>₹</span>
                  <strong>{pkg.price.toLocaleString()}</strong>
                  <span>/yr</span>
                </div>
              </div>
              <ul className="hpc-features">
                {pkg.features.filter(f => f.included).slice(0, 4).map((f, j) => (
                  <li key={j}><span>✓</span>{f.text}</li>
                ))}
              </ul>
              <Link to="/packages" className={pkg.popular ? 'btn-gold' : 'btn-primary'} style={{ display:'flex', justifyContent:'center', textDecoration:'none', margin:'0 20px 20px' }}>
                Get {pkg.name}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="home-section home-testimonials">
        <div className="home-section-head">
          <div className="gold-line" />
          <h2 className="section-title">What Our Members Say</h2>
          <p className="section-sub">Real experiences from real travellers</p>
        </div>
        <div className="testi-slider">
          <div className="testi-cards" style={{ transform: `translateX(-${activeTestimonial * 100}%)` }}>
            {testimonials.map((t, i) => (
              <div key={i} className="testi-card glass-card">
                <div className="testi-stars">{'★★★★★'}</div>
                <p className="testi-text">"{t.text}"</p>
                <div className="testi-author">
                  <div className="testi-avatar">{t.avatar}</div>
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="testi-dots">
            {testimonials.map((_, i) => (
              <button key={i} className={`testi-dot ${i === activeTestimonial ? 'dot-active' : ''}`} onClick={() => setActiveTestimonial(i)} />
            ))}
          </div>
        </div>
      </section>

      {/* ── DESTINATIONS STRIP (remaining 3) ── */}
      <section className="home-section home-more-dest">
        <div className="home-section-head">
          <div className="gold-line" />
          <h2 className="section-title">More to Explore</h2>
          <p className="section-sub">Discover even more extraordinary destinations</p>
        </div>
        <div className="more-dest-row">
          {destinations.slice(4).map((d, i) => (
            <div key={d.id} className="more-dest-card glass-card" style={{ '--i': i }} onClick={() => navigate(`/destinations/${d.id}`)}>
              <div className="mdc-img">
                <img src={d.image} alt={d.name} />
                <div className="mdc-overlay" />
                <div className="mdc-info">
                  <h4>{d.name}</h4>
                  <span>{d.country} · {d.duration}</span>
                </div>
              </div>
              <div className="mdc-footer">
                <span className="mdc-price">{d.price}</span>
                <span className="mdc-rating">⭐ {d.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="home-cta-banner">
        <div className="home-cta-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=1920&q=80')" }} />
        <div className="home-cta-overlay" />
        <div className="home-cta-content">
          <h2>Ready to Travel Like Never Before?</h2>
          <p>Join 50,000+ members who've discovered the My Holiday Club difference. Your first luxury getaway is closer than you think.</p>
          <div className="home-cta-btns">
            <Link to="/packages" className="btn-gold">Start Membership →</Link>
            <Link to="/contact" className="btn-ghost">Talk to an Expert</Link>
          </div>
        </div>
      </section>

    </div>
  );
}
