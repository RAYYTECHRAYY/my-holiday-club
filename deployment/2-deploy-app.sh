#!/bin/bash
# ─────────────────────────────────────────────
# MHC STEP 2 — Clone & Build Application
# Run this ONCE after Step 1
# Usage: bash 2-deploy-app.sh
# ─────────────────────────────────────────────
set -e

# ── CONFIGURE THESE ──────────────────────────
GITHUB_REPO="https://github.com/YOUR_USERNAME/myholidayclub.git"
APP_DIR="/var/www/mhc"
DOMAIN="demo.myholidayclub.in"
# ─────────────────────────────────────────────

echo "========================================"
echo "  MHC Deploy — Step 2"
echo "========================================"

# 1. Create app directory
echo "[1/6] Creating app directory at $APP_DIR..."
mkdir -p $APP_DIR
cd $APP_DIR

# 2. Clone repo
echo "[2/6] Cloning repository..."
if [ -d "$APP_DIR/.git" ]; then
  echo "  Repo already exists — pulling latest..."
  git pull origin main
else
  git clone $GITHUB_REPO .
fi

# 3. Install backend dependencies
echo "[3/6] Installing backend dependencies..."
cd $APP_DIR/backend
npm install --production

# 4. Build frontend
echo "[4/6] Building frontend..."
cd $APP_DIR/frontend
npm install
npm run build
echo "  ✅ Frontend built"

# 5. Build admin
echo "[5/6] Building admin panel..."
cd $APP_DIR/admin
npm install
npm run build
echo "  ✅ Admin built"

# 6. Set permissions
echo "[6/6] Setting permissions..."
chown -R www-data:www-data $APP_DIR/frontend/build
chown -R www-data:www-data $APP_DIR/admin/build

echo ""
echo "✅ App deployed successfully!"
echo "   Frontend build: $APP_DIR/frontend/build"
echo "   Admin build:    $APP_DIR/admin/build"
echo "   Backend:        $APP_DIR/backend"
echo ""
echo "👉 Next step: Run 3-nginx-config.sh"
