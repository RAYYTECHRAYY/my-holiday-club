import React from 'react';

const navItems = [
  { id: 'dashboard', icon: '📊', label: 'Dashboard', section: 'main' },
  { id: 'memberAccounts', icon: '👤', label: 'Member Accounts', section: 'crm' },
  { id: 'payments', icon: '💳', label: 'Payments', section: 'crm' },
  { id: 'bookings', icon: '🏨', label: 'Bookings', section: 'crm' },
  { id: 'members', icon: '⭐', label: 'Memberships (Legacy)', section: 'crm' },
  { id: 'inquiries', icon: '🏖️', label: 'Inquiries', section: 'crm' },
  { id: 'contacts', icon: '📨', label: 'Contact Messages', section: 'crm' },
  { id: 'destinationsManager', icon: '🗺️', label: 'Destinations Manager', section: 'content' },
  { id: 'packages', icon: '📦', label: 'Packages', section: 'content' },
  { id: 'membershipBenefits', icon: '🎁', label: 'Membership Benefits', section: 'content' },
  { id: 'news', icon: '📰', label: 'News & Updates', section: 'content' },
  { id: 'formSettings', icon: '📋', label: 'Form Settings', section: 'settings' },
  { id: 'settings', icon: '⚙️', label: 'Site Settings', section: 'settings' },
  { id: 'payment', icon: '🏦', label: 'Payment & Reviews', section: 'settings' },
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
          <img
            src="/logo.png"
            alt="My Holiday Club"
            style={{ width: '44px', height: '44px', objectFit: 'contain', flexShrink: 0, borderRadius: '8px' }}
          />
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
