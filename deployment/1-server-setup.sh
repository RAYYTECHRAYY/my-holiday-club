#!/bin/bash
# ─────────────────────────────────────────────
# MHC STEP 1 — Server Initial Setup
# Run this ONCE as root on a fresh Ubuntu 20/22 VPS
# Usage: bash 1-server-setup.sh
# ─────────────────────────────────────────────
set -e

echo "========================================"
echo "  MHC Server Setup — Step 1"
echo "========================================"

# 1. Update system
echo "[1/7] Updating system packages..."
apt update && apt upgrade -y

# 2. Install essential tools
echo "[2/7] Installing essential tools..."
apt install -y curl wget git unzip build-essential ufw

# 3. Install Node.js 20.x
echo "[3/7] Installing Node.js 20.x..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
echo "Node: $(node -v)  |  npm: $(npm -v)"

# 4. Install PM2 (process manager)
echo "[4/7] Installing PM2..."
npm install -g pm2
pm2 startup systemd -u root --hp /root

# 5. Install Nginx
echo "[5/7] Installing Nginx..."
apt install -y nginx
systemctl enable nginx
systemctl start nginx

# 6. Install Certbot (SSL)
echo "[6/7] Installing Certbot for SSL..."
apt install -y certbot python3-certbot-nginx

# 7. Configure firewall
echo "[7/7] Configuring firewall..."
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

echo ""
echo "✅ Server setup complete!"
echo "   Node.js: $(node -v)"
echo "   npm:     $(npm -v)"
echo "   PM2:     $(pm2 -v)"
echo "   Nginx:   $(nginx -v 2>&1)"
echo ""
echo "👉 Next step: Run 2-deploy-app.sh"
