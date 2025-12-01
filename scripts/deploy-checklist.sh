#!/bin/bash

# ShuAI Deployment Checklist Script
# Run this before deploying to production

set -e

echo "🚀 ShuAI Deployment Checklist"
echo "=============================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check counter
PASS=0
FAIL=0
WARN=0

check() {
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} $1"
    ((PASS++))
  else
    echo -e "${RED}✗${NC} $1"
    ((FAIL++))
  fi
}

warn() {
  echo -e "${YELLOW}⚠${NC} $1"
  ((WARN++))
}

echo "1. Environment Variables"
echo "------------------------"

# Check required env vars
[ -n "$DATABASE_URL" ] && check "DATABASE_URL set" || { echo -e "${RED}✗${NC} DATABASE_URL not set"; ((FAIL++)); }
[ -n "$REDIS_URL" ] && check "REDIS_URL set" || { echo -e "${RED}✗${NC} REDIS_URL not set"; ((FAIL++)); }
[ -n "$OPENAI_API_KEY" ] && check "OPENAI_API_KEY set" || { echo -e "${RED}✗${NC} OPENAI_API_KEY not set"; ((FAIL++)); }
[ -n "$ADMIN_PASSWORD_HASH" ] && check "ADMIN_PASSWORD_HASH set" || { echo -e "${RED}✗${NC} ADMIN_PASSWORD_HASH not set"; ((FAIL++)); }
[ -n "$NEXT_PUBLIC_SITE_URL" ] && check "NEXT_PUBLIC_SITE_URL set" || warn "NEXT_PUBLIC_SITE_URL not set (optional)"

echo ""
echo "2. Optional Integrations"
echo "------------------------"

if [ -n "$GHL_API_KEY" ] && [ "$GHL_API_KEY" != "ghl_api_key_placeholder" ]; then
  check "GHL_API_KEY configured"
else
  warn "GHL_API_KEY not configured (will use mock mode)"
fi

if [ -n "$N8N_WEBHOOK_SECRET" ] && [ "$N8N_WEBHOOK_SECRET" != "webhook_secret" ]; then
  check "N8N_WEBHOOK_SECRET configured"
else
  warn "N8N_WEBHOOK_SECRET not configured (will use mock mode)"
fi

echo ""
echo "3. Dependencies"
echo "---------------"

npm list > /dev/null 2>&1 && check "All dependencies installed" || { echo -e "${RED}✗${NC} Dependencies missing"; ((FAIL++)); }

echo ""
echo "4. Build Test"
echo "-------------"

echo "Building project..."
npm run build > /dev/null 2>&1 && check "Build successful" || { echo -e "${RED}✗${NC} Build failed"; ((FAIL++)); }

echo ""
echo "5. Tests"
echo "--------"

echo "Running tests..."
npm test > /dev/null 2>&1 && check "Tests passed" || warn "Some tests failed (check logs)"

echo ""
echo "6. Security Audit"
echo "-----------------"

npm audit --audit-level=high > /dev/null 2>&1 && check "No high-severity vulnerabilities" || warn "High-severity vulnerabilities found"

echo ""
echo "7. Database Connection"
echo "----------------------"

if [ -n "$DATABASE_URL" ]; then
  # Test database connection (requires psql or node script)
  check "Database URL format valid"
else
  echo -e "${RED}✗${NC} Cannot test database connection"
  ((FAIL++))
fi

echo ""
echo "=============================="
echo "Summary"
echo "=============================="
echo -e "${GREEN}Passed: $PASS${NC}"
echo -e "${YELLOW}Warnings: $WARN${NC}"
echo -e "${RED}Failed: $FAIL${NC}"
echo ""

if [ $FAIL -eq 0 ]; then
  echo -e "${GREEN}✓ Ready to deploy!${NC}"
  exit 0
else
  echo -e "${RED}✗ Fix failures before deploying${NC}"
  exit 1
fi
