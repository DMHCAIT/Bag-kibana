# How to Add VISTARA Products to Database

## Products Included (22 total products):

### 1. VISTARA TOTE (4 colors) - ₹4,500
- Teal Blue (8 images)
- Mocha Tan (8 images)
- Mint Green (7 images)
- Milky Blue (7 images)

### 2. PRIZMA SLING (4 colors) - ₹3,200
- Mint Green (8 images)
- Mocha Tan (9 images)
- Teal Blue (8 images)
- Milky Blue (8 images)

### 3. SANDESH LAPTOP BAG (4 colors) - ₹5,200
- Milky Blue (7 images)
- Mint Green (8 images)
- Mocha Tan (7 images)
- Teal Blue (8 images)

### 4. LEKHA WALLET (4 colors) - ₹1,800
- Milky Blue (8 images)
- Mint Green (8 images)
- Mocha Tan (8 images)
- Teal Blue (8 images)

### 5. VISTAPACK (4 colors) - ₹4,800
- Mint Green (8 images)
- Mocha Tan (8 images)
- Teal Blue (8 images)
- Milky Blue (8 images)

### 6. Compact Wallet (2 colors) - ₹1,500
- Mint Green (8 images)
- Teal Blue (8 images)

## Instructions to Add Products:

### Method 1: Using Supabase SQL Editor (Recommended)

1. **Login to Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Login to your project

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Copy and Paste SQL**
   - Open `supabase/add-vistara-products.sql`
   - Copy all the content
   - Paste into the SQL Editor

4. **Run the Script**
   - Click "Run" or press Cmd+Enter (Mac) / Ctrl+Enter (Windows)
   - Wait for confirmation message

5. **Verify**
   - Go to "Table Editor" → "products"
   - You should see all 22 new products

### Method 2: Using Supabase CLI

```bash
# Make sure you're in the project directory
cd "/Users/rubeenakhan/Desktop/Bag kibana/kibana-homepage"

# Login to Supabase (if not already logged in)
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Run the migration
supabase db push --file supabase/add-vistara-products.sql
```

### Method 3: Using Admin Panel

Alternatively, you can add products through your admin panel:
1. Login as admin at https://kibananew.vercel.app/admin
2. Go to "Product Management"
3. Click "Add Product"
4. Fill in details and add image URLs for each product

## Product Details

All products are set with:
- ✅ Stock: 50 units
- ✅ Bestseller: Yes
- ✅ New Arrival: Yes
- ✅ All images properly linked from Supabase Storage

## Categories Used
- TOTE
- SLING
- LAPTOP BAG
- CLUTCH
- BACKPACK
- WALLET

## Gender Classification
- Women (Most products)
- Unisex (SANDESH LAPTOP BAG, VISTAPACK)

## Verification Steps

After adding products, verify:
1. Products appear on homepage
2. Images load correctly
3. Products appear in category pages
4. Search functionality works
5. Cart and checkout work properly

## Troubleshooting

### If images don't load:
- Check if Supabase Storage is public
- Verify image URLs are correct
- Check browser console for errors

### If products don't appear:
- Check if SQL ran successfully
- Verify `products` table exists
- Check if there are any foreign key constraints

### If admin panel doesn't work:
- Clear browser cache
- Check if you're logged in as admin
- Verify admin permissions

## Need Help?

Contact support at: support@kibana.com




