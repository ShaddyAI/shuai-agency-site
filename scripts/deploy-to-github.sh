#!/bin/bash

# Deploy to GitHub Script
# This script helps you push the ShuAI website to GitHub

set -e

echo "🚀 ShuAI Agency Site - GitHub Deployment Helper"
echo "================================================"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
  echo "❌ Error: Not in project directory"
  echo "Please run from /home/user/shuai-agency-site"
  exit 1
fi

# Check if git is initialized
if [ ! -d ".git" ]; then
  echo "❌ Error: Git not initialized"
  echo "Run: git init"
  exit 1
fi

# Check if there are uncommitted changes
if ! git diff-index --quiet HEAD 2>/dev/null; then
  echo "⚠️  You have uncommitted changes."
  echo "Committing all changes..."
  git add .
  git commit -m "Prepare for GitHub deployment"
fi

echo "📋 Ready to push to GitHub!"
echo ""
echo "Before proceeding, create a repository on GitHub:"
echo "1. Go to: https://github.com/new"
echo "2. Repository name: shuai-agency-site"
echo "3. Description: Production Next.js website for ShuAI"
echo "4. Visibility: Public (or Private)"
echo "5. DO NOT initialize with README"
echo "6. Click 'Create repository'"
echo ""

read -p "Have you created the GitHub repository? (y/n): " confirm
if [ "$confirm" != "y" ]; then
  echo "Please create the repository first, then run this script again."
  exit 0
fi

echo ""
read -p "Enter your GitHub username: " username
if [ -z "$username" ]; then
  echo "❌ Username cannot be empty"
  exit 1
fi

# Set up remote
REPO_URL="https://github.com/$username/shuai-agency-site.git"

echo ""
echo "Setting up remote: $REPO_URL"

# Check if origin already exists
if git remote get-url origin &>/dev/null; then
  echo "⚠️  Remote 'origin' already exists. Removing..."
  git remote remove origin
fi

git remote add origin "$REPO_URL"

echo "✅ Remote added"

# Rename branch to main if needed
current_branch=$(git branch --show-current)
if [ "$current_branch" != "main" ]; then
  echo "Renaming branch to 'main'..."
  git branch -M main
fi

echo ""
echo "🚀 Pushing to GitHub..."
echo "If prompted, enter your GitHub credentials or token."
echo ""

# Push to GitHub
if git push -u origin main; then
  echo ""
  echo "✅ Successfully pushed to GitHub!"
  echo ""
  echo "Repository URL: https://github.com/$username/shuai-agency-site"
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "🎉 Next Steps:"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  echo "1. Deploy to Vercel:"
  echo "   → Go to: https://vercel.com/new"
  echo "   → Import: https://github.com/$username/shuai-agency-site"
  echo "   → Add environment variables (see .env.example)"
  echo "   → Click Deploy"
  echo ""
  echo "2. Setup Database & Redis:"
  echo "   → Vercel Postgres: Project → Storage → Postgres"
  echo "   → Upstash Redis: Integrations → Upstash"
  echo ""
  echo "3. Initialize Database:"
  echo "   → npm run db:seed"
  echo "   → npm run index:embeddings"
  echo ""
  echo "Full guide: See DEPLOYMENT.md"
  echo ""
else
  echo ""
  echo "❌ Push failed!"
  echo ""
  echo "Common issues:"
  echo "1. Authentication failed → Use GitHub Personal Access Token"
  echo "   Create token at: https://github.com/settings/tokens"
  echo "   Use token as password when prompted"
  echo ""
  echo "2. Repository doesn't exist → Make sure you created it on GitHub"
  echo ""
  echo "3. Permission denied → Check repository access"
  echo ""
  exit 1
fi
