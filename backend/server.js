const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const multer = require('multer');

// In-memory OTP store: { email: { otp, expiresAt, verified } }
const otpStore = {};

// Create transporter from db settings
function getTransporter(smtpSettings) {
  if (!smtpSettings || !smtpSettings.smtpHost || !smtpSettings.smtpUser || !smtpSettings.smtpPass) return null;
  return nodemailer.createTransport({
    host: smtpSettings.smtpHost,
    port: parseInt(smtpSettings.smtpPort) || 587,
    secure: parseInt(smtpSettings.smtpPort) === 465,
    auth: { user: smtpSettings.smtpUser, pass: smtpSettings.smtpPass },
  });
}

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

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
  : [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://77.37.45.215',
      'http://77.37.45.215:8080',
      'http://demo.myholidayclub.in',
      'http://admin-demo.myholidayclub.in',
    ];
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: '20mb' }));

// ── UPLOADS ──
const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
app.use('/uploads', express.static(UPLOAD_DIR));

// ==================== TEMPLATE DOWNLOADS ====================
const TEMPLATES_DIR = path.join(__dirname, 'templates');
app.use('/templates', express.static(TEMPLATES_DIR));

app.get('/api/templates/list', (req, res) => {
  res.json({
    success: true,
    templates: {
      destinations: {
        excel: '/templates/MHC_Destinations_Template.xlsx',
        pdf: '/templates/MHC_Destinations_Format_Guide.pdf',
      },
      packages: {
        excel: '/templates/MHC_Packages_Template.xlsx',
        pdf: '/templates/MHC_Packages_Format_Guide.pdf',
      },
    },
  });
});
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename:    (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
  const host = req.protocol + '://' + req.get('host');
  res.json({ success: true, url: host + '/uploads/' + req.file.filename });
});

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
    const { email, password, fullName, phone } = req.body;
    if (!email || !password || !fullName) return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    const exists = (db.memberAccounts || []).find(m => m.email === email);
    if (exists) return res.status(400).json({ success: false, message: 'Email already registered' });

    // Store pending signup data and send OTP - do NOT create account yet
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    otpStore[email] = {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000,
      pendingSignup: { fullName, email, phone: phone || '', hashedPassword }
    };
    console.log(`[Signup OTP] ${email} → ${otp}`);

    const smtpSettings = db.siteSettings?.smtpSettings || {};
    const transporter = getTransporter(smtpSettings);
    if (transporter) {
      try {
        await transporter.sendMail({
          from: `"My Holiday Club" <${smtpSettings.smtpUser}>`,
          to: email,
          subject: 'Verify your My Holiday Club account',
          html: `
            <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:32px;background:#f8faff;border-radius:16px;">
              <div style="text-align:center;margin-bottom:24px;">
                <h2 style="color:#0077C8;margin:0">My Holiday Club</h2>
                <p style="color:#6b7280;margin:8px 0 0">Account Verification</p>
              </div>
              <div style="background:white;border-radius:12px;padding:28px;text-align:center;box-shadow:0 4px 12px rgba(0,0,0,0.08);">
                <p style="color:#374151;margin:0 0 8px">Hi <strong>${fullName}</strong>, welcome!</p>
                <p style="color:#374151;margin:0 0 16px">Use this code to verify your email and create your account:</p>
                <div style="font-size:2.5rem;font-weight:900;letter-spacing:12px;color:#0077C8;background:#e8f4ff;padding:16px 24px;border-radius:12px;display:inline-block;margin-bottom:16px">${otp}</div>
                <p style="color:#9ca3af;font-size:0.85rem;margin:0">This code expires in <strong>10 minutes</strong>. Do not share it with anyone.</p>
              </div>
            </div>
          `
        });
      } catch (mailErr) { console.error('[Signup OTP] Email send failed:', mailErr.message); }
    }

    res.json({ success: true, requiresOtp: true, email, message: 'OTP sent to your email' });
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
    const payments = (db.payments || []).filter(p => p.memberId === account.id);
    res.json({ success: true, token, member: { ...safeAccount, payments } });
  } catch (err) { res.status(500).json({ success: false, message: 'Server error' }); }
});

