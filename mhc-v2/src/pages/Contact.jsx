import { useState } from 'react';
import './Contact.css';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors]   = useState({});

  const handle = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(er => ({ ...er, [e.target.name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim())    errs.name    = 'Name is required';
    if (!form.email.trim())   errs.email   = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email address';
    if (!form.subject.trim()) errs.subject = 'Please select a subject';
    if (!form.message.trim()) errs.message = 'Message cannot be empty';
    return errs;
  };

  const submit = e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitted(true);
    setForm({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const offices = [
    { city: 'Mumbai', address: '12th Floor, Trade Center, BKC, Mumbai 400051', phone: '+91 22 4852 6600', email: 'mumbai@myholidayclub.in' },
    { city: 'Delhi', address: 'Tower B, DLF Cyber City, Gurgaon 122002', phone: '+91 11 4001 2345', email: 'delhi@myholidayclub.in' },
    { city: 'Bangalore', address: '8th Floor, Prestige Tower, MG Road, Bangalore 560001', phone: '+91 80 4710 0022', email: 'bangalore@myholidayclub.in' },
  ];

  return (
    <div className="contact-page">
      {/* Hero */}
      <div className="page-hero">
        <div className="page-hero-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80')" }} />
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <div className="page-hero-eyebrow">Get in Touch</div>
          <h1>Contact Us</h1>
          <p>Our travel experts are ready to help you plan the journey of a lifetime. Reach out anytime.</p>
        </div>
      </div>

      {/* Quick contact cards */}
      <div className="section contact-quick">
        {[
          { icon: '📞', label: 'Call Us', value: '+91 1800 123 4567', sub: 'Mon–Sat, 9am–8pm IST' },
          { icon: '✉️', label: 'Email Us', value: 'hello@myholidayclub.in', sub: 'We reply within 2 hours' },
          { icon: '💬', label: 'Live Chat', value: 'Chat with an Expert', sub: 'Available 24/7 for members' },
        ].map((c, i) => (
          <div key={i} className="quick-card glass-card" style={{ '--i': i }}>
            <span className="quick-icon">{c.icon}</span>
            <span className="quick-label">{c.label}</span>
            <span className="quick-value">{c.value}</span>
            <span className="quick-sub">{c.sub}</span>
          </div>
        ))}
      </div>

      {/* Main contact form + map */}
      <div className="section contact-body">
        {/* Form */}
        <div className="contact-form-wrap">
          <div className="gold-line" />
          <h2 className="section-title">Send a Message</h2>
          <p className="section-sub">Have a question or a custom travel request? Drop us a message.</p>

          {submitted ? (
            <div className="contact-success glass-card">
              <span>✅</span>
              <h3>Message Sent!</h3>
              <p>Thank you, we've received your message and will respond within 2 hours.</p>
              <button className="btn-primary" onClick={() => setSubmitted(false)}>Send Another</button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={submit} noValidate>
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input className={`form-input ${errors.name ? 'input-error' : ''}`} name="name" value={form.name} onChange={handle} placeholder="Your full name" />
                  {errors.name && <span className="field-error">{errors.name}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input className={`form-input ${errors.email ? 'input-error' : ''}`} type="email" name="email" value={form.email} onChange={handle} placeholder="you@email.com" />
                  {errors.email && <span className="field-error">{errors.email}</span>}
                </div>
              </div>
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input className="form-input" name="phone" value={form.phone} onChange={handle} placeholder="+91 98765 43210" />
                </div>
                <div className="form-group">
                  <label className="form-label">Subject *</label>
                  <select className={`form-select ${errors.subject ? 'input-error' : ''}`} name="subject" value={form.subject} onChange={handle}>
                    <option value="">Select a topic…</option>
                    <option>General Enquiry</option>
                    <option>Membership Information</option>
                    <option>Booking Assistance</option>
                    <option>Package Customisation</option>
                    <option>Billing & Payments</option>
                    <option>Feedback / Complaint</option>
                    <option>Partnership Opportunity</option>
                  </select>
                  {errors.subject && <span className="field-error">{errors.subject}</span>}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Your Message *</label>
                <textarea className={`form-textarea ${errors.message ? 'input-error' : ''}`} name="message" value={form.message} onChange={handle} placeholder="Tell us how we can help you…" style={{ minHeight: '150px' }} />
                {errors.message && <span className="field-error">{errors.message}</span>}
              </div>
              <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start', padding: '14px 36px' }}>
                Send Message
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </form>
          )}
        </div>

        {/* Map + offices */}
        <div className="contact-right">
          {/* Map placeholder */}
          <div className="contact-map glass-card">
            <div className="map-inner">
              <div className="map-placeholder">
                <span>📍</span>
                <p>Bandra Kurla Complex,<br />Mumbai, Maharashtra</p>
                <a
                  href="https://maps.google.com/?q=Bandra+Kurla+Complex+Mumbai"
                  target="_blank" rel="noopener noreferrer"
                  className="btn-ghost"
                  style={{ fontSize: '12px', padding: '9px 20px' }}
                >
                  Open in Google Maps
                </a>
              </div>
            </div>
          </div>

          {/* Social */}
          <div className="contact-social">
            <p>Follow our journeys</p>
            <div className="social-links">
              {['Instagram', 'Facebook', 'LinkedIn', 'YouTube'].map((s, i) => (
                <a key={i} href="#" className="social-btn glass-card">{s[0]}</a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Offices */}
      <div className="section contact-offices">
        <div className="gold-line" />
        <h2 className="section-title">Our Offices</h2>
        <p className="section-sub">Visit us at any of our locations across India.</p>
        <div className="offices-grid">
          {offices.map((o, i) => (
            <div key={i} className="office-card glass-card" style={{ '--i': i }}>
              <h4 className="office-city">{o.city}</h4>
              <div className="office-info">
                <span>📍</span><p>{o.address}</p>
              </div>
              <div className="office-info">
                <span>📞</span><p>{o.phone}</p>
              </div>
              <div className="office-info">
                <span>✉️</span><p>{o.email}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div className="contact-newsletter">
        <div className="newsletter-inner">
          <div>
            <h3>Stay in the Loop</h3>
            <p>Get exclusive deals, destination guides, and member updates directly to your inbox.</p>
          </div>
          <NewsletterForm />
        </div>
      </div>
    </div>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [done, setDone]   = useState(false);
  const submit = e => {
    e.preventDefault();
    if (email) { setDone(true); setEmail(''); }
  };
  return done ? (
    <div className="newsletter-done">🎉 You're subscribed! Welcome to the club.</div>
  ) : (
    <form className="newsletter-form" onSubmit={submit}>
      <input className="form-input newsletter-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email address" required />
      <button type="submit" className="btn-gold">Subscribe</button>
    </form>
  );
}
