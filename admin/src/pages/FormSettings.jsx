import React, { useState, useEffect } from 'react';
import api from '../api';

const FIELD_TYPES = ['text','email','tel','number','date','textarea','select'];

export default function FormSettings({ socket }) {
  const [settings, setSettings] = useState(null);
  const [activeForm, setActiveForm] = useState('bookingForm');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    api.get('/api/form-settings').then(res => setSettings(res.data.data));
  }, []);
  useEffect(() => {
    if (!socket) return;
    socket.on('form_settings_changed', () => api.get('/api/form-settings').then(res => setSettings(res.data.data)));
    return () => socket.off('form_settings_changed');
  }, [socket]);

  if (!settings) return <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280', fontFamily: "'Inter',sans-serif" }}>Loading form settings…</div>;

  const form = settings[activeForm] || { title: '', subtitle: '', fields: [] };
  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const updateFormMeta = (key, val) => {
    setSettings(s => ({ ...s, [activeForm]: { ...s[activeForm], [key]: val } }));
  };
  const updateField = (idx, key, val) => {
    const fields = [...form.fields];
    fields[idx] = { ...fields[idx], [key]: val };
    setSettings(s => ({ ...s, [activeForm]: { ...s[activeForm], fields } }));
  };
  const addField = () => {
    const fields = [...form.fields, { id: `f${Date.now()}`, label: 'New Field', type: 'text', placeholder: '', required: false, enabled: true }];
    setSettings(s => ({ ...s, [activeForm]: { ...s[activeForm], fields } }));
  };
  const removeField = (idx) => {
    const fields = form.fields.filter((_, i) => i !== idx);
    setSettings(s => ({ ...s, [activeForm]: { ...s[activeForm], fields } }));
  };
  const moveField = (idx, dir) => {
    const fields = [...form.fields];
    const swap = idx + dir;
    if (swap < 0 || swap >= fields.length) return;
    [fields[idx], fields[swap]] = [fields[swap], fields[idx]];
    setSettings(s => ({ ...s, [activeForm]: { ...s[activeForm], fields } }));
  };
  const save = async () => {
    setSaving(true);
    try { await api.put('/api/form-settings', settings); flash('Saved successfully!'); }
    catch { flash('Error saving settings'); } finally { setSaving(false); }
  };

  const styles = {
    input: { width: '100%', padding: '9px 13px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontFamily: "'Inter',sans-serif", fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' },
    label: { display: 'block', fontWeight: 600, fontSize: '0.78rem', color: '#374151', marginBottom: '4px', fontFamily: "'Inter',sans-serif" },
    fieldCard: { background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '14px', padding: '16px 20px', marginBottom: '10px' },
    iconBtn: (c='#6b7280') => ({ background: 'none', border: `1.5px solid ${c}33`, color: c, borderRadius: '8px', width: '32px', height: '32px', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }),
  };

  return (
    <div style={{ padding: '28px', fontFamily: "'Inter',sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.8rem', color: '#1a1a2e', margin: 0 }}>Form Settings</h1>
          <p style={{ color: '#6b7280', margin: '4px 0 0', fontSize: '0.9rem' }}>Customise booking & membership form fields</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {msg && <span style={{ padding: '8px 16px', background: '#f0fdf4', color: '#16a34a', borderRadius: '8px', fontWeight: 600, fontSize: '0.875rem' }}>{msg}</span>}
          <button onClick={save} disabled={saving} style={{ padding: '10px 24px', background: saving ? '#94a3b8' : '#0077C8', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontSize: '0.9rem', fontFamily: "'Inter',sans-serif" }}>
            {saving ? 'Saving…' : '💾 Save Changes'}
          </button>
        </div>
      </div>

      {/* Form selector */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', borderBottom: '2px solid #f1f5f9' }}>
        {[['bookingForm','🏨 Booking Form'],['memberForm','👤 Member Form']].map(([k, l]) => (
          <button key={k} onClick={() => setActiveForm(k)} style={{ padding: '10px 24px', border: 'none', background: 'none', fontWeight: 600, fontSize: '0.9rem', fontFamily: "'Inter',sans-serif", cursor: 'pointer', color: activeForm === k ? '#0077C8' : '#6b7280', borderBottom: activeForm === k ? '3px solid #0077C8' : '3px solid transparent', marginBottom: '-2px' }}>{l}</button>
        ))}
      </div>

      {/* Form meta */}
      <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '24px' }}>
        <h3 style={{ margin: '0 0 18px', fontSize: '1rem', color: '#1a1a2e', fontWeight: 700 }}>Form Header</h3>
        <div style={{ display: 'grid', gap: '14px' }}>
          <div><label style={styles.label}>Form Title</label><input style={styles.input} value={form.title || ''} onChange={e => updateFormMeta('title', e.target.value)} /></div>
          <div><label style={styles.label}>Subtitle / Description</label><input style={styles.input} value={form.subtitle || ''} onChange={e => updateFormMeta('subtitle', e.target.value)} /></div>
        </div>
      </div>

      {/* Fields */}
      <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', color: '#1a1a2e', fontWeight: 700 }}>Fields ({form.fields?.length || 0})</h3>
          <button onClick={addField} style={{ padding: '8px 18px', background: '#0077C8', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem', fontFamily: "'Inter',sans-serif" }}>+ Add Field</button>
        </div>

        {(form.fields || []).map((field, idx) => (
          <div key={field.id} style={{ ...styles.fieldCard, opacity: field.enabled ? 1 : 0.5 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{ flex: 1, fontWeight: 700, color: '#1a1a2e', fontSize: '0.9rem' }}>{field.label || 'Untitled'}</div>
              <span style={{ background: field.enabled ? '#f0fdf4' : '#fef2f2', color: field.enabled ? '#16a34a' : '#ef4444', padding: '2px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700 }}>
                {field.enabled ? 'Enabled' : 'Disabled'}
              </span>
              <button style={styles.iconBtn()} onClick={() => moveField(idx, -1)} title="Move up">↑</button>
              <button style={styles.iconBtn()} onClick={() => moveField(idx, 1)} title="Move down">↓</button>
              <button style={styles.iconBtn('#ef4444')} onClick={() => removeField(idx)} title="Remove">✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <div><label style={styles.label}>Label</label><input style={styles.input} value={field.label} onChange={e => updateField(idx,'label',e.target.value)} /></div>
              <div><label style={styles.label}>Type</label>
                <select style={styles.input} value={field.type} onChange={e => updateField(idx,'type',e.target.value)}>
                  {FIELD_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div><label style={styles.label}>Placeholder</label><input style={styles.input} value={field.placeholder || ''} onChange={e => updateField(idx,'placeholder',e.target.value)} /></div>
            </div>
            <div style={{ display: 'flex', gap: '20px', marginTop: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, color: '#374151' }}>
                <input type="checkbox" checked={!!field.required} onChange={e => updateField(idx,'required',e.target.checked)} /> Required
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, color: '#374151' }}>
                <input type="checkbox" checked={!!field.enabled} onChange={e => updateField(idx,'enabled',e.target.checked)} /> Show on form
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
