#!/bin/bash
# ─────────────────────────────────────────────
# MHC STEP 4 — Start Backend with PM2
# Usage: bash 4-start-backend.sh
# ─────────────────────────────────────────────
set -e

APP_DIR="/var/www/mhc"

echo "========================================"
echo "  MHC Backend Start — Step 4"
echo "========================================"

cd $APP_DIR/backend

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
  echo "[!] Creating .env file..."
  cat > .env << ENVFILE
PORT=5000
NODE_ENV=production
JWT_SECRET=$(openssl rand -base64 48)
FRONTEND_URL=https://demo.myholidayclub.in
ADMIN_URL=https://admin-demo.myholidayclub.in
ENVFILE
  echo "  ✅ .env created with a secure JWT_SECRET"
  echo "  ⚠️  Review and update .env at: $APP_DIR/backend/.env"
fi

# Stop any existing PM2 process
pm2 delete mhc-backend 2>/dev/null || true

# Start with PM2
pm2 start server.js \
  --name "mhc-backend" \
  --env production \
  --max-memory-restart 400M \
  --log /var/log/mhc-backend.log \
  --error /var/log/mhc-backend-error.log

# Save PM2 process list (survives reboots)
pm2 save

echo ""
echo "✅ Backend is running!"
pm2 list
echo ""
echo "   API:     http://localhost:5000"
echo "   Logs:    pm2 logs mhc-backend"
echo "   Status:  pm2 status"
echo ""
echo "👉 Next step: Run 5-ssl-setup.sh to enable HTTPS"
