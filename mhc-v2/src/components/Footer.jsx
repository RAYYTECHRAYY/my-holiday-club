import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer-top">
        {/* Brand */}
        <div className="footer-brand">
          <div className="footer-logo">
            <div className="footer-logo-box">
              <span>M</span><span className="gold">HC</span>
            </div>
            <div>
              <span className="footer-brand-name">My Holiday Club</span>
              <span className="footer-brand-sub">Exclusive Member Travel</span>
            </div>
          </div>
          <p className="footer-desc">India's premier luxury travel membership club, connecting discerning travellers with the world's finest destinations since 2012.</p>
          <div className="footer-socials">
            {['Instagram', 'Facebook', 'LinkedIn', 'YouTube', 'Twitter'].map((s, i) => (
              <a key={i} href="#" className="footer-social-btn" aria-label={s}>{s[0]}</a>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="footer-links-group">
          <h5>Explore</h5>
          <ul>
            <li><Link to="/destinations">All Destinations</Link></li>
            <li><Link to="/destinations">Beach Escapes</Link></li>
            <li><Link to="/destinations">Cultural Journeys</Link></li>
            <li><Link to="/destinations">Nature Retreats</Link></li>
            <li><Link to="/destinations">Luxury Getaways</Link></li>
          </ul>
        </div>

        <div className="footer-links-group">
          <h5>Membership</h5>
          <ul>
            <li><Link to="/packages">Silver Plan</Link></li>
            <li><Link to="/packages">Gold Plan</Link></li>
            <li><Link to="/packages">Platinum Plan</Link></li>
            <li><Link to="/packages">Compare Plans</Link></li>
            <li><Link to="/packages">Member Benefits</Link></li>
          </ul>
        </div>

        <div className="footer-links-group">
          <h5>Company</h5>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/about">Our Team</Link></li>
            <li><Link to="/about">Our Story</Link></li>
            <li><Link to="/contact">Careers</Link></li>
            <li><Link to="/contact">Press & Media</Link></li>
          </ul>
        </div>

        <div className="footer-links-group">
          <h5>Support</h5>
          <ul>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><a href="#">Help Centre</a></li>
            <li><a href="#">Terms & Conditions</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Refund Policy</a></li>
          </ul>
        </div>
      </div>

      {/* Awards */}
      <div className="footer-awards">
        {['🏆 Best Travel Club 2023', '⭐ 4.9/5 Member Rating', '🌍 100+ Destinations', '✈️ 50,000+ Members'].map((a, i) => (
          <span key={i} className="footer-award-badge">{a}</span>
        ))}
      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <p>© {year} My Holiday Club. All rights reserved.</p>
        <p>Made with ❤️ for travellers who refuse to settle for ordinary.</p>
      </div>
    </footer>
  );
}
