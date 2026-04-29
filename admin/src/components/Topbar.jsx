import React from 'react';

const Topbar = ({ title, onMenuClick, extra }) => {
  const now = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  return (
    <div className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button onClick={onMenuClick} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '8px', display: 'none' }} className="menu-btn">☰</button>
        <h2>{title}</h2>
        {extra}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>{now}</span>
        <a href="http://localhost:3000" target="_blank" rel="noopener noreferrer" style={{
          padding: '8px 16px', background: '#e8f4ff', color: '#0077C8',
          borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem',
        }}>🌐 View Website</a>
      </div>
      <style>{`@media(max-width:768px){.menu-btn{display:block !important;}}`}</style>
    </div>
  );
};
export default Topbar;
