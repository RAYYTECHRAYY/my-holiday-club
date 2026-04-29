const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'] }
});

const PORT = process.env.PORT || 5000;
const DB_PATH = path.join(__dirname, 'db.json');
const JWT_SECRET = process.env.JWT_SECRET || 'mhc_secret_2026_xK9mPqR';

const allowedOrigins = process.env.FRONTEND_URL
  ? [process.env.FRONTEND_URL, process.env.ADMIN_URL].filter(Boolean)
  : ['http://localhost:3000','http://localhost:3001'];
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: '20mb' }));

const readDB = () => JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
const writeDB = (data) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Unauthorized' });
  try {
    req.member = jwt.verify(token, JWT_SECRET);
    next();
  } catch { res.status(401).json({ success: false, message: 'Invalid token' }); }
};

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => console.log('Client disconnected:', socket.id));
});

const emitStats = () => {
  const db = readDB();
  io.emit('stats_update', {
    totalMembers: (db.memberAccounts || []).length,
    totalInquiries: (db.inquiries || []).length,
    totalContacts: (db.contacts || []).length,
    totalProperties: (db.properties || []).length,
    totalBookings: (db.bookings || []).length,
    totalPayments: (db.payments || []).length,
    newMembers: (db.memberAccounts || []).filter(m => m.status === 'pending').length,
    newInquiries: (db.inquiries || []).filter(i => i.status === 'new').length,
    newBookings: (db.bookings || []).filter(b => b.status === 'pending').length,
    newPayments: (db.payments || []).filter(p => p.status === 'pending').length,
  });
};

