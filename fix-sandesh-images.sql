-- FIX SANDESH LAPTOP BAG - Update incorrect image URLs
-- Issue: Teal Blue and Mint Green have random filenames instead of proper folder paths

-- First, let's see what we have:
SELECT name, color, images, color_image
FROM products
WHERE name = 'SANDESH LAPTOP BAG'
ORDER BY color;

-- Fix Teal Blue variant
UPDATE products
SET images = ARRAY['https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/SANDESH%20LAPTOP%20BAG%20(%20png%20)%202/SANDESH%20LAPTOP%20BAG%20-%20Teal%20Blue/01.png']::text[]
WHERE name = 'SANDESH LAPTOP BAG' AND color = 'Teal Blue';

-- Fix Mint Green variant
UPDATE products
SET images = ARRAY['https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/SANDESH%20LAPTOP%20BAG%20(%20png%20)%202/SANDESH%20LAPTOP%20BAG%20-%20Mint%20Green/01.png']::text[]
WHERE name = 'SANDESH LAPTOP BAG' AND color = 'Mint Green';

-- Verify the fixes:
SELECT name, color, images
FROM products
WHERE name = 'SANDESH LAPTOP BAG'
ORDER BY color;
