import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled]   = useState(false);
  const location = useLocation();
  const isHome   = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  return (
    <nav className={`navbar ${scrolled || !isHome ? 'navbar-solid' : ''}`}>
      {/* Logo */}
      <NavLink to="/" className="nav-logo">
        <div className="nav-logo-box">
          <div className="nav-logo-fallback">
            <span>M</span><span className="gold">HC</span>
          </div>
        </div>
        <div className="nav-logo-text">
          <span className="nav-brand">My Holiday Club</span>
          <span className="nav-sub">Exclusive Member Travel</span>
        </div>
      </NavLink>

      {/* Links */}
      <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
        {[
          { to: '/',            label: 'Home' },
          { to: '/destinations',label: 'Destinations' },
          { to: '/packages',    label: 'Packages' },
          { to: '/about',       label: 'About Us' },
          { to: '/contact',     label: 'Contact' },
        ].map(({ to, label }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Right */}
      <div className="nav-right">
        <button className="nav-search" aria-label="Search">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </button>
        <NavLink to="/packages" className="nav-cta">Join Now</NavLink>
        <button className={`nav-hamburger ${menuOpen ? 'is-open' : ''}`} onClick={() => setMenuOpen(v => !v)}>
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}
