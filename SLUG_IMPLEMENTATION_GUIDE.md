# Product Slug Implementation - Setup Guide

## Overview
The website has been updated to use SEO-friendly URLs with product slugs instead of numeric IDs. Products are now accessed via URLs like `/products/wallet-mint-green` instead of `/products/45`.

## Database Changes Required

### Step 1: Run the Complete Migration SQL
Execute this SQL file in your Supabase SQL Editor:

**File: `supabase/COMPLETE_MIGRATION.sql`** ⭐ (Use this one!)

This single file does everything:
1. Adds `slug` column to the products table
2. Adds `colors` column (JSONB array) to the products table
3. Creates indexes for performance
4. Auto-generates slugs for all existing products (format: product-name-color)
5. Initializes colors array with default gray color
6. Makes slug column NOT NULL and UNIQUE
7. Shows verification results

**Alternative:** If you prefer separate files:
- First run: `supabase/add-slug-column.sql` (adds slug + colors columns)
- Then run: `supabase/update-colors-format.sql` (examples to update colors)

### Step 2: Verify Slug Generation
After running the SQL, check that all products have slugs:

```sql
SELECT id, name, color, slug FROM public.products ORDER BY id;
```

You should see slugs like:
- `wallet-mint-green`
- `vistara-tote-teal-blue`
- `prizma-sling-black`

## Features Implemented

### 1. SEO-Friendly URLs ✅
- Products use descriptive slugs: `/products/wallet-mint-green`
- Backward compatible: Numeric IDs still work (`/products/45`)
- Automatic slug generation from product name + color

### 2. Color Display Fixed ✅
- Color swatches now properly display with correct hex values
- Handles both hex colors and color names
- Removes `.jpg` extension from color values
- Shows checkmark for currently selected color

### 3. Automatic Slug Management ✅
- **New Products**: Slug auto-generated when creating via admin
- **Updated Products**: Slug regenerated when name or color changes
- **Format**: `product-name-color` (lowercase, hyphens, no special characters)

### 4. API Updates ✅
- `/api/products/[id]` - Accepts both slugs and numeric IDs
- `/api/products` - Returns slug in product data
- `/api/admin/products` - Auto-generates slugs on create/update

### 5. Frontend Updates ✅
All product links now use slugs:
- Product listing pages (shop, women, men, collections)
- Product cards in carousels
- Bestsellers section
- New collection carousel
- Product detail page color variants
- Admin product view links

## Code Changes Summary

### Database Schema
- **New Column**: `slug TEXT UNIQUE NOT NULL`
- **Index**: `idx_products_slug` for performance
- **Auto-generation**: Slugs created from name + color

### API Routes Updated
1. `/app/api/products/[id]/route.ts` - Slug-based lookup
2. `/app/api/products/route.ts` - Include slug in response
3. `/app/api/admin/products/route.ts` - Auto-generate on create
4. `/app/api/admin/products/[id]/route.ts` - Auto-update on edit

### Frontend Components Updated
1. `app/products/[id]/page.tsx` - Color display fix, slug URLs
2. `components/BestsellersSection.tsx` - Use slug links
3. `components/NewCollectionCarousel.tsx` - Use slug links
4. `app/shop/page.tsx` - Use slug links
5. `app/women/page.tsx` - Use slug links
6. All collection pages - Use slug links
7. `app/admin/products/page.tsx` - View with slug, edit with dbId

### Type Definitions Updated
- `lib/products-data.ts` - Added `slug?: string` to Product interface

## Color Configuration

The colors field in the database should follow this format:

```json
[
  { "name": "Teal Blue", "value": "#006D77", "available": true },
  { "name": "Mint Green", "value": "#98D8C8", "available": true },
  { "name": "Mocha", "value": "#9B6B4F", "available": true }
]
```

**Important**: 
- Use hex color codes (e.g., `#006D77`)
- Do NOT include `.jpg` extension in the value
- The system automatically handles hex color formatting

## Testing Checklist

After running the SQL migration:

- [ ] Visit a product page: `/products/wallet-mint-green`
- [ ] Check color swatches display correctly
- [ ] Click on different color options
- [ ] Verify URL changes to new color slug
- [ ] Test admin: Create new product → Check slug generated
- [ ] Test admin: Edit product name/color → Check slug updated
- [ ] Test old numeric URLs still work: `/products/45`
- [ ] Verify all product cards link with slugs
- [ ] Check search and filters work

## Deployment Steps

1. **Run SQL Migration** (Supabase Dashboard → SQL Editor)
   ```
   Execute: supabase/COMPLETE_MIGRATION.sql
   ```
   This will:
   - Add slug and colors columns
   - Generate slugs for all products
   - Initialize colors with defaults

2. **Verify Database**
   ```sql
   SELECT COUNT(*) FROM products WHERE slug IS NULL OR colors = '[]'::jsonb;
   -- Should return 0
   
   SELECT id, name, color, slug, colors FROM products LIMIT 5;
   -- Should show slugs and colors for products
   ```

3. **Deploy Code**
   ```bash
   git add -A
   git commit -m "Implement product slugs and fix color display"
   git push
   ```

4. **Test Production**
   - Visit production site
   - Test product URLs with slugs
   - Verify colors display correctly
   - Test admin product creation/editing

## Rollback Plan

If you need to revert:

```sql
-- Remove slug column
ALTER TABLE public.products DROP COLUMN IF EXISTS slug;

-- Remove index
DROP INDEX IF EXISTS idx_products_slug;
```

Then redeploy the previous code version.

## Benefits

✅ **SEO**: Search engines prefer descriptive URLs
✅ **UX**: Users can understand what product from URL
✅ **Sharing**: Links are more meaningful when shared
✅ **Analytics**: Easier to track product performance
✅ **Backwards Compatible**: Old numeric IDs still work

## Support

If colors still don't show:
1. Check database `colors` field format (should be JSON array)
2. Verify hex codes don't have `.jpg` extension
3. Check browser console for errors
4. Verify product has `colors` array in API response

If slugs don't work:
1. Verify SQL migration ran successfully
2. Check products have unique slugs (no duplicates)
3. Test with numeric ID to ensure product exists
4. Check API response includes `slug` field
