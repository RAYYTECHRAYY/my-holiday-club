#!/bin/bash
# ─────────────────────────────────────────────
# MHC STEP 0 — Push code to GitHub
# Run this on YOUR MAC (not the server)
# Usage: bash deployment/0-github-push.sh
# ─────────────────────────────────────────────

echo "========================================"
echo "  MHC — Push to GitHub"
echo "========================================"

# Move to project root
cd "$(dirname "$0")/.."

echo ""
echo "Enter your GitHub repo URL"
echo "(Create an empty repo at https://github.com/new first)"
echo "Example: https://github.com/rajkumar/myholidayclub.git"
echo ""
read -p "GitHub URL: " GITHUB_URL

if [ -z "$GITHUB_URL" ]; then
  echo "❌ No URL provided. Exiting."
  exit 1
fi

# Init git if needed
if [ ! -d ".git" ]; then
  echo "[1/4] Initializing git repository..."
  git init
  git branch -M main
else
  echo "[1/4] Git already initialized."
fi

# Stage everything
echo "[2/4] Staging all files..."
git add .
git status --short

# Commit
echo "[3/4] Creating commit..."
git commit -m "MHC production release — $(date '+%Y-%m-%d %H:%M')" 2>/dev/null || \
  echo "  (nothing new to commit)"

# Push
echo "[4/4] Pushing to GitHub..."
git remote remove origin 2>/dev/null || true
git remote add origin "$GITHUB_URL"
git push -u origin main

echo ""
echo "✅ Code pushed to GitHub!"
echo "   Repo: $GITHUB_URL"
echo ""
echo "👉 Next: SSH into your server and run:"
echo "   bash /root/1-server-setup.sh"
