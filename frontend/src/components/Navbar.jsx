import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ onMemberClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [destOpen, setDestOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const location = useLocation();
  const destRef = useRef(null);
  const aboutRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDestOpen(false);
    setAboutOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (destRef.current && !destRef.current.contains(e.target)) setDestOpen(false);
      if (aboutRef.current && !aboutRef.current.contains(e.target)) setAboutOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const nationalDests = [
    { label: '🏔️ North India', path: '/destinations/north-india' },
    { label: '🍵 East India',  path: '/destinations/east-india' },
    { label: '🏖️ West India',  path: '/destinations/west-india' },
    { label: '🌴 South India', path: '/destinations/south-india' },
  ];

  const aboutLinks = [
    { label: '📋 Overview',            path: '/about/overview' },
    { label: '🌟 Our Philosophy',      path: '/about/philosophy' },
    { label: "👤 Founder's Message",   path: '/about/founders-message' },
    { label: "📰 What's News",         path: '/about/whats-news' },
    { label: '📢 Press Release',       path: '/about/press-release' },
    { label: '💼 Careers',             path: '/about/careers' },
  ];

  const linkColor = scrolled ? '#1a1a2e' : 'white';

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 900,
      background: scrolled ? 'rgba(255,255,255,0.97)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      boxShadow: scrolled ? '0 4px 30px rgba(0,119,200,0.15)' : 'none',
      transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
      borderBottom: scrolled ? '2px solid rgba(0,119,200,0.12)' : 'none',
    }}>
      <style>{`
        .nav-link {
          font-family: 'Poppins', sans-serif;
          font-size: 1rem; font-weight: 600;
          text-decoration: none; padding: 10px 6px;
          position: relative; transition: color 0.3s ease;
          white-space: nowrap; letter-spacing: 0.3px;
        }
        .nav-link::after {
          content: ''; position: absolute;
          bottom: 0; left: 0; width: 0; height: 3px;
          background: linear-gradient(90deg, #0077C8, #6c63ff);
          border-radius: 2px; transition: width 0.35s ease;
        }
        .nav-link:hover::after { width: 100%; }

        .nav-arrow {
          display: inline-block; width: 18px; height: 18px;
          margin-left: 4px; vertical-align: middle;
          transition: transform 0.35s cubic-bezier(0.4,0,0.2,1);
        }
        .nav-arrow.open { transform: rotate(180deg); }

        .dropdown-menu {
          position: absolute; top: calc(100% + 10px); left: 50%;
          transform: translateX(-50%);
          background: white; border-radius: 20px;
          box-shadow: 0 25px 70px rgba(0,0,0,0.18);
          padding: 10px; min-width: 240px;
          border: 1px solid rgba(0,119,200,0.1);
          animation: dropdownIn 0.25s cubic-bezier(0.34,1.56,0.64,1);
          z-index: 999;
        }
        @keyframes dropdownIn {
          from { opacity:0; transform:translateX(-50%) translateY(-12px) scale(0.95); }
          to   { opacity:1; transform:translateX(-50%) translateY(0) scale(1); }
        }
        .dropdown-item {
          display: block; padding: 11px 18px; color: #1a1a2e;
          text-decoration: none; border-radius: 12px;
          font-size: 0.92rem; font-weight: 500;
          transition: all 0.2s ease; position: relative; overflow: hidden;
        }
        .dropdown-item::before {
          content: ''; position: absolute;
          left: 0; top: 0; bottom: 0; width: 3px;
          background: linear-gradient(180deg, #0077C8, #6c63ff);
          border-radius: 2px; transform: scaleY(0);
          transition: transform 0.2s ease;
        }
        .dropdown-item:hover {
          background: linear-gradient(135deg, #e8f4ff, #ede8ff);
          color: #0077C8; transform: translateX(6px);
          padding-left: 24px;
        }
        .dropdown-item:hover::before { transform: scaleY(1); }

        .dest-mega { min-width: 500px; padding: 18px; }
        .dest-section-title {
          font-size: 0.73rem; font-weight: 800;
          text-transform: uppercase; letter-spacing: 1.5px;
          padding: 8px 18px 6px;
          background: linear-gradient(90deg, #0077C8, #6c63ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .dest-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; }
        .dest-divider {
          height: 2px; margin: 10px;
          background: linear-gradient(90deg, #0077C8, #6c63ff, #00d2aa);
          border-radius: 2px; opacity: 0.3;
        }

        .mobile-menu {
          background: white; padding: 16px;
          border-top: 3px solid;
          border-image: linear-gradient(90deg, #0077C8, #6c63ff, #00d2aa, #f0a500) 1;
          max-height: 72vh; overflow-y: auto;
          box-shadow: 0 20px 40px rgba(0,0,0,0.12);
        }
        .mobile-nav-item {
          display: block; padding: 13px 18px; color: #1a1a2e;
          text-decoration: none; border-radius: 12px;
          font-weight: 600; font-size: 0.95rem;
          transition: all 0.2s; margin-bottom: 4px;
        }
        .mobile-nav-item:hover {
          background: linear-gradient(135deg, #e8f4ff, #ede8ff);
          color: #0077C8; transform: translateX(4px);
        }
        .mobile-section-title {
          padding: 10px 18px 5px; font-size: 0.72rem; font-weight: 800;
          background: linear-gradient(90deg, #0077C8, #6c63ff);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text; text-transform: uppercase;
          letter-spacing: 1.5px; margin-top: 8px;
        }
        .mobile-sub { padding-left: 32px !important; font-weight: 500 !important; font-size: 0.88rem !important; }

        @keyframes memberGlow {
          0%,100% { box-shadow: 0 4px 20px rgba(240,165,0,0.35); }
          50%      { box-shadow: 0 4px 30px rgba(240,165,0,0.65), 0 0 0 6px rgba(240,165,0,0.1); }
        }
        .member-btn { animation: memberGlow 2.5s ease-in-out infinite; }

        .hamburger { display: none; }
        @media (max-width: 1024px) {
          .desktop-nav { display: none !important; }
          .hamburger   { display: block !important; }
        }
      `}</style>

      <div className="container">
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', height:'92px' }}>

          {/* LOGO */}
          <Link to="/" style={{ display:'flex', alignItems:'center', gap:'10px', textDecoration:'none', flexShrink:0 }}>
            <div style={{
              width:'56px', height:'56px',
              borderRadius:'14px',
              overflow:'hidden',
              flexShrink:0,
              boxShadow: scrolled ? '0 4px 18px rgba(0,119,200,0.35)' : '0 2px 12px rgba(0,0,0,0.2)',
              transition:'all 0.3s ease',
              border: scrolled ? '2px solid rgba(0,119,200,0.15)' : '2px solid rgba(255,255,255,0.3)',
            }}>
              <img
                src="/logo.jpeg"
                alt="My Holiday Club"
                style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}
              />
            </div>
            <div>
              <div style={{
                fontFamily:"'Playfair Display',serif",
                fontSize:'1.2rem', fontWeight:800,
                color: scrolled ? '#1a1a2e' : 'white',
                lineHeight:1.1, transition:'color 0.3s ease',
                letterSpacing:'-0.3px'
              }}>My Holiday Club</div>
              <div style={{
                fontSize:'0.58rem',
                color: scrolled ? '#6c63ff' : 'rgba(255,255,255,0.75)',
                letterSpacing:'2.5px', textTransform:'uppercase',
                fontWeight:700, transition:'color 0.3s ease'
              }}>Travel Made Easier</div>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <div className="desktop-nav" style={{ display:'flex', alignItems:'center', gap:'28px' }}>
            <Link to="/" className="nav-link" style={{ color:linkColor }}>Home</Link>

            {/* Destinations – click to stay */}
            <div ref={destRef} style={{ position:'relative' }}>
              <button
                className="nav-link"
                onClick={() => { setDestOpen(p => !p); setAboutOpen(false); }}
                style={{ color:linkColor, background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:'2px' }}
              >
                Destinations
                <span className={`nav-arrow${destOpen ? ' open' : ''}`}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </span>
              </button>
              {destOpen && (
                <div className="dropdown-menu dest-mega">
                  <div className="dest-section-title">🇮🇳 National — Resorts & Hotels</div>
                  <div className="dest-grid">
                    {nationalDests.map(d => (
                      <Link key={d.path} to={d.path} className="dropdown-item">{d.label}</Link>
                    ))}
                  </div>
                  <div className="dest-divider" />
                  <div className="dest-section-title">🌍 International</div>
                  <Link to="/destinations/international" className="dropdown-item">🌐 International Destinations</Link>
                </div>
              )}
            </div>

            <Link to="/packages" className="nav-link" style={{ color:linkColor }}>Packages</Link>

            {/* About Us – click to stay */}
            <div ref={aboutRef} style={{ position:'relative' }}>
              <button
                className="nav-link"
                onClick={() => { setAboutOpen(p => !p); setDestOpen(false); }}
                style={{ color:linkColor, background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:'2px' }}
              >
                About Us
                <span className={`nav-arrow${aboutOpen ? ' open' : ''}`}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </span>
              </button>
              {aboutOpen && (
                <div className="dropdown-menu">
                  {aboutLinks.map(a => (
                    <Link key={a.path} to={a.path} className="dropdown-item">{a.label}</Link>
                  ))}
                </div>
              )}
            </div>

            <Link to="/contact" className="nav-link" style={{ color:linkColor }}>Contact Us</Link>
          </div>

          {/* CTA + HAMBURGER */}
          <div style={{ display:'flex', alignItems:'center', gap:'14px' }}>
            <button
              onClick={onMemberClick}
              className="member-btn"
              style={{
                padding:'12px 26px',
                background:'linear-gradient(135deg,#f0a500,#ff6b6b)',
                color:'white', border:'none', borderRadius:'50px',
                cursor:'pointer', fontWeight:700, fontSize:'0.92rem',
                fontFamily:"'Poppins',sans-serif",
                transition:'all 0.3s ease', whiteSpace:'nowrap', letterSpacing:'0.3px'
              }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px) scale(1.04)'; e.currentTarget.style.animation='none'; }}
              onMouseLeave={e => { e.currentTarget.style.transform='translateY(0) scale(1)'; e.currentTarget.style.animation='memberGlow 2.5s ease-in-out infinite'; }}
            >
              ⭐ Become a Member
            </button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="hamburger"
              style={{ background:'none', border:'none', cursor:'pointer', padding:'8px' }}
            >
              {[0,1,2].map(i => (
                <div key={i} style={{
                  width:'26px', height:'2.5px', background:linkColor,
                  margin:'5px 0', borderRadius:'3px', transition:'all 0.3s ease',
                  transform: mobileOpen
                    ? (i===0 ? 'rotate(45deg) translateY(7.5px)' : i===2 ? 'rotate(-45deg) translateY(-7.5px)' : 'none')
                    : 'none',
                  opacity: mobileOpen && i===1 ? 0 : 1
                }} />
              ))}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="mobile-menu">
          <Link to="/" className="mobile-nav-item">🏠 Home</Link>
          <div className="mobile-section-title">Destinations (National)</div>
          {nationalDests.map(d => (
            <Link key={d.path} to={d.path} className="mobile-nav-item mobile-sub">{d.label}</Link>
          ))}
          <Link to="/destinations/international" className="mobile-nav-item">🌍 International</Link>
          <Link to="/packages" className="mobile-nav-item">📦 Packages</Link>
          <div className="mobile-section-title">About Us</div>
          {aboutLinks.map(a => (
            <Link key={a.path} to={a.path} className="mobile-nav-item mobile-sub">{a.label}</Link>
          ))}
          <Link to="/contact" className="mobile-nav-item">📞 Contact Us</Link>
          <div style={{ padding:'14px 16px 4px' }}>
            <button onClick={onMemberClick} style={{
              width:'100%', padding:'15px',
              background:'linear-gradient(135deg,#f0a500,#ff6b6b)',
              color:'white', border:'none', borderRadius:'50px',
              fontWeight:700, fontSize:'1rem', cursor:'pointer',
              boxShadow:'0 4px 20px rgba(240,165,0,0.4)'
            }}>⭐ Become a Member</button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
