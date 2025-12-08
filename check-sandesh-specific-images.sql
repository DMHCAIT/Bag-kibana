-- Check images for Mint Green and Teal Blue specifically
SELECT 
  id,
  name,
  color,
  slug,
  images,
  array_length(images, 1) as image_count
FROM products
WHERE name = 'SANDESH LAPTOP BAG' 
  AND color IN ('Mint Green', 'Teal Blue')
ORDER BY color;
