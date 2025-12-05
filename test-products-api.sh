#!/bin/bash

echo "Testing Products API..."
echo "========================"
echo ""

# Wait for server to be ready
sleep 2

echo "Fetching products from API..."
curl -s http://localhost:3000/api/products | jq -r '
  "Total products: \(.products | length)",
  "",
  "First 3 products:",
  (.products[:3] | .[] | "  - ID: \(.id) | dbId: \(.dbId) | Name: \(.name) - \(.color)")
'

echo ""
echo "Fetching placements from API..."
curl -s http://localhost:3000/api/admin/placements?section=bestsellers | jq -r '
  "Total placements: \(length)",
  "",
  "Placements:",
  (.[] | "  - Placement ID: \(.id) | Product ID: \(.product_id) | Order: \(.display_order) | Active: \(.is_active)")
'

echo ""
echo "Test complete!"
