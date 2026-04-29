import { useEffect, useRef, useState } from 'react';
import './AboutUs.css';

function useCountUp(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

function Stat({ value, label, suffix = '' }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  const count = useCountUp(value, 2200, visible);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className="stat-item">
      <span className="stat-value">{count.toLocaleString()}{suffix}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

const team = [
  { name: 'Rajesh Mehta', role: 'Founder & CEO', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', bio: '20+ years in luxury travel, former VP at Taj Hotels.' },
  { name: 'Priya Sharma', role: 'Chief Travel Officer', image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=400&q=80', bio: 'Curated 500+ itineraries across 60 countries.' },
  { name: 'Arjun Nair', role: 'Head of Technology', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80', bio: 'Built the member platform serving 50,000+ users.' },
  { name: 'Meera Pillai', role: 'Member Experience Lead', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80', bio: 'Passionate about creating unforgettable journeys.' },
];

const timeline = [
  { year: '2012', title: 'Founded', desc: 'My Holiday Club started as a small luxury travel consultancy in Mumbai.' },
  { year: '2015', title: 'Membership Launched', desc: 'Introduced exclusive membership tiers with 500 founding members.' },
  { year: '2018', title: 'International Expansion', desc: 'Expanded to Maldives, Dubai, Thailand and South-East Asia.' },
  { year: '2021', title: 'Digital Platform', desc: 'Launched fully digital member portal, serving 20,000+ members.' },
  { year: '2024', title: 'Platinum Era', desc: '50,000+ members. 100+ destinations. The gold standard in travel clubs.' },
];

export default function AboutUs() {
  return (
    <div className="about-page">
      {/* Hero */}
      <div className="page-hero">
        <div className="page-hero-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1920&q=80')" }} />
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <div className="page-hero-eyebrow">Our Story</div>
          <h1>About Us</h1>
          <p>A decade of redefining luxury travel for discerning members who believe the journey is as important as the destination.</p>
        </div>
      </div>

      {/* Mission */}
      <div className="section about-mission">
        <div className="about-mission-text">
          <div className="gold-line" />
          <h2 className="section-title">Our Mission</h2>
          <p>At My Holiday Club, we believe every journey should be extraordinary. We hand-pick the world's finest properties and experiences, then make them exclusively available to our members at prices that defy expectation.</p>
          <p>We're not just a travel club — we're your personal gateway to the world's most coveted destinations, guided by experts who've been there, slept there, and lived there.</p>
          <div className="about-pillars">
            {['Exclusivity', 'Trust', 'Excellence', 'Value'].map((p, i) => (
              <div key={i} className="pillar-tag">
                <span className="pillar-dot" />{p}
              </div>
            ))}
          </div>
        </div>
        <div className="about-mission-img">
          <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80" alt="Mission" />
          <div className="about-mission-badge glass-card">
            <span className="amb-icon">🏆</span>
            <div>
              <strong>Award Winning</strong>
              <span>Best Travel Club 2023</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="about-stats">
        <Stat value={50000} label="Happy Members" suffix="+" />
        <Stat value={100} label="Destinations" suffix="+" />
        <Stat value={12} label="Years of Excellence" />
        <Stat value={99} label="Satisfaction Rate" suffix="%" />
      </div>

      {/* Philosophy */}
      <div className="section about-philosophy">
        <div className="gold-line" />
        <h2 className="section-title">Our Philosophy</h2>
        <p className="section-sub">Three principles that guide every decision we make.</p>
        <div className="philosophy-grid">
          {[
            { icon: '🌟', title: 'Quality First', desc: 'Every property in our portfolio is personally vetted by our travel team. No exceptions. If we wouldn\'t stay there ourselves, you won\'t find it in our collection.' },
            { icon: '🤝', title: 'Members First', desc: 'Your satisfaction is our only KPI. From 24/7 support to hassle-free bookings, we design every touchpoint around your comfort and convenience.' },
            { icon: '🌱', title: 'Responsible Travel', desc: 'We partner with properties that share our commitment to sustainable tourism, cultural respect, and environmental stewardship.' },
          ].map((p, i) => (
            <div key={i} className="philosophy-card glass-card" style={{ '--i': i }}>
              <span className="philo-icon">{p.icon}</span>
              <h3 className="philo-title">{p.title}</h3>
              <p className="philo-desc">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="section about-timeline">
        <div className="gold-line" />
        <h2 className="section-title">Our Journey</h2>
        <p className="section-sub">From a small consultancy to India's premier luxury travel club.</p>
        <div className="timeline">
          {timeline.map((t, i) => (
            <div key={i} className={`timeline-item ${i % 2 === 0 ? 'tl-left' : 'tl-right'}`}>
              <div className="tl-year">{t.year}</div>
              <div className="tl-dot" />
              <div className="tl-content glass-card">
                <h4>{t.title}</h4>
                <p>{t.desc}</p>
              </div>
            </div>
          ))}
          <div className="tl-line" />
        </div>
      </div>

      {/* Team */}
      <div className="section about-team">
        <div className="gold-line" />
        <h2 className="section-title">Meet the Team</h2>
        <p className="section-sub">The people behind your extraordinary travel experiences.</p>
        <div className="team-grid">
          {team.map((member, i) => (
            <div key={i} className="team-card glass-card" style={{ '--i': i }}>
              <div className="team-img-wrap">
                <img src={member.image} alt={member.name} />
              </div>
              <div className="team-body">
                <h4 className="team-name">{member.name}</h4>
                <span className="team-role">{member.role}</span>
                <p className="team-bio">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Founder's Message */}
      <div className="section about-founder">
        <div className="about-founder-inner glass-card">
          <div className="founder-img-wrap">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80" alt="Founder" />
          </div>
          <div className="founder-text">
            <div className="founder-quote">"</div>
            <blockquote>
              Travel is the only thing you buy that makes you richer. At MHC, we've made it our life's mission to ensure every member experiences that richness — not just in the places they visit, but in the memories they create along the way.
            </blockquote>
            <div className="founder-sig">
              <strong>Rajesh Mehta</strong>
              <span>Founder & CEO, My Holiday Club</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