// Verify OTP — handles both signup (creates account) and any future OTP use
app.post('/api/auth/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const stored = otpStore[email];
    if (!stored) return res.status(400).json({ success: false, message: 'No OTP found for this email. Please try again.' });
    if (Date.now() > stored.expiresAt) {
      delete otpStore[email];
      return res.status(400).json({ success: false, message: 'OTP has expired. Please try again.' });
    }
    if (stored.otp !== otp.trim()) {
      return res.status(400).json({ success: false, message: 'Invalid OTP. Please try again.' });
    }
    delete otpStore[email];

    const db = readDB();

    // If this OTP came from signup, create the account now
    if (stored.pendingSignup) {
      const { fullName, phone, hashedPassword } = stored.pendingSignup;
      const exists = (db.memberAccounts || []).find(m => m.email === email);
      if (exists) return res.status(400).json({ success: false, message: 'Email already registered.' });
      const memberId = 'MHC' + Date.now().toString().slice(-6);
      const account = {
        id: uuidv4(), memberId, fullName, email, phone,
        address: '', city: '', state: '', pincode: '',
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
      return res.status(201).json({ success: true, token, member: safeAccount, isNewAccount: true });
    }

    // Fallback: existing account lookup (not currently used for login)
    const account = (db.memberAccounts || []).find(m => m.email === email);
    if (!account) return res.status(400).json({ success: false, message: 'Account not found.' });
    const token = jwt.sign({ id: account.id, email: account.email, memberId: account.memberId }, JWT_SECRET, { expiresIn: '7d' });
    const { password: _, ...safeAccount } = account;
    const payments = (db.payments || []).filter(p => p.memberId === account.id);
    res.json({ success: true, token, member: { ...safeAccount, payments } });
  } catch (err) { res.status(500).json({ success: false, message: 'Server error' }); }
});

// Resend OTP
app.post('/api/auth/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;
    // Preserve pendingSignup data when regenerating OTP
    const existing = otpStore[email];
    const otp = generateOTP();
    otpStore[email] = { otp, expiresAt: Date.now() + 10 * 60 * 1000, pendingSignup: existing?.pendingSignup || null };
    console.log(`[OTP resend] ${email} → ${otp}`);
    const db = readDB();

    const smtpSettings = db.siteSettings?.smtpSettings || {};
    const transporter = getTransporter(smtpSettings);
    if (transporter) {
      try {
        await transporter.sendMail({
          from: `"My Holiday Club" <${smtpSettings.smtpUser}>`,
          to: email,
          subject: 'Your MHC Login Verification Code (Resent)',
          html: `
            <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:32px;">
              <h2 style="color:#0077C8">My Holiday Club — OTP Resent</h2>
              <p>Your new verification code:</p>
              <div style="font-size:2.5rem;font-weight:900;letter-spacing:12px;color:#0077C8;background:#e8f4ff;padding:16px;border-radius:12px;display:inline-block">${otp}</div>
              <p style="color:#9ca3af;font-size:0.85rem">Expires in 10 minutes.</p>
            </div>
          `
        });
      } catch (e) { console.error('[OTP resend] Email failed:', e.message); }
    }
    res.json({ success: true, message: 'OTP resent successfully' });
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
  // If confirmed → activate member + auto-assign invoice number
  if (req.body.status === 'confirmed' && db.payments[idx].memberId) {
    const mIdx = (db.memberAccounts || []).findIndex(m => m.id === db.payments[idx].memberId);
    if (mIdx !== -1) db.memberAccounts[mIdx].status = 'active';
  }
  if (req.body.status === 'confirmed' && !db.payments[idx].invoiceNumber) {
    const year = new Date().getFullYear();
    const confirmedThisYear = (db.payments || []).filter(p => p.invoiceNumber && p.invoiceNumber.includes(String(year))).length;
    const seq = String(confirmedThisYear + 1).padStart(4, '0');
    db.payments[idx].invoiceNumber = `MHC-INV-${year}-${seq}`;
    db.payments[idx].invoiceDate = new Date().toISOString();
  }
  writeDB(db);
  io.emit('payment_updated', db.payments[idx]);
  emitStats();
  res.json({ success: true, data: db.payments[idx] });
});

