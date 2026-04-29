# MHC — Production Deployment Guide
## Target: demo.myholidayclub.in (Ubuntu VPS)

---

## Architecture

```
demo.myholidayclub.in          → Frontend (React static build)
demo.myholidayclub.in/api/     → Backend (Node.js API via Nginx proxy)
admin-demo.myholidayclub.in    → Admin Panel (React static build)

Server: Ubuntu 20/22 VPS
Process manager: PM2
Web server: Nginx
SSL: Let's Encrypt (Certbot)
```

---

## BEFORE YOU BEGIN — DNS Setup

In your domain registrar (wherever you bought myholidayclub.in), add these DNS records:

| Type | Name                  | Value         | TTL  |
|------|-----------------------|---------------|------|
| A    | demo                  | YOUR_SERVER_IP | 3600 |
| A    | admin-demo            | YOUR_SERVER_IP | 3600 |

⏳ DNS propagation takes 5–30 minutes. You can check with:
```bash
nslookup demo.myholidayclub.in
```

---

## PHASE 1 — Push Code to GitHub

On your Mac, from the project folder:

```bash
cd /Users/rayytech/Documents/Myholidayclub2

# Initialize git (if not done already)
git init
git add .
git commit -m "Initial commit — MHC production release"

# Create a new repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/myholidayclub.git
git branch -M main
git push -u origin main
```

### ⚠️ Create a .gitignore first!
Make sure this file exists at the project root:

```
node_modules/
backend/db.json
frontend/build/
admin/build/
.env
.DS_Store
```

---

## PHASE 2 — Server Setup (Run Once)

SSH into your server:
```bash
ssh root@YOUR_SERVER_IP
```

Run the setup script:
```bash
# Upload the script first (from your Mac):
scp deployment/1-server-setup.sh root@YOUR_SERVER_IP:/root/

# Then on the server:
bash /root/1-server-setup.sh
```

**What this installs:** Node.js 20, npm, PM2, Nginx, Certbot, UFW firewall.

---

## PHASE 3 — Deploy Application

Still on the server, edit and run:
```bash
# Upload deploy script
scp deployment/2-deploy-app.sh root@YOUR_SERVER_IP:/root/

# Edit to add your GitHub repo URL
nano /root/2-deploy-app.sh
# Change: GITHUB_REPO="https://github.com/YOUR_USERNAME/myholidayclub.git"

bash /root/2-deploy-app.sh
```

---

## PHASE 4 — Configure Nginx

```bash
scp deployment/3-nginx-config.sh root@YOUR_SERVER_IP:/root/
bash /root/3-nginx-config.sh
```

Test Nginx:
```bash
nginx -t          # Should say: syntax is ok
systemctl status nginx
```

---

## PHASE 5 — Start Backend API

```bash
scp deployment/4-start-backend.sh root@YOUR_SERVER_IP:/root/
bash /root/4-start-backend.sh
```

Check it's running:
```bash
pm2 status           # Should show mhc-backend as online
pm2 logs mhc-backend # View live logs
curl http://localhost:5000/api/health  # Should return OK
```

Update the `.env` file with your settings:
```bash
nano /var/www/mhc/backend/.env
```

---

## PHASE 6 — Enable HTTPS (After DNS points to server)

```bash
scp deployment/5-ssl-setup.sh root@YOUR_SERVER_IP:/root/
# Edit to add your email:
nano /root/5-ssl-setup.sh

bash /root/5-ssl-setup.sh
```

---

## ✅ LIVE CHECKLIST

- [ ] DNS A records added (demo + admin-demo)
- [ ] Server setup script ran successfully
- [ ] Code cloned from GitHub
- [ ] Frontend built without errors
- [ ] Admin built without errors
- [ ] Nginx configured and running
- [ ] Backend running in PM2 (`pm2 status`)
- [ ] http://demo.myholidayclub.in loads the site
- [ ] http://demo.myholidayclub.in/api/ returns a response
- [ ] http://admin-demo.myholidayclub.in loads the admin
- [ ] SSL certificates issued (https works)
- [ ] http:// auto-redirects to https://

---

## ONGOING — Updating the Site

Every time you push new code to GitHub:

```bash
# On the server:
bash /root/update.sh
```

Or if you uploaded the update script:
```bash
scp deployment/update.sh root@YOUR_SERVER_IP:/root/
```

---

## USEFUL COMMANDS

```bash
# Check backend status
pm2 status
pm2 logs mhc-backend

# Restart backend
pm2 restart mhc-backend

# Check Nginx
nginx -t
systemctl status nginx
systemctl reload nginx

# View Nginx error logs
tail -f /var/log/nginx/error.log

# Check disk space
df -h

# Check memory
free -m

# Renew SSL manually
certbot renew --dry-run
```

---

## BACKEND .env — Required Variables

Located at: `/var/www/mhc/backend/.env`

```env
PORT=5000
NODE_ENV=production
JWT_SECRET=your-super-secret-key-change-this
FRONTEND_URL=https://demo.myholidayclub.in
ADMIN_URL=https://admin-demo.myholidayclub.in
```

---

## Support

If anything fails, run:
```bash
# Backend logs
pm2 logs mhc-backend --lines 50

# Nginx logs
tail -50 /var/log/nginx/error.log
tail -50 /var/log/nginx/access.log
```

Share the error output so we can debug together.
