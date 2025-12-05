-- Populate ALL Available Colors for Products
-- This will add color variants to show on product pages

-- First, check what products we have and their colors
SELECT id, name, color, slug, colors 
FROM products 
ORDER BY name, color;

-- ============================================
-- WALLET Products - Add all color variants
-- ============================================

-- Update Wallet - Mint Green to show all wallet colors
UPDATE products 
SET colors = '[
  { "name": "Mint Green", "value": "#98D8C8", "available": true },
  { "name": "Black", "value": "#000000", "available": true },
  { "name": "Tan", "value": "#D2B48C", "available": true },
  { "name": "Brown", "value": "#8B4513", "available": true }
]'::jsonb
WHERE name ILIKE '%wallet%' AND color ILIKE '%mint%green%';

-- Update Wallet - Black
UPDATE products 
SET colors = '[
  { "name": "Mint Green", "value": "#98D8C8", "available": true },
  { "name": "Black", "value": "#000000", "available": true },
  { "name": "Tan", "value": "#D2B48C", "available": true },
  { "name": "Brown", "value": "#8B4513", "available": true }
]'::jsonb
WHERE name ILIKE '%wallet%' AND color ILIKE '%black%';

-- Update Wallet - Tan
UPDATE products 
SET colors = '[
  { "name": "Mint Green", "value": "#98D8C8", "available": true },
  { "name": "Black", "value": "#000000", "available": true },
  { "name": "Tan", "value": "#D2B48C", "available": true },
  { "name": "Brown", "value": "#8B4513", "available": true }
]'::jsonb
WHERE name ILIKE '%wallet%' AND color ILIKE '%tan%';

-- Update Wallet - Brown
UPDATE products 
SET colors = '[
  { "name": "Mint Green", "value": "#98D8C8", "available": true },
  { "name": "Black", "value": "#000000", "available": true },
  { "name": "Tan", "value": "#D2B48C", "available": true },
  { "name": "Brown", "value": "#8B4513", "available": true }
]'::jsonb
WHERE name ILIKE '%wallet%' AND color ILIKE '%brown%';

-- ============================================
-- VISTARA TOTE Products - Add all color variants
-- ============================================

-- Update all VISTARA TOTE products with all 4 colors
UPDATE products 
SET colors = '[
  { "name": "Teal Blue", "value": "#006D77", "available": true },
  { "name": "Mint Green", "value": "#98D8C8", "available": true },
  { "name": "Mocha", "value": "#9B6B4F", "available": true },
  { "name": "Milky Blue", "value": "#B8D4E8", "available": true }
]'::jsonb
WHERE name = 'VISTARA TOTE';

-- ============================================
-- VISTAPACK Products - Add all color variants
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
-- PRIZMA SLING Products - Add all color variants
-- ============================================

UPDATE products 
SET colors = '[
  { "name": "Black", "value": "#000000", "available": true },
  { "name": "Tan", "value": "#D2B48C", "available": true },
  { "name": "Brown", "value": "#8B4513", "available": true }
]'::jsonb
WHERE name = 'PRIZMA SLING';

-- ============================================
-- Generic update for any product with only default color
-- This adds similar colors based on the current color
-- ============================================

-- For products with Mint Green, add related colors
UPDATE products 
SET colors = '[
  { "name": "Mint Green", "value": "#98D8C8", "available": true },
  { "name": "Teal Blue", "value": "#006D77", "available": true },
  { "name": "Milky Blue", "value": "#B8D4E8", "available": true }
]'::jsonb
WHERE color ILIKE '%mint%green%' 
  AND (colors = '[]'::jsonb OR jsonb_array_length(colors) = 1);

-- For products with Black, add related colors
UPDATE products 
SET colors = '[
  { "name": "Black", "value": "#000000", "available": true },
  { "name": "Brown", "value": "#8B4513", "available": true },
  { "name": "Navy", "value": "#000080", "available": true }
]'::jsonb
WHERE color ILIKE '%black%' 
  AND (colors = '[]'::jsonb OR jsonb_array_length(colors) = 1);

-- ============================================
-- Verification - Check results
-- ============================================

SELECT 
  id,
  name,
  color,
  slug,
  jsonb_array_length(colors) as color_count,
  colors
FROM products
ORDER BY name, color;

-- ============================================
-- Summary
-- ============================================

SELECT 
  name,
  COUNT(*) as variants,
  string_agg(DISTINCT color, ', ' ORDER BY color) as available_colors
FROM products
GROUP BY name
ORDER BY name;
