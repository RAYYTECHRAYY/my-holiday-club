import './DestinationCard.css';

export default function DestinationCard({ dest, index, onClick, isActive }) {
  const stars = Math.round(dest.rating);

  return (
    <div
      className={`dest-card ${isActive ? 'card-active' : ''}`}
      onClick={() => onClick(dest)}
      style={{ '--index': index }}
    >
      {/* Card image */}
      <div className="card-img-wrap">
        <img src={dest.cardImage} alt={dest.name} className="card-img" loading="lazy" />
        <div className="card-img-overlay" />
      </div>

      {/* Card body */}
      <div className="card-body">
        <div className="card-top">
          <div className="card-info">
            <span className="card-category">{dest.category}</span>
            <h4 className="card-name">{dest.name}</h4>
            <span className="card-country">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {dest.country}
            </span>
          </div>

          {/* Bookmark */}
          <button className="card-bookmark" onClick={e => e.stopPropagation()}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </button>
        </div>

        {/* Star rating */}
        <div className="card-rating">
          <div className="card-stars">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`star-dot ${i < stars ? 'filled' : ''}`}
              />
            ))}
          </div>
          <span className="card-rating-num">{dest.rating}</span>
        </div>

        {/* Bottom */}
        <div className="card-bottom">
          <div className="card-price">
            <span className="price-from">from</span>
            <span className="price-val">{dest.price}</span>
          </div>
          <span className="card-duration">{dest.duration}</span>
        </div>
      </div>
    </div>
  );
}
