-- DEBUG: Let's see EXACTLY what's in the database for SANDESH LAPTOP BAG
-- This will show us the exact structure so we can write the correct UPDATE

SELECT 
  id,
  name,
  color,
  images,
  price,
  created_at
FROM products
WHERE name LIKE '%SANDESH%'
ORDER BY color;

-- Also check if there are multiple rows with similar names
SELECT DISTINCT name 
FROM products 
WHERE name LIKE '%SANDESH%';
