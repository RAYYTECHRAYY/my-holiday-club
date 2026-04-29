# 🏖️ My Holiday Club - Full Stack Platform

## Quick Start Guide

### Prerequisites
- Node.js (v16 or higher)
- npm

---

## 🚀 Step-by-Step Setup

### Step 1: Install Dependencies

Open THREE separate terminal windows and run:

**Terminal 1 - Backend:**
```bash
cd my-holiday-club/backend
npm install
```

**Terminal 2 - Frontend:**
```bash
cd my-holiday-club/frontend
npm install
```

**Terminal 3 - Admin:**
```bash
cd my-holiday-club/admin
npm install
```

---

### Step 2: Start All Services

**Terminal 1 - Start Backend API (Port 5000):**
```bash
cd my-holiday-club/backend
node server.js
```

**Terminal 2 - Start Frontend (Port 3000):**
```bash
cd my-holiday-club/frontend
npm start
```

**Terminal 3 - Start Admin Panel (Port 3001):**
```bash
cd my-holiday-club/admin
npm start
```

---

## 🌐 Access URLs

| Service | URL | Description |
|---------|-----|-------------|
| **Main Website** | http://localhost:3000 | Customer-facing website |
| **Admin Panel** | http://localhost:3001 | Admin dashboard |
| **Backend API** | http://localhost:5000 | REST API server |

---

## 🔐 Admin Login

- **Username:** `admin`
- **Password:** `mhc@2024`

---

## 📋 Features

### Frontend Website
- ✅ Animated Splash Screen with loading progress
- ✅ Sticky Navbar with mega dropdown (Destinations + About)
- ✅ Hero slider with 4 rotating slides
- ✅ Home page with stats, destinations, testimonials, CTA sections
- ✅ Become a Member popup form with success animation
- ✅ Destination pages for North, East, West, South India & International
- ✅ Booking inquiry form popup with submission animation
- ✅ All About Us sub-pages (Overview, Philosophy, Founder's Message, News, Press Release, Careers)
- ✅ Packages page with pricing plans
- ✅ Contact page with form + social media links
- ✅ Footer with all links + social media

### Admin Panel
- ✅ Secure login (admin/mhc@2024)
- ✅ Dashboard with live statistics
- ✅ Members management (view, edit status, delete)
- ✅ Inquiries management (view details, update status)
- ✅ Contact messages management
- ✅ Destinations management (add, edit, delete with images)
- ✅ Packages management (add, edit, delete)
- ✅ News & Updates management
- ✅ Site Settings (edit contact info + social media links)

### Backend API
- ✅ Members CRUD
- ✅ Inquiries CRUD
- ✅ Contacts CRUD
- ✅ Destinations CRUD
- ✅ Packages CRUD
- ✅ News CRUD
- ✅ Site Settings (GET/PUT)
- ✅ Dashboard statistics

---

## 🎨 Design
- **Primary Color:** #0077C8 (Blue - from logo)
- **Secondary Color:** #f0a500 (Gold)
- **Fonts:** Playfair Display (headings) + Inter (body)
- **Animations:** Fade-in on scroll, slide transitions, form submission animations

---

## 📁 Project Structure

```
my-holiday-club/
├── backend/          # Express.js API server (Port 5000)
│   ├── server.js     # Main server file with all API routes
│   └── db.json       # JSON file-based database
├── frontend/         # React customer website (Port 3000)
│   └── src/
│       ├── App.jsx
│       ├── components/  (Navbar, Footer, SplashScreen, Modals)
│       └── pages/       (Home, Destinations, About, Contact, etc.)
└── admin/            # React admin panel (Port 3001)
    └── src/
        ├── App.jsx
        ├── components/  (Sidebar, Topbar)
        └── pages/       (Dashboard, Members, Destinations, etc.)
```

---

## 💡 Tips

- Data is stored in `backend/db.json` - it persists between sessions
- The admin panel connects to the same API as the frontend
- All forms submit to the backend API and data appears immediately in admin panel
- To add the actual logo PNG: place it in `frontend/public/logo.png`
