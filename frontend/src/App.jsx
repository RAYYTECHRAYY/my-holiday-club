import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SplashScreen from './components/SplashScreen';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MembershipModal from './components/MembershipModal';
import Home from './pages/Home';
import DestinationsHub from './pages/Destinations/DestinationsHub';
import DestinationPage from './pages/Destinations/DestinationPage';
import PropertyDetail from './pages/Destinations/PropertyDetail';
import Packages from './pages/Packages';
import Overview from './pages/AboutUs/Overview';
import Philosophy from './pages/AboutUs/Philosophy';
import FoundersMessage from './pages/AboutUs/FoundersMessage';
import WhatsNews from './pages/AboutUs/WhatsNews';
import PressRelease from './pages/AboutUs/PressRelease';
import Careers from './pages/AboutUs/Careers';
import Contact from './pages/Contact';
import MemberLogin from './pages/Members/Login';
import MemberDashboard from './pages/Members/Dashboard';
import SelectPackage from './pages/Members/SelectPackage';

const regionConfig = {
  'north-india':  { title: 'North India',  subtitle: 'Majestic Himalayas, royal Rajasthan and the golden triangle',           heroImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1920&q=80', type: 'national' },
  'east-india':   { title: 'East India',   subtitle: 'Land of temples, tea gardens, tiger reserves and the Bay of Bengal',     heroImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1920&q=80', type: 'national' },
  'west-india':   { title: 'West India',   subtitle: 'Vibrant Goa beaches, ancient caves and the golden desert of Rajasthan', heroImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1920&q=80', type: 'national' },
  'south-india':  { title: 'South India',  subtitle: 'Enchanting backwaters, misty hill stations and pristine southern coastlines', heroImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1920&q=80', type: 'national' },
  'maldives':     { title: 'Maldives',     subtitle: 'Crystal lagoons, overwater bungalows and world-class diving',            heroImage: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1920&q=80', type: 'international' },
  'thailand':     { title: 'Thailand',     subtitle: 'Golden temples, floating markets and stunning tropical islands',          heroImage: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1920&q=80', type: 'international' },
  'dubai':        { title: 'Dubai',        subtitle: 'Futuristic skyline, desert safaris and world-class luxury',              heroImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1920&q=80', type: 'international' },
};

const RegionRoute = ({ slug }) => {
  const cfg = regionConfig[slug] || { title: slug, subtitle: '', heroImage: 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1600', type: 'national' };
  return <DestinationPage region={slug} {...cfg} />;
};

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [showMembership, setShowMembership] = useState(false);
  const [loggedInMember, setLoggedInMember] = useState(() => {
    try { return JSON.parse(localStorage.getItem('mhc_member') || 'null'); } catch { return null; }
  });

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (member) => setLoggedInMember(member);
  const handleLogout = () => { setLoggedInMember(null); };

  if (showSplash) return <SplashScreen />;

  return (
    <Router>
      <div className="app">
        <div className="bg-particles" aria-hidden="true">
          {Array.from({ length: 10 }, (_, i) => <div key={i} className="particle" />)}
        </div>
        <Navbar onMemberClick={() => setShowMembership(true)} loggedInMember={loggedInMember} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Home onMemberClick={() => setShowMembership(true)} />} />

          {/* Destinations */}
          <Route path="/destinations" element={<DestinationsHub />} />
          <Route path="/destinations/property/:id" element={<PropertyDetail />} />
          {Object.keys(regionConfig).map(slug => (
            <Route key={slug} path={`/destinations/${slug}`} element={<RegionRoute slug={slug} />} />
          ))}
          <Route path="/destinations/international" element={<DestinationsHub />} />

          {/* Member Portal */}
          <Route path="/members/login" element={<MemberLogin onLogin={handleLogin} />} />
          <Route path="/members/dashboard" element={<MemberDashboard onLogout={handleLogout} />} />
          <Route path="/members/select-package" element={<SelectPackage />} />

          {/* Other pages */}
          <Route path="/packages" element={<Packages />} />
          <Route path="/about/overview" element={<Overview />} />
          <Route path="/about/philosophy" element={<Philosophy />} />
          <Route path="/about/founders-message" element={<FoundersMessage />} />
          <Route path="/about/whats-news" element={<WhatsNews />} />
          <Route path="/about/press-release" element={<PressRelease />} />
          <Route path="/about/careers" element={<Careers />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <Footer onMemberClick={() => setShowMembership(true)} />
        {showMembership && <MembershipModal onClose={() => setShowMembership(false)} />}
      </div>
    </Router>
  );
}

export default App;
