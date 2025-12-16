-- Find the product with the problematic image reference
-- Error shows: 09-10-2025--livia00357-Photoroom.png (404 Not Found)

-- Step 1: Find products with this image reference
SELECT 
  id, 
  name, 
  color,
  images,
  slug
FROM products 
WHERE images::text LIKE '%livia00357%'
ORDER BY id;

-- Step 2: Check what's actually in Supabase Storage
-- You'll need to check your Supabase dashboard -> Storage -> product-images bucket
-- Look for files with "livia00357" in the name

-- Step 3: If the file exists with .jpg extension instead of .png, update the database:
-- UNCOMMENT AND RUN THIS AFTER VERIFYING THE CORRECT FILENAME IN STORAGE:

/*
UPDATE products
SET images = ARRAY(
  SELECT REPLACE(
    unnest(images),
    '09-10-2025--livia00357-Photoroom.png',
    'https://YOUR_SUPABASE_URL/storage/v1/object/public/product-images/ACTUAL_FILENAME.jpg'
  )
)
WHERE images::text LIKE '%livia00357%';
*/

-- Step 4: Verify the update
SELECT 
  id, 
  name, 
  color,
  images
FROM products 
WHERE images::text LIKE '%livia%'
ORDER BY id;
