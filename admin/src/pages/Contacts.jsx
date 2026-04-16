import React, { useState, useEffect } from 'react';
import api from '../api';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [viewMsg, setViewMsg] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetch = async () => { try { const r = await api.get('/api/contacts'); setContacts(r.data.data); } catch (_) {} setLoading(false); };
  useEffect(() => { fetch(); }, []);

  const del = async (id) => { if (window.confirm('Delete?')) { await api.delete(`/api/contacts/${id}`); fetch(); } };

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Contact Messages ({contacts.length})</h3>
        <p style={{ color: '#6b7280', fontSize: '0.85rem' }}>Messages submitted via the contact form</p>
      </div>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>#</th><th>Name</th><th>Phone</th><th>Email</th><th>Subject</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px' }}>Loading...</td></tr>
                : contacts.length === 0 ? <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>No contact messages yet</td></tr>
                  : [...contacts].reverse().map((c, i) => (
                    <tr key={c.id}>
                      <td style={{ color: '#9ca3af' }}>{i + 1}</td>
                      <td style={{ fontWeight: 600 }}>{c.name}</td>
                      <td>{c.phone}</td>
                      <td style={{ color: '#0077C8' }}>{c.email}</td>
                      <td>{c.subject || '—'}</td>
                      <td style={{ fontSize: '0.8rem', color: '#6b7280' }}>{c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-IN') : '—'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button className="btn btn-outline" style={{ padding: '5px 10px', fontSize: '0.8rem' }} onClick={() => setViewMsg(c)}>View</button>
                          <button className="btn btn-danger" style={{ padding: '5px 10px', fontSize: '0.8rem' }} onClick={() => del(c.id)}>Del</button>
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>

      {viewMsg && (
        <div className="admin-modal-overlay" onClick={e => e.target === e.currentTarget && setViewMsg(null)}>
          <div className="admin-modal">
            <h2>Message from {viewMsg.name}</h2>
            <div style={{ display: 'grid', gap: '12px', marginBottom: '20px' }}>
              {[['Name', viewMsg.name], ['Email', viewMsg.email], ['Phone', viewMsg.phone], ['Subject', viewMsg.subject]].map(([l, v]) => (
                <div key={l} style={{ display: 'flex', gap: '16px' }}>
                  <span style={{ fontWeight: 600, minWidth: '70px', color: '#6b7280', fontSize: '0.85rem' }}>{l}:</span>
                  <span>{v || '—'}</span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
                <div style={{ fontWeight: 600, marginBottom: '8px', color: '#6b7280', fontSize: '0.85rem' }}>Message:</div>
                <p style={{ lineHeight: 1.7 }}>{viewMsg.message}</p>
              </div>
            </div>
            <button className="btn btn-outline" onClick={() => setViewMsg(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contacts;
