import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { destinations } from '../data/destinations';
import './Destinations.css';

const CATEGORIES = ['All', 'Cultural', 'Beach', 'Nature', 'Luxury'];

export default function Destinations() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    return destinations.filter(d => {
      const matchCat = activeCategory === 'All' || d.category === activeCategory;
      const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
                          d.country.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeCategory, search]);

  return (
    <div className="destinations-page">
      {/* Hero */}
      <div className="page-hero">
        <div className="page-hero-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=1920&q=80')" }} />
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <div className="page-hero-eyebrow">Explore</div>
          <h1>Our Destinations</h1>
          <p>Handpicked luxury getaways across the world's most breathtaking locations, exclusively for members.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="dest-filters section-sm">
        <div className="dest-search-wrap">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            className="dest-search form-input"
            placeholder="Search destinations or countries…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="dest-categories">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`cat-btn ${activeCategory === cat ? 'cat-active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <p className="dest-count">{filtered.length} destination{filtered.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Grid */}
      <div className="dest-grid section">
        {filtered.length === 0 ? (
          <div className="dest-empty">
            <span>🌍</span>
            <p>No destinations match your search.</p>
            <button className="btn-ghost" onClick={() => { setSearch(''); setActiveCategory('All'); }}>
              Clear Filters
            </button>
          </div>
        ) : (
          filtered.map((d, i) => (
            <div
              key={d.id}
              className="dest-card-full glass-card"
              style={{ '--i': i }}
              onClick={() => navigate(`/destinations/${d.id}`)}
            >
              <div className="dcf-img-wrap">
                <img src={d.image} alt={d.name} className="dcf-img" loading="lazy" />
                <div className="dcf-img-overlay" />
                <span className="dcf-category">{d.category}</span>
                <button className="dcf-bookmark" onClick={e => e.stopPropagation()}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                  </svg>
                </button>
              </div>
              <div className="dcf-body">
                <div className="dcf-country">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  {d.country}
                </div>
                <h3 className="dcf-name">{d.name}</h3>
                <p className="dcf-tagline">{d.tagline}</p>
                <p className="dcf-desc">{d.description}</p>
                <div className="dcf-highlights">
                  {d.highlights.slice(0, 3).map((h, j) => (
                    <span key={j} className="dcf-tag">✦ {h}</span>
                  ))}
                </div>
                <div className="dcf-footer">
                  <div className="dcf-price">
                    <span className="dcf-from">from</span>
                    <span className="dcf-price-val">{d.price}</span>
                    <span className="dcf-duration">· {d.duration}</span>
                  </div>
                  <div className="dcf-rating">
                    ⭐ <strong>{d.rating}</strong>
                    <span>({d.reviews.toLocaleString()})</span>
                  </div>
                </div>
                <button className="btn-primary dcf-cta">
                  View Details
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
