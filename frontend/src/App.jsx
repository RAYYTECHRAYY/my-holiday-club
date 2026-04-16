import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SplashScreen from './components/SplashScreen';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MembershipModal from './components/MembershipModal';
import Home from './pages/Home';
import NorthIndia from './pages/Destinations/National/NorthIndia';
import EastIndia from './pages/Destinations/National/EastIndia';
import WestIndia from './pages/Destinations/National/WestIndia';
import SouthIndia from './pages/Destinations/National/SouthIndia';
import International from './pages/Destinations/International';
import Packages from './pages/Packages';
import Overview from './pages/AboutUs/Overview';
import Philosophy from './pages/AboutUs/Philosophy';
import FoundersMessage from './pages/AboutUs/FoundersMessage';
import WhatsNews from './pages/AboutUs/WhatsNews';
import PressRelease from './pages/AboutUs/PressRelease';
import Careers from './pages/AboutUs/Careers';
import Contact from './pages/Contact';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [showMembership, setShowMembership] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) return <SplashScreen />;

  return (
    <Router>
      <div className="app">
        {/* Global floating background particles */}
        <div className="bg-particles" aria-hidden="true">
          {Array.from({ length: 10 }, (_, i) => <div key={i} className="particle" />)}
        </div>
        <Navbar onMemberClick={() => setShowMembership(true)} />
        <Routes>
          <Route path="/" element={<Home onMemberClick={() => setShowMembership(true)} />} />
          <Route path="/destinations/north-india" element={<NorthIndia />} />
          <Route path="/destinations/east-india" element={<EastIndia />} />
          <Route path="/destinations/west-india" element={<WestIndia />} />
          <Route path="/destinations/south-india" element={<SouthIndia />} />
          <Route path="/destinations/international" element={<International />} />
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
