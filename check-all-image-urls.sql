-- CHECK ALL PRODUCTS FOR IMAGE URL ISSUES
-- This will find products with random filename images instead of proper folder paths

SELECT 
  name,
  color,
  images,
  CASE 
    WHEN images[1] LIKE '%/%product-images/176%' THEN '❌ RANDOM FILENAME'
    WHEN images[1] LIKE '%/%20BAG%20-%20%' THEN '✅ PROPER PATH'
    WHEN images[1] LIKE '%/%20TOTE%20-%20%' THEN '✅ PROPER PATH'
    WHEN images[1] LIKE '%/%20SLING%20-%20%' THEN '✅ PROPER PATH'
    ELSE '⚠️  CHECK MANUALLY'
  END as status
FROM products
WHERE images IS NOT NULL AND array_length(images, 1) > 0
ORDER BY name, color;
