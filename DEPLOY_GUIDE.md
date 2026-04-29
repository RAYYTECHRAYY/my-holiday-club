# My Holiday Club — Server Deployment Guide

## The Problem
Hostinger blocks SSH access from external IPs for security.  
**Solution:** Use CloudPanel's built-in terminal.

---

## Step 1: Open CloudPanel Terminal

1. Open your browser and go to:  
   **https://187.127.145.211:8443**

2. Log in with:
   - Username: `root`
   - Password: `)GU&s+BDBlKwbGGa0Zo?`

3. In CloudPanel, click **"Tools"** in the left menu  
   Then click **"Terminal"** (or look for a terminal/console option)

---

## Step 2: Run the Deployment

Paste this **entire block** into the terminal and press Enter:

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && apt-get install -y nodejs && npm install -g pm2 && git clone https://github.com/RAYYTECHRAYY/my-holiday-club.git /var/www/my-holiday-club-api ; cd /var/www/my-holiday-club-api/backend && npm install --production && [ ! -f db.json ] && echo '{"packages":[],"destinations":[],"enquiries":[],"contacts":[],"members":[],"settings":{"siteName":"My Holiday Club","contactInfo":{"phone":"+91 98765 43210","email":"info@myholidayclub.co.in","address":"123 Travel House, New Delhi","whatsapp":"+91 98765 43210"},"socialMedia":{"facebook":"#","instagram":"#","twitter":"#","youtube":"#","linkedin":"#"}}}' > db.json ; pm2 start server.js --name my-holiday-club-api && pm2 save && echo "SUCCESS - Backend running on port 5000!"
```

---

## Step 3: Set Up Domain/Subdomain (in CloudPanel)

1. In CloudPanel → **"Sites"** → **"Add Site"**
2. Create a new site: `api.yourdomain.com` (or use a subfolder)
3. Set the site type to **"Reverse Proxy"**
4. Set proxy URL to: `http://127.0.0.1:5000`

> **Or** if you want to use a path like `yourdomain.com/api/`:
> Edit the Nginx config in CloudPanel and add the proxy_pass block

---

## Step 4: Update Your Netlify Frontend

Once the backend is live on your domain, update `frontend/src/api.js` and `admin/src/api.js`:

```js
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production'
    ? 'https://api.yourdomain.com'  // ← your new server URL
    : '',
});
```

Then redeploy to Netlify.

---

## Alternative: Allow SSH Access

In CloudPanel → **"Security"** → **"Firewall"**  
Add your IP to the SSH whitelist, then I can connect and deploy automatically.

---

*Backend port: 5000 | GitHub: https://github.com/RAYYTECHRAYY/my-holiday-club*
