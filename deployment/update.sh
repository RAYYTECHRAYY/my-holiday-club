#!/bin/bash
# ─────────────────────────────────────────────
# MHC UPDATE SCRIPT — Pull latest + redeploy
# Run this every time you push new code
# Usage: bash update.sh
# ─────────────────────────────────────────────
set -e

APP_DIR="/var/www/mhc"

echo "========================================"
echo "  MHC Update — Pulling Latest Code"
echo "========================================"

cd $APP_DIR
git pull origin main

echo "[1/4] Rebuilding frontend..."
cd $APP_DIR/frontend && npm install && npm run build

echo "[2/4] Rebuilding admin..."
cd $APP_DIR/admin && npm install && npm run build

echo "[3/4] Installing backend deps..."
cd $APP_DIR/backend && npm install --production

echo "[4/4] Restarting backend..."
pm2 restart mhc-backend

echo ""
echo "✅ Update complete! Live at https://demo.myholidayclub.in"
pm2 status
