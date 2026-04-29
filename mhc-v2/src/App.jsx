import { useState, useCallback } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import SplashScreen from './components/SplashScreen';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Destinations from './pages/Destinations';
import DestinationDetail from './pages/DestinationDetail';
import Packages from './pages/Packages';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import './App.css';

function Layout({ children }) {
  return (
    <div className="layout">
      <Navbar />
      <main className="main-page">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  const [splashDone, setSplashDone] = useState(false);
  const handleSplashDone = useCallback(() => setSplashDone(true), []);

  return (
    <div className="app">
      {!splashDone && <SplashScreen onDone={handleSplashDone} />}
      <div className={`main-content ${splashDone ? 'content-visible' : 'content-hidden'}`}>
        <HashRouter>
          <Routes>
            <Route path="/" element={
              <div className="layout">
                <Navbar />
                <Home />
                <Footer />
              </div>
            } />
            <Route path="/destinations"    element={<Layout><Destinations /></Layout>} />
            <Route path="/destinations/:id" element={<Layout><DestinationDetail /></Layout>} />
            <Route path="/packages"        element={<Layout><Packages /></Layout>} />
            <Route path="/about"           element={<Layout><AboutUs /></Layout>} />
            <Route path="/contact"         element={<Layout><Contact /></Layout>} />
          </Routes>
        </HashRouter>
      </div>
    </div>
  );
}