// ==================== INVOICE ====================
app.get('/api/payments/:id/invoice', (req, res) => {
  const db = readDB();
  const payment = (db.payments || []).find(p => p.id === req.params.id);
  if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
  // Fetch company info from siteSettings
  const s = db.siteSettings || {};
  const company = {
    name:    s.siteName    || 'My Holiday Club',
    address: s.address     || 'Mumbai, India',
    phone:   s.phone       || '',
    email:   s.email       || 'info@myholidayclub.in',
    website: s.website     || 'www.myholidayclub.in',
    gst:     s.gstNumber   || '',
    logo:    s.logoUrl     || '',
  };
  // Fetch member details
  const member = (db.memberAccounts || []).find(m => m.id === payment.memberId) || {};
  res.json({ success: true, data: { payment, company, member } });
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
  syncCities(db);
  writeDB(db);
  emitStats();
  res.status(201).json({ success: true, data: prop });
});
app.put('/api/properties/:id', (req, res) => {
  const db = readDB();
  const idx = (db.properties || []).findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Not found' });
  db.properties[idx] = { ...db.properties[idx], ...req.body };
  syncCities(db);
  writeDB(db);
  res.json({ success: true, data: db.properties[idx] });
});
app.delete('/api/properties/:id', (req, res) => {
  const db = readDB();
  db.properties = (db.properties || []).filter(p => p.id !== req.params.id);
  syncCities(db);
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

// ==================== TEST SMTP ====================
app.post('/api/test-smtp', async (req, res) => {
  try {
    const { smtpHost, smtpPort, smtpUser, smtpPass, testTo } = req.body;
    if (!smtpHost || !smtpUser || !smtpPass) {
      return res.status(400).json({ success: false, message: 'SMTP host, email and password are required.' });
    }
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort) || 587,
      secure: parseInt(smtpPort) === 465,
      auth: { user: smtpUser, pass: smtpPass }
    });
    await transporter.verify();
    await transporter.sendMail({
      from: `"My Holiday Club" <${smtpUser}>`,
      to: testTo || smtpUser,
      subject: '✅ SMTP Test — My Holiday Club',
      html: `<div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:24px;border:1px solid #e2e8f0;border-radius:8px">
        <h2 style="color:#1a56db;margin-bottom:8px">✅ SMTP Configuration Working!</h2>
        <p style="color:#374151">Your email settings are correctly configured. My Holiday Club can now send emails for OTP verification and notifications.</p>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:16px 0">
        <p style="color:#6b7280;font-size:13px">Sent via: ${smtpHost}:${smtpPort || 587}<br>From: ${smtpUser}</p>
      </div>`
    });
    res.json({ success: true, message: `Test email sent successfully to ${testTo || smtpUser}` });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
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

// ==================== CARD & VOUCHER SETTINGS ====================
app.get('/api/card-voucher-settings', (req, res) => {
  const db = readDB();
  res.json({ success: true, data: db.cardVoucherSettings || {} });
});
app.put('/api/card-voucher-settings', (req, res) => {
  const db = readDB();
  db.cardVoucherSettings = { ...db.cardVoucherSettings, ...req.body };
  writeDB(db);
  res.json({ success: true, data: db.cardVoucherSettings });
});

// ==================== ABOUT US CONTENT ====================
app.get('/api/about-us', (req, res) => {
  const db = readDB();
  res.json({ success: true, data: db.aboutUs || {} });
});
app.put('/api/about-us', (req, res) => {
  const db = readDB();
  const { section, data } = req.body;
  if (!section) return res.status(400).json({ success: false, error: 'section required' });
  db.aboutUs = db.aboutUs || {};
  db.aboutUs[section] = { ...(db.aboutUs[section] || {}), ...data };
  writeDB(db);
  res.json({ success: true, data: db.aboutUs[section] });
});

// ==================== CHATBOT CONTEXT ====================
app.get('/api/chatbot-context', (req, res) => {
  const db = readDB();
  const s  = db.siteSettings || {};

  // Packages - full list
  const packages = (db.packages || []).map(p => ({
    id: p.id, name: p.name, price: p.price, duration: p.duration,
    description: p.description, features: p.features || [],
    category: p.category || '', type: p.type || '',
  }));

  // Destinations - summarised
  const destinations = (db.properties || []).map(d => ({
    id: d.id, name: d.name, location: d.location,
    region: d.region || '', type: d.type || '',
    description: d.description || '', international: d.international || false,
  }));

  // Membership benefits
  const benefits = (db.siteSettings?.membershipBenefits || []).map(b => ({
    title: b.title, desc: b.desc,
  }));

  // Membership tiers from packages
  const tiers = packages.filter(p =>
    ['starter','classic','premium'].some(t => (p.name || '').toLowerCase().includes(t))
  );

  // Company info
  const company = {
    name:    s.siteName    || 'My Holiday Club',
    phone:   s.contactInfo?.phone   || s.phone   || '',
    email:   s.contactInfo?.email   || s.email   || 'info@myholidayclub.in',
    address: s.contactInfo?.address || s.address || '',
    website: s.website || 'myholidayclub.in',
  };

  res.json({
    success: true,
    data: { packages, destinations, benefits, tiers, company },
  });
});

// ==================== INVOICE SETTINGS ====================
app.get('/api/invoice-settings', (req, res) => {
  const db = readDB();
  res.json({ success: true, data: db.invoiceSettings || {} });
});
app.put('/api/invoice-settings', (req, res) => {
  const db = readDB();
  db.invoiceSettings = { ...db.invoiceSettings, ...req.body };
  writeDB(db);
  res.json({ success: true, data: db.invoiceSettings });
});

// ==================== TEAM ====================
app.get('/api/team', (req, res) => {
  const db = readDB();
  res.json({ success: true, data: db.team || [] });
});
app.put('/api/team', (req, res) => {
  const db = readDB();
  db.team = req.body.members || [];
  writeDB(db);
  res.json({ success: true, data: db.team });
});

// ==================== PARSE PDF TEXT ====================
app.post('/api/parse-pdf', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
  try {
    const pdfParse = require('pdf-parse');
    const data = await pdfParse(fs.readFileSync(req.file.path));
    fs.unlinkSync(req.file.path);
    res.json({ success: true, text: data.text });
  } catch (e) {
    res.status(500).json({ success: false, message: 'PDF parse failed: ' + e.message });
  }
});

// ==================== BULK IMPORT ====================
app.post('/api/bulk-import', (req, res) => {
  const { entries } = req.body; // [{name, location, city, state, starRating, type, mapsUrl, regionId, description}]
  if (!Array.isArray(entries) || entries.length === 0)
    return res.status(400).json({ success: false, message: 'No entries provided' });

  const db = readDB();
  db.regions = db.regions || [];
  db.properties = db.properties || [];

  const created = { regions: 0, properties: 0, skipped: 0 };

  entries.forEach(entry => {
    if (!entry.name || !entry.regionId) { created.skipped++; return; }

    // Only allow existing region IDs — no auto-creation
    let regionId = entry.regionId;
    if (regionId.startsWith('__new__')) { created.skipped++; return; }
    const regionExists = db.regions.find(r => r.id === regionId);
    if (!regionExists) { created.skipped++; return; }

    // Skip duplicate properties (same name + regionId)
    const dup = db.properties.find(
      p => p.regionId === regionId && p.name.toLowerCase() === entry.name.toLowerCase()
    );
    if (dup) { created.skipped++; return; }

    const stars = parseInt(entry.starRating) || 0;
    const typeLabel = entry.type || (stars >= 4 ? 'Hotel' : 'Resort');

    const prop = {
      id: uuidv4(),
      regionId,
      name: entry.name,
      type: typeLabel,
      location: entry.location || entry.city || '',
      starRating: stars,
      mapsUrl: entry.mapsUrl || '',
      rating: stars > 0 ? Math.min(5, stars + 0.2 + Math.random() * 0.5) : 4.0,
      price: entry.price || (stars >= 5 ? 12000 : stars >= 4 ? 8000 : stars >= 3 ? 5000 : 3500),
      priceUnit: 'per night',
      images: [
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
        'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',
      ],
      description: entry.description || `${entry.name} — a premium ${stars > 0 ? stars + '-star' : ''} property in ${entry.city || entry.location}.`,
      amenities: ['Free WiFi', 'Air Conditioning', 'Room Service', 'Parking'],
      featured: false,
      createdAt: new Date().toISOString(),
    };
    db.properties.push(prop);
    created.properties++;
  });

  syncCities(db);
  writeDB(db);
  emitStats();
  res.json({ success: true, created });
});

// ==================== BULK IMPORT PACKAGES ====================
app.post('/api/bulk-import-packages', (req, res) => {
  const { packages } = req.body;
  if (!Array.isArray(packages) || packages.length === 0)
    return res.status(400).json({ success: false, message: 'No packages provided' });

  const db = readDB();
  db.packages = db.packages || [];

  const COLORS = ['#0077C8','#7c3aed','#f59e0b','#10b981','#ef4444','#0ea5e9'];
  const created = { packages: 0, skipped: 0 };

  packages.forEach((pkg, i) => {
    if (!pkg.name) { created.skipped++; return; }
    const dup = db.packages.find(p => p.name.toLowerCase() === pkg.name.toLowerCase());
    if (dup) { created.skipped++; return; }

    const features = Array.isArray(pkg.features)
      ? pkg.features
      : String(pkg.features || '').split(',').map(f => f.trim()).filter(Boolean);

    db.packages.push({
      id: uuidv4(),
      name: pkg.name,
      price: parseInt(pkg.price) || 0,
      duration: pkg.duration || '3 Nights / 4 Days',
      validity: pkg.validity || '2 Years',
      description: pkg.description || `${pkg.name} — a premium holiday membership package.`,
      images: pkg.images && pkg.images.length
        ? pkg.images
        : ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'],
      features,
      color: pkg.color || COLORS[i % COLORS.length],
      badge: pkg.badge || pkg.name.split(' ')[0],
      popular: pkg.popular === true || String(pkg.popular).toLowerCase() === 'yes',
      createdAt: new Date().toISOString(),
    });
    created.packages++;
  });

  writeDB(db);
  res.json({ success: true, created });
});

// ==================== BULK REMOVE PROPERTIES ====================
app.post('/api/bulk-remove-properties', (req, res) => {
  const { propertyIds } = req.body;
  if (!Array.isArray(propertyIds) || propertyIds.length === 0)
    return res.status(400).json({ success: false, message: 'No property IDs provided' });

  const db = readDB();
  const before = (db.properties || []).length;
  db.properties = (db.properties || []).filter(p => !propertyIds.includes(p.id));
  const removed = before - db.properties.length;

  syncCities(db);
  writeDB(db);
  emitStats();
  res.json({ success: true, removed, remaining: db.properties.length });
});

// ==================== BULK REMOVE PACKAGES ====================
app.post('/api/bulk-remove-packages', (req, res) => {
  const { packageIds } = req.body;
  if (!Array.isArray(packageIds) || packageIds.length === 0)
    return res.status(400).json({ success: false, message: 'No package IDs provided' });

  const db = readDB();
  const before = (db.packages || []).length;
  db.packages = (db.packages || []).filter(p => !packageIds.includes(p.id));
  const removed = before - db.packages.length;

  writeDB(db);
  res.json({ success: true, removed, remaining: db.packages.length });
});

// ==================== SEARCH PROPERTIES (for bulk remove) ====================
app.get('/api/search-properties', (req, res) => {
  const { q, regionId } = req.query;
  const db = readDB();
  let props = db.properties || [];

  if (regionId) {
    props = props.filter(p => p.regionId === regionId);
  }
  if (q) {
    const query = q.toLowerCase().trim();
    props = props.filter(p =>
      (p.name || '').toLowerCase().includes(query) ||
      (p.city || '').toLowerCase().includes(query) ||
      (p.location || '').toLowerCase().includes(query) ||
      (p.type || '').toLowerCase().includes(query)
    );
  }
  res.json({ success: true, data: props });
});

// ==================== SEARCH PACKAGES (for bulk remove) ====================
app.get('/api/search-packages', (req, res) => {
  const { q } = req.query;
  const db = readDB();
  let pkgs = db.packages || [];

  if (q) {
    const query = q.toLowerCase().trim();
    pkgs = pkgs.filter(p =>
      (p.name || '').toLowerCase().includes(query) ||
      (p.badge || '').toLowerCase().includes(query) ||
      (p.description || '').toLowerCase().includes(query)
    );
  }
  res.json({ success: true, data: pkgs });
});

// ==================== CITIES ====================

// Helper: derive a slug from a city name
function citySlug(name) {
  return (name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// Sync cities from all current properties (called after any property mutation)
function syncCities(db) {
  db.cities = db.cities || [];
  const seen = {};
  (db.properties || []).forEach(p => {
    const raw = (p.city || p.location || '').split(',')[0].trim();
    if (!raw) return;
    const slug = citySlug(raw);
    if (!slug) return;
    if (!seen[slug]) {
      seen[slug] = { id: slug, name: raw, slug, regionId: p.regionId || '', propertyCount: 0 };
    }
    seen[slug].propertyCount++;
    // keep regionId from first property that has one
    if (!seen[slug].regionId && p.regionId) seen[slug].regionId = p.regionId;
  });
  db.cities = Object.values(seen).sort((a, b) => a.name.localeCompare(b.name));
}

// GET /api/cities  — returns all, or filtered by ?regionId=
app.get('/api/cities', (req, res) => {
  const db = readDB();
  syncCities(db);
  let cities = db.cities;
  if (req.query.regionId) cities = cities.filter(c => c.regionId === req.query.regionId);
  res.json(cities);
});

// GET /api/cities/:slug — single city info + its properties
app.get('/api/cities/:slug', (req, res) => {
  const db = readDB();
  syncCities(db);
  const slug = req.params.slug;
  const city = (db.cities || []).find(c => c.slug === slug);
  if (!city) return res.status(404).json({ success: false, message: 'City not found' });
  const props = (db.properties || []).filter(p => {
    const cs = citySlug((p.city || p.location || '').split(',')[0].trim());
    return cs === slug;
  });
  res.json({ success: true, city, properties: props });
});

// ==================== ANALYTICS ====================
app.get('/api/analytics', (req, res) => {
  const db = readDB();
  const now = new Date();

  const monthKey = d => { const dt = new Date(d); return `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}`; };
  const last6 = Array.from({length:6}, (_,i) => {
    const d = new Date(now.getFullYear(), now.getMonth()-5+i, 1);
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
  });

  const bucket = (items, dateField) => {
    const map = {};
    (items||[]).forEach(x => { const k = monthKey(x[dateField]||x.createdAt); if(map[k]===undefined) map[k]=0; map[k]++; });
    return last6.map(m => ({ month: m, count: map[m]||0 }));
  };

  const propsByRegion = {};
  (db.properties||[]).forEach(p => { propsByRegion[p.regionId] = (propsByRegion[p.regionId]||0)+1; });

  const propsByType = {};
  (db.properties||[]).forEach(p => { const t=p.type||'Other'; propsByType[t]=(propsByType[t]||0)+1; });

  res.json({
    totals: {
      properties: (db.properties||[]).length,
      packages:   (db.packages||[]).length,
      bookings:   (db.bookings||[]).length,
      enquiries:  (db.enquiries||[]).length,
      contacts:   (db.contacts||[]).length,
      members:    (db.members||[]).length,
      cities:     (db.cities||[]).length,
    },
    charts: {
      bookings:  bucket(db.bookings,  'createdAt'),
      enquiries: bucket(db.enquiries, 'createdAt'),
      members:   bucket(db.members,   'createdAt'),
      contacts:  bucket(db.contacts,  'createdAt'),
    },
    propsByRegion,
    propsByType,
    recentBookings:  (db.bookings||[]).slice(-5).reverse(),
    recentEnquiries: (db.enquiries||[]).slice(-5).reverse(),
    recentMembers:   (db.members||[]).slice(-5).reverse(),
  });
});

// ==================== NOTIFICATIONS ====================
app.get('/api/notifications', (req, res) => {
  const db = readDB();
  const limit = parseInt(req.query.limit)||20;
  const items = [];

  (db.bookings||[]).forEach(b => items.push({
    id: b.id, type: 'booking', icon: '📅',
    title: `New Booking — ${b.destination||b.name||'Unknown'}`,
    subtitle: b.guestName||b.name||'Guest',
    time: b.createdAt, read: false,
  }));
  (db.enquiries||[]).forEach(e => items.push({
    id: e.id, type: 'enquiry', icon: '📩',
    title: `Enquiry — ${e.destination||e.subject||'General'}`,
    subtitle: e.name||e.email||'',
    time: e.createdAt, read: false,
  }));
  (db.contacts||[]).forEach(c => items.push({
    id: c.id, type: 'contact', icon: '📞',
    title: `Contact — ${c.subject||c.name||'New Message'}`,
    subtitle: c.name||c.email||'',
    time: c.createdAt, read: false,
  }));
  (db.members||[]).forEach(m => items.push({
    id: m.id, type: 'member', icon: '👤',
    title: `New Member — ${m.fullName||m.email||''}`,
    subtitle: m.packageId||'Free',
    time: m.createdAt, read: false,
  }));

  items.sort((a,b) => new Date(b.time||0) - new Date(a.time||0));
  res.json(items.slice(0, limit));
});

// ==================== STAYS (by property type) ====================
app.get('/api/stays', (req, res) => {
  const db = readDB();
  const type = req.query.type; // 'Homestay','Beach Stay','Villa','Cottage'
  let props = db.properties || [];
  if (type) {
    props = props.filter(p => (p.type||'').toLowerCase() === type.toLowerCase());
  } else {
    const STAY_TYPES = ['homestay','beach stay','villa','cottage','heritage','farmstay'];
    props = props.filter(p => STAY_TYPES.includes((p.type||'').toLowerCase()));
  }
  // group by type
  const grouped = {};
  props.forEach(p => {
    const t = p.type||'Other';
    if (!grouped[t]) grouped[t] = [];
    grouped[t].push(p);
  });
  res.json({ success: true, properties: props, grouped, total: props.length });
});
