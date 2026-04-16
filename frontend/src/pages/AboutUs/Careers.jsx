import React, { useState } from 'react';

const jobs = [
  { title: 'Senior Sales Manager', dept: 'Sales', location: 'New Delhi', type: 'Full-time', exp: '5-8 years' },
  { title: 'Digital Marketing Executive', dept: 'Marketing', location: 'Mumbai', type: 'Full-time', exp: '2-4 years' },
  { title: 'Resort Relationship Manager', dept: 'Operations', location: 'Goa', type: 'Full-time', exp: '3-5 years' },
  { title: 'Customer Experience Specialist', dept: 'CX', location: 'Bangalore', type: 'Full-time', exp: '1-3 years' },
  { title: 'Travel Consultant', dept: 'Sales', location: 'Hyderabad', type: 'Full-time', exp: '2-4 years' },
  { title: 'UI/UX Designer', dept: 'Technology', location: 'Remote', type: 'Full-time', exp: '3-5 years' },
];

const Careers = () => {
  const [applyJob, setApplyJob] = useState(null);
  const [applied, setApplied] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', experience: '', message: '' });

  const handleApply = (e) => {
    e.preventDefault();
    setTimeout(() => { setApplied(true); }, 1000);
  };

  return (
    <div>
      <div style={{ padding: '140px 0 80px', background: 'linear-gradient(135deg, #0077C8, #003d6b)', color: 'white', textAlign: 'center' }}>
        <div className="container">
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.5rem,5vw,4rem)', marginBottom: '16px' }}>Careers at MHC</h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.85, maxWidth: '600px', margin: '0 auto' }}>Join a team passionate about making travel dreams come true</p>
        </div>
      </div>

      <div style={{ padding: '80px 0' }}>
        <div className="container">
          {/* Culture */}
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div className="badge" style={{ marginBottom: '16px' }}>Why Work With Us</div>
            <h2 className="section-title">Life at My Holiday Club</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '64px' }}>
            {[
              { icon: '✈️', title: 'Travel Perks', desc: 'Annual travel allowance and discounted stays at all MHC properties' },
              { icon: '📈', title: 'Growth Culture', desc: 'Clear career paths, mentorship, and continuous learning programs' },
              { icon: '🎉', title: 'Fun Workplace', desc: 'Regular team outings, celebrations, and a vibrant work culture' },
              { icon: '💰', title: 'Competitive Pay', desc: 'Industry-leading compensation with performance bonuses' },
            ].map((b, i) => (
              <div key={i} style={{ padding: '28px', background: '#f8fafc', borderRadius: '16px', textAlign: 'center', border: '1px solid #e8f4ff', transition: 'all 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#0077C8'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e8f4ff'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{b.icon}</div>
                <h4 style={{ fontFamily: "'Playfair Display', serif", color: '#1a1a2e', marginBottom: '8px' }}>{b.title}</h4>
                <p style={{ color: '#6b7280', fontSize: '0.85rem', lineHeight: 1.6 }}>{b.desc}</p>
              </div>
            ))}
          </div>

          {/* Jobs */}
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: '#1a1a2e', marginBottom: '32px' }}>Open Positions</h2>
          <div style={{ display: 'grid', gap: '16px' }}>
            {jobs.map((job, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '24px 28px', background: 'white', borderRadius: '14px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.06)', border: '1px solid #e8f4ff',
                transition: 'all 0.3s', flexWrap: 'wrap', gap: '16px'
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#0077C8'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,119,200,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e8f4ff'; e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.06)'; }}
              >
                <div>
                  <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', color: '#1a1a2e', marginBottom: '6px' }}>{job.title}</h4>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    {[
                      { label: job.dept, color: '#0077C8' },
                      { label: `📍 ${job.location}`, color: '#4b5563' },
                      { label: job.type, color: '#10b981' },
                      { label: `${job.exp} exp`, color: '#f0a500' },
                    ].map((tag, j) => (
                      <span key={j} style={{ fontSize: '0.8rem', color: tag.color, fontWeight: 500 }}>{tag.label}</span>
                    ))}
                  </div>
                </div>
                <button onClick={() => { setApplyJob(job); setApplied(false); }} style={{
                  padding: '10px 24px',
                  background: 'linear-gradient(135deg, #0077C8, #005a96)',
                  color: 'white', border: 'none', borderRadius: '50px',
                  cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem',
                  fontFamily: "'Poppins', sans-serif", transition: 'all 0.3s'
                }}>Apply Now</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {applyJob && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setApplyJob(null)}>
          <div className="modal-box">
            <button className="modal-close" onClick={() => setApplyJob(null)}>✕</button>
            {!applied ? (
              <>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.6rem', color: '#1a1a2e', marginBottom: '4px' }}>Apply: {applyJob.title}</h2>
                <p style={{ color: '#6b7280', marginBottom: '24px' }}>📍 {applyJob.location} • {applyJob.dept}</p>
                <form onSubmit={handleApply}>
                  <div className="form-row">
                    <div className="form-group"><label>Full Name *</label><input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Your name" required /></div>
                    <div className="form-group"><label>Phone *</label><input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="Mobile number" required /></div>
                  </div>
                  <div className="form-group"><label>Email *</label><input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="your@email.com" required /></div>
                  <div className="form-group"><label>Years of Experience</label><input value={form.experience} onChange={e => setForm(p => ({ ...p, experience: e.target.value }))} placeholder="e.g. 3 years" /></div>
                  <div className="form-group"><label>Cover Letter</label><textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} placeholder="Tell us why you'd be a great fit..." rows={4} /></div>
                  <button type="submit" style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #0077C8, #005a96)', color: 'white', border: 'none', borderRadius: '50px', fontWeight: 700, cursor: 'pointer', fontSize: '1rem' }}>
                    Submit Application
                  </button>
                </form>
              </>
            ) : (
              <div className="success-animation">
                <div className="checkmark">✓</div>
                <h3>Application Submitted!</h3>
                <p style={{ color: '#6b7280' }}>Our HR team will be contacting you shortly!</p>
                <button onClick={() => setApplyJob(null)} style={{ marginTop: '20px', padding: '12px 32px', background: '#0077C8', color: 'white', border: 'none', borderRadius: '50px', cursor: 'pointer', fontWeight: 600 }}>Close</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Careers;
