# 📸 Image Placement Guide - Where & How

## 🎯 Quick Answer

**Your images are ALREADY in Supabase Storage!**

You just need to add products to the database with the image URLs.

---

## 📍 Where Are Your Images?

### Supabase Storage Location:
```
Project: hrahjiccbwvhtocabxja.supabase.co
Bucket: product-images
```

### Image Structure:
```
product-images/
├── VISTARA TOTE ( png )/
│   ├── VISTARA TOTE - Teal Blue/
│   │   ├── 01.png
│   │   ├── 02.png
│   │   ├── 03.png
│   │   ├── 04.png
│   │   ├── 09-10-2025--livia00539.jpg
│   │   └── ... more images
│   ├── VISTARA TOTE - Mocha Tan/
│   ├── VISTARA TOTE - Mint Green/
│   └── VISTARA TOTE - Milky Blue/
│
├── PRIZMA SLING( png )/
│   ├── PRIZMA SLING - Mint Green/
│   ├── PRIZMA SLING - Mocha Tan/
│   ├── PRIZMA SLING - Teal Blue/
│   └── PRIZMA SLING png (milky blue )/
│
├── SANDESH LAPTOP BAG ( png ) 2/
├── lekha wallet ( clutch) 3/
├── png (VISTAPACK )/
└── wallet/
```

---

## 🔗 How Image URLs Work

### Full URL Format:
```
https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/[FOLDER]/[SUBFOLDER]/[IMAGE_FILE]
```

### Example:
```
https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/VISTARA%20TOTE%20(%20png%20)/VISTARA%20TOTE%20-%20Teal%20Blue/01.png
```

**Note**: Spaces are encoded as `%20` in URLs

---

## 🎯 Two Ways to Add Images to Products

### Method 1: SQL Script (FASTEST - Recommended)

#### File: `add-vistara-products-fixed.sql`

This file has **ALL 22 products** with **171 image URLs** ready!

```sql
INSERT INTO products (name, description, price, category, images, stock, is_bestseller, is_new, color)
VALUES (
  'VISTARA TOTE',
  'Spacious and stylish tote bag...',
  4999,
  'TOTE',
  ARRAY[
    'https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/VISTARA%20TOTE%20(%20png%20)/VISTARA%20TOTE%20-%20Teal%20Blue/01.png',
    'https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/VISTARA%20TOTE%20(%20png%20)/VISTARA%20TOTE%20-%20Teal%20Blue/02.png',
    'https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/VISTARA%20TOTE%20(%20png%20)/VISTARA%20TOTE%20-%20Teal%20Blue/03.png',
    'https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/VISTARA%20TOTE%20(%20png%20)/VISTARA%20TOTE%20-%20Teal%20Blue/04.png'
    // ... more images
  ],
  50,
  true,
  true,
  'Teal Blue'
);
```

#### Steps:
1. Open Supabase Dashboard → SQL Editor
2. Copy entire `add-vistara-products-fixed.sql`
3. Paste and Run
4. Done! All 22 products with images added!

---

### Method 2: Admin Panel (MANUAL - For individual products)

#### Where to Place URLs in Admin Panel:

```
Dashboard URL: https://kibananew.vercel.app/admin/products

Step 1: Click "Add New Product"
        ↓
Step 2: Fill Product Form:
        - Name: VISTARA TOTE
        - Category: TOTE
        - Price: 4999
        - Color: Teal Blue
        - Description: (text)
        ↓
Step 3: Add Images Section
        ┌─────────────────────────────────┐
        │  Product Images                 │
        ├─────────────────────────────────┤
        │  [Image URL input box]          │
        │  [Add Image button]             │
        └─────────────────────────────────┘
        
        Paste URL here:
        https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/VISTARA%20TOTE%20(%20png%20)/VISTARA%20TOTE%20-%20Teal%20Blue/01.png
        
        Click "Add Image"
        
        Repeat for each image
        ↓
Step 4: Click "Create Product"
```

---

## 🖼️ Image Display Flow

### How Images Appear on Your Website:

```
┌────────────────────────────────────────┐
│  1. Product Added to Database          │
│     - Name, price, etc.                │
│     - Images array with URLs           │
└──────────────┬─────────────────────────┘
               ↓
┌────────────────────────────────────────┐
│  2. User Visits Product Page           │
│     URL: /products/[id]                │
└──────────────┬─────────────────────────┘
               ↓
┌────────────────────────────────────────┐
│  3. API Fetches Product                │
│     GET /api/products/[id]             │
└──────────────┬─────────────────────────┘
               ↓
┌────────────────────────────────────────┐
│  4. Returns Product Data               │
│     {                                  │
│       id: 1,                           │
│       name: "VISTARA TOTE",            │
│       images: [                        │
│         "https://...01.png",           │
│         "https://...02.png"            │
│       ]                                │
│     }                                  │
└──────────────┬─────────────────────────┘
               ↓
┌────────────────────────────────────────┐
│  5. Product Page Displays Images       │
│     - Main carousel                    │
│     - Thumbnail gallery                │
│     - Loads from Supabase URLs         │
└────────────────────────────────────────┘
```

---

## 📋 Complete Product List with Image Counts

