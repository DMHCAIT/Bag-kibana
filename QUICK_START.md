# Quick Start Guide - Product Slug & Color Fix

## Run This in Supabase (3 Minutes Setup)

### Step 1: Execute SQL Migration
1. Open **Supabase Dashboard**
2. Go to **SQL Editor**
3. Create new query
4. Copy and paste the contents of: **`supabase/COMPLETE_MIGRATION.sql`**
5. Click **Run**

✅ This adds slug and colors columns to your database

### Step 2: Update Product Colors (Optional)
If colors don't display correctly, update them with actual hex codes.

Example - Update VISTARA TOTE colors:
```sql
UPDATE products 
SET colors = '[
  { "name": "Teal Blue", "value": "#006D77", "available": true },
  { "name": "Mint Green", "value": "#98D8C8", "available": true },
  { "name": "Mocha", "value": "#9B6B4F", "available": true },
  { "name": "Milky Blue", "value": "#B8D4E8", "available": true }
]'::jsonb
WHERE name = 'VISTARA TOTE';
```

See `supabase/update-colors-format.sql` for more examples.

### Step 3: Deploy Code
```bash
git add -A
git commit -m "Add product slugs and fix color display"
git push
```

## What This Fixes

✅ **Before:** `/products/45` (not SEO friendly)  
✅ **After:** `/products/wallet-mint-green` (SEO friendly!)

✅ **Before:** Colors not showing  
✅ **After:** Color swatches display correctly

## Test It Works

1. Visit any product page
2. Check the URL - should use slug like `/products/wallet-mint-green`
3. Check color swatches are visible
4. Click different colors - URL should change
5. In admin, create a new product - slug auto-generates

## Need Help?

Check `SLUG_IMPLEMENTATION_GUIDE.md` for full documentation.
