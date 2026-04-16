import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Inquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [search, setSearch] = useState('');
  const [viewInq, setViewInq] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    try { const r = await axios.get('/api/inquiries'); setInquiries(r.data.data); } catch (_) {}
    setLoading(false);
  };
  useEffect(() => { fetch(); }, []);

  const filtered = inquiries.filter(i =>
    (i.fullName || '').toLowerCase().includes(search.toLowerCase()) ||
    (i.destination || '').toLowerCase().includes(search.toLowerCase())
  );

  const updateStatus = async (id, status) => { await axios.put(`/api/inquiries/${id}`, { status }); fetch(); };
  const deleteInq = async (id) => { if (window.confirm('Delete?')) { await axios.delete(`/api/inquiries/${id}`); fetch(); } };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Destination Inquiries ({filtered.length})</h3>
          <p style={{ color: '#6b7280', fontSize: '0.85rem' }}>Booking inquiries from website visitors</p>
        </div>
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input className="search-input" placeholder="Search by name or destination..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>#</th><th>Name</th><th>Phone</th><th>Destination</th><th>Check-in</th><th>Adults</th><th>Status</th><th>Date</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan={9} style={{ textAlign: 'center', padding: '40px' }}>Loading...</td></tr>
                : filtered.length === 0 ? <tr><td colSpan={9} style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>No inquiries found</td></tr>
                  : filtered.map((inq, i) => (
                    <tr key={inq.id}>
                      <td style={{ color: '#9ca3af' }}>{i + 1}</td>
                      <td style={{ fontWeight: 600 }}>{inq.fullName}</td>
                      <td>{inq.phone}</td>
                      <td><span style={{ color: '#0077C8', fontWeight: 600 }}>📍 {inq.destination || '—'}</span></td>
                      <td>{inq.checkIn || '—'}</td>
                      <td>{inq.adults || '—'}</td>
                      <td>
                        <select value={inq.status} onChange={e => updateStatus(inq.id, e.target.value)}
                          style={{ fontSize: '0.8rem', padding: '4px 8px', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="closed">Closed</option>
                        </select>
                      </td>
                      <td style={{ fontSize: '0.8rem', color: '#6b7280' }}>{inq.createdAt ? new Date(inq.createdAt).toLocaleDateString('en-IN') : '—'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button className="btn btn-outline" style={{ padding: '5px 10px', fontSize: '0.8rem' }} onClick={() => setViewInq(inq)}>View</button>
                          <button className="btn btn-danger" style={{ padding: '5px 10px', fontSize: '0.8rem' }} onClick={() => deleteInq(inq.id)}>Del</button>
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>

      {viewInq && (
        <div className="admin-modal-overlay" onClick={e => e.target === e.currentTarget && setViewInq(null)}>
          <div className="admin-modal">
            <h2>Inquiry Details</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              {[
                ['Name', viewInq.fullName], ['Phone', viewInq.phone], ['Email', viewInq.email],
                ['Destination', viewInq.destination], ['Check-in', viewInq.checkIn], ['Check-out', viewInq.checkOut],
                ['Adults', viewInq.adults], ['Children', viewInq.children], ['Room Type', viewInq.roomType]
              ].map(([label, val]) => (
                <div key={label} style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>{label}</div>
                  <div style={{ fontWeight: 500 }}>{val || '—'}</div>
                </div>
              ))}
            </div>
            {viewInq.specialRequest && (
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Special Request</div>
                <div>{viewInq.specialRequest}</div>
              </div>
            )}
            <button className="btn btn-outline" onClick={() => setViewInq(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inquiries;
