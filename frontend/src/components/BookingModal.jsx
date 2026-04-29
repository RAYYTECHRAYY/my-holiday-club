import React, { useState, useEffect } from 'react';
import api from '../api';

const BookingModal = ({ property, onClose }) => {
  const [formSettings, setFormSettings] = useState(null);
  const [form, setForm] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/api/form-settings').then(res => {
      setFormSettings(res.data.data?.bookingForm);
    }).catch(() => {
      setFormSettings({
        title: 'Book Your Stay',
        subtitle: 'Fill in your details and our team will confirm shortly',
        fields: [
          { id: 'bf1', label: 'Full Name', type: 'text', placeholder: 'Enter your full name', required: true, enabled: true },
          { id: 'bf2', label: 'Email Address', type: 'email', placeholder: 'Enter your email', required: true, enabled: true },
          { id: 'bf3', label: 'Phone Number', type: 'tel', placeholder: 'Enter your phone number', required: true, enabled: true },
          { id: 'bf4', label: 'Check-in Date', type: 'date', placeholder: '', required: true, enabled: true },
          { id: 'bf5', label: 'Check-out Date', type: 'date', placeholder: '', required: true, enabled: true },
          { id: 'bf6', label: 'Number of Guests', type: 'number', placeholder: 'How many guests?', required: true, enabled: true },
          { id: 'bf7', label: 'Special Requests', type: 'textarea', placeholder: 'Any special requirements?', required: false, enabled: true }
        ]
      });
    });
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleChange = (id, value) => setForm(f => ({ ...f, [id]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true); setError('');
    try {
      const fields = formSettings?.fields?.filter(f => f.enabled) || [];
      const formData = {};
      fields.forEach(f => { formData[f.label] = form[f.id] || ''; });
      await api.post('/api/bookings', {
        propertyId: property.id,
        propertyName: property.name,
        propertyLocation: property.location,
        ...formData
      });
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const fields = (formSettings?.fields || []).filter(f => f.enabled);

  return (
    <div onClick={onClose} style={{
      // outer overlay
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
    }}>
      <div onClick={e => e.stopPropagation()} className='bk-modal-box' style={{
        background: 'white', borderRadius: '24px', width: '100%', maxWidth: '560px',
        maxHeight: '90vh', overflow: 'auto', boxShadow: '0 30px 80px rgba(0,0,0,0.3)',
        animation: 'modalIn 0.35s cubic-bezier(0.34,1.56,0.64,1)'
      }}>
        <style>{`
          @keyframes modalIn { from { opacity:0; transform:scale(0.85) translateY(30px); } to { opacity:1; transform:scale(1) translateY(0); } }
          .bk-input { width:100%; padding:13px 16px; border:2px solid #e2e8f0; border-radius:12px; font-size:0.95rem; font-family:'Inter',sans-serif; outline:none; transition:border-color 0.2s,box-shadow 0.2s; background:#fafafa; }
          .bk-input:focus { border-color:#0077C8; box-shadow:0 0 0 3px rgba(0,119,200,0.1); background:white; }
          .bk-label { display:block; font-weight:600; font-size:0.85rem; color:#374151; margin-bottom:6px; font-family:'Inter',sans-serif; }
          @media (max-width: 768px) {
            .bk-modal-box { max-height: 92vh !important; border-radius: 20px 20px 0 0 !important; }
            .bk-modal-overlay { align-items: flex-end !important; padding: 0 !important; }
            .bk-input { font-size: 16px !important; }
            .bk-header { padding: 20px 20px 18px !important; }
            .bk-body { padding: 20px 18px 28px !important; }
          }

        `}</style>

        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg,#0077C8,#005a96)',
          borderRadius: '24px 24px 0 0', padding: '28px 28px 24px',
          position: 'relative', className: 'bk-header'
        }}>
          <button onClick={onClose} style={{
            position: 'absolute', top: '16px', right: '16px',
            background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white',
            width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer',
            fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>✕</button>

          {/* Property mini-card */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
            {property.images?.[0] && (
              <img src={property.images[0]} alt={property.name} style={{
                width: '60px', height: '60px', borderRadius: '12px', objectFit: 'cover',
                border: '2px solid rgba(255,255,255,0.3)'
              }} />
            )}
            <div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>{property.type}</div>
              <div style={{ color: 'white', fontFamily: "'Playfair Display',serif", fontSize: '1.2rem', fontWeight: 700 }}>{property.name}</div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>📍 {property.location}</div>
            </div>
          </div>
          <h2 style={{ color: 'white', fontFamily: "'Playfair Display',serif", fontSize: '1.5rem', margin: '0 0 4px' }}>
            {formSettings?.title || 'Book Your Stay'}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', margin: 0 }}>
            {formSettings?.subtitle || 'Our team will confirm your booking shortly'}
          </p>
        </div>

        <div style={{ padding: '28px' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '32px 16px' }}>
              <div style={{ fontSize: '4rem', marginBottom: '16px' }}>✅</div>
              <h3 style={{ fontFamily: "'Playfair Display',serif", color: '#1a1a2e', fontSize: '1.5rem', marginBottom: '12px' }}>Booking Request Sent!</h3>
              <p style={{ color: '#6b7280', lineHeight: 1.7, marginBottom: '24px' }}>
                Thank you for choosing <strong>{property.name}</strong>. Our team will contact you within 24 hours to confirm your reservation.
              </p>
              <button onClick={onClose} style={{
                padding: '13px 32px', background: 'linear-gradient(135deg,#0077C8,#005a96)',
                color: 'white', border: 'none', borderRadius: '50px',
                fontWeight: 600, cursor: 'pointer', fontSize: '1rem', fontFamily: "'Inter',sans-serif"
              }}>Close</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gap: '18px' }}>
                {fields.map(field => (
                  <div key={field.id}>
                    <label className="bk-label">
                      {field.label} {field.required && <span style={{ color: '#ef4444' }}>*</span>}
                    </label>
                    {field.type === 'textarea' ? (
                      <textarea className="bk-input" placeholder={field.placeholder}
                        required={field.required} rows={3}
                        value={form[field.id] || ''}
                        onChange={e => handleChange(field.id, e.target.value)}
                        style={{ resize: 'vertical' }} />
                    ) : (
                      <input className="bk-input" type={field.type} placeholder={field.placeholder}
                        required={field.required}
                        value={form[field.id] || ''}
                        onChange={e => handleChange(field.id, e.target.value)} />
                    )}
                  </div>
                ))}
              </div>
              {error && <div style={{ marginTop: '14px', padding: '12px 16px', background: '#fef2f2', borderRadius: '10px', color: '#dc2626', fontSize: '0.9rem' }}>{error}</div>}
              <button type="submit" disabled={submitting} style={{
                marginTop: '24px', width: '100%', padding: '15px',
                background: submitting ? '#94a3b8' : 'linear-gradient(135deg,#0077C8,#005a96)',
                color: 'white', border: 'none', borderRadius: '50px',
                fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer',
                fontSize: '1rem', fontFamily: "'Inter',sans-serif",
                transition: 'all 0.3s', letterSpacing: '0.5px'
              }}>
                {submitting ? '⏳ Sending...' : '🏨 Submit Booking Request'}
              </button>
              <p style={{ textAlign: 'center', marginTop: '12px', color: '#9ca3af', fontSize: '0.8rem' }}>
                🔒 Your information is secure and will not be shared
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
