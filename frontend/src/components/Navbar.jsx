import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../api';

const Navbar = ({ onMemberClick, loggedInMember, onLogout }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [destOpen, setDestOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [payOpen, setPayOpen] = useState(false);
  const [paySettings, setPaySettings] = useState({ googlePayQR: '', googlePayUPI: '', googleReviewsLink: '', googleReviewsRating: '4.8', showPayNow: true });
  const location = useLocation();
  const navigate = useNavigate();
  const destRef = useRef(null);
  const aboutRef = useRef(null);

  useEffect(() => {
    api.get('/api/payment-settings').then(r => {
      if (r.data.success) setPaySettings(r.data.data);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setMobileOpen(false); setDestOpen(false); setAboutOpen(false); }, [location]);

  useEffect(() => {
    const fn = (e) => {
      if (destRef.current && !destRef.current.contains(e.target)) setDestOpen(false);
      if (aboutRef.current && !aboutRef.current.contains(e.target)) setAboutOpen(false);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const nationalDests = [
    { label: '🏔️ North India', path: '/destinations/north-india' },
    { label: '🍵 East India',  path: '/destinations/east-india' },
    { label: '🏖️ West India',  path: '/destinations/west-india' },
    { label: '🌴 South India', path: '/destinations/south-india' },
  ];
  const aboutLinks = [
    { label: '📋 Overview',          path: '/about/overview' },
    { label: '🌟 Our Philosophy',    path: '/about/philosophy' },
    { label: "👤 Founder's Message", path: '/about/founders-message' },
    { label: "📰 What's News",       path: '/about/whats-news' },
    { label: '📢 Press Release',     path: '/about/press-release' },
    { label: '💼 Careers',           path: '/about/careers' },
  ];

  const linkColor = scrolled ? '#1a1a2e' : 'white';

  const reviewsCount = (parseFloat(paySettings.googleReviewsRating) || 4.8);
  const stars = '★'.repeat(Math.round(reviewsCount)) + '☆'.repeat(5 - Math.round(reviewsCount));

  return (
    <>
      <style>{`
        * { font-family: 'Inter', sans-serif !important; }

        /* TOP BAR */
        .top-bar {
          background: linear-gradient(90deg, #003d7a 0%, #0055a0 50%, #003d7a 100%);
          color: white;
          font-size: 0.88rem;
          font-weight: 600;
          position: fixed; top: 0; left: 0; right: 0;
          z-index: 901;
          display: flex; align-items: center; justify-content: space-between;
          padding: 8px 32px;
          letter-spacing: 0.2px;
        }
        .top-bar-reviews {
          display: flex; align-items: center; gap: 8px;
          text-decoration: none; color: white;
          transition: opacity 0.2s;
        }
        .top-bar-reviews:hover { opacity: 0.82; }
        .top-bar-stars { color: #f0a500; font-size: 1rem; letter-spacing: 1px; }
        .top-bar-right { display: flex; align-items: center; gap: 14px; }
        .pay-now-btn {
          display: flex; align-items: center; gap: 7px;
          background: linear-gradient(135deg, #f0a500, #ff8c00);
          color: white; border: none; border-radius: 50px;
          padding: 6px 18px; font-size: 0.86rem; font-weight: 700;
          cursor: pointer; transition: all 0.25s ease;
          box-shadow: 0 2px 10px rgba(240,165,0,0.40);
          font-family: 'Inter', sans-serif;
          letter-spacing: 0.3px;
          white-space: nowrap;
        }
        .pay-now-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(240,165,0,0.55); }

        /* MAIN NAV */
        .nav-link {
          font-family: 'Inter', sans-serif !important;
          font-size: 1.05rem; font-weight: 700;
          text-decoration: none; padding: 10px 6px;
          position: relative; transition: color 0.3s ease;
          white-space: nowrap; letter-spacing: 0.2px;
        }
        .nav-link::after {
          content: ''; position: absolute; bottom: 0; left: 0;
          width: 0; height: 3px;
          background: linear-gradient(90deg, #0077C8, #f0a500);
          border-radius: 2px; transition: width 0.3s ease;
        }
        .nav-link:hover::after { width: 100%; }

        .nav-arrow {
          display: inline-block; width: 18px; height: 18px;
          margin-left: 3px; vertical-align: middle;
          transition: transform 0.3s ease;
        }
        .nav-arrow.open { transform: rotate(180deg); }

        .dropdown-menu {
          position: absolute; top: calc(100% + 10px); left: 50%;
          transform: translateX(-50%);
          background: white; border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.14);
          padding: 8px; min-width: 230px;
          border: 1px solid rgba(0,119,200,0.09);
          animation: dropdownIn 0.22s cubic-bezier(0.34,1.56,0.64,1);
          z-index: 999;
        }
        @keyframes dropdownIn {
          from { opacity:0; transform:translateX(-50%) translateY(-10px) scale(0.96); }
          to   { opacity:1; transform:translateX(-50%) translateY(0) scale(1); }
        }
        .dropdown-item {
          display: block; padding: 10px 16px; color: #1a1a2e;
          text-decoration: none; border-radius: 10px;
          font-size: 0.95rem; font-weight: 600;
          font-family: 'Inter', sans-serif;
          transition: all 0.2s ease;
        }
        .dropdown-item:hover { background: #e8f4ff; color: #0077C8; padding-left: 22px; }

        .dest-mega { min-width: 480px; padding: 16px; }
        .dest-section-title {
          font-size: 0.75rem; font-weight: 800;
          text-transform: uppercase; letter-spacing: 1.5px;
          padding: 6px 16px; color: #0077C8;
        }
        .dest-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 3px; }
        .dest-divider { height: 2px; margin: 8px 16px; background: linear-gradient(90deg,#0077C8,#f0a500); border-radius: 2px; opacity: 0.25; }

        /* PAY MODAL */
        .pay-modal-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.65); backdrop-filter: blur(6px);
          z-index: 1200; display: flex; align-items: center; justify-content: center;
          animation: modalOverlayIn 0.2s ease;
        }
        @keyframes modalOverlayIn { from{opacity:0} to{opacity:1} }
        .pay-modal {
          background: white; border-radius: 24px;
          padding: 40px 36px; max-width: 400px; width: 100%;
          text-align: center; position: relative;
          box-shadow: 0 30px 80px rgba(0,0,0,0.22);
          animation: payModalIn 0.3s cubic-bezier(0.34,1.56,0.64,1);
        }
        @keyframes payModalIn { from{opacity:0;transform:scale(0.88) translateY(30px)} to{opacity:1;transform:scale(1) translateY(0)} }
        .pay-modal h2 {
          font-family: 'Inter', sans-serif;
          font-size: 1.5rem; font-weight: 800; color: #1a1a2e; margin-bottom: 6px;
        }
        .pay-modal p { color: #6b7280; font-size: 0.95rem; margin-bottom: 24px; }
        .pay-qr-box {
          background: linear-gradient(135deg, #e8f4ff, #fff8e6);
          border-radius: 16px; padding: 20px;
          border: 2px dashed rgba(0,119,200,0.25);
          margin-bottom: 20px;
        }
        .pay-qr-box img { width: 180px; height: 180px; object-fit: contain; border-radius: 8px; }
        .pay-qr-placeholder {
          width: 180px; height: 180px; margin: 0 auto;
          background: linear-gradient(135deg, #f0f4ff, #fff8e6);
          border-radius: 12px; display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 8px;
          border: 2px solid rgba(0,119,200,0.20);
        }
        .pay-upi {
          background: #f8faff; border-radius: 10px;
          padding: 10px 18px; font-size: 0.95rem; font-weight: 700;
          color: #0077C8; border: 1px solid rgba(0,119,200,0.20);
          letter-spacing: 0.5px;
        }
        .pay-modal-close {
          position: absolute; top: 14px; right: 14px;
          background: #f1f5f9; border: none; border-radius: 50%;
          width: 34px; height: 34px; cursor: pointer; font-size: 1rem;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s; color: #6b7280;
        }
        .pay-modal-close:hover { background: #fee2e2; color: #ef4444; transform: rotate(90deg); }

        /* MOBILE */
        .mobile-menu {
          background: white; padding: 14px;
          border-top: 3px solid;
          border-image: linear-gradient(90deg,#0077C8,#f0a500) 1;
          max-height: 70vh; overflow-y: auto;
          box-shadow: 0 16px 36px rgba(0,0,0,0.10);
        }
        .mobile-nav-item {
          display: block; padding: 12px 16px; color: #1a1a2e;
          text-decoration: none; border-radius: 10px;
          font-weight: 700; font-size: 0.96rem;
          font-family: 'Inter', sans-serif;
          transition: all 0.2s; margin-bottom: 3px;
        }
        .mobile-nav-item:hover { background: #e8f4ff; color: #0077C8; }
        .mobile-section-title {
          padding: 8px 16px 4px; font-size: 0.74rem; font-weight: 800;
          color: #0077C8; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 6px;
        }
        .mobile-sub { padding-left: 28px !important; font-weight: 600 !important; font-size: 0.88rem !important; }

        .member-btn { animation: memberGlow 2.5s ease-in-out infinite; }
        .member-login-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 10px 20px;
          background: transparent;
          color: white;
          border: 2px solid rgba(255,255,255,0.5);
          border-radius: 50px;
          font-size: 0.9rem; font-weight: 700;
          cursor: pointer; font-family: 'Inter', sans-serif;
          transition: all 0.25s ease; text-decoration: none; white-space: nowrap;
        }
        .member-login-btn:hover { background: rgba(255,255,255,0.15); border-color: white; }
        .member-login-btn.scrolled { color: #0077C8 !important; border-color: #0077C8 !important; }
        .member-login-btn.scrolled:hover { background: #e8f4ff !important; }
        .member-avatar {
          width: 34px; height: 34px; border-radius: 50%;
          background: linear-gradient(135deg,#0077C8,#005a96);
          color: white; display: flex; align-items: center; justify-content: center;
          font-weight: 800; font-size: 0.95rem; flex-shrink: 0;
          border: 2px solid rgba(255,255,255,0.4);
        }
        @keyframes memberGlow {
          0%,100% { box-shadow:0 4px 18px rgba(240,165,0,0.35); }
          50%      { box-shadow:0 4px 28px rgba(240,165,0,0.65),0 0 0 5px rgba(240,165,0,0.10); }
        }
        .hamburger { display: none; }
        @media (max-width: 1024px) {
          .desktop-nav        { display: none !important; }
          .hamburger          { display: block !important; }
          .member-cta-desktop { display: none !important; }
          .top-bar { padding: 7px 16px; font-size: 0.80rem; }
          .top-bar-left-text { display: none; }
        }
        @media (max-width: 480px) {
          .top-bar { padding: 5px 12px; font-size: 0.75rem; }
          .pay-now-btn { padding: 4px 10px !important; font-size: 0.74rem !important; gap: 4px !important; }
          .top-bar-stars { font-size: 0.85rem; }
          .mobile-menu { max-height: 80vh; padding: 10px 8px; }
          .mobile-nav-item { padding: 11px 14px; font-size: 0.9rem; }
          .nav-logo-text { font-size: 1rem !important; }
          .nav-logo-sub  { display: none; }
        }
      `}</style>

      {/* ===== TOP BAR ===== */}
      <div className="top-bar">
        {/* Google Reviews */}
        <a
          href={paySettings.googleReviewsLink || '#'}
          target="_blank" rel="noopener noreferrer"
          className="top-bar-reviews"
        >
          <span style={{ fontSize: '1rem' }}>🏆</span>
          <span className="top-bar-stars">{stars}</span>
          <span><strong>{paySettings.googleReviewsRating || '4.8'}</strong> on Google Reviews</span>
          <span style={{ opacity: 0.70, fontSize: '0.80rem' }}>↗</span>
        </a>

        {/* Right side */}
        <div className="top-bar-right">
          <span className="top-bar-left-text" style={{ opacity: 0.70, fontSize: '0.82rem' }}>
            ✆ &nbsp;{'+91 98765 43210'}
          </span>
          {paySettings.showPayNow !== false && (
            <button className="pay-now-btn" onClick={() => setPayOpen(true)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                <line x1="1" y1="10" x2="23" y2="10"/>
              </svg>
              Pay Now
            </button>
          )}
        </div>
      </div>

      {/* ===== MAIN NAVBAR (shifted down by top-bar height ~38px) ===== */}
      <nav style={{
        position: 'fixed', top: '38px', left: 0, right: 0, zIndex: 900,
        background: scrolled ? 'rgba(255,255,255,0.97)' : 'transparent',
        backdropFilter: scrolled ? 'blur(18px)' : 'none',
        boxShadow: scrolled ? '0 4px 24px rgba(0,119,200,0.12)' : 'none',
        transition: 'all 0.35s ease',
        borderBottom: scrolled ? '2px solid rgba(0,119,200,0.10)' : 'none',
      }}>
        <div className="container">
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', height:'80px' }}>

            {/* LOGO */}
            <Link to="/" style={{ display:'flex', alignItems:'center', gap:'10px', textDecoration:'none', flexShrink:0 }}>
              <div style={{
                width:'52px', height:'52px', borderRadius:'12px', overflow:'hidden', flexShrink:0,
                boxShadow: scrolled ? '0 4px 16px rgba(0,119,200,0.30)' : '0 2px 10px rgba(0,0,0,0.18)',
                border: scrolled ? '2px solid rgba(0,119,200,0.12)' : '2px solid rgba(255,255,255,0.30)',
                transition:'all 0.3s ease',
              }}>
                <img src="/logo.png" alt="My Holiday Club" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
              </div>
              <div>
                <div style={{
                  fontFamily:"'Inter',sans-serif",
                  fontSize:'1.18rem', fontWeight:800,
                  color: scrolled ? '#1a1a2e' : 'white',
                  lineHeight:1.1, transition:'color 0.3s ease',
                }}>My Holiday Club</div>
                <div style={{
                  fontSize:'0.60rem',
                  color: scrolled ? '#0077C8' : 'rgba(255,255,255,0.80)',
                  letterSpacing:'2px', textTransform:'uppercase',
                  fontWeight:700, transition:'color 0.3s ease',
                }}>Travel Made Easier</div>
              </div>
            </Link>

            {/* DESKTOP NAV */}
            <div className="desktop-nav" style={{ display:'flex', alignItems:'center', gap:'24px' }}>
              <Link to="/" className="nav-link" style={{ color:linkColor }}>Home</Link>

              <div ref={destRef} style={{ position:'relative' }}>
                <button className="nav-link" onClick={() => { setDestOpen(p=>!p); setAboutOpen(false); }}
                  style={{ color:linkColor, background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:'2px' }}>
                  Destinations
                  <span className={`nav-arrow${destOpen?' open':''}`}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                  </span>
                </button>
                {destOpen && (
                  <div className="dropdown-menu dest-mega">
                    <div className="dest-section-title">🇮🇳 National — Resorts & Hotels</div>
                    <div className="dest-grid">
                      {nationalDests.map(d => <Link key={d.path} to={d.path} className="dropdown-item">{d.label}</Link>)}
                    </div>
                    <div className="dest-divider"/>
                    <div className="dest-section-title">🌍 International</div>
                    <Link to="/destinations/international" className="dropdown-item">🌐 International Destinations</Link>
                  </div>
                )}
              </div>

              <Link to="/packages" className="nav-link" style={{ color:linkColor }}>Packages</Link>

              <div ref={aboutRef} style={{ position:'relative' }}>
                <button className="nav-link" onClick={() => { setAboutOpen(p=>!p); setDestOpen(false); }}
                  style={{ color:linkColor, background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:'2px' }}>
                  About Us
                  <span className={`nav-arrow${aboutOpen?' open':''}`}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                  </span>
                </button>
                {aboutOpen && (
                  <div className="dropdown-menu">
                    {aboutLinks.map(a => <Link key={a.path} to={a.path} className="dropdown-item">{a.label}</Link>)}
                  </div>
                )}
              </div>

              <Link to="/contact" className="nav-link" style={{ color:linkColor }}>Contact Us</Link>
            </div>

            {/* CTA + HAMBURGER */}
            <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
              {loggedInMember ? (
                <div className="member-cta-desktop" style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                  <div className="member-avatar">{loggedInMember.fullName?.charAt(0) || '?'}</div>
                  <div style={{ display:'flex', flexDirection:'column' }}>
                    <span style={{ color:scrolled?'#1a1a2e':'white', fontSize:'0.82rem', fontWeight:700 }}>{loggedInMember.fullName?.split(' ')[0]}</span>
                    <span style={{ color:scrolled?'#0077C8':'rgba(255,255,255,0.7)', fontSize:'0.72rem' }}>Member</span>
                  </div>
                  <Link to="/members/dashboard" style={{ padding:'8px 16px', background:'linear-gradient(135deg,#0077C8,#005a96)', color:'white', borderRadius:'50px', textDecoration:'none', fontSize:'0.82rem', fontWeight:700, whiteSpace:'nowrap' }}>Dashboard</Link>
                </div>
              ) : (
                <>
                  <Link to="/members/login" className={'member-login-btn member-cta-desktop'+(scrolled?' scrolled':'')} style={{ color:scrolled?'#0077C8':'white', borderColor:scrolled?'#0077C8':'rgba(255,255,255,0.5)' }}>
                    🔐 Member Login
                  </Link>
                  <button onClick={onMemberClick} className="member-btn member-cta-desktop" style={{
                    padding:'11px 24px',
                    background:'linear-gradient(135deg,#f0a500,#ff8c00)',
                    color:'white', border:'none', borderRadius:'50px',
                    cursor:'pointer', fontWeight:800, fontSize:'0.92rem',
                    fontFamily:"'Inter',sans-serif",
                    transition:'all 0.3s ease', whiteSpace:'nowrap',
                  }}
                    onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-3px) scale(1.04)';e.currentTarget.style.animation='none';}}
                    onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.animation='memberGlow 2.5s ease-in-out infinite';}}>
                    ⭐ Become a Member
                  </button>
                </>
              )}

              <button onClick={() => setMobileOpen(!mobileOpen)} className="hamburger"
                style={{ background:'none', border:'none', cursor:'pointer', padding:'8px' }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{
                    width:'24px', height:'2.5px', background:linkColor,
                    margin:'5px 0', borderRadius:'3px', transition:'all 0.3s ease',
                    transform: mobileOpen ? (i===0?'rotate(45deg) translateY(7.5px)':i===2?'rotate(-45deg) translateY(-7.5px)':'none') : 'none',
                    opacity: mobileOpen && i===1 ? 0 : 1
                  }}/>
                ))}
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE MENU */}
        {mobileOpen && (
          <div className="mobile-menu">
            <Link to="/" className="mobile-nav-item">🏠 Home</Link>
            <div className="mobile-section-title">Destinations</div>
            {nationalDests.map(d => <Link key={d.path} to={d.path} className="mobile-nav-item mobile-sub">{d.label}</Link>)}
            <Link to="/destinations/international" className="mobile-nav-item">🌍 International</Link>
            <Link to="/packages" className="mobile-nav-item">📦 Packages</Link>
            <div className="mobile-section-title">About Us</div>
            {aboutLinks.map(a => <Link key={a.path} to={a.path} className="mobile-nav-item mobile-sub">{a.label}</Link>)}
            <Link to="/contact" className="mobile-nav-item">📞 Contact Us</Link>
            {paySettings.showPayNow !== false && (
              <button onClick={() => { setPayOpen(true); setMobileOpen(false); }} style={{
                width:'100%', padding:'13px',
                background:'linear-gradient(135deg,#f0a500,#ff8c00)',
                color:'white', border:'none', borderRadius:'50px',
                fontWeight:800, fontSize:'0.96rem', cursor:'pointer',
                margin:'10px 0 4px', fontFamily:"'Inter',sans-serif",
              }}>💳 Pay Now</button>
            )}
            {loggedInMember ? (
              <>
                <Link to="/members/dashboard" className="mobile-nav-item" style={{ background:'#e8f4ff', color:'#0077C8', fontWeight:700 }}>
                  👤 {loggedInMember.fullName?.split(' ')[0]}'s Dashboard
                </Link>
                <button onClick={() => { setMobileOpen(false); onLogout && onLogout(); navigate('/'); }} style={{ width:'100%', padding:'13px', background:'#fef2f2', color:'#ef4444', border:'2px solid #ef4444', borderRadius:'50px', fontWeight:700, fontSize:'0.92rem', cursor:'pointer', margin:'6px 0', fontFamily:"'Inter',sans-serif" }}>Sign Out</button>
              </>
            ) : (
              <>
                <Link to="/members/login" className="mobile-nav-item" style={{ background:'#e8f4ff', color:'#0077C8' }}>🔐 Member Login</Link>
                <button onClick={onMemberClick} style={{ width:'100%', padding:'13px', background:'linear-gradient(135deg,#0077C8,#0095f0)', color:'white', border:'none', borderRadius:'50px', fontWeight:800, fontSize:'0.96rem', cursor:'pointer', margin:'6px 0', fontFamily:"'Inter',sans-serif" }}>⭐ Become a Member</button>
              </>
            )}
          </div>
        )}
      </nav>

      {/* ===== PAY NOW MODAL ===== */}
      {payOpen && (
        <div className="pay-modal-overlay" onClick={() => setPayOpen(false)}>
          <div className="pay-modal" onClick={e => e.stopPropagation()}>
            <button className="pay-modal-close" onClick={() => setPayOpen(false)}>✕</button>
            <div style={{ fontSize:'2.2rem', marginBottom:'10px' }}>💳</div>
            <h2>Pay Now</h2>
            <p>Scan the QR code using any UPI app to pay securely</p>

            <div className="pay-qr-box">
              {paySettings.googlePayQR ? (
                <img src={paySettings.googlePayQR} alt="Google Pay QR" />
              ) : (
                <div className="pay-qr-placeholder">
                  <div style={{ fontSize:'2.5rem' }}>📱</div>
                  <div style={{ fontSize:'0.85rem', color:'#6b7280', fontWeight:600 }}>QR Code</div>
                  <div style={{ fontSize:'0.78rem', color:'#9ca3af' }}>Upload via Admin Panel</div>
                </div>
              )}
            </div>

            {paySettings.googlePayUPI && (
              <div style={{ marginBottom:'16px' }}>
                <div style={{ fontSize:'0.80rem', color:'#6b7280', marginBottom:'6px', fontWeight:600 }}>UPI ID</div>
                <div className="pay-upi">{paySettings.googlePayUPI}</div>
              </div>
            )}

            <div style={{ display:'flex', gap:'10px', justifyContent:'center', marginTop:'8px' }}>
              {['Google Pay', 'PhonePe', 'Paytm'].map(app => (
                <div key={app} style={{
                  padding:'6px 14px', background:'#f0f4ff', borderRadius:'50px',
                  fontSize:'0.80rem', fontWeight:700, color:'#0077C8',
                  border:'1px solid rgba(0,119,200,0.18)',
                }}>✓ {app}</div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