// ==================== AUTH ====================
app.post('/api/auth/signup', async (req, res) => {
  try {
    const db = readDB();
    const { email, password, fullName, phone, address, city, state, pincode } = req.body;
    if (!email || !password || !fullName) return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    const exists = (db.memberAccounts || []).find(m => m.email === email);
    if (exists) return res.status(400).json({ success: false, message: 'Email already registered' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const memberId = 'MHC' + Date.now().toString().slice(-6);
    const account = {
      id: uuidv4(), memberId, fullName, email, phone: phone || '',
      address: address || '', city: city || '', state: state || '', pincode: pincode || '',
      password: hashedPassword, status: 'pending', packageId: null, packageName: null,
      joinDate: new Date().toISOString(), createdAt: new Date().toISOString()
    };
    if (!db.memberAccounts) db.memberAccounts = [];
    db.memberAccounts.push(account);
    writeDB(db);
    const token = jwt.sign({ id: account.id, email: account.email, memberId: account.memberId }, JWT_SECRET, { expiresIn: '7d' });
    const { password: _, ...safeAccount } = account;
    io.emit('new_member', safeAccount);
    emitStats();
    res.status(201).json({ success: true, token, member: safeAccount });
  } catch (err) { console.error(err); res.status(500).json({ success: false, message: 'Server error' }); }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const db = readDB();
    const { email, password } = req.body;
    const account = (db.memberAccounts || []).find(m => m.email === email);
    if (!account) return res.status(400).json({ success: false, message: 'Invalid email or password' });
    const valid = await bcrypt.compare(password, account.password);
    if (!valid) return res.status(400).json({ success: false, message: 'Invalid email or password' });
    const token = jwt.sign({ id: account.id, email: account.email, memberId: account.memberId }, JWT_SECRET, { expiresIn: '7d' });
    const { password: _, ...safeAccount } = account;
    // Attach payments
    const payments = (db.payments || []).filter(p => p.memberId === account.id);
    res.json({ success: true, token, member: { ...safeAccount, payments } });
  } catch (err) { res.status(500).json({ success: false, message: 'Server error' }); }
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  try {
    const db = readDB();
    const account = (db.memberAccounts || []).find(m => m.id === req.member.id);
    if (!account) return res.status(404).json({ success: false, message: 'Member not found' });
    const { password: _, ...safeAccount } = account;
    const payments = (db.payments || []).filter(p => p.memberId === account.id);
    res.json({ success: true, member: { ...safeAccount, payments } });
  } catch { res.status(500).json({ success: false, message: 'Server error' }); }
});

// ==================== MEMBER ACCOUNTS (ADMIN) ====================
app.get('/api/member-accounts', (req, res) => {
  const db = readDB();
  const accounts = (db.memberAccounts || []).map(({ password, ...m }) => m);
  res.json({ success: true, data: accounts });
});

app.get('/api/member-accounts/:id', (req, res) => {
  const db = readDB();
  const account = (db.memberAccounts || []).find(m => m.id === req.params.id);
  if (!account) return res.status(404).json({ success: false, message: 'Not found' });
  const { password: _, ...safeAccount } = account;
  const payments = (db.payments || []).filter(p => p.memberId === account.id);
  res.json({ success: true, data: { ...safeAccount, payments } });
});

app.post('/api/member-accounts', async (req, res) => {
  try {
    const db = readDB();
    const { email, password, fullName, phone, address, city, state, pincode, status, packageId } = req.body;
    const hashedPassword = await bcrypt.hash(password || 'MHC@1234', 10);
    const memberId = 'MHC' + Date.now().toString().slice(-6);
    let packageName = null;
    if (packageId) {
      const pkg = (db.packages || []).find(p => p.id === packageId);
      if (pkg) packageName = pkg.name;
    }
    const account = {
      id: uuidv4(), memberId, fullName, email, phone: phone || '',
      address: address || '', city: city || '', state: state || '', pincode: pincode || '',
      password: hashedPassword, status: status || 'active', packageId: packageId || null,
      packageName, joinDate: new Date().toISOString(), createdAt: new Date().toISOString()
    };
    if (!db.memberAccounts) db.memberAccounts = [];
    db.memberAccounts.push(account);
    writeDB(db);
    emitStats();
    const { password: _, ...safeAccount } = account;
    res.status(201).json({ success: true, data: safeAccount });
  } catch (err) { res.status(500).json({ success: false, message: 'Server error' }); }
});

app.put('/api/member-accounts/:id', async (req, res) => {
  try {
    const db = readDB();
    const idx = (db.memberAccounts || []).findIndex(m => m.id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Not found' });
    const updates = { ...req.body };
    if (updates.password && updates.password.length > 0) {
      updates.password = await bcrypt.hash(updates.password, 10);
    } else {
      delete updates.password;
    }
    if (updates.packageId) {
      const pkg = (db.packages || []).find(p => p.id === updates.packageId);
      if (pkg) updates.packageName = pkg.name;
    }
    db.memberAccounts[idx] = { ...db.memberAccounts[idx], ...updates, updatedAt: new Date().toISOString() };
    writeDB(db);
    emitStats();
    const { password: _, ...safeAccount } = db.memberAccounts[idx];
    io.emit('member_updated', safeAccount);
    res.json({ success: true, data: safeAccount });
  } catch { res.status(500).json({ success: false, message: 'Server error' }); }
});

app.delete('/api/member-accounts/:id', (req, res) => {
  const db = readDB();
  db.memberAccounts = (db.memberAccounts || []).filter(m => m.id !== req.params.id);
  writeDB(db);
  emitStats();
  res.json({ success: true, message: 'Deleted' });
});

// ==================== PAYMENTS ====================
app.post('/api/payments', (req, res) => {
  try {
    const db = readDB();
    const payment = {
      id: uuidv4(),
      ...req.body,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    if (!db.payments) db.payments = [];
    db.payments.push(payment);
    // Update member's packageId if provided
    if (payment.memberId && payment.packageId) {
      const idx = (db.memberAccounts || []).findIndex(m => m.id === payment.memberId);
      if (idx !== -1) {
        db.memberAccounts[idx].packageId = payment.packageId;
        db.memberAccounts[idx].packageName = payment.packageName;
      }
    }
    writeDB(db);
    io.emit('new_payment', payment);
    emitStats();
    res.status(201).json({ success: true, data: payment });
  } catch { res.status(500).json({ success: false, message: 'Server error' }); }
});

app.get('/api/payments', (req, res) => {
  const db = readDB();
  res.json({ success: true, data: (db.payments || []).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)) });
});

app.get('/api/payments/member/:memberId', (req, res) => {
  const db = readDB();
  const payments = (db.payments || []).filter(p => p.memberId === req.params.memberId);
  res.json({ success: true, data: payments });
});

app.put('/api/payments/:id', (req, res) => {
  const db = readDB();
  const idx = (db.payments || []).findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Not found' });
  db.payments[idx] = { ...db.payments[idx], ...req.body, updatedAt: new Date().toISOString() };
  // If confirmed, activate the member
  if (req.body.status === 'confirmed' && db.payments[idx].memberId) {
    const mIdx = (db.memberAccounts || []).findIndex(m => m.id === db.payments[idx].memberId);
    if (mIdx !== -1) db.memberAccounts[mIdx].status = 'active';
  }
  writeDB(db);
  io.emit('payment_updated', db.payments[idx]);
  emitStats();
  res.json({ success: true, data: db.payments[idx] });
});

app.delete('/api/payments/:id', (req, res) => {
  const db = readDB();
  db.payments = (db.payments || []).filter(p => p.id !== req.params.id);
  writeDB(db);
  res.json({ success: true });
});

// ==================== PACKAGES ====================
app.get('/api/packages', (req, res) => {
  const db = readDB();
  res.json({ success: true, data: db.packages || [] });
});
app.post('/api/packages', (req, res) => {
  const db = readDB();
  const pkg = { id: uuidv4(), ...req.body, createdAt: new Date().toISOString() };
  if (!db.packages) db.packages = [];
  db.packages.push(pkg);
  writeDB(db);
  res.status(201).json({ success: true, data: pkg });
});
app.put('/api/packages/:id', (req, res) => {
  const db = readDB();
  const idx = (db.packages || []).findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Not found' });
  db.packages[idx] = { ...db.packages[idx], ...req.body };
  writeDB(db);
  res.json({ success: true, data: db.packages[idx] });
});
app.delete('/api/packages/:id', (req, res) => {
  const db = readDB();
  db.packages = (db.packages || []).filter(p => p.id !== req.params.id);
  writeDB(db);
  res.json({ success: true });
});

// ==================== REGIONS ====================
app.get('/api/regions', (req, res) => {
  const db = readDB();
  let regions = db.regions || [];
  if (req.query.type) regions = regions.filter(r => r.type === req.query.type);
  res.json({ success: true, data: regions });
});
app.post('/api/regions', (req, res) => {
  const db = readDB();
  const region = { id: uuidv4(), ...req.body, createdAt: new Date().toISOString() };
  db.regions = db.regions || [];
  db.regions.push(region);
  writeDB(db);
  res.status(201).json({ success: true, data: region });
});
app.put('/api/regions/:id', (req, res) => {
  const db = readDB();
  const idx = (db.regions || []).findIndex(r => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Not found' });
  db.regions[idx] = { ...db.regions[idx], ...req.body };
  writeDB(db);
  res.json({ success: true, data: db.regions[idx] });
});
app.delete('/api/regions/:id', (req, res) => {
  const db = readDB();
  db.regions = (db.regions || []).filter(r => r.id !== req.params.id);
  db.properties = (db.properties || []).filter(p => p.regionId !== req.params.id);
  writeDB(db);
  res.json({ success: true });
});

// ==================== PROPERTIES ====================
app.get('/api/properties', (req, res) => {
  const db = readDB();
  let props = db.properties || [];
  if (req.query.regionId) props = props.filter(p => p.regionId === req.query.regionId);
  const regions = db.regions || [];
  props = props.map(p => ({ ...p, regionName: regions.find(r => r.id === p.regionId)?.name || '' }));
  res.json({ success: true, data: props });
});
app.get('/api/properties/:id', (req, res) => {
  const db = readDB();
  const prop = (db.properties || []).find(p => p.id === req.params.id);
  if (!prop) return res.status(404).json({ success: false, message: 'Not found' });
  const region = (db.regions || []).find(r => r.id === prop.regionId);
  res.json({ success: true, data: { ...prop, regionName: region?.name || '' } });
});
app.post('/api/properties', (req, res) => {
  const db = readDB();
  const prop = { id: uuidv4(), ...req.body, createdAt: new Date().toISOString() };
  db.properties = db.properties || [];
  db.properties.push(prop);
  writeDB(db);
  emitStats();
  res.status(201).json({ success: true, data: prop });
});
app.put('/api/properties/:id', (req, res) => {
  const db = readDB();
  const idx = (db.properties || []).findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Not found' });
  db.properties[idx] = { ...db.properties[idx], ...req.body };
  writeDB(db);
  res.json({ success: true, data: db.properties[idx] });
});
app.delete('/api/properties/:id', (req, res) => {
  const db = readDB();
  db.properties = (db.properties || []).filter(p => p.id !== req.params.id);
  writeDB(db);
  emitStats();
  res.json({ success: true });
});

// ==================== BOOKINGS ====================
app.post('/api/bookings', (req, res) => {
  const db = readDB();
  const booking = { id: uuidv4(), ...req.body, status: 'pending', createdAt: new Date().toISOString() };
  db.bookings = db.bookings || [];
  db.bookings.push(booking);
  writeDB(db);
  io.emit('new_booking', booking);
  emitStats();
  res.status(201).json({ success: true, data: booking });
});
app.get('/api/bookings', (req, res) => {
  const db = readDB();
  res.json({ success: true, data: (db.bookings || []).sort((a,b) => new Date(b.createdAt)-new Date(a.createdAt)) });
});
app.put('/api/bookings/:id', (req, res) => {
  const db = readDB();
  const idx = (db.bookings||[]).findIndex(b=>b.id===req.params.id);
  if (idx===-1) return res.status(404).json({ success:false, message:'Not found' });
  db.bookings[idx] = { ...db.bookings[idx], ...req.body };
  writeDB(db);
  io.emit('booking_updated', db.bookings[idx]);
  emitStats();
  res.json({ success:true, data:db.bookings[idx] });
});
app.delete('/api/bookings/:id', (req, res) => {
  const db = readDB();
  db.bookings = (db.bookings||[]).filter(b=>b.id!==req.params.id);
  writeDB(db);
  io.emit('booking_deleted', { id: req.params.id });
  emitStats();
  res.json({ success:true });
});

// ==================== FORM SETTINGS ====================
app.get('/api/form-settings', (req, res) => {
  const db = readDB();
  res.json({ success: true, data: db.formSettings || {} });
});
app.put('/api/form-settings', (req, res) => {
  const db = readDB();
  db.formSettings = { ...db.formSettings, ...req.body };
  writeDB(db);
  res.json({ success: true, data: db.formSettings });
});

// ==================== MEMBERS (legacy inquiry-based) ====================
app.post('/api/members', (req, res) => {
  try {
    const db = readDB();
    const member = { id: uuidv4(), ...req.body, status: 'pending', createdAt: new Date().toISOString() };
    db.members = db.members || [];
    db.members.push(member);
    writeDB(db);
    io.emit('new_member', member);
    emitStats();
    res.status(201).json({ success: true, message: 'Member registered successfully', data: member });
  } catch { res.status(500).json({ success: false, message: 'Server error' }); }
});
app.get('/api/members', (req, res) => {
  const db = readDB();
  res.json({ success: true, data: db.members || [] });
});
app.put('/api/members/:id', (req, res) => {
  const db = readDB();
  const idx = (db.members||[]).findIndex(m=>m.id===req.params.id);
  if (idx===-1) return res.status(404).json({ success:false });
  db.members[idx]={...db.members[idx],...req.body};
  writeDB(db);
  res.json({ success:true, data:db.members[idx] });
});
app.delete('/api/members/:id', (req, res) => {
  const db = readDB();
  db.members=(db.members||[]).filter(m=>m.id!==req.params.id);
  writeDB(db);
  res.json({ success:true });
});

// ==================== INQUIRIES ====================
app.post('/api/inquiries', (req, res) => {
  const db = readDB();
  const inq = { id: uuidv4(), ...req.body, status: 'new', createdAt: new Date().toISOString() };
  db.inquiries = db.inquiries || [];
  db.inquiries.push(inq);
  writeDB(db);
  io.emit('new_inquiry', inq);
  emitStats();
  res.status(201).json({ success: true, data: inq });
});
app.get('/api/inquiries', (req, res) => {
  const db = readDB();
  res.json({ success: true, data: (db.inquiries||[]).sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)) });
});
app.put('/api/inquiries/:id', (req, res) => {
  const db = readDB();
  const idx = (db.inquiries||[]).findIndex(i=>i.id===req.params.id);
  if (idx===-1) return res.status(404).json({ success:false });
  db.inquiries[idx]={...db.inquiries[idx],...req.body};
  writeDB(db);
  res.json({ success:true, data:db.inquiries[idx] });
});
app.delete('/api/inquiries/:id', (req, res) => {
  const db = readDB();
  db.inquiries=(db.inquiries||[]).filter(i=>i.id!==req.params.id);
  writeDB(db);
  res.json({ success:true });
});

