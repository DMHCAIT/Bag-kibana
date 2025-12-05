-- Fix Colors Field Format in Database
-- This ensures colors display correctly on product pages
-- 
-- IMPORTANT: Run add-slug-column.sql FIRST to create the colors column!
-- This file should be run AFTER add-slug-column.sql
--
-- Example: Update a product's colors field with proper hex codes
-- Replace product_id, product_name, and hex values as needed

-- Template for colors JSON format:
-- [
--   { "name": "Color Name", "value": "#HEXCODE", "available": true },
--   { "name": "Another Color", "value": "#HEXCODE", "available": true }
-- ]

-- Example 1: Update VISTARA TOTE colors
UPDATE products 
SET colors = '[
  { "name": "Teal Blue", "value": "#006D77", "available": true },
  { "name": "Mint Green", "value": "#98D8C8", "available": true },
  { "name": "Mocha", "value": "#9B6B4F", "available": true },
  { "name": "Milky Blue", "value": "#B8D4E8", "available": true }
]'::jsonb
WHERE name = 'VISTARA TOTE';

-- Example 2: Update WALLET colors
UPDATE products 
SET colors = '[
  { "name": "Mint Green", "value": "#98D8C8", "available": true },
  { "name": "Black", "value": "#000000", "available": true },
  { "name": "Brown", "value": "#8B4513", "available": true }
]'::jsonb
WHERE name = 'Wallet' AND category = 'WALLET';

-- Example 3: Check current colors format
SELECT 
  id,
  name,
  color,
  slug,
  colors
FROM products
ORDER BY name, color;

-- Example 4: Add colors to a product that doesn't have any
UPDATE products 
SET colors = jsonb_build_array(
  jsonb_build_object(
    'name', color,
    'value', '#CCCCCC',
    'available', true
  )
)
WHERE colors IS NULL OR colors = '[]'::jsonb;

-- Important Notes:
-- 1. Always use hex color codes (e.g., "#006D77")
-- 2. Do NOT include .jpg extension in value
-- 3. Color "name" should match the product's "color" field for current color
-- 4. Set "available": false for out-of-stock colors

-- Common Color Hex Codes:
-- Teal Blue:   #006D77
-- Mint Green:  #98D8C8
-- Mocha:       #9B6B4F
-- Milky Blue:  #B8D4E8
-- Black:       #000000
-- White:       #FFFFFF
-- Brown:       #8B4513
-- Tan:         #D2B48C
-- Navy:        #000080
-- Gray:        #808080
