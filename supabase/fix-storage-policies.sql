-- Fix Supabase Storage bucket policies for product-images
-- Run this in Supabase SQL Editor

-- 1. Check current bucket configuration
SELECT * FROM storage.buckets WHERE name = 'product-images';

-- 2. Update bucket to be public
UPDATE storage.buckets
SET public = true
WHERE name = 'product-images';

-- 3. Drop existing policies (if any)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;

-- 4. Create new policy for public read access
CREATE POLICY "Allow public read access"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'product-images');

-- 5. Verify policies
SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';

-- 6. Test URL format - Check if files exist
-- Replace the path with one of your actual file paths
SELECT * FROM storage.objects 
WHERE bucket_id = 'product-images' 
AND name LIKE '%VISTARA%'
LIMIT 5;
