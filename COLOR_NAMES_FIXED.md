# Color Names Fixed

## Changes Made

Fixed color name mismatches between product `color` field and `colors` array:

### 1. SANDESH LAPTOP BAG
- **Changed**: "Mocha Tan" → "Mocha"
- **Reason**: Products have color field as "Mocha", not "Mocha Tan"

### 2. VISTAPACK
- **Changed**: "Mint Green" → "Green"
- **Added**: Both "Green" and "Teal Blue" since product shows "Color: Green"
- **Reason**: Products have color field as "Green", not "Mint Green"

### 3. LEKHA WALLET
- **Changed**: "Mocha Tan" → "Mocha"
- **Reason**: Standardizing all products to use "Mocha" consistently

## Standard Color Names (All Products)

```json
[
  { "name": "Teal Blue", "value": "#006D77", "available": true },
  { "name": "Mint Green" or "Green", "value": "#98D8C8", "available": true },
  { "name": "Mocha", "value": "#9B6B4F", "available": true },
  { "name": "Milky Blue", "value": "#B8D4E8", "available": true }
]
```

**Note**: Some products use "Green" instead of "Mint Green" - both are supported.

## Products Using These Colors

1. SANDESH LAPTOP BAG - Teal Blue, Mint Green, Mocha, Milky Blue
2. VISTAPACK - Green, Teal Blue, Mocha, Milky Blue
3. LEKHA WALLET - Teal Blue, Mint Green, Mocha, Milky Blue
4. VISTARA TOTE - Teal Blue, Mint Green, Mocha, Milky Blue
5. PRIZMA SLING - Teal Blue, Mint Green, Mocha, Milky Blue
6. VISTARA BACKPACK - Teal Blue, Mint Green, Mocha, Milky Blue

## Next Steps

### 1. Add color_image Column
```sql
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS color_image TEXT;
```

### 2. Run the Updated SQL
Go to Supabase → SQL Editor → Run:
```
supabase/fix-all-product-colors.sql
```

### 3. Verify Colors Match
Run the verification queries at the bottom of the SQL file to check:
- Each product has 4 color variants
- Color names match between `color` field and `colors` array

### 4. Upload Color Images
Go to `/admin/color-management` and upload images for each color variant:
- Image size: 200x200px to 400x400px (square)
- Format: JPG or PNG
- Shows the product in that specific color
- These will appear as 24px circles on listing pages
- 64px squares on product detail pages

## How Color Matching Works

The API uses two strategies:

1. **Exact Match**: Tries to match color names exactly
   ```typescript
   colorImageMap[variant.color.toLowerCase().trim()]
   ```

2. **Normalized Match**: Removes special characters and extra spaces
   ```typescript
   const normalizeColor = (color: string) => {
     return color.toLowerCase().trim()
       .replace(/\s+/g, ' ')
       .replace(/[^a-z0-9\s]/g, '');
   };
   ```

This handles variations like:
- "Mocha" vs "Mocha Tan"
- "Teal Blue" vs "TealBlue"
- "Mint Green" vs "MintGreen"

## Testing Checklist

After running the SQL and uploading images:

- [ ] Homepage - NewCollectionCarousel shows color images
- [ ] Homepage - BestsellersSection shows color images
- [ ] Shop page - All products show color images
- [ ] Women page - All products show color images
- [ ] SANDESH LAPTOP BAG product page - 4 colors with images
- [ ] VISTAPACK product page - 4 colors with images
- [ ] Hover effect - 2nd image shows on all listings
- [ ] Color selection - Clicking color box changes main image

## Debug Endpoint

Visit `/api/debug-colors` to see:
- Product name and color field
- Whether color_image exists
- The colors array structure
- Helps troubleshoot any remaining issues
