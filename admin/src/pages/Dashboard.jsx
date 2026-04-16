import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({ totalMembers: 0, totalInquiries: 0, totalContacts: 0, totalDestinations: 0, newMembers: 0, newInquiries: 0 });
  const [recentMembers, setRecentMembers] = useState([]);
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, membersRes, inqRes] = await Promise.all([
          axios.get('/api/stats'),
          axios.get('/api/members'),
          axios.get('/api/inquiries')
        ]);
        setStats(statsRes.data.data);
        setRecentMembers(membersRes.data.data.slice(-5).reverse());
        setRecentInquiries(inqRes.data.data.slice(-5).reverse());
      } catch (_) {}
      setLoading(false);
    };
    fetchData();
  }, []);

  const statCards = [
    { label: 'Total Members', value: stats.totalMembers, icon: '⭐', color: '#0077C8', bg: '#e8f4ff' },
    { label: 'New Inquiries', value: stats.newInquiries, icon: '🏖️', color: '#f0a500', bg: '#fef3c7' },
    { label: 'Contact Messages', value: stats.totalContacts, icon: '📨', color: '#10b981', bg: '#d1fae5' },
    { label: 'Total Destinations', value: stats.totalDestinations, icon: '🗺️', color: '#8b5cf6', bg: '#ede9fe' },
    { label: 'Pending Members', value: stats.newMembers, icon: '⏳', color: '#ef4444', bg: '#fee2e2' },
    { label: 'Total Inquiries', value: stats.totalInquiries, icon: '📋', color: '#6b7280', bg: '#f3f4f6' },
  ];

  return (
    <div>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid #e8f4ff', borderTopColor: '#0077C8', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
          <style>{`@keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }`}</style>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="stat-grid">
            {statCards.map((s, i) => (
              <div className="stat-card" key={i}>
                <div className="stat-icon" style={{ background: s.bg }}>
                  {s.icon}
                </div>
                <div>
                  <div className="stat-num" style={{ color: s.color }}>{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Two columns */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* Recent Members */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>Recent Members</h3>
                <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{recentMembers.length} latest</span>
              </div>
              {recentMembers.length === 0 ? (
                <p style={{ color: '#9ca3af', textAlign: 'center', padding: '20px' }}>No members yet</p>
              ) : (
                <div>
                  {recentMembers.map((m, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < recentMembers.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #0077C8, #a78bfa)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.8rem', flexShrink: 0 }}>
                          {(m.fullName || 'U')[0].toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{m.fullName || 'N/A'}</div>
                          <div style={{ color: '#6b7280', fontSize: '0.8rem' }}>{m.phone || ''}</div>
                        </div>
                      </div>
                      <span className={`badge badge-${m.status === 'active' ? 'active' : 'pending'}`}>{m.status || 'pending'}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Inquiries */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>Recent Inquiries</h3>
                <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{recentInquiries.length} latest</span>
              </div>
              {recentInquiries.length === 0 ? (
                <p style={{ color: '#9ca3af', textAlign: 'center', padding: '20px' }}>No inquiries yet</p>
              ) : (
                <div>
                  {recentInquiries.map((inq, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < recentInquiries.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{inq.fullName}</div>
                        <div style={{ color: '#6b7280', fontSize: '0.8rem' }}>📍 {inq.destination || 'N/A'}</div>
                      </div>
                      <span className={`badge badge-${inq.status === 'new' ? 'new' : 'read'}`}>{inq.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card" style={{ marginTop: '20px' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '16px' }}>Quick Actions</h3>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {[
                { label: '+ Add Destination', color: '#0077C8', bg: '#e8f4ff' },
                { label: '+ Add Package', color: '#f0a500', bg: '#fef3c7' },
                { label: '📊 Export Members', color: '#10b981', bg: '#d1fae5' },
                { label: '⚙️ Site Settings', color: '#6b7280', bg: '#f3f4f6' },
              ].map((a, i) => (
                <button key={i} className="btn" style={{ background: a.bg, color: a.color, border: 'none' }}>{a.label}</button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