| Product | Colors | Images per Color | Total Images |
|---------|--------|------------------|--------------|
| VISTARA TOTE | 4 | 7-8 each | 30 |
| PRIZMA SLING | 4 | 8-9 each | 33 |
| SANDESH LAPTOP BAG | 4 | 7-8 each | 30 |
| LEKHA WALLET | 4 | 8 each | 32 |
| VISTAPACK | 4 | 8 each | 32 |
| Compact Wallet | 2 | 8 each | 16 |
| **TOTAL** | **22** | - | **171** |

---

## 🔍 Example: Adding VISTARA TOTE - Teal Blue

### Option A: Via SQL
```sql
INSERT INTO products (name, description, price, category, images, stock, is_bestseller, is_new, color)
VALUES (
  'VISTARA TOTE',
  'Spacious and stylish tote bag perfect for everyday use.',
  4999,
  'TOTE',
  ARRAY[
    'https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/VISTARA%20TOTE%20(%20png%20)/VISTARA%20TOTE%20-%20Teal%20Blue/01.png',
    'https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/VISTARA%20TOTE%20(%20png%20)/VISTARA%20TOTE%20-%20Teal%20Blue/02.png',
    'https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/VISTARA%20TOTE%20(%20png%20)/VISTARA%20TOTE%20-%20Teal%20Blue/03.png',
    'https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/VISTARA%20TOTE%20(%20png%20)/VISTARA%20TOTE%20-%20Teal%20Blue/04.png',
    'https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/VISTARA%20TOTE%20(%20png%20)/VISTARA%20TOTE%20-%20Teal%20Blue/09-10-2025--livia00539.jpg',
    'https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/VISTARA%20TOTE%20(%20png%20)/VISTARA%20TOTE%20-%20Teal%20Blue/09-10-2025--livia00547.jpg',
    'https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/VISTARA%20TOTE%20(%20png%20)/VISTARA%20TOTE%20-%20Teal%20Blue/09-10-2025--livia00548.jpg',
    'https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/VISTARA%20TOTE%20(%20png%20)/VISTARA%20TOTE%20-%20Teal%20Blue/09-10-2025--livia00554.jpg'
  ],
  50,
  true,
  true,
  'Teal Blue'
);
```

### Option B: Via Admin Panel
1. Go to `/admin/products/new`
2. Fill form:
   - Name: `VISTARA TOTE`
   - Category: Select `TOTE`
   - Price: `4999`
   - Color: `Teal Blue`
   - Stock: `50`
   - Description: `Spacious and stylish tote bag perfect for everyday use.`
3. Scroll to "Product Images" section
4. Paste each URL (8 total) one by one:
   - Paste URL → Click "Add Image"
   - Repeat 8 times
5. Click "Create Product"

---

## ✅ Verification Steps

After adding products, verify they work:

### 1. Check Database
```
Supabase Dashboard → Table Editor → products
Should see: 22 rows
```

### 2. Check API
```
Visit: https://kibananew.vercel.app/api/products
Should return: JSON with all products and image arrays
```

### 3. Check Website
```
Visit: https://kibananew.vercel.app
Homepage should show: Product grid with images
```

### 4. Check Product Page
```
Visit: https://kibananew.vercel.app/products/1
Should show: Product details with image carousel
```

### 5. Test Image Loading
```
Right-click on product image → "Open in new tab"
Should show: Image loads successfully from Supabase
```

---

## 🚨 Troubleshooting Images

### Images Not Loading?

#### Problem: Broken image icons
**Solution:**
1. Make bucket public:
   - Supabase Dashboard → Storage → product-images
   - Settings → Make public
   
2. Check URL is correct:
   - Should start with `https://`
   - Should contain `/storage/v1/object/public/`
   - Should end with image file extension

#### Problem: 403 Forbidden
**Solution:**
- Bucket not public → Make it public
- Or add RLS policy:
```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');
```

#### Problem: 404 Not Found
**Solution:**
- Check file exists in Supabase Storage
- Verify folder structure
- Check URL encoding (spaces = `%20`)

---

## 🎯 Quick Reference Card

### Image URL Template:
```
https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/[PRODUCT_FOLDER]/[COLOR_FOLDER]/[IMAGE_FILE]
```

### Where to Put URLs:
1. ✅ **SQL Script** (all at once) → `add-vistara-products-fixed.sql`
2. ✅ **Admin Panel** (one by one) → `/admin/products/new`
3. ✅ **Direct Database** (advanced) → Supabase Table Editor

### Files with All URLs:
- ✅ `add-vistara-products-fixed.sql` - Ready to run!
- ✅ `KIBANA PICS URL.docx` - Your original list
- ✅ `lib/products-data.ts` - Static fallback data

---

## 🎉 Summary

**Images are uploaded** ✅  
**URLs are ready** ✅  
**SQL script is ready** ✅  
**Admin panel works** ✅  

**Just run the SQL script and you're done!**

```bash
# Make script executable
chmod +x fix-connection-issues.sh

# Run it
./fix-connection-issues.sh

# Then add products via SQL or Admin panel
```

---

📚 **Related Guides:**
- `COMPLETE_SETUP_GUIDE.md` - Full setup instructions
- `QUICK_START_ADD_PRODUCTS.md` - 3-step quick start
- `FINAL_PRODUCT_PRICES.md` - Price list
- `ADD_PRODUCTS_INSTRUCTIONS.md` - Detailed product addition guide

