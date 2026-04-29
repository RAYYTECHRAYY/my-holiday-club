import React, { useState, useEffect } from 'react';
import socket from './socket';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import Inquiries from './pages/Inquiries';
import Contacts from './pages/Contacts';
import Destinations from './pages/Destinations';
import DestinationsManager from './pages/DestinationsManager';
import Bookings from './pages/Bookings';
import FormSettings from './pages/FormSettings';
import Packages from './pages/Packages';
import SiteSettings from './pages/SiteSettings';
import News from './pages/News';
import PaymentSettings from './pages/PaymentSettings';
import Login from './pages/Login';
import MemberAccounts from './pages/MemberAccounts';
import MembershipBenefits from './pages/MembershipBenefits';
import Payments from './pages/Payments';

const TOAST_ICONS = {
  new_member:  { icon: '⭐', color: '#0077C8', bg: '#e8f4ff', label: 'New Member' },
  new_inquiry: { icon: '🏖️', color: '#f0a500', bg: '#fef3c7', label: 'New Inquiry' },
  new_contact: { icon: '📨', color: '#10b981', bg: '#d1fae5', label: 'New Message' },
  new_booking: { icon: '🏨', color: '#8b5cf6', bg: '#ede9fe', label: 'New Booking' },
};

const ToastStack = ({ toasts, onDismiss }) => (
  <div style={{ position:'fixed', bottom:'24px', right:'24px', display:'flex', flexDirection:'column', gap:'10px', zIndex:9999, pointerEvents:'none' }}>
    {toasts.map(t => {
      const cfg = TOAST_ICONS[t.type] || { icon:'🔔', color:'#6b7280', bg:'#f3f4f6', label:'Update' };
      return (
        <div key={t.id} style={{ pointerEvents:'all', background:'white', border:`1.5px solid ${cfg.color}22`, borderLeft:`4px solid ${cfg.color}`, borderRadius:'14px', padding:'14px 18px', minWidth:'280px', maxWidth:'340px', boxShadow:'0 8px 32px rgba(0,0,0,0.14)', display:'flex', alignItems:'flex-start', gap:'12px', animation:'toastIn 0.35s cubic-bezier(0.34,1.56,0.64,1)', fontFamily:"'Inter',sans-serif" }}>
          <div style={{ width:'38px', height:'38px', borderRadius:'10px', background:cfg.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.3rem', flexShrink:0 }}>{cfg.icon}</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'3px' }}>
              <span style={{ fontWeight:800, fontSize:'0.9rem', color:cfg.color }}>{cfg.label}</span>
              <button onClick={() => onDismiss(t.id)} style={{ background:'none', border:'none', cursor:'pointer', color:'#9ca3af', fontSize:'0.85rem' }}>✕</button>
            </div>
            <div style={{ fontWeight:700, fontSize:'0.92rem', color:'#1a1a2e', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{t.name}</div>
            {t.sub && <div style={{ fontSize:'0.8rem', color:'#6b7280', marginTop:'2px' }}>{t.sub}</div>}
          </div>
        </div>
      );
    })}
    <style>{`@keyframes toastIn { from{opacity:0;transform:translateX(60px) scale(0.92)} to{opacity:1;transform:translateX(0) scale(1)} }`}</style>
  </div>
);

const LivePill = ({ connected }) => (
  <div style={{ display:'inline-flex', alignItems:'center', gap:'6px', padding:'4px 12px', borderRadius:'50px', background:connected?'#d1fae5':'#fee2e2', color:connected?'#065f46':'#991b1b', fontSize:'0.78rem', fontWeight:700, fontFamily:"'Inter',sans-serif", border:`1px solid ${connected?'#6ee7b7':'#fca5a5'}` }}>
    <span style={{ width:'7px', height:'7px', borderRadius:'50%', background:connected?'#10b981':'#ef4444', animation:connected?'livePulse 1.5s ease-in-out infinite':'none' }}/>
    {connected ? 'Live' : 'Offline'}
    <style>{`@keyframes livePulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.4);opacity:0.7} }`}</style>
  </div>
);

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('mhc_admin') === 'true');
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [connected, setConnected] = useState(false);
  const [toasts, setToasts] = useState([]);

  const addToast = (type, name, sub) => {
    const id = Date.now();
    setToasts(prev => [...prev.slice(-4), { id, type, name, sub }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 6000);
  };
  const dismissToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  useEffect(() => {
    socket.on('connect',    () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
    socket.on('new_member',  m => addToast('new_member',  m.fullName || 'New member',  m.phone));
    socket.on('new_inquiry', i => addToast('new_inquiry', i.fullName || 'New inquiry', i.destination || ''));
    socket.on('new_contact', c => addToast('new_contact', c.name    || 'New message',  c.email || ''));
    socket.on('new_booking', b => addToast('new_booking', b.propertyName || 'New booking', b.propertyLocation || ''));
    return () => socket.off();
  }, []);

  const pageTitles = {
    dashboard: 'Dashboard', members: 'Members', inquiries: 'Inquiries',
    contacts: 'Contacts', destinations: 'Destinations', destinationsManager: 'Destinations Manager',
    bookings: 'Bookings', formSettings: 'Form Settings', packages: 'Packages',
    memberAccounts: 'Member Accounts', payments: 'Payments',
    settings: 'Site Settings', news: 'News', payment: 'Payment & Reviews',
    membershipBenefits: 'Membership Benefits',
  };

  const pages = {
    dashboard: Dashboard, members: Members, inquiries: Inquiries,
    contacts: Contacts, destinations: Destinations,
    destinationsManager: DestinationsManager, bookings: Bookings,
    formSettings: FormSettings, packages: Packages,
    memberAccounts: MemberAccounts, payments: Payments,
    settings: SiteSettings, news: News, payment: PaymentSettings,
    membershipBenefits: MembershipBenefits,
  };
  const ActivePage = pages[activePage] || Dashboard;

  if (!isLoggedIn) return <Login onLogin={() => { localStorage.setItem('mhc_admin','true'); setIsLoggedIn(true); }} />;

  return (
    <div className="admin-layout">
      <Sidebar activePage={activePage} setActivePage={setActivePage} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onLogout={() => { localStorage.removeItem('mhc_admin'); setIsLoggedIn(false); }} />
      <div className="main-content">
        <Topbar title={pageTitles[activePage]} onMenuClick={() => setSidebarOpen(true)} extra={<LivePill connected={connected} />} />
        <div className="page-content fade-in" key={activePage}>
          <ActivePage socket={socket} />
        </div>
      </div>
      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};

export default App;
