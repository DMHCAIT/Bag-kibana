#!/bin/bash

# Script to update all product image URLs to use Supabase storage
# This replaces placeholder image names with full Supabase URLs

cd "/Users/rubeenakhan/Desktop/Bag kibana/kibana-homepage"

# Base URL for Supabase storage
BASE_URL="https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images"

# Update all image references in products-data.ts
sed -i '' 's/"vistara-tote-/"'"$BASE_URL"'\/vistara-tote-/g' lib/products-data.ts
sed -i '' 's/"prizma-sling-/"'"$BASE_URL"'\/prizma-sling-/g' lib/products-data.ts
sed -i '' 's/"vistapack-/"'"$BASE_URL"'\/vistapack-/g' lib/products-data.ts
sed -i '' 's/"sandesh-laptop-bag-/"'"$BASE_URL"'\/sandesh-laptop-bag-/g' lib/products-data.ts
sed -i '' 's/"lekha-wallet-/"'"$BASE_URL"'\/lekha-wallet-/g' lib/products-data.ts

# Add .jpg extension to all image URLs
sed -i '' 's/\([0-9]\)"/\1.jpg"/g' lib/products-data.ts

echo "✅ Updated all product image URLs to use Supabase storage!"
echo "🔗 Base URL: $BASE_URL"