// ==================== CONTACTS ====================
app.post('/api/contacts', (req, res) => {
  const db = readDB();
  const contact = { id: uuidv4(), ...req.body, status: 'new', createdAt: new Date().toISOString() };
  db.contacts = db.contacts || [];
  db.contacts.push(contact);
  writeDB(db);
  io.emit('new_contact', contact);
  emitStats();
  res.status(201).json({ success: true, data: contact });
});
app.get('/api/contacts', (req, res) => {
  const db = readDB();
  res.json({ success: true, data: (db.contacts||[]).sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)) });
});
app.put('/api/contacts/:id', (req, res) => {
  const db = readDB();
  const idx = (db.contacts||[]).findIndex(c=>c.id===req.params.id);
  if (idx===-1) return res.status(404).json({ success:false });
  db.contacts[idx]={...db.contacts[idx],...req.body};
  writeDB(db);
  res.json({ success:true, data:db.contacts[idx] });
});
app.delete('/api/contacts/:id', (req, res) => {
  const db = readDB();
  db.contacts=(db.contacts||[]).filter(c=>c.id!==req.params.id);
  writeDB(db);
  res.json({ success:true });
});

// ==================== NEWS ====================
app.get('/api/news', (req, res) => {
  const db = readDB();
  res.json({ success: true, data: db.news || [] });
});
app.post('/api/news', (req, res) => {
  const db = readDB();
  const article = { id: uuidv4(), ...req.body, createdAt: new Date().toISOString() };
  db.news = db.news || [];
  db.news.push(article);
  writeDB(db);
  res.status(201).json({ success: true, data: article });
});
app.put('/api/news/:id', (req, res) => {
  const db = readDB();
  const idx = (db.news||[]).findIndex(n=>n.id===req.params.id);
  if (idx===-1) return res.status(404).json({ success:false });
  db.news[idx]={...db.news[idx],...req.body};
  writeDB(db);
  res.json({ success:true, data:db.news[idx] });
});
app.delete('/api/news/:id', (req, res) => {
  const db = readDB();
  db.news=(db.news||[]).filter(n=>n.id!==req.params.id);
  writeDB(db);
  res.json({ success:true });
});

