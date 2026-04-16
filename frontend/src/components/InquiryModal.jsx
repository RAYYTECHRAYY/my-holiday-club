import React, { useState } from 'react';
import api from '../api';

const InquiryModal = ({ destination, onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '',
    checkIn: '', checkOut: '', adults: '2', children: '0',
    roomType: '', specialRequest: ''
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!formData.fullName.trim()) e.fullName = 'Name is required';
    if (!formData.email.match(/^\S+@\S+\.\S+$/)) e.email = 'Valid email required';
    if (!formData.phone.match(/^\d{10}$/)) e.phone = '10-digit mobile required';
    if (!formData.checkIn) e.checkIn = 'Check-in date required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setStep(2);
    try {
      await api.post('/api/inquiries', {
        ...formData,
        destination: destination?.name,
        region: destination?.region,
        type: destination?.type
      });
    } catch (_) {}
    setTimeout(() => setStep(3), 2200);
  };

  const handleChange = (e) => {
    setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(p => ({ ...p, [e.target.name]: '' }));
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && step !== 2 && onClose()}>
      <div className="modal-box">
        {step !== 2 && <button className="modal-close" onClick={onClose}>✕</button>}

        {step === 1 && (
          <>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              {destination?.image && (
                <img src={destination.image} alt={destination.name}
                  style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '12px', marginBottom: '16px' }} />
              )}
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.6rem', color: '#1a1a2e', marginBottom: '4px' }}>
                Enquire About {destination?.name}
              </h2>
              <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                📍 {destination?.state} &nbsp;|&nbsp; {destination?.price}
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Your name" />
                  {errors.fullName && <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>{errors.fullName}</span>}
                </div>
                <div className="form-group">
                  <label>Phone *</label>
                  <input name="phone" value={formData.phone} onChange={handleChange} placeholder="10-digit mobile" maxLength={10} />
                  {errors.phone && <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>{errors.phone}</span>}
                </div>
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" />
                {errors.email && <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>{errors.email}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Check-in Date *</label>
                  <input name="checkIn" type="date" value={formData.checkIn} onChange={handleChange} min={new Date().toISOString().split('T')[0]} />
                  {errors.checkIn && <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>{errors.checkIn}</span>}
                </div>
                <div className="form-group">
                  <label>Check-out Date</label>
                  <input name="checkOut" type="date" value={formData.checkOut} onChange={handleChange} min={formData.checkIn} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Adults</label>
                  <select name="adults" value={formData.adults} onChange={handleChange}>
                    {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} Adult{n>1?'s':''}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Children</label>
                  <select name="children" value={formData.children} onChange={handleChange}>
                    {[0,1,2,3,4].map(n => <option key={n} value={n}>{n} Child{n!==1&&n!==0?'ren':n===1?'':'ren'}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Room Type</label>
                <select name="roomType" value={formData.roomType} onChange={handleChange}>
                  <option value="">Select room type</option>
                  <option value="deluxe">Deluxe Room</option>
                  <option value="suite">Suite</option>
                  <option value="villa">Villa</option>
                  <option value="cottage">Cottage</option>
                  <option value="bungalow">Bungalow</option>
                </select>
              </div>

              <div className="form-group">
                <label>Special Requests</label>
                <textarea name="specialRequest" value={formData.specialRequest} onChange={handleChange}
                  placeholder="Any special requirements, dietary needs, anniversary/birthday celebration..." rows={3} />
              </div>

              <button type="submit" style={{
                width: '100%', padding: '15px',
                background: 'linear-gradient(135deg, #0077C8, #005a96)',
                color: 'white', border: 'none', borderRadius: '50px',
                fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
                fontFamily: "'Inter', sans-serif", transition: 'all 0.3s'
              }}>
                🏖️ Submit Enquiry
              </button>
            </form>
          </>
        )}

        {step === 2 && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <style>{`
              @keyframes planeAnim {
                0% { transform: translateX(-60px) translateY(0) rotate(-10deg); opacity: 0; }
                30% { opacity: 1; }
                70% { transform: translateX(60px) translateY(-20px) rotate(5deg); opacity: 1; }
                100% { transform: translateX(120px) translateY(-40px) rotate(10deg); opacity: 0; }
              }
              @keyframes cloudFloat {
                0%, 100% { transform: translateX(0); }
                50% { transform: translateX(20px); }
              }
            `}</style>
            <div style={{ fontSize: '4rem', animation: 'planeAnim 2s ease infinite', display: 'block', marginBottom: '16px' }}>✈️</div>
            <div style={{ fontSize: '2rem', animation: 'cloudFloat 3s ease infinite', opacity: 0.5 }}>☁️</div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", marginTop: '16px', color: '#1a1a2e' }}>
              Processing Your Enquiry...
            </h3>
            <p style={{ color: '#6b7280', marginTop: '8px' }}>Just a moment please</p>
          </div>
        )}

        {step === 3 && (
          <div className="success-animation">
            <style>{`
              @keyframes bounce {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
              }
            `}</style>
            <div className="checkmark" style={{ animation: 'bounce 0.8s ease' }}>✓</div>
            <h3>Enquiry Received!</h3>
            <p style={{ color: '#6b7280', marginBottom: '8px' }}>
              Thank you for your interest in <strong>{destination?.name}</strong>.
            </p>
            <p style={{ fontWeight: 600, color: '#0077C8', fontSize: '1.1rem' }}>
              Our team will be contacting you shortly!
            </p>
            <p style={{ marginTop: '8px', fontSize: '0.85rem', color: '#9ca3af' }}>
              Reference: ENQ-{Date.now().toString().slice(-6)}
            </p>
            <button onClick={onClose} style={{
              marginTop: '24px', padding: '12px 36px',
              background: 'linear-gradient(135deg, #0077C8, #005a96)',
              color: 'white', border: 'none', borderRadius: '50px',
              fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem'
            }}>
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InquiryModal;
