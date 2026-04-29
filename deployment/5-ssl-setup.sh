#!/bin/bash
# ─────────────────────────────────────────────
# MHC STEP 5 — Enable HTTPS with Let's Encrypt
# ⚠️  DNS must point to this server BEFORE running!
# Usage: bash 5-ssl-setup.sh
# ─────────────────────────────────────────────
set -e

DOMAIN="demo.myholidayclub.in"
ADMIN_DOMAIN="admin-demo.myholidayclub.in"
EMAIL="your-email@domain.com"   # <-- Change this to your email

echo "========================================"
echo "  MHC SSL Setup — Step 5"
echo "========================================"

echo "[1/2] Getting SSL certificate for $DOMAIN..."
certbot --nginx \
  -d $DOMAIN \
  --non-interactive \
  --agree-tos \
  --email $EMAIL \
  --redirect

echo "[2/2] Getting SSL certificate for $ADMIN_DOMAIN..."
certbot --nginx \
  -d $ADMIN_DOMAIN \
  --non-interactive \
  --agree-tos \
  --email $EMAIL \
  --redirect

echo ""
echo "✅ HTTPS enabled!"
echo "   Main site: https://$DOMAIN"
echo "   Admin:     https://$ADMIN_DOMAIN"
echo ""
echo "   Certificates auto-renew every 90 days."
echo "   To manually renew: certbot renew"
