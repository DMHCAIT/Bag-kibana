-- Fix SANDESH LAPTOP BAG Color Variants
-- Each variant should show all 4 available colors

UPDATE products 
SET colors = '[
  { "name": "Teal Blue", "value": "#006D77", "available": true },
  { "name": "Mint Green", "value": "#98D8C8", "available": true },
  { "name": "Mocha Tan", "value": "#9B6B4F", "available": true },
  { "name": "Milky Blue", "value": "#B8D4E8", "available": true }
]'::jsonb
WHERE name = 'SANDESH LAPTOP BAG';

-- Verify the update
SELECT 
  id,
  name,
  color,
  slug,
  jsonb_array_length(colors) as color_count,
  colors
FROM products
WHERE name = 'SANDESH LAPTOP BAG'
ORDER BY color;
