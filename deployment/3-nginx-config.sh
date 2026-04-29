#!/bin/bash
# ─────────────────────────────────────────────
# MHC STEP 3 — Configure Nginx
# Run after Step 2
# Usage: bash 3-nginx-config.sh
# ─────────────────────────────────────────────
set -e

DOMAIN="demo.myholidayclub.in"
ADMIN_DOMAIN="admin-demo.myholidayclub.in"
APP_DIR="/var/www/mhc"

echo "========================================"
echo "  MHC Nginx Configuration — Step 3"
echo "========================================"

# ── Main site (frontend + API proxy) ────────
echo "[1/3] Writing Nginx config for $DOMAIN..."
cat > /etc/nginx/sites-available/mhc-frontend << NGINXCONF
server {
    listen 80;
    server_name $DOMAIN;

    root $APP_DIR/frontend/build;
    index index.html;

    # Serve React app — all routes go to index.html
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Proxy API calls to backend
    location /api/ {
        proxy_pass         http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade \$http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host \$host;
        proxy_set_header   X-Real-IP \$remote_addr;
        proxy_set_header   X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Socket.io
    location /socket.io/ {
        proxy_pass         http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade \$http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host \$host;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files \$uri =404;
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;
    gzip_min_length 1024;
}
NGINXCONF

# ── Admin panel ──────────────────────────────
echo "[2/3] Writing Nginx config for $ADMIN_DOMAIN..."
cat > /etc/nginx/sites-available/mhc-admin << NGINXCONF
server {
    listen 80;
    server_name $ADMIN_DOMAIN;

    root $APP_DIR/admin/build;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location /api/ {
        proxy_pass         http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header   Host \$host;
        proxy_set_header   X-Real-IP \$remote_addr;
        proxy_set_header   X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto \$scheme;
    }

    location /socket.io/ {
        proxy_pass         http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade \$http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host \$host;
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
}
NGINXCONF

# ── Enable sites ─────────────────────────────
echo "[3/3] Enabling sites and reloading Nginx..."
ln -sf /etc/nginx/sites-available/mhc-frontend /etc/nginx/sites-enabled/
ln -sf /etc/nginx/sites-available/mhc-admin    /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

nginx -t && systemctl reload nginx

echo ""
echo "✅ Nginx configured!"
echo "   Main site:  http://$DOMAIN"
echo "   Admin:      http://$ADMIN_DOMAIN"
echo ""
echo "👉 Next step: Run 4-start-backend.sh"
