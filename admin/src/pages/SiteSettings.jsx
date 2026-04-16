import React, { useState, useEffect } from 'react';
import api from '../api';

const SiteSettings = () => {
  const [settings, setSettings] = useState({
    contactInfo: { phone: '', email: '', address: '', whatsapp: '' },
    socialMedia: { facebook: '', instagram: '', twitter: '', youtube: '', linkedin: '' }
  });
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get('/api/settings').then(r => { if (r.data.data) setSettings(r.data.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const save = async () => {
    await api.put('/api/settings', settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const updateContact = (key, val) => setSettings(p => ({ ...p, contactInfo: { ...p.contactInfo, [key]: val } }));
  const updateSocial = (key, val) => setSettings(p => ({ ...p, socialMedia: { ...p.socialMedia, [key]: val } }));

  if (loading) return <div style={{ textAlign: 'center', padding: '60px' }}>Loading settings...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Site Settings</h3>
          <p style={{ color: '#6b7280', fontSize: '0.85rem' }}>Edit contact information and social media links</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {saved && <span style={{ color: '#10b981', fontWeight: 600, fontSize: '0.9rem' }}>✓ Saved successfully!</span>}
          <button className="btn btn-primary" onClick={save}>💾 Save All Changes</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Contact Info */}
        <div className="card">
          <h4 style={{ fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>📞</span> Contact Information
          </h4>
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input className="form-control" value={settings.contactInfo.phone} onChange={e => updateContact('phone', e.target.value)} placeholder="+91 98765 43210" />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="form-control" value={settings.contactInfo.email} onChange={e => updateContact('email', e.target.value)} placeholder="info@myholidayclub.co.in" />
          </div>
          <div className="form-group">
            <label className="form-label">WhatsApp Number</label>
            <input className="form-control" value={settings.contactInfo.whatsapp} onChange={e => updateContact('whatsapp', e.target.value)} placeholder="+91 98765 43210" />
          </div>
          <div className="form-group">
            <label className="form-label">Office Address</label>
            <textarea className="form-control" rows={3} value={settings.contactInfo.address} onChange={e => updateContact('address', e.target.value)} placeholder="123 Travel House, Connaught Place, New Delhi - 110001" />
          </div>
        </div>

        {/* Social Media */}
        <div className="card">
          <h4 style={{ fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>📱</span> Social Media Links
          </h4>
          {[
            { key: 'facebook', label: 'Facebook URL', icon: 'f', placeholder: 'https://facebook.com/myholidayclub' },
            { key: 'instagram', label: 'Instagram URL', icon: '📷', placeholder: 'https://instagram.com/myholidayclub' },
            { key: 'twitter', label: 'Twitter/X URL', icon: '𝕏', placeholder: 'https://twitter.com/myholidayclub' },
            { key: 'youtube', label: 'YouTube URL', icon: '▶', placeholder: 'https://youtube.com/myholidayclub' },
            { key: 'linkedin', label: 'LinkedIn URL', icon: 'in', placeholder: 'https://linkedin.com/company/myholidayclub' },
          ].map(s => (
            <div className="form-group" key={s.key}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>{s.icon}</span> {s.label}
              </label>
              <input className="form-control" value={settings.socialMedia[s.key] || ''} onChange={e => updateSocial(s.key, e.target.value)} placeholder={s.placeholder} />
            </div>
          ))}
        </div>

        {/* Preview */}
        <div className="card" style={{ gridColumn: '1/-1' }}>
          <h4 style={{ fontWeight: 700, marginBottom: '16px' }}>📋 Live Preview (Contact Page)</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            {[
              { icon: '📞', label: 'Phone', value: settings.contactInfo.phone },
              { icon: '✉️', label: 'Email', value: settings.contactInfo.email },
              { icon: '💬', label: 'WhatsApp', value: settings.contactInfo.whatsapp },
            ].map(item => (
              <div key={item.label} style={{ padding: '16px', background: '#f8fafc', borderRadius: '10px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600 }}>{item.label}</div>
                  <div style={{ fontWeight: 500 }}>{item.value || '—'}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '16px', padding: '12px', background: '#f8fafc', borderRadius: '10px' }}>
            <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600, marginBottom: '4px' }}>📍 Address</div>
            <div>{settings.contactInfo.address || '—'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteSettings;
