import React, { useState, useEffect, useRef } from 'react';
import api from '../api';

const PaymentSettings = () => {
  const [form, setForm] = useState({
    googlePayQR: '',
    googlePayUPI: '',
    googleReviewsLink: '',
    googleReviewsRating: '4.8',
    showPayNow: true,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [qrPreview, setQrPreview] = useState('');
  const fileRef = useRef();

  useEffect(() => {
    api.get('/api/payment-settings').then(r => {
      if (r.data.success) {
        setForm(f => ({ ...f, ...r.data.data }));
        if (r.data.data.googlePayQR) setQrPreview(r.data.data.googlePayQR);
      }
    }).catch(() => {});
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  // Convert uploaded image to base64 and store as QR
  const handleQRUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      setQrPreview(dataUrl);
      setForm(f => ({ ...f, googlePayQR: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteQR = () => {
    setQrPreview('');
    setForm(f => ({ ...f, googlePayQR: '' }));
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/api/payment-settings', form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert('Error saving. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1a1a2e', marginBottom: '6px' }}>
          💳 Payment & Reviews Settings
        </h2>
        <p style={{ color: '#6b7280', fontSize: '0.97rem' }}>
          Manage the Google Pay QR scanner shown to customers, and configure the Google Reviews link in the top bar.
        </p>
      </div>

      {saved && (
        <div style={{
          background: 'linear-gradient(135deg,#d1fae5,#a7f3d0)', color: '#065f46',
          borderRadius: '12px', padding: '14px 20px', marginBottom: '24px',
          fontWeight: 700, fontSize: '0.96rem', display: 'flex', alignItems: 'center', gap: '10px',
          border: '1px solid #6ee7b7',
        }}>
          ✅ Settings saved successfully!
        </div>
      )}

      <form onSubmit={handleSave}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

          {/* LEFT — QR Code */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', border: '1px solid #f0f4ff' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1a1a2e', marginBottom: '6px' }}>
              📱 Google Pay QR Scanner
            </h3>
            <p style={{ color: '#6b7280', fontSize: '0.88rem', marginBottom: '22px' }}>
              Upload your Google Pay QR code. It will appear in the Pay Now popup on the website.
            </p>

            {/* QR Preview */}
            <div style={{
              background: 'linear-gradient(135deg,#e8f4ff,#fff8e6)',
              borderRadius: '14px', padding: '20px',
              border: '2px dashed rgba(0,119,200,0.22)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              minHeight: '220px', marginBottom: '18px', position: 'relative',
            }}>
              {qrPreview ? (
                <>
                  <img src={qrPreview} alt="QR Preview"
                    style={{ width: '180px', height: '180px', objectFit: 'contain', borderRadius: '10px' }} />
                  <button type="button" onClick={handleDeleteQR} style={{
                    position: 'absolute', top: '10px', right: '10px',
                    background: '#fee2e2', border: 'none', borderRadius: '50%',
                    width: '30px', height: '30px', cursor: 'pointer',
                    color: '#ef4444', fontSize: '1rem', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                  }}>✕</button>
                </>
              ) : (
                <div style={{ textAlign: 'center', color: '#9ca3af' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📲</div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#6b7280' }}>No QR uploaded yet</div>
                  <div style={{ fontSize: '0.82rem', marginTop: '4px' }}>Upload your Google Pay QR code below</div>
                </div>
              )}
            </div>

            <label style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              padding: '12px', background: '#0077C8', color: 'white',
              borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontSize: '0.95rem',
              transition: 'all 0.2s', marginBottom: '14px',
            }}>
              📤 {qrPreview ? 'Replace QR Image' : 'Upload QR Image'}
              <input ref={fileRef} type="file" accept="image/*" onChange={handleQRUpload} style={{ display: 'none' }} />
            </label>

            <div style={{ background: '#f8faff', borderRadius: '10px', padding: '14px' }}>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.88rem', color: '#1a1a2e', marginBottom: '8px' }}>
                UPI ID (shown below QR)
              </label>
              <input
                type="text" name="googlePayUPI"
                value={form.googlePayUPI} onChange={handleChange}
                placeholder="yourname@okaxis"
                style={{
                  width: '100%', padding: '10px 14px', border: '2px solid #e2e8f0',
                  borderRadius: '8px', fontSize: '0.95rem', fontFamily: 'Calibri, Arial, sans-serif',
                }}
              />
            </div>

            {/* Toggle */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginTop: '16px', padding: '14px', background: '#f8faff',
              borderRadius: '10px', border: '1px solid #e2e8f0',
            }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1a1a2e' }}>Show "Pay Now" button</div>
                <div style={{ fontSize: '0.80rem', color: '#9ca3af', marginTop: '2px' }}>Displays in the top bar on the website</div>
              </div>
              <label style={{ position: 'relative', display: 'inline-block', width: '46px', height: '26px', cursor: 'pointer' }}>
                <input type="checkbox" name="showPayNow" checked={form.showPayNow} onChange={handleChange}
                  style={{ opacity: 0, width: 0, height: 0 }} />
                <span style={{
                  position: 'absolute', inset: 0, borderRadius: '26px',
                  background: form.showPayNow ? '#0077C8' : '#d1d5db',
                  transition: 'background 0.25s',
                }}/>
                <span style={{
                  position: 'absolute', top: '3px',
                  left: form.showPayNow ? '23px' : '3px',
                  width: '20px', height: '20px', background: 'white',
                  borderRadius: '50%', transition: 'left 0.25s',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.18)',
                }}/>
              </label>
            </div>
          </div>

          {/* RIGHT — Google Reviews */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', border: '1px solid #f0f4ff' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1a1a2e', marginBottom: '6px' }}>
              ⭐ Google Reviews
            </h3>
            <p style={{ color: '#6b7280', fontSize: '0.88rem', marginBottom: '22px' }}>
              Set your Google Reviews link and rating displayed in the top bar of the website.
            </p>

            {/* Preview */}
            <div style={{
              background: 'linear-gradient(135deg,#003d7a,#0055a0)',
              borderRadius: '12px', padding: '14px 20px',
              display: 'flex', alignItems: 'center', gap: '10px',
              marginBottom: '22px', color: 'white', fontSize: '0.90rem',
            }}>
              <span style={{ fontSize: '1.1rem' }}>🏆</span>
              <span style={{ color: '#f0a500', fontSize: '1rem', letterSpacing: '1px' }}>
                {'★'.repeat(Math.round(parseFloat(form.googleReviewsRating)||5))}
              </span>
              <span><strong>{form.googleReviewsRating || '4.8'}</strong> on Google Reviews ↗</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.88rem', color: '#1a1a2e', marginBottom: '7px' }}>
                  Google Reviews Link
                </label>
                <input
                  type="url" name="googleReviewsLink"
                  value={form.googleReviewsLink} onChange={handleChange}
                  placeholder="https://g.page/r/..."
                  style={{
                    width: '100%', padding: '11px 14px', border: '2px solid #e2e8f0',
                    borderRadius: '10px', fontSize: '0.95rem', fontFamily: 'Calibri, Arial, sans-serif',
                  }}
                />
                <p style={{ fontSize: '0.78rem', color: '#9ca3af', marginTop: '5px' }}>
                  Go to Google Maps → your business → Share → Copy link
                </p>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.88rem', color: '#1a1a2e', marginBottom: '7px' }}>
                  Rating (e.g. 4.8)
                </label>
                <input
                  type="number" name="googleReviewsRating"
                  value={form.googleReviewsRating} onChange={handleChange}
                  min="1" max="5" step="0.1" placeholder="4.8"
                  style={{
                    width: '120px', padding: '11px 14px', border: '2px solid #e2e8f0',
                    borderRadius: '10px', fontSize: '0.95rem', fontFamily: 'Calibri, Arial, sans-serif',
                  }}
                />
              </div>
            </div>

            {/* Instructions */}
            <div style={{
              marginTop: '24px', background: '#f0f9ff', borderRadius: '12px',
              padding: '16px 18px', border: '1px solid rgba(0,119,200,0.15)',
            }}>
              <div style={{ fontWeight: 800, fontSize: '0.90rem', color: '#0077C8', marginBottom: '8px' }}>
                📋 How to get your Google Reviews link:
              </div>
              {[
                'Go to Google Maps and search your business',
                'Click on your business listing',
                'Click "Share" → "Copy link"',
                'Paste the link in the field above',
              ].map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '5px', fontSize: '0.85rem', color: '#374151' }}>
                  <span style={{ color: '#0077C8', fontWeight: 800, minWidth: '16px' }}>{i+1}.</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" disabled={saving} style={{
            padding: '13px 36px',
            background: saving ? '#9ca3af' : 'linear-gradient(135deg,#0077C8,#0095f0)',
            color: 'white', border: 'none', borderRadius: '50px',
            fontWeight: 800, fontSize: '1rem', cursor: saving ? 'not-allowed' : 'pointer',
            fontFamily: 'Calibri, Arial, sans-serif',
            boxShadow: '0 4px 18px rgba(0,119,200,0.30)',
            transition: 'all 0.2s',
          }}>
            {saving ? '⏳ Saving...' : '💾 Save Payment Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentSettings;
