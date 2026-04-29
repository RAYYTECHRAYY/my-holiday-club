import React from 'react';
import { Link } from 'react-router-dom';

const Footer = ({ onMemberClick }) => {
  return (
    <footer style={{
      background: 'linear-gradient(135deg, #0a1628 0%, #1a1a2e 100%)',
      color: 'white',
      paddingTop: '64px'
    }}>
      <style>{`
        .footer-link {
          color: rgba(255,255,255,0.65);
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.2s;
          display: block;
          margin-bottom: 10px;
        }
        .footer-link:hover { color: #f0a500; }
        .social-btn {
          width: 42px; height: 42px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          text-decoration: none;
          font-size: 1.1rem;
          transition: all 0.3s ease;
          border: 1px solid rgba(255,255,255,0.15);
          color: white;
        }
        .social-btn:hover {
          transform: translateY(-4px);
          border-color: #f0a500;
          color: #f0a500;
          background: rgba(240,165,0,0.1);
        }
        .footer-title {
          font-size: 1rem;
          font-weight: 700;
          color: white;
          margin-bottom: 20px;
          position: relative;
          padding-bottom: 10px;
        }
        .footer-title::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0;
          width: 40px; height: 2px;
          background: linear-gradient(90deg, #f0a500, #0077C8);
          border-radius: 2px;
        }
        .footer-bottom-flex {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        }
        .footer-bottom-links { display: flex; gap: 20px; }
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 24px !important; }
          .footer-bottom-flex { flex-direction: column !important; text-align: center !important; }
          .footer-bottom-links { justify-content: center !important; flex-wrap: wrap !important; gap: 12px !important; }
        }
        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }

      `}</style>

      <div className="container">
        <div className='footer-grid' style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px', marginBottom: '48px' }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div style={{
                width: '52px', height: '52px',
                borderRadius: '12px', overflow: 'hidden', flexShrink: 0,
                boxShadow: '0 4px 16px rgba(0,119,200,0.30)',
                border: '2px solid rgba(0,119,200,0.25)'
              }}>
                <img src="/logo.png" alt="My Holiday Club" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
              <div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>My Holiday Club</div>
                <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '2px', textTransform: 'uppercase' }}>Travel Made Easier</div>
              </div>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '24px' }}>
              India's premier holiday membership club offering exclusive access to 200+ luxury resorts across India and abroad.
            </p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {/* Facebook */}
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-btn" title="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              {/* Instagram */}
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-btn" title="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4.5"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                </svg>
              </a>
              {/* X / Twitter */}
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-btn" title="X (Twitter)">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              {/* YouTube */}
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-btn" title="YouTube">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/></svg>
              </a>
              {/* LinkedIn */}
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-btn" title="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
            </div>
          </div>

          {/* Destinations */}
          <div>
            <div className="footer-title">Destinations</div>
            <Link to="/destinations/north-india" className="footer-link">North India</Link>
            <Link to="/destinations/east-india" className="footer-link">East India</Link>
            <Link to="/destinations/west-india" className="footer-link">West India</Link>
            <Link to="/destinations/south-india" className="footer-link">South India</Link>
            <Link to="/destinations/international" className="footer-link">International</Link>
          </div>

          {/* Company */}
          <div>
            <div className="footer-title">Company</div>
            <Link to="/about/overview" className="footer-link">About Us</Link>
            <Link to="/about/philosophy" className="footer-link">Our Philosophy</Link>
            <Link to="/about/founders-message" className="footer-link">Founder's Message</Link>
            <Link to="/about/whats-news" className="footer-link">What's News</Link>
            <Link to="/about/press-release" className="footer-link">Press Release</Link>
            <Link to="/about/careers" className="footer-link">Careers</Link>
          </div>

          {/* Contact */}
          <div>
            <div className="footer-title">Get In Touch</div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', lineHeight: 1.8, marginBottom: '8px' }}>
              📍 123 Travel House, Connaught Place<br />New Delhi - 110001
            </p>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginBottom: '6px' }}>📞 +91 98765 43210</p>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginBottom: '6px' }}>✉️ info@myholidayclub.co.in</p>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginBottom: '20px' }}>💬 WhatsApp: +91 98765 43210</p>
            <button
              onClick={onMemberClick}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #f0a500, #d4920a)',
                color: 'white', border: 'none', borderRadius: '50px',
                fontWeight: 700, fontSize: '0.9rem',
                cursor: 'pointer', width: '100%',
                transition: 'all 0.3s ease'
              }}
            >
              ⭐ Become a Member
            </button>
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '24px', paddingBottom: '32px' }}>
          <div className='footer-bottom-flex'>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
              © 2024 My Holiday Club. All rights reserved. | CIN: U63090DL2010PTC123456
            </p>
            <div className='footer-bottom-links'>
              {['Privacy Policy', 'Terms of Service', 'Refund Policy'].map(t => (
                <a key={t} href="#" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = '#f0a500'}
                  onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.4)'}
                >{t}</a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
