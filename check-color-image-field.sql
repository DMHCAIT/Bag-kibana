-- Check if color_image column exists and what it contains
SELECT 
  id,
  name,
  color,
  color_image,
  images[1] as first_image
FROM products
WHERE name = 'SANDESH LAPTOP BAG'
ORDER BY color;
