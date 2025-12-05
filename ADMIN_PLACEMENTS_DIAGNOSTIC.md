# Admin Placements Diagnostic Guide

## Database Schema ✅

Your database schema is **CORRECT** and has all required tables:

### ✅ Products Table
- `id` (INTEGER) - Primary key
- `name`, `category`, `color`, `price` - Product details
- `slug` (TEXT UNIQUE) - For URLs
- `images` (ARRAY) - Product images
- All other fields are present

### ✅ Product Placements Table
- `id` (SERIAL) - Primary key
- `product_id` (INTEGER) - Foreign key to products
- `section` (VARCHAR) - Section name
- `display_order` (INTEGER) - Order in section
- `is_active` (BOOLEAN) - Visibility toggle
- UNIQUE constraint on (product_id, section)

## Diagnostic Checklist

### Step 1: Verify Products Exist in Database

Run this in Supabase SQL Editor:

```sql
-- Check total products
SELECT COUNT(*) as total_products FROM products;

-- View first 5 products
SELECT id, name, color, slug, price FROM products LIMIT 5;
```

**Expected:** Should show at least 1 product

---

### Step 2: Verify Product Placements Table Exists

Run this in Supabase SQL Editor:

```sql
-- Check if table exists
SELECT COUNT(*) as total_placements FROM product_placements;

-- View existing placements
SELECT 
  pp.id,
  pp.product_id,
  pp.section,
  pp.display_order,
  pp.is_active,
  p.name,
  p.color
FROM product_placements pp
LEFT JOIN products p ON pp.product_id = p.id
ORDER BY pp.section, pp.display_order;
```

**Expected:** Table should exist (count may be 0)

---

### Step 3: Test API Endpoints

#### Test Products API
```bash
curl http://localhost:3000/api/products | jq '.products | length'
```
**Expected:** Should return number of products

#### Test Placements API
```bash
curl http://localhost:3000/api/admin/placements?section=bestsellers | jq 'length'
```
**Expected:** Should return number (0 or more)

---

### Step 4: Browser Console Test

1. Open: `http://localhost:3000/admin/placements`
2. Open Browser Console (F12 or Cmd+Option+I)
3. Look for these logs:

```
=== PRODUCT SELECTOR DEBUG ===
Total products fetched: X
Placed product IDs: [...]
Available products: X
First 3 products: [...]
```

---

## Common Issues & Solutions

### Issue 1: "Loading products..." never changes
**Cause:** Products API not returning data
**Solution:**
1. Check Supabase env variables in `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_key
   ```
2. Restart dev server: `npm run dev`

---

### Issue 2: "No products found in database"
**Cause:** Products table is empty
**Solution:**
1. Run product insertion SQL: `supabase/add-vistara-products-fixed.sql`
2. Or create products via Admin Panel: `http://localhost:3000/admin/products`

---

### Issue 3: "All products are already placed"
**Cause:** All products in database are already in that section
**Solution:**
1. Try a different section (e.g., switch from "bestsellers" to "new-collection")
2. Or remove some placements first
3. Or add more products to database

---

### Issue 4: Products showing but dropdown empty
**Cause:** dbId field mismatch
**Check Console Logs:**
```javascript
// Look for this in console:
First 3 products: [
  { id: "...", dbId: X, name: "...", color: "..." }
]
```
**Solution:** If `dbId` is `undefined`, the API needs fixing

---

### Issue 5: "product_placements table does not exist"
**Cause:** Table not created in Supabase
**Solution:**
1. Go to Supabase Dashboard → SQL Editor
2. Run: `supabase/create-product-placements.sql`
3. Verify with: `SELECT * FROM product_placements LIMIT 1;`

---

## Quick Fix Commands

### Reset Dev Server
```bash
cd "/Users/rubeenakhan/Desktop/Bag kibana/kibana-homepage"
npm run dev
```

### Test Database Connection
Create a test file and run:
```javascript
// test-db.js
import { supabaseAdmin } from './lib/supabase.ts';

const test = async () => {
  const { data, error } = await supabaseAdmin.from('products').select('id, name').limit(1);
  console.log('Products:', data);
  console.log('Error:', error);
};

test();
```

---

## Expected Behavior (When Working)

1. **Section Selector:** Dropdown shows 4 sections
2. **Product Dropdown:** Shows products NOT yet placed in selected section
3. **Products Counter:** Shows "X products available"
4. **Console:** Shows debug output with product details
5. **Add Button:** Adds product to section successfully
6. **Placements List:** Shows cards with product images, names, and controls

---

## Files Modified (Recent Changes)

✅ `app/admin/placements/page.tsx` - Improved filtering and debug logging
✅ `app/women/page.tsx` - Fixed color swatch sizing
✅ Database schema verified - All tables correct

---

## Next Steps

1. **Start dev server** (if not running)
2. **Visit** `http://localhost:3000/admin/placements`
3. **Open console** and share the debug output
4. **Try selecting** a product from dropdown
5. **Report** what you see in console

---

## Contact Support

If still having issues, share:
1. Console output (screenshots or text)
2. Network tab showing API responses
3. Any error messages displayed
