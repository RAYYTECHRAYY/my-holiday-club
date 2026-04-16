import React, { useState } from 'react';
import axios from 'axios';

const MembershipModal = ({ onClose }) => {
  const [step, setStep] = useState(1); // 1=form, 2=submitting, 3=success
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', address: '',
    city: '', state: '', pincode: '',
    memberType: '', adults: '1', children: '0',
    preferredDestination: '', message: ''
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!formData.fullName.trim()) e.fullName = 'Name is required';
    if (!formData.email.match(/^\S+@\S+\.\S+$/)) e.email = 'Valid email required';
    if (!formData.phone.match(/^\d{10}$/)) e.phone = '10-digit mobile number required';
    if (!formData.address.trim()) e.address = 'Address is required';
    if (!formData.memberType) e.memberType = 'Please select membership type';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setStep(2);
    try {
      await axios.post('/api/members', { ...formData, type: 'membership' });
    } catch (_) {}
    setTimeout(() => setStep(3), 2000);
  };

  const handleChange = (e) => {
    setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(p => ({ ...p, [e.target.name]: '' }));
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && step !== 2 && onClose()}>
      <div className="modal-box" style={{ maxWidth: '640px' }}>
        {step !== 2 && step !== 3 && (
          <button className="modal-close" onClick={onClose}>✕</button>
        )}

        {step === 1 && (
          <>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div style={{
                width: '60px', height: '60px', margin: '0 auto 16px',
                background: 'linear-gradient(135deg, #0077C8, #005a96)',
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.8rem'
              }}>⭐</div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', color: '#1a1a2e', marginBottom: '8px' }}>
                Become a Member
              </h2>
              <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>
                Join thousands of happy holiday members. Fill in your details and our team will contact you shortly.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Your full name" />
                  {errors.fullName && <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>{errors.fullName}</span>}
                </div>
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input name="phone" value={formData.phone} onChange={handleChange} placeholder="10-digit mobile" maxLength={10} />
                  {errors.phone && <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>{errors.phone}</span>}
                </div>
              </div>

              <div className="form-group">
                <label>Email Address *</label>
                <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" />
                {errors.email && <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>{errors.email}</span>}
              </div>

              <div className="form-group">
                <label>Home Address *</label>
                <input name="address" value={formData.address} onChange={handleChange} placeholder="Street address" />
                {errors.address && <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>{errors.address}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input name="city" value={formData.city} onChange={handleChange} placeholder="Your city" />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input name="state" value={formData.state} onChange={handleChange} placeholder="Your state" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>PIN Code</label>
                  <input name="pincode" value={formData.pincode} onChange={handleChange} placeholder="6-digit PIN" maxLength={6} />
                </div>
                <div className="form-group">
                  <label>Membership Type *</label>
                  <select name="memberType" value={formData.memberType} onChange={handleChange}>
                    <option value="">Select plan</option>
                    <option value="starter">Holiday Starter - ₹2,99,999</option>
                    <option value="classic">Holiday Classic - ₹4,99,999</option>
                    <option value="premium">Holiday Premium - ₹7,99,999</option>
                  </select>
                  {errors.memberType && <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>{errors.memberType}</span>}
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
                    {[0,1,2,3,4].map(n => <option key={n} value={n}>{n} Child{n>1?'ren':n===1?'':'ren'}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Preferred Destination</label>
                <input name="preferredDestination" value={formData.preferredDestination} onChange={handleChange} placeholder="Where would you love to go?" />
              </div>

              <div className="form-group">
                <label>Any Message</label>
                <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Tell us more about your holiday expectations..." rows={3} />
              </div>

              <button type="submit" style={{
                width: '100%', padding: '16px',
                background: 'linear-gradient(135deg, #0077C8, #005a96)',
                color: 'white', border: 'none', borderRadius: '50px',
                fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
                transition: 'all 0.3s', fontFamily: "'Inter', sans-serif"
              }}
                onMouseEnter={e => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.target.style.transform = 'translateY(0)'}
              >
                ⭐ Submit Membership Request
              </button>
            </form>
          </>
        )}

        {step === 2 && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <style>{`
              @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
              @keyframes wave {
                0%, 100% { transform: scaleY(0.5); }
                50% { transform: scaleY(1.5); }
              }
            `}</style>
            <div style={{ marginBottom: '24px' }}>
              {[0, 0.1, 0.2, 0.3, 0.4].map((delay, i) => (
                <div key={i} style={{
                  display: 'inline-block', width: '10px', height: '40px',
                  background: `hsl(${200 + i * 20}, 80%, 50%)`,
                  margin: '0 4px', borderRadius: '5px',
                  animation: `wave 1s ease ${delay}s infinite`
                }} />
              ))}
            </div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', color: '#1a1a2e', marginBottom: '8px' }}>
              Processing Your Request...
            </h3>
            <p style={{ color: '#6b7280' }}>Please wait a moment</p>
          </div>
        )}

        {step === 3 && (
          <div className="success-animation">
            <style>{`
              @keyframes checkBounce {
                0% { transform: scale(0); opacity: 0; }
                60% { transform: scale(1.2); }
                100% { transform: scale(1); opacity: 1; }
              }
              @keyframes confetti {
                0% { transform: translateY(0) rotate(0); opacity: 1; }
                100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
              }
            `}</style>

            {/* Confetti dots */}
            {[...Array(12)].map((_, i) => (
              <div key={i} style={{
                position: 'absolute',
                width: '8px', height: '8px',
                borderRadius: '50%',
                background: ['#f0a500', '#0077C8', '#10b981', '#ef4444', '#8b5cf6'][i % 5],
                left: `${10 + i * 7}%`,
                top: '20%',
                animation: `confetti ${1 + i * 0.1}s ease forwards`
              }} />
            ))}

            <div className="checkmark" style={{ animation: 'checkBounce 0.6s ease' }}>✓</div>
            <h3>🎉 Welcome to My Holiday Club!</h3>
            <p style={{ marginBottom: '8px' }}>Your membership request has been received.</p>
            <p style={{ fontWeight: 600, color: '#0077C8', fontSize: '1.05rem' }}>
              Our team will be contacting you shortly!
            </p>
            <p style={{ marginTop: '12px', fontSize: '0.85rem', color: '#9ca3af' }}>
              Reference ID: MHC-{Date.now().toString().slice(-6)}
            </p>
            <button onClick={onClose} style={{
              marginTop: '24px', padding: '12px 36px',
              background: 'linear-gradient(135deg, #0077C8, #005a96)',
              color: 'white', border: 'none', borderRadius: '50px',
              fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem'
            }}>
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MembershipModal;