// ==================== SITE SETTINGS ====================
app.get('/api/settings', (req, res) => {
  const db = readDB();
  res.json({ success: true, data: db.siteSettings || {} });
});
app.put('/api/settings', (req, res) => {
  const db = readDB();
  db.siteSettings = { ...db.siteSettings, ...req.body };
  writeDB(db);
  res.json({ success: true, data: db.siteSettings });
});

// ==================== PAYMENT SETTINGS ====================
app.get('/api/payment-settings', (req, res) => {
  const db = readDB();
  res.json({ success: true, data: db.siteSettings?.paymentSettings || {} });
});
app.put('/api/payment-settings', (req, res) => {
  const db = readDB();
  db.siteSettings = db.siteSettings || {};
  db.siteSettings.paymentSettings = { ...db.siteSettings.paymentSettings, ...req.body };
  writeDB(db);
  res.json({ success: true, data: db.siteSettings.paymentSettings });
});

// ==================== MEMBERSHIP BENEFITS ====================
app.get('/api/membership-benefits', (req, res) => {
  const db = readDB();
  res.json({ success: true, data: db.siteSettings?.membershipBenefits || [] });
});
app.put('/api/membership-benefits', (req, res) => {
  const db = readDB();
  db.siteSettings = db.siteSettings || {};
  db.siteSettings.membershipBenefits = req.body;
  writeDB(db);
  res.json({ success: true, data: db.siteSettings.membershipBenefits });
});

// ==================== STATS ====================
app.get('/api/stats', (req, res) => {
  const db = readDB();
  res.json({
    success: true,
    data: {
      totalMembers: (db.memberAccounts || []).length,
      totalInquiries: (db.inquiries || []).length,
      totalContacts: (db.contacts || []).length,
      totalProperties: (db.properties || []).length,
      totalBookings: (db.bookings || []).length,
      totalPayments: (db.payments || []).length,
      newMembers: (db.memberAccounts || []).filter(m => m.status === 'pending').length,
      newPayments: (db.payments || []).filter(p => p.status === 'pending').length,
    }
  });
});

app.get('/api/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime(), env: process.env.NODE_ENV || 'development' }));

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
