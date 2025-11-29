#!/bin/bash

# KIBANA E-Commerce - Pre-Deployment Checklist Script
# Run this before deploying to production

echo "🚀 KIBANA E-Commerce - Pre-Deployment Checklist"
echo "================================================"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# Check 1: Node modules installed
echo "📦 Checking dependencies..."
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} Dependencies installed"
else
    echo -e "${RED}✗${NC} node_modules not found. Run: npm install"
    ((ERRORS++))
fi
echo ""

# Check 2: .env.local exists
echo "🔐 Checking environment variables..."
if [ -f ".env.local" ]; then
    echo -e "${GREEN}✓${NC} .env.local file exists"
    
    # Check if contains Razorpay keys
    if grep -q "RAZORPAY_KEY_ID" .env.local; then
        # Check if using test or live keys
        if grep -q "rzp_test_" .env.local; then
            echo -e "${YELLOW}⚠${NC} Using TEST Razorpay keys (okay for testing, use LIVE keys for production)"
            ((WARNINGS++))
        elif grep -q "rzp_live_" .env.local; then
            echo -e "${GREEN}✓${NC} Using LIVE Razorpay keys"
        else
            echo -e "${RED}✗${NC} Razorpay keys format incorrect"
            ((ERRORS++))
        fi
    else
        echo -e "${RED}✗${NC} RAZORPAY_KEY_ID not found in .env.local"
        ((ERRORS++))
    fi
else
    echo -e "${RED}✗${NC} .env.local not found. Copy from .env.local.example"
    ((ERRORS++))
fi
echo ""

# Check 3: Try to build
echo "🏗️  Testing production build..."
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Build successful"
else
    echo -e "${RED}✗${NC} Build failed. Run 'npm run build' to see errors"
    ((ERRORS++))
fi
echo ""

# Check 4: Git status
echo "📝 Checking Git status..."
if [ -d ".git" ]; then
    if git diff-index --quiet HEAD --; then
        echo -e "${GREEN}✓${NC} All changes committed"
    else
        echo -e "${YELLOW}⚠${NC} Uncommitted changes found"
        ((WARNINGS++))
    fi
else
    echo -e "${YELLOW}⚠${NC} Not a Git repository"
    ((WARNINGS++))
fi
echo ""

# Check 5: Important files
echo "📄 Checking important files..."
FILES=("package.json" "next.config.mjs" "app/layout.tsx" "contexts/CartContext.tsx")
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file exists"
    else
        echo -e "${RED}✗${NC} $file missing"
        ((ERRORS++))
    fi
done
echo ""

# Summary
echo "================================================"
echo "📊 SUMMARY"
echo "================================================"
echo -e "Errors: ${RED}$ERRORS${NC}"
echo -e "Warnings: ${YELLOW}$WARNINGS${NC}"
echo ""

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ Ready to deploy!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Choose hosting platform (Vercel recommended)"
    echo "2. Deploy: vercel --prod"
    echo "3. Add environment variables in hosting dashboard"
    echo "4. Test thoroughly after deployment"
    echo ""
    echo "See DEPLOYMENT_GUIDE.md for detailed instructions"
else
    echo -e "${RED}❌ Please fix errors before deploying${NC}"
    exit 1
fi
