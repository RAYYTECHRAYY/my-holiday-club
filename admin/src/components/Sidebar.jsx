import React from 'react';

const navItems = [
  { id: 'dashboard', icon: '📊', label: 'Dashboard', section: 'main' },
  { id: 'members', icon: '⭐', label: 'Members', section: 'crm' },
  { id: 'inquiries', icon: '🏖️', label: 'Inquiries', section: 'crm' },
  { id: 'contacts', icon: '📨', label: 'Contact Messages', section: 'crm' },
  { id: 'destinations', icon: '🗺️', label: 'Destinations', section: 'content' },
  { id: 'packages', icon: '📦', label: 'Packages', section: 'content' },
  { id: 'news', icon: '📰', label: 'News & Updates', section: 'content' },
  { id: 'settings', icon: '⚙️', label: 'Site Settings', section: 'settings' },
];

const sections = {
  main: 'Main',
  crm: 'CRM & Leads',
  content: 'Content Management',
  settings: 'Settings'
};

const Sidebar = ({ activePage, setActivePage, isOpen, onClose, onLogout }) => {
  const sectionedItems = navItems.reduce((acc, item) => {
    if (!acc[item.section]) acc[item.section] = [];
    acc[item.section].push(item);
    return acc;
  }, {});

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99 }} onClick={onClose} />}

      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div style={{
            width: '38px', height: '38px', flexShrink: 0,
            background: 'rgba(0,119,200,0.3)', borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <svg width="20" height="20" viewBox="0 0 100 100">
              <polygon points="10,85 60,10 85,85" fill="#60a5fa"/>
              <g transform="translate(18,48) rotate(-30)" fill="#1e293b">
                <ellipse cx="18" cy="8" rx="15" ry="5"/>
              </g>
            </svg>
          </div>
          <div>
            <h1>My Holiday Club</h1>
            <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', marginTop: '2px', letterSpacing: '1px' }}>ADMIN PANEL</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {Object.entries(sectionedItems).map(([section, items]) => (
            <div key={section}>
              <div className="nav-section-title">{sections[section]}</div>
              {items.map(item => (
                <button key={item.id} className={`nav-item ${activePage === item.id ? 'active' : ''}`}
                  onClick={() => { setActivePage(item.id); onClose(); }}>
                  <span>{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </nav>

        {/* User section */}
        <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #0077C8, #a78bfa)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 700, color: 'white' }}>A</div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'white' }}>Administrator</div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>admin@mhc.co.in</div>
            </div>
          </div>
          <button className="nav-item" onClick={onLogout} style={{ color: '#f87171' }}>
            <span>🚪</span> Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
