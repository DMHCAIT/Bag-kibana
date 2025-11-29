# 🎯 COMPLETE SETUP GUIDE - Products & Admin

## ✅ Your Images Are Already in Supabase!

All 171 product images are uploaded to Supabase Storage at:
```
https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/
```

---

## 📍 Where to Place Product URLs

### Option 1: Using SQL (RECOMMENDED - Fastest)

**File Location**: `supabase/add-vistara-products-fixed.sql`

This file already contains ALL 22 products with:
- ✅ Correct prices
- ✅ All 171 image URLs
- ✅ Correct schema (no gender column)
- ✅ Ready to run

**How to Use:**

1. **Open Supabase Dashboard**
   ```
   https://supabase.com/dashboard
   ```

2. **Go to SQL Editor**
   - Click "SQL Editor" in left sidebar
   - Click "New Query"

3. **Copy & Paste**
   - Open: `supabase/add-vistara-products-fixed.sql`
   - Copy ALL content (Cmd+A, Cmd+C)
   - Paste into SQL Editor

4. **Run**
   - Click "Run" button or press Cmd+Enter
   - Wait for "Success" message

5. **Verify**
   - Go to "Table Editor" → "products"
   - You should see 22 products
   - Visit website: https://kibananew.vercel.app
   - Products appear immediately!

---

### Option 2: Using Admin Panel (Manual - For individual products)

**Admin URL**: `https://kibananew.vercel.app/admin/products`

#### How to Add Products Manually:

1. **Login to Admin**
   - Go to: `/admin/products`
   - Click "Add New Product"

2. **Fill Product Details**
   - Name: VISTARA TOTE
   - Category: TOTE
   - Price: 4999
   - Color: Teal Blue
   - Stock: 50
   - Description: (Product description)

3. **Add Images (Copy URLs from Below)**

   **VISTARA TOTE - Teal Blue URLs:**
   ```
   https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/VISTARA%20TOTE%20(%20png%20)/VISTARA%20TOTE%20-%20Teal%20Blue/01.png
   https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/VISTARA%20TOTE%20(%20png%20)/VISTARA%20TOTE%20-%20Teal%20Blue/02.png
   https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/VISTARA%20TOTE%20(%20png%20)/VISTARA%20TOTE%20-%20Teal%20Blue/03.png
   https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/VISTARA%20TOTE%20(%20png%20)/VISTARA%20TOTE%20-%20Teal%20Blue/04.png
   ```

   **For other products**: See URLs in `add-vistara-products-fixed.sql`

4. **Click "Create Product"**

---

## 🔧 How Product Pages Display Images

### Current Flow:

```
User visits product page
  ↓
Page calls: /api/products/[id]
  ↓
API fetches from Supabase database
  ↓
Returns product with images array
  ↓
Product page displays images
```

### Image Display Code:
Located in: `app/products/[id]/page.tsx`

```typescript
// Images are fetched from database
const productResponse = await fetch(`/api/products/${id}`);
const productData = await productResponse.json();

// Product contains images array:
product.images = [
  "https://...supabase.co/.../01.png",
  "https://...supabase.co/.../02.png",
  // etc...
]

// Images are displayed in carousel
{product.images.map((image, index) => (
  <Image src={image} alt={product.name} />
))}
```

---

## 🛠️ Admin Panel Features

### Current Admin Capabilities:

✅ **View All Products**
- URL: `/admin/products`
- Shows all products from database
- Search and filter functionality

✅ **Add New Products**
- URL: `/admin/products/new`
- Manual form entry
- Paste image URLs directly

✅ **Edit Products**
- URL: `/admin/products/[id]/edit`
- Update any field
- Add/remove images

✅ **Delete Products**
- Click trash icon
- Confirms before deleting

✅ **Sync Static Data**
- Button: "Sync Products from Static Data"
- Copies all products from `lib/products-data.ts` to database

---

## 📊 Database Schema

Your `products` table has these columns:

```sql
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  category TEXT NOT NULL,
  color TEXT,
  images TEXT[] DEFAULT '{}',  -- Array of image URLs
  stock INTEGER DEFAULT 0,
  features TEXT[] DEFAULT '{}',
  care_instructions TEXT[] DEFAULT '{}',
  is_bestseller BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Note**: No `gender` column - that's why the original SQL failed!

---

## 🐛 Common Issues & Fixes

### Issue 1: Images Not Loading

**Symptoms**: Broken image icons on product pages

**Fixes**:
1. Check Supabase Storage is public
   - Dashboard → Storage → product-images
   - Click settings icon → Make bucket public

2. Verify image URLs are correct
   - Should start with: `https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/`

3. Check CORS settings in Supabase
   - Dashboard → Settings → API
   - Add your domain to allowed origins

---

### Issue 2: Connection Errors

**Symptoms**: "Network disconnected" or "Failed to fetch"

**Fixes**:
1. Check environment variables
   ```bash
   # .env.local should have:
   NEXT_PUBLIC_SUPABASE_URL=https://hrahjiccbwvhtocabxja.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_KEY=your_service_key
   ```

2. Restart development server
   ```bash
   npm run dev
   ```

3. Clear browser cache

4. Check Supabase is not paused
   - Dashboard → check project status

---

### Issue 3: Products Not Showing on Website

**Symptoms**: Empty product grid

**Fixes**:
1. Run SQL script to add products (Option 1 above)

2. OR sync static products:
   - Go to `/admin/products`
   - Click "Sync Products from Static Data"

3. Check API endpoint:
   - Visit: `https://kibananew.vercel.app/api/products`
   - Should return JSON with products

