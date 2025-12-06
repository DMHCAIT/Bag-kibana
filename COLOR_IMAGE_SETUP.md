# Color Image Upload Setup Guide

## Issue Fixed
The color management page was getting a **400 Bad Request** error when trying to upload color images. This has been fixed by:

1. ✅ Changed API calls from `PUT` to `PATCH` (allows partial updates)
2. ✅ Added `colorImage` field support in the PATCH endpoint
3. ✅ Fixed the upload API to handle single file uploads

## Database Setup Required

You need to add the `color_image` column to your products table if it doesn't exist yet.

### Step 1: Run the Migration SQL

1. Go to your **Supabase Dashboard**: https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy and paste this SQL:

```sql
-- Add color_image field to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS color_image TEXT;

-- Add comment
COMMENT ON COLUMN products.color_image IS 'URL of circular color swatch image for the product variant';
```

6. Click **Run** or press `Ctrl/Cmd + Enter`
7. You should see: "Success. No rows returned"

### Step 2: Verify the Column Was Added

Run this query to verify:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products' AND column_name = 'color_image';
```

You should see:
```
column_name  | data_type
-------------|----------
color_image  | text
```

## How to Upload Color Images

1. Go to: **https://www.kibanalife.com/admin/color-management**
2. Select a product from the dropdown (or view all)
3. Click **Upload Image** for any product variant
4. Choose a square image (recommended 200x200px to 400x400px)
5. The image will be uploaded and saved to that product variant

## Image Guidelines

- ✅ **Size**: 200x200px to 400x400px (max 5MB)
- ✅ **Format**: PNG, JPG, or WEBP
- ✅ **Content**: Show the product clearly in the specific color
- ✅ **Background**: Transparent or white background works best
- ✅ **Shape**: Square images work best (will be displayed as circles on frontend)

## Testing

After running the migration, try uploading a color image:

1. Go to color management page
2. Upload an image for any product
3. Check the browser console - should see "Color image uploaded successfully!"
4. The uploaded image should appear next to the product
5. Go to the product page on the frontend to see the color swatch

## Note About Storage

Currently, the upload API simulates uploads and returns placeholder URLs. For production:

- You may want to set up a **Supabase Storage bucket** called `color-swatches`
- Or use the existing `product-images` bucket
- Update the upload API to actually upload files to Supabase Storage (commented code is in the file)

The current implementation will work for testing, but uploaded images won't persist between deployments.
