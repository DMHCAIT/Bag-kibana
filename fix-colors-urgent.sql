-- URGENT FIX: Add color images to all products
-- Run this in Supabase SQL Editor NOW

-- Step 1: Add color_image column
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS color_image TEXT;

-- Step 2: Populate colors array for all products

-- VISTARA TOTE (showing black boxes in screenshot)
UPDATE products 
SET colors = '[
  { "name": "Teal Blue", "value": "#006D77", "available": true },
  { "name": "Mint Green", "value": "#98D8C8", "available": true },
  { "name": "Mocha", "value": "#9B6B4F", "available": true },
  { "name": "Milky Blue", "value": "#B8D4E8", "available": true }
]'::jsonb
WHERE name = 'VISTARA TOTE';

-- VISTAPACK
UPDATE products 
SET colors = '[
  { "name": "Green", "value": "#98D8C8", "available": true },
  { "name": "Teal Blue", "value": "#006D77", "available": true },
  { "name": "Mocha", "value": "#9B6B4F", "available": true },
  { "name": "Milky Blue", "value": "#B8D4E8", "available": true }
]'::jsonb
WHERE name = 'VISTAPACK';

-- SANDESH LAPTOP BAG
UPDATE products 
SET colors = '[
  { "name": "Teal Blue", "value": "#006D77", "available": true },
  { "name": "Mint Green", "value": "#98D8C8", "available": true },
  { "name": "Mocha", "value": "#9B6B4F", "available": true },
  { "name": "Milky Blue", "value": "#B8D4E8", "available": true }
]'::jsonb
WHERE name = 'SANDESH LAPTOP BAG';

-- LEKHA WALLET
UPDATE products 
SET colors = '[
  { "name": "Teal Blue", "value": "#006D77", "available": true },
  { "name": "Mint Green", "value": "#98D8C8", "available": true },
  { "name": "Mocha", "value": "#9B6B4F", "available": true },
  { "name": "Milky Blue", "value": "#B8D4E8", "available": true }
]'::jsonb
WHERE name = 'LEKHA WALLET';

-- PRIZMA SLING
UPDATE products 
SET colors = '[
  { "name": "Teal Blue", "value": "#006D77", "available": true },
  { "name": "Mint Green", "value": "#98D8C8", "available": true },
  { "name": "Mocha", "value": "#9B6B4F", "available": true },
  { "name": "Milky Blue", "value": "#B8D4E8", "available": true }
]'::jsonb
WHERE name = 'PRIZMA SLING';

-- VISTARA BACKPACK
UPDATE products 
SET colors = '[
  { "name": "Teal Blue", "value": "#006D77", "available": true },
  { "name": "Mint Green", "value": "#98D8C8", "available": true },
  { "name": "Mocha", "value": "#9B6B4F", "available": true },
  { "name": "Milky Blue", "value": "#B8D4E8", "available": true }
]'::jsonb
WHERE name = 'VISTARA BACKPACK';

-- WALLET (if exists)
UPDATE products 
SET colors = '[
  { "name": "Brown", "value": "#8B4513", "available": true },
  { "name": "Black", "value": "#000000", "available": true }
]'::jsonb
WHERE name = 'WALLET' AND category = 'wallet';

-- Step 3: Verify the fix
SELECT 
  name,
  color,
  CASE 
    WHEN colors IS NULL THEN '❌ NULL'
    WHEN jsonb_array_length(colors) = 0 THEN '❌ EMPTY'
    ELSE '✅ ' || jsonb_array_length(colors)::text || ' colors'
  END as status,
  colors->0->>'name' as color1,
  colors->1->>'name' as color2,
  colors->2->>'name' as color3,
  colors->3->>'name' as color4
FROM products
WHERE name IN ('VISTARA TOTE', 'VISTAPACK', 'SANDESH LAPTOP BAG', 'LEKHA WALLET', 'PRIZMA SLING', 'VISTARA BACKPACK')
ORDER BY name, color
LIMIT 20;

-- Step 4: Update ALL products if there are more
UPDATE products 
SET colors = '[
  { "name": "Teal Blue", "value": "#006D77", "available": true },
  { "name": "Mint Green", "value": "#98D8C8", "available": true },
  { "name": "Mocha", "value": "#9B6B4F", "available": true },
  { "name": "Milky Blue", "value": "#B8D4E8", "available": true }
]'::jsonb
WHERE (colors IS NULL OR jsonb_array_length(colors) = 0)
  AND category NOT IN ('wallet', 'accessory')
  AND name NOT IN ('WALLET', 'VISTAPACK');

-- Final verification: Show all products status
SELECT 
  name,
  COUNT(*) as variants,
  MAX(CASE 
    WHEN colors IS NULL THEN '❌ NULL'
    WHEN jsonb_array_length(colors) = 0 THEN '❌ EMPTY'
    ELSE '✅ HAS COLORS'
  END) as colors_status
FROM products
GROUP BY name
ORDER BY name;
