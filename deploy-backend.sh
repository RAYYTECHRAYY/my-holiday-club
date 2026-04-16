#!/bin/bash
# =====================================================
# My Holiday Club - Backend Deployment Script
# Run this in CloudPanel Terminal as root
# =====================================================

set -e
echo "🚀 Starting My Holiday Club Backend Deployment..."
echo "=================================================="

# Step 1: Install Node.js if not present
if ! command -v node &> /dev/null; then
    echo "📦 Installing Node.js 20..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
    echo "✅ Node.js $(node --version) installed"
else
    echo "✅ Node.js already installed: $(node --version)"
fi

# Step 2: Install PM2 if not present
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installing PM2..."
    npm install -g pm2
    echo "✅ PM2 installed"
else
    echo "✅ PM2 already installed: $(pm2 --version)"
fi

# Step 3: Set up deployment directory
DEPLOY_DIR="/var/www/my-holiday-club-api"
echo ""
echo "📁 Setting up deployment directory: $DEPLOY_DIR"

if [ -d "$DEPLOY_DIR" ]; then
    echo "   Directory exists - pulling latest code..."
    cd "$DEPLOY_DIR"
    git pull origin main 2>/dev/null || git pull origin master 2>/dev/null || echo "Git pull skipped"
else
    echo "   Cloning from GitHub..."
    git clone https://github.com/RAYYTECHRAYY/my-holiday-club.git "$DEPLOY_DIR"
    cd "$DEPLOY_DIR"
fi

# Step 4: Install backend dependencies
echo ""
echo "📦 Installing backend dependencies..."
cd "$DEPLOY_DIR/backend"
npm install --production

# Step 5: Ensure db.json exists
if [ ! -f "db.json" ]; then
    echo "📄 Creating initial db.json..."
    cat > db.json << 'JSON'
{
  "packages": [],
  "destinations": [],
  "enquiries": [],
  "contacts": [],
  "members": [],
  "settings": {
    "siteName": "My Holiday Club",
    "contactInfo": {
      "phone": "+91 98765 43210",
      "email": "info@myholidayclub.co.in",
      "address": "123 Travel House, Connaught Place, New Delhi - 110001",
      "whatsapp": "+91 98765 43210"
    },
    "socialMedia": {
      "facebook": "#",
      "instagram": "#",
      "twitter": "#",
      "youtube": "#",
      "linkedin": "#"
    }
  }
}
JSON
fi

# Step 6: Start/Restart with PM2
echo ""
echo "🚀 Starting backend with PM2..."
cd "$DEPLOY_DIR/backend"
pm2 stop my-holiday-club-api 2>/dev/null || true
pm2 start server.js --name my-holiday-club-api
pm2 save
pm2 startup 2>/dev/null | tail -1 | bash 2>/dev/null || true

echo ""
echo "✅ Backend is running!"
pm2 list

echo ""
echo "🔗 Backend running at: http://localhost:5000"
echo ""
echo "=================================================="
echo "📋 NEXT STEP - Set up Nginx reverse proxy:"
echo "=================================================="
echo ""
echo "Run this command to create the Nginx config:"
echo ""
echo "  bash /var/www/my-holiday-club-api/setup-nginx.sh"
echo ""
echo "OR manually add this to your Nginx site config:"
echo ""
echo "  location /api/ {"
echo "    proxy_pass http://localhost:5000;"
echo "    proxy_http_version 1.1;"
echo "    proxy_set_header Upgrade \$http_upgrade;"
echo "    proxy_set_header Connection 'upgrade';"
echo "    proxy_set_header Host \$host;"
echo "    proxy_cache_bypass \$http_upgrade;"
echo "  }"
echo ""
