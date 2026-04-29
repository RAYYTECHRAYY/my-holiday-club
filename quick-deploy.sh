#!/bin/bash
# One-liner deployment for CloudPanel terminal
# Paste this entire block into the terminal

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && apt-get install -y nodejs

# Install PM2
npm install -g pm2

# Clone project
git clone https://github.com/RAYYTECHRAYY/my-holiday-club.git /var/www/my-holiday-club-api

# Install dependencies
cd /var/www/my-holiday-club-api/backend && npm install --production

# Create db.json if missing
[ ! -f db.json ] && echo '{"packages":[],"destinations":[],"enquiries":[],"contacts":[],"members":[],"settings":{"siteName":"My Holiday Club","contactInfo":{"phone":"+91 98765 43210","email":"info@myholidayclub.co.in","address":"123 Travel House, Connaught Place, New Delhi - 110001","whatsapp":"+91 98765 43210"},"socialMedia":{"facebook":"#","instagram":"#","twitter":"#","youtube":"#","linkedin":"#"}}}' > db.json

# Start with PM2
pm2 start server.js --name my-holiday-club-api && pm2 save && pm2 startup systemd -u root --hp /root | tail -1 | bash

echo "✅ Done! Backend running on port 5000"
pm2 list
