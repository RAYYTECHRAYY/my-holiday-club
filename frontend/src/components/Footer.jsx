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
      `}</style>

      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px', marginBottom: '48px' }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div style={{
                width: '44px', height: '44px',
                background: 'rgba(0,119,200,0.2)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '2px solid rgba(0,119,200,0.4)'
              }}>
                <svg width="22" height="22" viewBox="0 0 100 100">
                  <polygon points="10,85 60,10 85,85" fill="#0077C8"/>
                  <g transform="translate(18,48) rotate(-30)" fill="white">
                    <ellipse cx="18" cy="8" rx="15" ry="5"/>
                    <polygon points="3,8 3,5 -3,6.5"/>
                  </g>
                </svg>
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
              {[
                { icon: '📘', label: 'f', url: 'https://facebook.com' },
                { icon: '📸', label: '📷', url: 'https://instagram.com' },
                { icon: '🐦', label: '𝕏', url: 'https://twitter.com' },
                { icon: '▶️', label: '▶', url: 'https://youtube.com' },
                { icon: '💼', label: 'in', url: 'https://linkedin.com' },
              ].map((s, i) => (
                <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="social-btn" title={s.icon}>
                  {['f', '📷', '𝕏', '▶', 'in'][i]}
                </a>
              ))}
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
              © 2024 My Holiday Club. All rights reserved. | CIN: U63090DL2010PTC123456
            </p>
            <div style={{ display: 'flex', gap: '20px' }}>
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
