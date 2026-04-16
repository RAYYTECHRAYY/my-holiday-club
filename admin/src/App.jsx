import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import Inquiries from './pages/Inquiries';
import Contacts from './pages/Contacts';
import Destinations from './pages/Destinations';
import Packages from './pages/Packages';
import SiteSettings from './pages/SiteSettings';
import News from './pages/News';
import Login from './pages/Login';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('mhc_admin') === 'true');
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pageTitles = {
    dashboard: 'Dashboard Overview',
    members: 'Members Management',
    inquiries: 'Destination Inquiries',
    contacts: 'Contact Messages',
    destinations: 'Destinations Management',
    packages: 'Packages Management',
    settings: 'Site Settings',
    news: 'News & Updates'
  };

  const pages = { dashboard: Dashboard, members: Members, inquiries: Inquiries, contacts: Contacts, destinations: Destinations, packages: Packages, settings: SiteSettings, news: News };
  const ActivePage = pages[activePage] || Dashboard;

  if (!isLoggedIn) return <Login onLogin={() => { localStorage.setItem('mhc_admin', 'true'); setIsLoggedIn(true); }} />;

  return (
    <div className="admin-layout">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={() => { localStorage.removeItem('mhc_admin'); setIsLoggedIn(false); }}
      />
      <div className="main-content">
        <Topbar
          title={pageTitles[activePage]}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <div className="page-content fade-in" key={activePage}>
          <ActivePage />
        </div>
      </div>
    </div>
  );
};

export default App;
