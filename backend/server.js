const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 5000;
const DB_PATH = path.join(__dirname, 'db.json');

app.use(cors());
app.use(express.json());

// Helper: Read DB
const readDB = () => JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
// Helper: Write DB
const writeDB = (data) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

// ==================== MEMBERS ====================
// POST /api/members - Register new member
app.post('/api/members', (req, res) => {
  try {
    const db = readDB();
    const member = {
      id: uuidv4(),
      ...req.body,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    db.members.push(member);
    writeDB(db);
    res.status(201).json({ success: true, message: 'Member registered successfully', data: member });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/members - Get all members (admin)
app.get('/api/members', (req, res) => {
  const db = readDB();
  res.json({ success: true, data: db.members });
});

// PUT /api/members/:id - Update member status (admin)
app.put('/api/members/:id', (req, res) => {
  const db = readDB();
  const idx = db.members.findIndex(m => m.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Member not found' });
  db.members[idx] = { ...db.members[idx], ...req.body };
  writeDB(db);
  res.json({ success: true, data: db.members[idx] });
});

// DELETE /api/members/:id
app.delete('/api/members/:id', (req, res) => {
  const db = readDB();
  db.members = db.members.filter(m => m.id !== req.params.id);
  writeDB(db);
  res.json({ success: true, message: 'Member deleted' });
});

// ==================== INQUIRIES ====================
// POST /api/inquiries - Submit destination inquiry
app.post('/api/inquiries', (req, res) => {
  try {
    const db = readDB();
    const inquiry = {
      id: uuidv4(),
      ...req.body,
      status: 'new',
      createdAt: new Date().toISOString()
    };
    db.inquiries.push(inquiry);
    writeDB(db);
    res.status(201).json({ success: true, message: 'Inquiry submitted successfully', data: inquiry });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/inquiries - Get all inquiries (admin)
app.get('/api/inquiries', (req, res) => {
  const db = readDB();
  res.json({ success: true, data: db.inquiries });
});

// PUT /api/inquiries/:id
app.put('/api/inquiries/:id', (req, res) => {
  const db = readDB();
  const idx = db.inquiries.findIndex(i => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Inquiry not found' });
  db.inquiries[idx] = { ...db.inquiries[idx], ...req.body };
  writeDB(db);
  res.json({ success: true, data: db.inquiries[idx] });
});

// DELETE /api/inquiries/:id
app.delete('/api/inquiries/:id', (req, res) => {
  const db = readDB();
  db.inquiries = db.inquiries.filter(i => i.id !== req.params.id);
  writeDB(db);
  res.json({ success: true, message: 'Inquiry deleted' });
});

// ==================== CONTACTS ====================
// POST /api/contacts
app.post('/api/contacts', (req, res) => {
  try {
    const db = readDB();
    const contact = {
      id: uuidv4(),
      ...req.body,
      status: 'unread',
      createdAt: new Date().toISOString()
    };
    db.contacts.push(contact);
    writeDB(db);
    res.status(201).json({ success: true, message: 'Message sent successfully', data: contact });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/contacts
app.get('/api/contacts', (req, res) => {
  const db = readDB();
  res.json({ success: true, data: db.contacts });
});

// DELETE /api/contacts/:id
app.delete('/api/contacts/:id', (req, res) => {
  const db = readDB();
  db.contacts = db.contacts.filter(c => c.id !== req.params.id);
  writeDB(db);
  res.json({ success: true, message: 'Contact deleted' });
});

// ==================== DESTINATIONS ====================
// GET /api/destinations
app.get('/api/destinations', (req, res) => {
  const db = readDB();
  const { region, type } = req.query;
  let destinations = db.destinations;
  if (region) destinations = destinations.filter(d => d.region === region);
  if (type) destinations = destinations.filter(d => d.type === type);
  res.json({ success: true, data: destinations });
});

// POST /api/destinations (admin)
app.post('/api/destinations', (req, res) => {
  const db = readDB();
  const dest = { id: uuidv4(), ...req.body };
  db.destinations.push(dest);
  writeDB(db);
  res.status(201).json({ success: true, data: dest });
});

// PUT /api/destinations/:id (admin)
app.put('/api/destinations/:id', (req, res) => {
  const db = readDB();
  const idx = db.destinations.findIndex(d => d.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Destination not found' });
  db.destinations[idx] = { ...db.destinations[idx], ...req.body };
  writeDB(db);
  res.json({ success: true, data: db.destinations[idx] });
});

// DELETE /api/destinations/:id (admin)
app.delete('/api/destinations/:id', (req, res) => {
  const db = readDB();
  db.destinations = db.destinations.filter(d => d.id !== req.params.id);
  writeDB(db);
  res.json({ success: true, message: 'Destination deleted' });
});

// ==================== PACKAGES ====================
app.get('/api/packages', (req, res) => {
  const db = readDB();
  res.json({ success: true, data: db.packages });
});

app.post('/api/packages', (req, res) => {
  const db = readDB();
  const pkg = { id: uuidv4(), ...req.body };
  db.packages.push(pkg);
  writeDB(db);
  res.status(201).json({ success: true, data: pkg });
});

app.put('/api/packages/:id', (req, res) => {
  const db = readDB();
  const idx = db.packages.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Package not found' });
  db.packages[idx] = { ...db.packages[idx], ...req.body };
  writeDB(db);
  res.json({ success: true, data: db.packages[idx] });
});

app.delete('/api/packages/:id', (req, res) => {
  const db = readDB();
  db.packages = db.packages.filter(p => p.id !== req.params.id);
  writeDB(db);
  res.json({ success: true, message: 'Package deleted' });
});

// ==================== SITE SETTINGS ====================
app.get('/api/settings', (req, res) => {
  const db = readDB();
  res.json({ success: true, data: db.siteSettings });
});

app.put('/api/settings', (req, res) => {
  const db = readDB();
  db.siteSettings = { ...db.siteSettings, ...req.body };
  writeDB(db);
  res.json({ success: true, data: db.siteSettings });
});

// ==================== NEWS ====================
app.get('/api/news', (req, res) => {
  const db = readDB();
  res.json({ success: true, data: db.news });
});

app.post('/api/news', (req, res) => {
  const db = readDB();
  const item = { id: uuidv4(), ...req.body };
  db.news.push(item);
  writeDB(db);
  res.status(201).json({ success: true, data: item });
});

app.put('/api/news/:id', (req, res) => {
  const db = readDB();
  const idx = db.news.findIndex(n => n.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'News item not found' });
  db.news[idx] = { ...db.news[idx], ...req.body };
  writeDB(db);
  res.json({ success: true, data: db.news[idx] });
});

app.delete('/api/news/:id', (req, res) => {
  const db = readDB();
  db.news = db.news.filter(n => n.id !== req.params.id);
  writeDB(db);
  res.json({ success: true, message: 'News deleted' });
});

// ==================== STATS (Admin Dashboard) ====================
app.get('/api/stats', (req, res) => {
  const db = readDB();
  res.json({
    success: true,
    data: {
      totalMembers: db.members.length,
      totalInquiries: db.inquiries.length,
      totalContacts: db.contacts.length,
      totalDestinations: db.destinations.length,
      newMembers: db.members.filter(m => m.status === 'pending').length,
      newInquiries: db.inquiries.filter(i => i.status === 'new').length
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'My Holiday Club API is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 My Holiday Club API running on http://localhost:${PORT}`);
});
