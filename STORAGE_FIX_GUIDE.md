# Fix Supabase Storage 400 Error

## Problem
Images are returning 400 Bad Request errors when accessed from Supabase Storage, even with properly encoded URLs.

## Root Causes
1. **Bucket not public** - The `product-images` bucket may not be set to public access
2. **Missing RLS policies** - Storage policies may not allow public read access
3. **CORS configuration** - Bucket may not have proper CORS settings

## Solution Steps

### Step 1: Make Bucket Public
1. Go to Supabase Dashboard → Storage
2. Click on `product-images` bucket
3. Click on the gear icon (settings)
4. Enable "Public bucket"
5. Click "Save"

### Step 2: Add Storage Policies
Run the SQL script in `supabase/fix-storage-policies.sql`:

```sql
-- Make bucket public
UPDATE storage.buckets
SET public = true
WHERE name = 'product-images';

-- Allow public read access
CREATE POLICY "Allow public read access"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'product-images');
```

### Step 3: Configure CORS
1. Go to Supabase Dashboard → Storage → Configuration
2. Add CORS configuration:

```json
{
  "allowedOrigins": [
    "https://www.kibanalife.com",
    "https://kibanalife.com",
    "http://localhost:3000"
  ],
  "allowedMethods": ["GET", "HEAD"],
  "allowedHeaders": ["*"],
  "maxAge": 3600
}
```

### Step 4: Verify Access
Test a URL directly in your browser:
```
https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/logo%20kibana.jpg
```

It should display the image without requiring authentication.

### Step 5: Alternative - Rename Folders Without Spaces
If issues persist, consider reorganizing your storage structure to avoid spaces in folder names:

**Current structure:**
```
product-images/
  VISTARA TOTE ( png )/
    VISTARA TOTE - Milky Blue/
```

**Recommended structure:**
```
product-images/
  vistara-tote/
    milky-blue/
```

This can be done by:
1. Downloading all files
2. Creating new folder structure
3. Re-uploading files
4. Updating database URLs

## Testing
After applying fixes, test with:
1. Direct browser access to image URL
2. Check browser console for errors
3. Verify images load on website

## Code Changes Made
- ✅ Created `lib/image-utils.ts` with URL encoding utilities
- ✅ Set Next.js `images.unoptimized: true` in `next.config.ts`
- ✅ Created SQL script to fix storage policies

## Next Steps
1. Apply the storage policies in Supabase
2. Test image URLs directly
3. If still failing, reorganize folder structure
4. Update product image URLs in database
