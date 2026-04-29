import React, { useState, useEffect } from 'react';
import api from '../api';

const Contact = () => {
  const [settings, setSettings] = useState({
    contactInfo: { phone: '+91 98765 43210', email: 'info@myholidayclub.co.in', address: '123 Travel House, Connaught Place, New Delhi - 110001', whatsapp: '+91 98765 43210' },
    socialMedia: { facebook: '#', instagram: '#', twitter: '#', youtube: '#', linkedin: '#' }
  });
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState('form');

  useEffect(() => {
    api.get('/api/settings').then(r => { if (r.data.data) setSettings(r.data.data); }).catch(() => {});
  }, []);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name required';
    if (!form.email.match(/^\S+@\S+\.\S+$/)) e.email = 'Valid email required';
    if (!form.phone.match(/^\d{10}$/)) e.phone = '10-digit mobile required';
    if (!form.message.trim()) e.message = 'Message required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setStep('loading');
    try { await api.post('/api/contacts', form); } catch (_) {}
    setTimeout(() => setStep('success'), 1800);
  };

  const socialIcons = [
    { name: 'Facebook', icon: 'f', color: '#1877f2', key: 'facebook' },
    { name: 'Instagram', icon: '📷', color: '#e1306c', key: 'instagram' },
    { name: 'Twitter', icon: '𝕏', color: '#1da1f2', key: 'twitter' },
    { name: 'YouTube', icon: '▶', color: '#ff0000', key: 'youtube' },
    { name: 'LinkedIn', icon: 'in', color: '#0a66c2', key: 'linkedin' },
  ];

  return (
    <div>
      <style>{`
        @media (max-width: 768px) {
          .contact-main-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
      `}</style>
      {/* Header */}
      <div style={{ padding: '160px 0 100px', position: 'relative', overflow: 'hidden', color: 'white', textAlign: 'center' }}>
        {/* Background photo */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1600)',
          backgroundSize: 'cover', backgroundPosition: 'center',
        }} />
        {/* Dark gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(0,40,100,0.78) 0%, rgba(0,119,200,0.65) 60%, rgba(0,60,120,0.72) 100%)',
        }} />
        {/* Content */}
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display:'inline-block', padding:'6px 20px', background:'rgba(240,165,0,0.85)', borderRadius:'50px', fontSize:'0.82rem', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', marginBottom:'20px' }}>
            📬 Contact Us
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', marginBottom: '16px', fontWeight: 800, textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}>Get In Touch</h1>
          <p style={{ fontSize: '1.15rem', opacity: 0.92, maxWidth: '520px', margin: '0 auto', lineHeight: 1.7, textShadow: '0 1px 8px rgba(0,0,0,0.3)' }}>
            Have questions about our packages? Our team is ready to help you plan your perfect holiday.
          </p>
        </div>
      </div>

      <div style={{ padding: '80px 0', background: '#f8fafc' }}>
        <div className="container">
          <div className='contact-main-grid' style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '60px', alignItems: 'start' }}>
            {/* Contact Info */}
            <div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: '#1a1a2e', marginBottom: '32px' }}>Contact Details</h2>
              {[
                { icon: '📍', label: 'Address', value: settings.contactInfo.address },
                { icon: '📞', label: 'Phone', value: settings.contactInfo.phone },
                { icon: '✉️', label: 'Email', value: settings.contactInfo.email },
                { icon: '💬', label: 'WhatsApp', value: settings.contactInfo.whatsapp },
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex', gap: '16px', marginBottom: '24px',
                  padding: '20px', background: 'white', borderRadius: '16px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                  transition: 'all 0.3s'
                }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,119,200,0.12)'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateX(0)'; }}
                >
                  <div style={{ width: '48px', height: '48px', flexShrink: 0, background: '#e8f4ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>{item.icon}</div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>{item.label}</div>
                    <div style={{ color: '#1a1a2e', fontWeight: 500 }}>{item.value}</div>
                  </div>
                </div>
              ))}

              {/* Social Media */}
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', color: '#1a1a2e', marginBottom: '20px', marginTop: '8px' }}>Follow Us</h3>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {socialIcons.map(s => (
                  <a key={s.key} href={settings.socialMedia[s.key] || '#'} target="_blank" rel="noopener noreferrer" style={{
                    width: '50px', height: '50px', borderRadius: '14px',
                    background: `${s.color}15`, color: s.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    textDecoration: 'none', fontSize: '1rem', fontWeight: 700,
                    border: `2px solid ${s.color}25`,
                    transition: 'all 0.3s'
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = s.color; e.currentTarget.style.color = 'white'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = `${s.color}15`; e.currentTarget.style.color = s.color; e.currentTarget.style.transform = 'translateY(0)'; }}
                    title={s.name}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>

              {/* Hours */}
              <div style={{ marginTop: '32px', padding: '24px', background: 'linear-gradient(135deg, #0077C8, #005a96)', borderRadius: '16px', color: 'white' }}>
                <h4 style={{ fontFamily: "'Playfair Display', serif", marginBottom: '12px' }}>Office Hours</h4>
                <p style={{ opacity: 0.85, fontSize: '0.9rem', lineHeight: 1.8 }}>
                  Monday – Saturday: 9:00 AM – 7:00 PM<br />
                  Sunday: 10:00 AM – 4:00 PM<br />
                  <strong>24/7</strong> for existing members
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div style={{ background: 'white', borderRadius: '24px', padding: '48px', boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}>
              {step === 'form' && (
                <>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', color: '#1a1a2e', marginBottom: '8px' }}>Send Us a Message</h2>
                  <p style={{ color: '#6b7280', marginBottom: '32px' }}>We'll get back to you within 24 hours</p>
                  <form onSubmit={handleSubmit}>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Full Name *</label>
                        <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Your name" />
                        {errors.name && <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>{errors.name}</span>}
                      </div>
                      <div className="form-group">
                        <label>Phone *</label>
                        <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="10-digit mobile" maxLength={10} />
                        {errors.phone && <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>{errors.phone}</span>}
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Email *</label>
                      <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="your@email.com" />
                      {errors.email && <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>{errors.email}</span>}
                    </div>
                    <div className="form-group">
                      <label>Subject</label>
                      <select value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}>
                        <option value="">Select subject</option>
                        <option>Membership Enquiry</option>
                        <option>Destination Information</option>
                        <option>Package Details</option>
                        <option>Existing Member Support</option>
                        <option>Partnership / B2B</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Message *</label>
                      <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} placeholder="Tell us how we can help you..." rows={5} />
                      {errors.message && <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>{errors.message}</span>}
                    </div>
                    <button type="submit" style={{
                      width: '100%', padding: '16px',
                      background: 'linear-gradient(135deg, #0077C8, #005a96)',
                      color: 'white', border: 'none', borderRadius: '50px',
                      fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
                      fontFamily: "'Inter', sans-serif", transition: 'all 0.3s'
                    }}>
                      📨 Send Message
                    </button>
                  </form>
                </>
              )}

              {step === 'loading' && (
                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                  <div style={{ width: '60px', height: '60px', border: '4px solid #e8f4ff', borderTopColor: '#0077C8', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 20px' }} />
                  <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
                  <p style={{ color: '#6b7280' }}>Sending your message...</p>
                </div>
              )}

              {step === 'success' && (
                <div className="success-animation" style={{ padding: '40px' }}>
                  <div className="checkmark">✓</div>
                  <h3>Message Sent!</h3>
                  <p style={{ marginBottom: '8px' }}>Thank you for reaching out to us.</p>
                  <p style={{ fontWeight: 600, color: '#0077C8', fontSize: '1.05rem' }}>Our team will be contacting you shortly!</p>
                  <button onClick={() => { setStep('form'); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); }} style={{
                    marginTop: '24px', padding: '12px 32px',
                    background: '#0077C8', color: 'white', border: 'none', borderRadius: '50px', cursor: 'pointer', fontWeight: 600
                  }}>
                    Send Another
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Map placeholder */}
      <div style={{ height: '300px', background: 'linear-gradient(135deg, #e8f4ff, #f8fafc)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
        <div style={{ fontSize: '3rem' }}>📍</div>
        <p style={{ color: '#6b7280', fontWeight: 500 }}>My Holiday Club • 123 Travel House, Connaught Place, New Delhi</p>
        <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" style={{
          padding: '10px 24px', background: '#0077C8', color: 'white', borderRadius: '50px',
          textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem'
        }}>View on Google Maps →</a>
      </div>
    </div>
  );
};

export default Contact;
