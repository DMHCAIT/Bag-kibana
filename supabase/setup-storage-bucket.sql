-- =====================================================
-- SUPABASE STORAGE BUCKET SETUP FOR PRODUCT IMAGES
-- =====================================================
-- Run this in Supabase SQL Editor to fix upload permissions
-- Then verify in: Storage → product-images → Policies

-- Step 1: Create the bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Step 2: Drop existing policies (if any)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Enable read access for all users" ON storage.objects;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON storage.objects;
DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;

-- Step 3: Create policy for PUBLIC READ access (so images display on website)
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Step 4: Create policy for PUBLIC UPLOAD access (so admin can upload from browser)
CREATE POLICY "Public Upload Access"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-images');

-- Step 5: Create policy for UPDATE access (for replacing images)
CREATE POLICY "Public Update Access"
ON storage.objects FOR UPDATE
USING (bucket_id = 'product-images')
WITH CHECK (bucket_id = 'product-images');

-- Step 6: Create policy for DELETE access (for removing images)
CREATE POLICY "Public Delete Access"
ON storage.objects FOR DELETE
USING (bucket_id = 'product-images');

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check bucket exists and is public
SELECT id, name, public, created_at
FROM storage.buckets
WHERE id = 'product-images';
-- Expected: 1 row with public = true

-- Check policies are created
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'objects' AND policyname LIKE '%Public%Access%';
-- Expected: 4 rows (Read, Upload, Update, Delete)

-- =====================================================
-- ALTERNATIVE: If you want AUTHENTICATED users only
-- =====================================================
-- Use these policies instead if you want only logged-in admins to upload:

/*
-- Replace Step 3-6 with these:

-- Public can still READ (view images on website)
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Only authenticated users can UPLOAD
CREATE POLICY "Authenticated Upload Access"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');

-- Only authenticated users can UPDATE
CREATE POLICY "Authenticated Update Access"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'product-images')
WITH CHECK (bucket_id = 'product-images');

-- Only authenticated users can DELETE
CREATE POLICY "Authenticated Delete Access"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'product-images');
*/

-- =====================================================
-- TROUBLESHOOTING
-- =====================================================

-- If uploads still fail, check:

-- 1. Bucket size limits (free tier = 1GB total)
SELECT 
  bucket_id,
  COUNT(*) as file_count,
  pg_size_pretty(SUM(LENGTH(metadata::text))::bigint) as metadata_size
FROM storage.objects
WHERE bucket_id = 'product-images'
GROUP BY bucket_id;

-- 2. Recent failed uploads (check logs if available)
-- Go to: Supabase Dashboard → Logs → Storage

-- 3. File name conflicts (upsert is set to false in code)
SELECT name, created_at
FROM storage.objects
WHERE bucket_id = 'product-images'
ORDER BY created_at DESC
LIMIT 20;

-- =====================================================
-- CLEANUP (if needed)
-- =====================================================

-- Remove all files from bucket (CAREFUL!)
-- DELETE FROM storage.objects WHERE bucket_id = 'product-images';

-- Remove specific file
-- DELETE FROM storage.objects 
-- WHERE bucket_id = 'product-images' 
-- AND name = 'your-filename.png';
