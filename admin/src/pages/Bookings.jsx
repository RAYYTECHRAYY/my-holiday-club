import React, { useState, useEffect } from 'react';
import api from '../api';

const STATUS_COLORS = { pending: '#f59e0b', confirmed: '#16a34a', cancelled: '#ef4444' };

export default function Bookings({ socket }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/api/bookings');
      setBookings(res.data.data || []);
    } catch { setBookings([]); } finally { setLoading(false); }
  };

  useEffect(() => { fetchBookings(); }, []);
  useEffect(() => {
    if (!socket) return;
    socket.on('new_booking', b => setBookings(prev => [b, ...prev]));
    socket.on('booking_updated', b => setBookings(prev => prev.map(x => x.id === b.id ? b : x)));
    socket.on('booking_deleted', id => setBookings(prev => prev.filter(x => x.id !== id)));
    return () => { socket.off('new_booking'); socket.off('booking_updated'); socket.off('booking_deleted'); };
  }, [socket]);

  const updateStatus = async (id, status) => {
    await api.put(`/api/bookings/${id}`, { status });
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    if (selected?.id === id) setSelected(s => ({ ...s, status }));
  };
  const deleteBooking = async (id) => {
    if (!window.confirm('Delete this booking?')) return;
    await api.delete(`/api/bookings/${id}`);
    setBookings(prev => prev.filter(b => b.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);
  const counts = { all: bookings.length, pending: bookings.filter(b => b.status === 'pending').length, confirmed: bookings.filter(b => b.status === 'confirmed').length, cancelled: bookings.filter(b => b.status === 'cancelled').length };

  const styles = {
    card: (b) => ({ background: 'white', borderRadius: '14px', padding: '18px 20px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', marginBottom: '10px', cursor: 'pointer', border: selected?.id === b.id ? '2px solid #0077C8' : '2px solid transparent', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '14px' }),
    btn: (c='#0077C8') => ({ padding: '7px 14px', background: c, color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem', fontFamily: "'Inter',sans-serif" }),
    badge: (s) => ({ padding: '3px 10px', background: STATUS_COLORS[s] + '22', color: STATUS_COLORS[s], borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, border: `1px solid ${STATUS_COLORS[s]}44` }),
  };

  return (
    <div style={{ padding: '28px', fontFamily: "'Inter',sans-serif" }}>
      <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.8rem', color: '#1a1a2e', marginBottom: '6px' }}>Bookings</h1>
      <p style={{ color: '#6b7280', marginBottom: '24px', fontSize: '0.9rem' }}>All property booking requests — live updates enabled</p>

      {/* Stats bar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {[['all','All',counts.all,'#0077C8'],['pending','Pending',counts.pending,'#f59e0b'],['confirmed','Confirmed',counts.confirmed,'#16a34a'],['cancelled','Cancelled',counts.cancelled,'#ef4444']].map(([v,l,c,col]) => (
          <button key={v} onClick={() => setFilter(v)} style={{ padding: '10px 20px', background: filter === v ? col : 'white', color: filter === v ? 'white' : '#374151', border: `2px solid ${filter === v ? col : '#e2e8f0'}`, borderRadius: '50px', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem', fontFamily: "'Inter',sans-serif", transition: 'all 0.2s' }}>
            {l} <span style={{ opacity: 0.8 }}>({c})</span>
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 380px' : '1fr', gap: '24px', alignItems: 'start' }}>
        {/* List */}
        <div>
          {loading && <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>Loading…</div>}
          {!loading && filtered.length === 0 && <div style={{ textAlign: 'center', padding: '60px', color: '#9ca3af' }}>No bookings found.</div>}
          {filtered.map(b => (
            <div key={b.id} style={styles.card(b)} onClick={() => setSelected(b)}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 700, color: '#1a1a2e', fontSize: '0.95rem' }}>{b.propertyName || 'Property'}</span>
                  <span style={styles.badge(b.status || 'pending')}>{b.status || 'pending'}</span>
                  {b.status === 'pending' && <span style={{ background: '#fef3c7', color: '#d97706', padding: '2px 8px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 700, animation: 'pulse 2s infinite' }}>● NEW</span>}
                </div>
                <div style={{ color: '#6b7280', fontSize: '0.82rem' }}>
                  👤 {b['Full Name'] || 'Guest'} · 📧 {b['Email Address'] || '—'} · 📞 {b['Phone Number'] || '—'}
                </div>
                <div style={{ color: '#9ca3af', fontSize: '0.78rem', marginTop: '2px' }}>📍 {b.propertyLocation} · {new Date(b.createdAt).toLocaleString()}</div>
              </div>
              <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                <button style={styles.btn('#ef4444')} onClick={e => { e.stopPropagation(); deleteBooking(b.id); }}>✕</button>
              </div>
            </div>
          ))}
        </div>

        {/* Detail Panel */}
        {selected && (
          <div style={{ background: 'white', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 24px rgba(0,0,0,0.1)', position: 'sticky', top: '80px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.2rem', color: '#1a1a2e', margin: 0 }}>Booking Details</h3>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#9ca3af' }}>✕</button>
            </div>
            <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
              <div style={{ fontWeight: 700, color: '#1a1a2e', marginBottom: '4px' }}>{selected.propertyName}</div>
              <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>📍 {selected.propertyLocation}</div>
            </div>
            <div style={{ display: 'grid', gap: '10px', marginBottom: '20px' }}>
              {Object.entries(selected).filter(([k]) => !['id','propertyId','propertyName','propertyLocation','status','createdAt'].includes(k)).map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ color: '#6b7280', fontSize: '0.82rem', fontWeight: 600 }}>{k}</span>
                  <span style={{ color: '#1a1a2e', fontSize: '0.85rem', textAlign: 'right' }}>{v || '—'}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gap: '8px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button style={{ ...styles.btn('#16a34a'), flex: 1 }} onClick={() => updateStatus(selected.id, 'confirmed')}>✓ Confirm</button>
                <button style={{ ...styles.btn('#ef4444'), flex: 1 }} onClick={() => updateStatus(selected.id, 'cancelled')}>✕ Cancel</button>
              </div>
              <button style={{ ...styles.btn('#6b7280'), width: '100%' }} onClick={() => { deleteBooking(selected.id); setSelected(null); }}>🗑 Delete Booking</button>
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </div>
  );
}
