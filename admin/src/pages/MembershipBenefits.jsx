import React, { useState, useEffect } from 'react';
import api from '../api';

const EMOJI_OPTIONS = ['🏨','💰','🎁','📱','🧳','🔄','✈️','🌴','🏖️','🎯','🌟','💎','👑','🍽️','🚗','🏊','🎪','🎭','🌺','⭐','🔑','🛎️','🎫','🌍','🏅'];

const defaultBenefit = { icon: '🌟', title: '', desc: '' };

const BenefitCard = ({ benefit, idx, onChange, onRemove, onMoveUp, onMoveDown, isFirst, isLast }) => {
  const [showEmoji, setShowEmoji] = useState(false);

  return (
    <div style={{
      background: 'white', borderRadius: '16px', padding: '20px',
      border: '2px solid #e8f4ff', position: 'relative',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      transition: 'border-color 0.2s'
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
        {/* Emoji picker */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <button
            onClick={() => setShowEmoji(v => !v)}
            style={{
              width: '56px', height: '56px', borderRadius: '14px',
              background: '#f0f7ff', border: '2px solid #e8f4ff',
              fontSize: '1.8rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
            title="Pick icon"
          >{benefit.icon || '🌟'}</button>
          {showEmoji && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, zIndex: 10,
              background: 'white', borderRadius: '12px', padding: '10px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
              display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '4px',
              minWidth: '180px', border: '1px solid #e8f4ff', marginTop: '6px'
            }}>
              {EMOJI_OPTIONS.map(em => (
                <button key={em}
                  onClick={() => { onChange('icon', em); setShowEmoji(false); }}
                  style={{ fontSize: '1.4rem', background: 'none', border: 'none', cursor: 'pointer', borderRadius: '6px', padding: '4px', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f0f7ff'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >{em}</button>
              ))}
            </div>
          )}
        </div>

        {/* Fields */}
        <div style={{ flex: 1 }}>
          <input
            value={benefit.title}
            onChange={e => onChange('title', e.target.value)}
            placeholder="Benefit title (e.g. Premium Properties)"
            style={{
              width: '100%', padding: '8px 12px', marginBottom: '8px',
              border: '1px solid #e5e7eb', borderRadius: '8px',
              fontSize: '0.95rem', fontWeight: 600, color: '#1a1a2e',
              fontFamily: "'Inter', sans-serif", boxSizing: 'border-box'
            }}
          />
          <textarea
            value={benefit.desc}
            onChange={e => onChange('desc', e.target.value)}
            placeholder="Short description shown to members..."
            rows={2}
            style={{
              width: '100%', padding: '8px 12px',
              border: '1px solid #e5e7eb', borderRadius: '8px',
              fontSize: '0.875rem', color: '#4b5563', resize: 'vertical',
              fontFamily: "'Inter', sans-serif", boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexShrink: 0 }}>
          <button onClick={onMoveUp} disabled={isFirst}
            style={{ background: isFirst ? '#f3f4f6' : '#f0f7ff', border: '1px solid #e5e7eb', borderRadius: '6px', width: '28px', height: '28px', cursor: isFirst ? 'not-allowed' : 'pointer', fontSize: '0.75rem', color: isFirst ? '#9ca3af' : '#0077C8' }}>↑</button>
          <button onClick={onMoveDown} disabled={isLast}
            style={{ background: isLast ? '#f3f4f6' : '#f0f7ff', border: '1px solid #e5e7eb', borderRadius: '6px', width: '28px', height: '28px', cursor: isLast ? 'not-allowed' : 'pointer', fontSize: '0.75rem', color: isLast ? '#9ca3af' : '#0077C8' }}>↓</button>
          <button onClick={onRemove}
            style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '6px', width: '28px', height: '28px', cursor: 'pointer', fontSize: '0.8rem', color: '#dc2626' }}>×</button>
        </div>
      </div>

      <div style={{ position: 'absolute', top: '10px', left: '10px', background: '#e8f4ff', color: '#0077C8', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700 }}>
        {idx + 1}
      </div>
    </div>
  );
};

const MembershipBenefits = () => {
  const [benefits, setBenefits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get('/api/membership-benefits')
      .then(r => { if (r.data.data) setBenefits(r.data.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const addBenefit = () => {
    setBenefits(prev => [...prev, { id: `b${Date.now()}`, ...defaultBenefit }]);
  };

  const updateBenefit = (idx, field, value) => {
    setBenefits(prev => prev.map((b, i) => i === idx ? { ...b, [field]: value } : b));
  };

  const removeBenefit = (idx) => {
    setBenefits(prev => prev.filter((_, i) => i !== idx));
  };

  const moveUp = (idx) => {
    if (idx === 0) return;
    setBenefits(prev => {
      const arr = [...prev];
      [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
      return arr;
    });
  };

  const moveDown = (idx) => {
    if (idx === benefits.length - 1) return;
    setBenefits(prev => {
      const arr = [...prev];
      [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
      return arr;
    });
  };

  const save = async () => {
    setSaving(true);
    try {
      await api.put('/api/membership-benefits', benefits);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '80px', color: '#6b7280' }}>
      <div style={{ fontSize: '2rem', marginBottom: '12px' }}>⏳</div>
      Loading membership benefits...
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '4px' }}>Membership Benefits</h3>
          <p style={{ color: '#6b7280', fontSize: '0.85rem' }}>
            Customize the benefits shown on the Members Packages page. Drag to reorder, edit icons and descriptions freely.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {saved && (
            <span style={{ color: '#10b981', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              ✅ Saved successfully!
            </span>
          )}
          <button onClick={addBenefit} className="btn" style={{ background: '#f0f7ff', color: '#0077C8', border: '2px solid #0077C8', fontWeight: 600 }}>
            + Add Benefit
          </button>
          <button onClick={save} className="btn btn-primary" disabled={saving}>
            {saving ? '💾 Saving...' : '💾 Save Changes'}
          </button>
        </div>
      </div>

      {/* Preview banner */}
      <div style={{ background: 'linear-gradient(135deg, #0077C8, #005a96)', borderRadius: '12px', padding: '16px 20px', marginBottom: '24px', color: 'white', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '1.4rem' }}>👁</span>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Live Preview</div>
          <div style={{ fontSize: '0.8rem', opacity: 0.85 }}>Changes save instantly to the Members Packages page. Members will see these benefits when they log in.</div>
        </div>
        <div style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.15)', borderRadius: '50px', padding: '4px 14px', fontSize: '0.85rem', fontWeight: 600 }}>
          {benefits.length} benefit{benefits.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Benefits list */}
      {benefits.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: '#f8fafc', borderRadius: '16px', color: '#6b7280' }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🎁</div>
          <p style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '8px' }}>No benefits added yet</p>
          <p style={{ fontSize: '0.875rem' }}>Click "Add Benefit" to create your first membership benefit.</p>
          <button onClick={addBenefit} className="btn btn-primary" style={{ marginTop: '16px' }}>
            + Add First Benefit
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {benefits.map((b, i) => (
            <BenefitCard
              key={b.id || i}
              benefit={b}
              idx={i}
              onChange={(field, val) => updateBenefit(i, field, val)}
              onRemove={() => removeBenefit(i)}
              onMoveUp={() => moveUp(i)}
              onMoveDown={() => moveDown(i)}
              isFirst={i === 0}
              isLast={i === benefits.length - 1}
            />
          ))}
        </div>
      )}

      {/* Mini preview */}
      {benefits.length > 0 && (
        <div style={{ marginTop: '32px', background: '#f8fafc', borderRadius: '16px', padding: '24px' }}>
          <h4 style={{ fontWeight: 700, marginBottom: '16px', fontSize: '0.95rem', color: '#1a1a2e' }}>
            📱 Page Preview
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
            {benefits.map((b, i) => (
              <div key={i} style={{ padding: '16px', background: 'white', borderRadius: '10px', border: '2px solid #e8f4ff', textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>{b.icon}</div>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '4px', color: '#1a1a2e' }}>{b.title || 'Benefit Title'}</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{b.desc || 'Description here...'}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom save */}
      {benefits.length > 0 && (
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          {saved && <span style={{ color: '#10b981', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center' }}>✅ Saved!</span>}
          <button onClick={save} className="btn btn-primary" disabled={saving} style={{ padding: '12px 28px' }}>
            {saving ? '💾 Saving...' : '💾 Save All Changes'}
          </button>
        </div>
      )}
    </div>
  );
};

export default MembershipBenefits;
