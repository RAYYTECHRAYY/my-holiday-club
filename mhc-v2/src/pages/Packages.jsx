import { useState } from 'react';
import { packages } from '../data/packages';
import './Packages.css';

export default function Packages() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', plan: '' });
  const [submitted, setSubmitted] = useState(false);

  const openModal = (pkg) => {
    setSelectedPlan(pkg);
    setForm(f => ({ ...f, plan: pkg.name }));
  };

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const submit  = e => {
    e.preventDefault();
    setSubmitted(true);
  };

  const benefits = [
    { icon: '🏨', title: 'Premium Properties', desc: 'Handpicked luxury resorts with guaranteed quality.' },
    { icon: '💰', title: "Members-Only Prices", desc: 'Save up to 50% versus public room rates.' },
    { icon: '🌍', title: 'Global Destinations', desc: 'Access to 100+ curated destinations worldwide.' },
    { icon: '🎖️', title: 'Concierge Service', desc: 'Dedicated travel experts at your disposal.' },
    { icon: '✈️', title: 'Complimentary Nights', desc: 'Free nights included with every membership tier.' },
    { icon: '🔒', title: 'Exclusive Access', desc: 'Members-only lounges, events, and early bookings.' },
  ];

  return (
    <div className="packages-page">
      {/* Hero */}
      <div className="page-hero">
        <div className="page-hero-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1540202404-a2f29016b523?auto=format&fit=crop&w=1920&q=80')" }} />
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <div className="page-hero-eyebrow">Membership</div>
          <h1>Choose Your Plan</h1>
          <p>Join thousands of members enjoying exclusive travel privileges. Pick the tier that suits your lifestyle.</p>
        </div>
      </div>

      {/* Plans */}
      <div className="packages-grid section">
        <div className="gold-line" />
        <h2 className="section-title">Membership Tiers</h2>
        <p className="section-sub">All plans include access to our global network of luxury properties and member support.</p>

        <div className="plans-grid">
          {packages.map((pkg, i) => (
            <div
              key={pkg.id}
              className={`plan-card glass-card ${pkg.popular ? 'plan-popular' : ''}`}
              style={{ '--i': i }}
            >
              {pkg.popular && <div className="plan-badge">Most Popular</div>}
              <div className="plan-top" style={{ background: pkg.gradient }}>
                <span className="plan-badge-icon">{pkg.badge}</span>
                <h3 className="plan-name">{pkg.name}</h3>
                <p className="plan-tagline">{pkg.tagline}</p>
                <div className="plan-price">
                  <span className="price-currency">₹</span>
                  <span className="price-amount">{pkg.price.toLocaleString()}</span>
                  <span className="price-period">/{pkg.period}</span>
                </div>
              </div>
              <div className="plan-features">
                {pkg.features.map((f, j) => (
                  <div key={j} className={`plan-feature ${f.included ? '' : 'feature-disabled'}`}>
                    <span className="feature-icon">{f.included ? '✓' : '✗'}</span>
                    <span>{f.text}</span>
                  </div>
                ))}
              </div>
              <div className="plan-cta">
                <button
                  className={pkg.popular ? 'btn-gold' : 'btn-primary'}
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => openModal(pkg)}
                >
                  Get {pkg.name} Plan
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div className="pkg-benefits section">
        <div className="gold-line" />
        <h2 className="section-title">Why Join MHC?</h2>
        <p className="section-sub">Exclusive perks that make every journey extraordinary.</p>
        <div className="benefits-grid">
          {benefits.map((b, i) => (
            <div key={i} className="benefit-card glass-card" style={{ '--i': i }}>
              <span className="benefit-icon">{b.icon}</span>
              <h4 className="benefit-title">{b.title}</h4>
              <p className="benefit-desc">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="pkg-faq section">
        <div className="gold-line" />
        <h2 className="section-title">Frequently Asked Questions</h2>
        <div className="faq-grid">
          {[
            { q: 'Can I upgrade my plan later?', a: 'Yes, you can upgrade your membership at any time. The difference in price is prorated.' },
            { q: 'Are there any hidden fees?', a: 'No. Your membership fee covers all the listed benefits. Property-specific taxes may apply.' },
            { q: 'How do I use my free nights?', a: 'Free nights can be redeemed through our member portal or by contacting your concierge.' },
            { q: 'Can I share my membership?', a: 'Gold and Platinum members can add one accompanying guest at no extra charge.' },
            { q: 'What is the cancellation policy?', a: 'We offer a 30-day money-back guarantee from the date of purchase, no questions asked.' },
            { q: 'How soon does access begin?', a: 'Your membership activates instantly upon payment. You\'ll receive your welcome kit within 48 hours.' },
          ].map((item, i) => (
            <FaqItem key={i} q={item.q} a={item.a} />
          ))}
        </div>
      </div>

      {/* Join Modal */}
      {selectedPlan && (
        <div className="pkg-modal-overlay" onClick={() => { setSelectedPlan(null); setSubmitted(false); }}>
          <div className="pkg-modal glass-card" onClick={e => e.stopPropagation()}>
            <button className="pkg-modal-close" onClick={() => { setSelectedPlan(null); setSubmitted(false); }}>✕</button>
            {submitted ? (
              <div className="pkg-modal-success">
                <span>🎉</span>
                <h3>Welcome to {selectedPlan.name}!</h3>
                <p>Our team will contact you at <strong>{form.email}</strong> within 24 hours to activate your membership.</p>
                <button className="btn-primary" onClick={() => { setSelectedPlan(null); setSubmitted(false); }}>Done</button>
              </div>
            ) : (
              <>
                <div className="pkg-modal-header" style={{ background: selectedPlan.gradient }}>
                  <span>{selectedPlan.badge}</span>
                  <h3>{selectedPlan.name} Membership</h3>
                  <p>₹{selectedPlan.price.toLocaleString()} / {selectedPlan.period}</p>
                </div>
                <form className="pkg-modal-form" onSubmit={submit}>
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input className="form-input" name="name" value={form.name} onChange={handle} placeholder="Your full name" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input className="form-input" type="email" name="email" value={form.email} onChange={handle} placeholder="you@email.com" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number *</label>
                    <input className="form-input" name="phone" value={form.phone} onChange={handle} placeholder="+91 98765 43210" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Selected Plan</label>
                    <select className="form-select" name="plan" value={form.plan} onChange={handle}>
                      {packages.map(p => <option key={p.id} value={p.name}>{p.name} — ₹{p.price.toLocaleString()}/yr</option>)}
                    </select>
                  </div>
                  <button type="submit" className="btn-gold" style={{ width: '100%', justifyContent: 'center' }}>
                    Confirm & Join Now 🚀
                  </button>
                  <p style={{ fontSize: '11px', color: 'var(--text-dim)', textAlign: 'center' }}>
                    🔒 Secure · No hidden charges · 30-day money-back guarantee
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item glass-card ${open ? 'faq-open' : ''}`} onClick={() => setOpen(v => !v)}>
      <div className="faq-q">
        <span>{q}</span>
        <span className="faq-icon">{open ? '−' : '+'}</span>
      </div>
      {open && <p className="faq-a">{a}</p>}
    </div>
  );
}
