-- VERIFY: Check current image URLs for SANDESH LAPTOP BAG
-- Run this to see if the UPDATE worked

SELECT 
  name,
  color,
  images[1] as first_image_url,
  CASE 
    WHEN images[1] LIKE '%1765012655308-yq9vclj.png%' THEN '❌ STILL OLD URL (Mint Green)'
    WHEN images[1] LIKE '%1765012471633-r0135ij.png%' THEN '❌ STILL OLD URL (Teal Blue)'
    WHEN images[1] LIKE '%SANDESH%20LAPTOP%20BAG%20-%20Mint%20Green%' THEN '✅ FIXED (Mint Green)'
    WHEN images[1] LIKE '%SANDESH%20LAPTOP%20BAG%20-%20Teal%20Blue%' THEN '✅ FIXED (Teal Blue)'
    ELSE '✅ OK'
  END as status
FROM products
WHERE name = 'SANDESH LAPTOP BAG'
ORDER BY color;
