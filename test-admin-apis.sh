#!/bin/bash

echo "🔍 Testing Admin API Endpoints"
echo "================================"

BASE_URL="http://localhost:3000"

# Wait for server to be ready
echo "⏳ Waiting for server..."
sleep 3

# Test Dashboard API
echo "📊 Testing Dashboard API:"
curl -s -w "\nStatus: %{http_code}\n" "$BASE_URL/api/admin/dashboard" | head -5
echo ""

# Test Products API
echo "📦 Testing Products API:"
curl -s -w "\nStatus: %{http_code}\n" "$BASE_URL/api/admin/products" | head -5
echo ""

# Test Orders API
echo "🛍️ Testing Orders API:"
curl -s -w "\nStatus: %{http_code}\n" "$BASE_URL/api/admin/orders" | head -5
echo ""

# Test Customers API
echo "👥 Testing Customers API:"
curl -s -w "\nStatus: %{http_code}\n" "$BASE_URL/api/admin/customers" | head -5
echo ""

# Test Reports API
echo "📈 Testing Reports API:"
curl -s -w "\nStatus: %{http_code}\n" "$BASE_URL/api/admin/reports" | head -5
echo ""

echo "✅ API Test Complete"