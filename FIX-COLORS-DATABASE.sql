-- ===================================================================
-- KIBANA COLOR IMAGES FIX - FINAL VERSION
-- ===================================================================
-- This SQL script fixes the empty colors array issue in your database
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- ===================================================================

-- Step 1: Add color_image column if it doesn't exist
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS color_image TEXT;

-- Step 2: Update VISTARA TOTE colors array
-- VISTARA TOTE has: Teal Blue, Mint Green, Mocha (NOT Mocha Tan), Milky Blue
UPDATE products 
SET colors = '[
  {"name": "Teal Blue", "value": "#006D77", "available": true},
  {"name": "Mint Green", "value": "#98D8C8", "available": true},
  {"name": "Mocha", "value": "#9B6B4F", "available": true},
  {"name": "Milky Blue", "value": "#B8D4E8", "available": true}
]'::jsonb
WHERE name = 'VISTARA TOTE';

-- Step 3: Update VISTAPACK colors array  
-- VISTAPACK has: Teal Blue, Mint Green, Mocha Tan (NOT Mocha), Milky Blue
UPDATE products 
SET colors = '[
  {"name": "Teal Blue", "value": "#006D77", "available": true},
  {"name": "Mint Green", "value": "#98D8C8", "available": true},
  {"name": "Mocha Tan", "value": "#9B6B4F", "available": true},
  {"name": "Milky Blue", "value": "#B8D4E8", "available": true}
]'::jsonb
WHERE name = 'VISTAPACK';

-- Step 4: Update PRIZMA SLING colors array
-- PRIZMA SLING has: Teal Blue, Mint Green, Mocha (NOT Mocha Tan), Milky Blue
UPDATE products 
SET colors = '[
  {"name": "Teal Blue", "value": "#006D77", "available": true},
  {"name": "Mint Green", "value": "#98D8C8", "available": true},
  {"name": "Mocha", "value": "#9B6B4F", "available": true},
  {"name": "Milky Blue", "value": "#B8D4E8", "available": true}
]'::jsonb
WHERE name = 'PRIZMA SLING';

-- Step 5: Update SANDESH LAPTOP BAG colors array
-- SANDESH LAPTOP BAG has: Teal Blue, Mint Green, Mocha Tan (NOT Mocha), Milky Blue
UPDATE products 
SET colors = '[
  {"name": "Teal Blue", "value": "#006D77", "available": true},
  {"name": "Mint Green", "value": "#98D8C8", "available": true},
  {"name": "Mocha Tan", "value": "#9B6B4F", "available": true},
  {"name": "Milky Blue", "value": "#B8D4E8", "available": true}
]'::jsonb
WHERE name = 'SANDESH LAPTOP BAG';

-- Step 6: Update LEKHA WALLET colors array
-- LEKHA WALLET has: Teal Blue, Mint Green, Mocha Tan (NOT Mocha), Milky Blue
UPDATE products 
SET colors = '[
  {"name": "Teal Blue", "value": "#006D77", "available": true},
  {"name": "Mint Green", "value": "#98D8C8", "available": true},
  {"name": "Mocha Tan", "value": "#9B6B4F", "available": true},
  {"name": "Milky Blue", "value": "#B8D4E8", "available": true}
]'::jsonb
WHERE name = 'LEKHA WALLET';

-- Step 7: Update small Wallet colors array (if you have it)
-- Small Wallet variants typically have: Brown, Black
UPDATE products 
SET colors = '[
  {"name": "Brown", "value": "#8B4513", "available": true},
  {"name": "Black", "value": "#000000", "available": true}
]'::jsonb
WHERE name ILIKE '%wallet%' 
AND name != 'LEKHA WALLET'
AND category ILIKE '%wallet%';

-- ===================================================================
-- VERIFICATION QUERIES
-- ===================================================================

-- Check which products now have colors data
SELECT 
  name,
  color,
  CASE 
    WHEN colors IS NULL THEN '❌ NULL - NOT FIXED'
    WHEN jsonb_array_length(colors) = 0 THEN '❌ EMPTY ARRAY - NOT FIXED'
    ELSE '✅ FIXED - ' || jsonb_array_length(colors)::text || ' colors'
  END as status,
  colors->0->>'name' as color1,
  colors->1->>'name' as color2,
  colors->2->>'name' as color3,
  colors->3->>'name' as color4
FROM products
WHERE name IN ('VISTARA TOTE', 'VISTAPACK', 'PRIZMA SLING', 'SANDESH LAPTOP BAG', 'LEKHA WALLET')
ORDER BY name, color;

-- Count how many product variants now have colors
SELECT 
  name,
  COUNT(*) as total_variants,
  SUM(CASE WHEN colors IS NOT NULL AND jsonb_array_length(colors) > 0 THEN 1 ELSE 0 END) as with_colors
FROM products
WHERE name IN ('VISTARA TOTE', 'VISTAPACK', 'PRIZMA SLING', 'SANDESH LAPTOP BAG', 'LEKHA WALLET')
GROUP BY name
ORDER BY name;

-- ===================================================================
-- EXPECTED RESULTS AFTER RUNNING THIS:
-- ===================================================================
-- All products should show ✅ FIXED status
-- Color images should automatically appear on your website
-- No need to restart the server - API will pick up changes immediately
-- ===================================================================