---

### Issue 4: Admin Panel Issues

**Symptoms**: Can't access admin or save products

**Fixes**:
1. Check if logged in as admin
   - Email: admin@kibana.com
   - If not working, check user has `role = 'admin'` in database

2. Check admin API routes
   - Should be at: `/api/admin/products`

3. Verify Supabase service key
   - In .env.local
   - Must have admin privileges

---

## 🎨 Matching Admin to Frontend

The admin panel is designed to match your frontend:

### Current Design:
- ✅ Black and white theme (matches frontend)
- ✅ Clean, minimalist layout
- ✅ Same typography (Playfair Display, Inter)
- ✅ Responsive design

### To Customize Admin Further:

Edit these files:
- `app/admin/layout.tsx` - Overall admin layout
- `app/admin/products/page.tsx` - Products list page
- `components/admin/ProductForm.tsx` - Add/Edit form

---

## 📁 All Your Image URLs

### Quick Reference - All Product Image URLs:

#### VISTARA TOTE (4 colors)
**Teal Blue:**
```
https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/VISTARA%20TOTE%20(%20png%20)/VISTARA%20TOTE%20-%20Teal%20Blue/01.png
https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/VISTARA%20TOTE%20(%20png%20)/VISTARA%20TOTE%20-%20Teal%20Blue/02.png
https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/VISTARA%20TOTE%20(%20png%20)/VISTARA%20TOTE%20-%20Teal%20Blue/03.png
https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/VISTARA%20TOTE%20(%20png%20)/VISTARA%20TOTE%20-%20Teal%20Blue/04.png
+ 4 more lifestyle images
```

**Mocha Tan, Mint Green, Milky Blue:** Similar pattern

#### PRIZMA SLING (4 colors)
```
https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/PRIZMA%20SLING(%20png%20)/PRIZMA%20SLING%20-%20[COLOR]/01.png
```

#### SANDESH LAPTOP BAG (4 colors)
```
https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/SANDESH%20LAPTOP%20BAG%20(%20png%20)%202/SANDESH%20LAPTOP%20BAG%20-%20[COLOR]/01.png
```

#### LEKHA WALLET (4 colors)
```
https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/lekha%20wallet%20(%20clutch)%203/LEKHA%20WALLET%20-%20[COLOR]/01.png
```

#### VISTAPACK (4 colors)
```
https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/png%20(VISTAPACK%20)/VISTAPACK%20-%20[COLOR]/01.png
```

#### Compact Wallet (2 colors)
```
https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/wallet/[COLOR]/01.png
```

**Complete URLs**: See `add-vistara-products-fixed.sql`

---

## ✅ Quick Checklist

### To Get Everything Working:

- [ ] Run SQL script in Supabase (`add-vistara-products-fixed.sql`)
- [ ] Verify products in Table Editor
- [ ] Visit website - check products show up
- [ ] Test product detail pages
- [ ] Test add to cart functionality
- [ ] Login to admin panel
- [ ] Test creating a new product
- [ ] Test editing a product
- [ ] Test deleting a product
- [ ] Check images display correctly
- [ ] Test on mobile device

---

## 🚀 Deployment Status

Your app is deployed at:
- **Production**: https://kibananew.vercel.app
- **Admin**: https://kibananew.vercel.app/admin

### After Adding Products:
1. Changes are immediate (no rebuild needed)
2. Supabase database updates live
3. Website reflects changes instantly

---

## 📞 Need Help?

If you encounter any issues:

1. **Check Logs**
   ```bash
   # Local development
   npm run dev
   # Check terminal for errors
   
   # Production
   # Vercel Dashboard → Your Project → Logs
   ```

2. **Check Supabase Logs**
   - Dashboard → Database → Logs
   - Check for connection issues

3. **Test API Endpoints**
   ```bash
   # Test products API
   curl https://kibananew.vercel.app/api/products
   
   # Test single product
   curl https://kibananew.vercel.app/api/products/1
   ```

---

## 🎉 Summary

**Your images are ready!** They're in Supabase Storage with proper URLs.

**Two ways to add products:**
1. **SQL Script** (recommended) - Add all 22 at once
2. **Admin Panel** - Add one by one with form

**Everything is connected and ready to work!**

Just run the SQL script and you're done! 🚀

