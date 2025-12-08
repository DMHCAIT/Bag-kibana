-- ADD MORE IMAGES for SANDESH LAPTOP BAG - Teal Blue and Mint Green

-- Update Teal Blue with additional images
UPDATE products
SET images = ARRAY[
  'https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/SANDESH%20LAPTOP%20BAG%20(%20png%20)%202/SANDESH%20LAPTOP%20BAG%20-%20Teal%20Blue/01.png',
  'https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/SANDESH%20LAPTOP%20BAG%20(%20png%20)%202/SANDESH%20LAPTOP%20BAG%20-%20Teal%20Blue/09-10-2025--livia00630.jpg',
  'https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/SANDESH%20LAPTOP%20BAG%20(%20png%20)%202/SANDESH%20LAPTOP%20BAG%20-%20Teal%20Blue/09-10-2025--livia00633.jpg',
  'https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/SANDESH%20LAPTOP%20BAG%20(%20png%20)%202/SANDESH%20LAPTOP%20BAG%20-%20Teal%20Blue/09-10-2025--livia00637.jpg',
  'https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/SANDESH%20LAPTOP%20BAG%20(%20png%20)%202/SANDESH%20LAPTOP%20BAG%20-%20Teal%20Blue/09-10-2025--livia00649.jpg'
]::text[]
WHERE id = 36;

-- Update Mint Green with additional images
-- NOTE: You labeled these as "mint green" but URLs show "Milky Blue" folder
-- If these ARE Mint Green images, need to move them to correct folder in Supabase Storage first
-- For now, keeping the Mint Green 01.png only until you clarify
UPDATE products
SET images = ARRAY[
  'https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/SANDESH%20LAPTOP%20BAG%20(%20png%20)%202/SANDESH%20LAPTOP%20BAG%20-%20Mint%20Green/01.png'
]::text[]
WHERE id = 37;

-- If the Milky Blue images you shared ARE actually Mint Green photos,
-- you need to either:
-- 1. Move them to the "SANDESH LAPTOP BAG - Mint Green" folder in Supabase Storage, OR
-- 2. Use them from the Milky Blue folder (not recommended - confusing)

-- Verify the updates
SELECT 
  id,
  name,
  color,
  array_length(images, 1) as image_count,
  images[1] as first_image,
  images[2] as second_image
FROM products
WHERE name = 'SANDESH LAPTOP BAG' 
  AND color IN ('Mint Green', 'Teal Blue')
ORDER BY color;
