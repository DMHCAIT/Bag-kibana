#!/bin/bash

# Quick Fix Script for Connection Issues
# Run this if you're experiencing network or connection problems

echo "🔧 KIBANA Connection Issues - Quick Fix"
echo "========================================"
echo ""

cd "/Users/rubeenakhan/Desktop/Bag kibana/kibana-homepage"

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚠️  WARNING: .env.local file not found!"
    echo "📝 Creating .env.local template..."
    
    cat > .env.local << 'EOF'
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://hrahjiccbwvhtocabxja.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_key_here

# Razorpay Configuration (for payments)
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_here
RAZORPAY_KEY_SECRET=your_razorpay_secret_here

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
EOF
    
    echo "✅ Created .env.local template"
    echo "⚠️  IMPORTANT: You need to add your actual API keys!"
    echo "   Get them from: https://supabase.com/dashboard"
    echo ""
else
    echo "✅ .env.local file exists"
fi

# Check Node modules
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
else
    echo "✅ Node modules exist"
fi

# Clear Next.js cache
echo ""
echo "🧹 Clearing Next.js cache..."
rm -rf .next
echo "✅ Cache cleared"

# Check if Supabase is accessible
echo ""
echo "🌐 Testing Supabase connection..."
SUPABASE_URL="https://hrahjiccbwvhtocabxja.supabase.co"

if curl -s --head "$SUPABASE_URL" | grep "200 OK" > /dev/null; then
    echo "✅ Supabase is accessible"
else
    echo "⚠️  Warning: Could not reach Supabase"
    echo "   Check your internet connection"
    echo "   Or verify Supabase project is not paused"
fi

# Test if images are accessible
echo ""
echo "🖼️  Testing image storage..."
TEST_IMAGE="$SUPABASE_URL/storage/v1/object/public/product-images/VISTARA%20TOTE%20(%20png%20)/VISTARA%20TOTE%20-%20Teal%20Blue/01.png"

if curl -s --head "$TEST_IMAGE" | grep "200 OK" > /dev/null; then
    echo "✅ Product images are accessible"
else
    echo "⚠️  Warning: Cannot access product images"
    echo "   Make sure 'product-images' bucket is public in Supabase"
fi

echo ""
echo "================================"
echo "✅ Quick Fix Complete!"
echo "================================"
echo ""
echo "📋 Next Steps:"
echo "1. Make sure your .env.local has correct API keys"
echo "2. Run: npm run dev"
echo "3. Visit: http://localhost:3000"
echo ""
echo "🔑 Get API Keys from:"
echo "   Supabase: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api"
echo "   Razorpay: https://dashboard.razorpay.com/app/keys"
echo ""
echo "📚 See COMPLETE_SETUP_GUIDE.md for detailed instructions"
echo ""

