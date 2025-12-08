-- FINAL FIX: Update color_image column for SANDESH LAPTOP BAG
-- ROOT CAUSE: color_image column has wrong URLs and takes priority over images array

-- Fix Mint Green (id: 37)
UPDATE products
SET color_image = 'https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/SANDESH%20LAPTOP%20BAG%20(%20png%20)%202/SANDESH%20LAPTOP%20BAG%20-%20Mint%20Green/01.png'
WHERE id = 37;

-- Fix Teal Blue (id: 36)
UPDATE products
SET color_image = 'https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/SANDESH%20LAPTOP%20BAG%20(%20png%20)%202/SANDESH%20LAPTOP%20BAG%20-%20Teal%20Blue/01.png'
WHERE id = 36;

-- Verify the fix
SELECT 
  id,
  name,
  color,
  color_image,
  images[1] as first_image,
  CASE 
    WHEN color_image LIKE '%176%' THEN '❌ STILL WRONG'
    WHEN color_image LIKE '%SANDESH%20LAPTOP%20BAG%' THEN '✅ FIXED'
    ELSE '⚠️ CHECK'
  END as status
FROM products
WHERE name = 'SANDESH LAPTOP BAG'
ORDER BY color;
