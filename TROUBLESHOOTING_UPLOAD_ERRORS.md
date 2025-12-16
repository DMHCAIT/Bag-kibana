# TROUBLESHOOTING GUIDE: Image Upload Errors

## Issue Summary

You're experiencing two main errors:

1. **404 Error**: `09-10-2025--livia00357-Photoroom.png` not found
2. **413 Error**: File upload payload too large

---

## ✅ FIXED: 413 Error (Content Too Large)

### What Was Changed:
- Reduced upload limit from **500MB to 100MB per file** (more practical for web uploads)
- Implemented **batch uploading** - uploads 3 files at a time instead of all at once
- Updated error messages to show file sizes and suggest compression

### Why 500MB Didn't Work:
- **Vercel Hobby Plan**: ~4.5MB request body limit
- **Vercel Pro Plan**: ~100MB request body limit  
- No configuration can bypass these platform limits
- Our new 100MB limit aligns with Vercel Pro's capabilities

### Testing the Fix:
1. Go to your admin panel
2. Try uploading images under 100MB
3. If uploading multiple files, they'll be sent in batches of 3
4. You should see success messages for each batch

---

## 🔍 TO FIX: 404 Error (Missing Image)

### The Problem:
The database references `09-10-2025--livia00357-Photoroom.png` but:
- The file might not exist in Supabase Storage
- The file might have a different extension (`.jpg` instead of `.png`)
- The file path might be incorrect

### Step-by-Step Fix:

#### STEP 1: Check Supabase Storage
1. Go to https://supabase.com/dashboard
2. Select your project
3. Navigate to **Storage** → **product-images** bucket
4. Search for files with "livia" or "livia00357" in the name
5. Note the **exact filename and extension**

#### STEP 2: Run SQL Query to Find the Product
I've created a SQL file for you: `supabase/fix-livia-image.sql`

Run this in your Supabase SQL Editor:
\`\`\`sql
SELECT 
  id, 
  name, 
  color,
  images,
  slug
FROM products 
WHERE images::text LIKE '%livia00357%'
ORDER BY id;
\`\`\`

This will show you:
- Which product has the problematic image
- What the current image URL is in the database

#### STEP 3: Update the Database
If the file exists in Storage with a different name/extension:

\`\`\`sql
UPDATE products
SET images = ARRAY(
  SELECT REPLACE(
    unnest(images),
    '09-10-2025--livia00357-Photoroom.png',
    'https://YOUR_SUPABASE_URL/storage/v1/object/public/product-images/ACTUAL_FILENAME_FROM_STORAGE.jpg'
  )
)
WHERE images::text LIKE '%livia00357%';
\`\`\`

**Important**: Replace `ACTUAL_FILENAME_FROM_STORAGE.jpg` with the exact filename you found in Step 1.

#### STEP 4: If Image is Completely Missing
If the image doesn't exist in Supabase Storage at all:

**Option A: Remove the missing image reference**
\`\`\`sql
UPDATE products
SET images = array_remove(images, '09-10-2025--livia00357-Photoroom.png')
WHERE images::text LIKE '%livia00357%';
\`\`\`

**Option B: Re-upload the image**
1. Go to your admin panel
2. Edit the affected product (ID from Step 2)
3. Upload the image again
4. Save the product

---

## 📊 Understanding the Errors

### 404 Error Breakdown:
\`\`\`
GET https://www.kibanalife.com/admin/products/32/09-10-2025--livia00357-Photoroom.png 404
\`\`\`

This means:
- **Product ID**: 32
- **Missing file**: `09-10-2025--livia00357-Photoroom.png`
- **Issue**: The URL path suggests it's looking in the wrong location

### 413 Error Breakdown:
\`\`\`
POST https://www.kibanalife.com/api/admin/upload 413 (Content Too Large)
\`\`\`

This means:
- The total size of files being uploaded exceeded Vercel's limit
- **Fixed** by reducing per-file limit to 100MB and batching uploads

---

## 🎯 Best Practices Going Forward

### Image Upload Guidelines:
1. **Optimal file size**: 2-10MB per image
2. **Maximum supported**: 100MB per file
3. **Multiple files**: Upload in batches (system handles automatically)
4. **Recommended format**: WebP or JPEG for best compression
5. **Image dimensions**: Max 4000x4000px for product photos

### If You Still Get 413 Errors:
1. **Compress images before upload**:
   - Use tools like TinyPNG.com or ImageOptim
   - Aim for under 5MB per image
   
2. **Upload fewer files at once**:
   - Upload 3-5 images at a time instead of 10+
   
3. **Consider image optimization**:
   - Resize large images to 2000x2000px
   - Convert PNG to JPEG if transparency isn't needed

---

## 🔧 Technical Details

### Current Configuration:
- **Client limit**: 100MB per file
- **Batch size**: 3 files per upload request
- **Vercel function timeout**: 60 seconds
- **Vercel function memory**: 3GB
- **File types**: All image/* MIME types

### Files Changed:
1. `components/admin/ProductForm.tsx` - Batch upload logic
2. `app/api/admin/upload/route.ts` - 100MB validation
3. `supabase/fix-livia-image.sql` - SQL queries for 404 fix

---

## 🆘 Still Having Issues?

### For 404 Errors:
Run the SQL query and share:
- Product ID
- Current image URLs in database
- Files that exist in Supabase Storage

### For 413 Errors:
Share:
- File sizes you're trying to upload
- Number of files at once
- Your Vercel plan (Hobby/Pro/Enterprise)

---

## ✨ Summary

**✅ DONE:**
- Reduced upload limit to 100MB (realistic for Vercel)
- Implemented batch uploading
- Better error messages with file sizes
- Created SQL troubleshooting queries

**📋 TODO:**
1. Check Supabase Storage for the "livia" image
2. Run SQL queries to find the problematic product
3. Update database with correct image URL OR remove missing image
4. Test uploads with new 100MB limit

The 413 errors should now be resolved. The 404 error requires you to check Supabase Storage and update the database accordingly.
