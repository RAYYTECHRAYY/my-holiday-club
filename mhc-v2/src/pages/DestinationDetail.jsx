import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { destinations } from '../data/destinations';
import './DestinationDetail.css';

export default function DestinationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dest = destinations.find(d => String(d.id) === id);
  const [form, setForm] = useState({ name: '', email: '', phone: '', date: '', guests: '2', message: '' });
  const [submitted, setSubmitted] = useState(false);

  if (!dest) {
    return (
      <div className="ddetail-notfound">
        <h2>Destination not found</h2>
        <button className="btn-primary" onClick={() => navigate('/destinations')}>← Back</button>
      </div>
    );
  }

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const submit  = e => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setForm({ name: '', email: '', phone: '', date: '', guests: '2', message: '' });
  };

  const related = destinations.filter(d => d.id !== dest.id && d.category === dest.category).slice(0, 3);

  return (
    <div className="ddetail-page">
      {/* Hero */}
      <div className="ddetail-hero">
        <div className="ddetail-hero-bg" style={{ backgroundImage: `url(${dest.image})` }} />
        <div className="ddetail-hero-overlay" />
        <button className="ddetail-back" onClick={() => navigate('/destinations')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back
        </button>
        <div className="ddetail-hero-content">
          <div className="page-hero-eyebrow">{dest.category} · {dest.country}</div>
          <h1>{dest.name}</h1>
          <p className="ddetail-tagline">{dest.tagline}</p>
          <div className="ddetail-meta">
            <span>⭐ {dest.rating} ({dest.reviews.toLocaleString()} reviews)</span>
            <span>🕐 {dest.duration}</span>
            <span>💰 from {dest.price}</span>
          </div>
        </div>
      </div>

      <div className="ddetail-body section">
        {/* Left: info */}
        <div className="ddetail-info">
          <div className="gold-line" />
          <h2 className="section-title">About {dest.name}</h2>
          <p className="ddetail-desc">{dest.description}</p>
          <p className="ddetail-subtitle">{dest.subtitle}</p>

          {/* Highlights */}
          <h3 className="ddetail-sub-h">Highlights</h3>
          <div className="ddetail-highlights-grid">
            {dest.highlights.map((h, i) => (
              <div key={i} className="ddetail-highlight glass-card">
                <span className="dh-dot" />
                <span>{h}</span>
              </div>
            ))}
          </div>

          {/* What's Included */}
          <h3 className="ddetail-sub-h">What's Included</h3>
          <div className="ddetail-included">
            {['Return flights', 'Luxury hotel stay', 'Daily breakfast', 'Airport transfers', 'Travel insurance', 'Expert guide'].map((item, i) => (
              <div key={i} className="included-item">
                <span className="included-check">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: booking form */}
        <div className="ddetail-form-wrap">
          <div className="ddetail-form-card glass-card">
            <div className="ddetail-form-header">
              <h3>Book This Destination</h3>
              <p>Fill out the form and our travel experts will reach you within 24 hours.</p>
            </div>
            {submitted ? (
              <div className="ddetail-form-success">
                <span>✅</span>
                <h4>Enquiry Sent!</h4>
                <p>We'll contact you within 24 hours to confirm your booking.</p>
              </div>
            ) : (
              <form className="ddetail-form" onSubmit={submit}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input className="form-input" name="name" value={form.name} onChange={handle} placeholder="Your name" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email *</label>
                    <input className="form-input" type="email" name="email" value={form.email} onChange={handle} placeholder="you@email.com" required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input className="form-input" name="phone" value={form.phone} onChange={handle} placeholder="+91 98765 43210" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Guests</label>
                    <select className="form-select" name="guests" value={form.guests} onChange={handle}>
                      {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} {n===1?'Guest':'Guests'}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Preferred Travel Date</label>
                  <input className="form-input" type="date" name="date" value={form.date} onChange={handle} />
                </div>
                <div className="form-group">
                  <label className="form-label">Special Requests</label>
                  <textarea className="form-textarea" name="message" value={form.message} onChange={handle} placeholder="Any special requirements or requests…" />
                </div>
                <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Send Booking Enquiry
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                </button>
                <p className="ddetail-form-note">🔒 Your information is secure and never shared</p>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="section ddetail-related">
          <div className="gold-line" />
          <h2 className="section-title">You May Also Like</h2>
          <p className="section-sub">More {dest.category.toLowerCase()} destinations for you</p>
          <div className="ddetail-related-grid">
            {related.map(r => (
              <div key={r.id} className="ddetail-related-card glass-card" onClick={() => navigate(`/destinations/${r.id}`)}>
                <div className="drc-img-wrap">
                  <img src={r.image} alt={r.name} loading="lazy" />
                </div>
                <div className="drc-body">
                  <h4>{r.name}</h4>
                  <span>{r.country} · {r.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
