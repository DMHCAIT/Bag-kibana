-- Fix ALL Product Color Variants
-- This ensures each product variant shows all available colors for that product

-- ============================================
-- SANDESH LAPTOP BAG - 4 colors
-- ============================================
UPDATE products 
SET colors = '[
  { "name": "Teal Blue", "value": "#006D77", "available": true },
  { "name": "Mint Green", "value": "#98D8C8", "available": true },
  { "name": "Mocha Tan", "value": "#9B6B4F", "available": true },
  { "name": "Milky Blue", "value": "#B8D4E8", "available": true }
]'::jsonb
WHERE name = 'SANDESH LAPTOP BAG';

-- ============================================
-- LEKHA WALLET - 4 colors
-- ============================================
UPDATE products 
SET colors = '[
  { "name": "Teal Blue", "value": "#006D77", "available": true },
  { "name": "Mint Green", "value": "#98D8C8", "available": true },
  { "name": "Mocha Tan", "value": "#9B6B4F", "available": true },
  { "name": "Milky Blue", "value": "#B8D4E8", "available": true }
]'::jsonb
WHERE name = 'LEKHA WALLET';

-- ============================================
-- WALLET - 4 colors  
-- ============================================
UPDATE products 
SET colors = '[
  { "name": "Mint Green", "value": "#98D8C8", "available": true },
  { "name": "Black", "value": "#000000", "available": true },
  { "name": "Tan", "value": "#D2B48C", "available": true },
  { "name": "Brown", "value": "#8B4513", "available": true }
]'::jsonb
WHERE name = 'Wallet';

-- ============================================
-- VISTARA TOTE - 4 colors
-- ============================================
UPDATE products 
SET colors = '[
  { "name": "Teal Blue", "value": "#006D77", "available": true },
  { "name": "Mint Green", "value": "#98D8C8", "available": true },
  { "name": "Mocha", "value": "#9B6B4F", "available": true },
  { "name": "Milky Blue", "value": "#B8D4E8", "available": true }
]'::jsonb
WHERE name = 'VISTARA TOTE';

-- ============================================
-- VISTAPACK - 4 colors
-- ============================================
UPDATE products 
SET colors = '[
  { "name": "Teal Blue", "value": "#006D77", "available": true },
  { "name": "Mint Green", "value": "#98D8C8", "available": true },
  { "name": "Mocha", "value": "#9B6B4F", "available": true },
  { "name": "Milky Blue", "value": "#B8D4E8", "available": true }
]'::jsonb
WHERE name = 'VISTAPACK';

-- ============================================
-- PRIZMA SLING - 3 colors
-- ============================================
UPDATE products 
SET colors = '[
  { "name": "Black", "value": "#000000", "available": true },
  { "name": "Tan", "value": "#D2B48C", "available": true },
  { "name": "Brown", "value": "#8B4513", "available": true }
]'::jsonb
WHERE name = 'PRIZMA SLING';

-- ============================================
-- VISTARA BACKPACK - 4 colors
-- ============================================
UPDATE products 
SET colors = '[
  { "name": "Teal Blue", "value": "#006D77", "available": true },
  { "name": "Mint Green", "value": "#98D8C8", "available": true },
  { "name": "Mocha", "value": "#9B6B4F", "available": true },
  { "name": "Milky Blue", "value": "#B8D4E8", "available": true }
]'::jsonb
WHERE name = 'VISTARA BACKPACK';

-- ============================================
-- Verification Query
-- ============================================
SELECT 
  name,
  color,
  slug,
  jsonb_array_length(colors) as color_variants,
  colors->0->>'name' as first_color,
  colors->1->>'name' as second_color,
  colors->2->>'name' as third_color,
  colors->3->>'name' as fourth_color
FROM products
ORDER BY name, color;

-- ============================================
-- Summary by Product
-- ============================================
SELECT 
  name,
  COUNT(*) as total_variants,
  jsonb_array_length((SELECT colors FROM products p2 WHERE p2.name = p1.name LIMIT 1)) as colors_shown,
  string_agg(DISTINCT color, ', ' ORDER BY color) as actual_colors_available
FROM products p1
GROUP BY name
ORDER BY name;
