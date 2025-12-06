# Fix Product Colors in Database

## Problem
Product pages are showing incorrect or missing color variants because the `colors` field in the database hasn't been properly populated.

## Solution
Run the SQL script to populate the `colors` field for all products.

## Steps

### Option 1: Using Supabase Dashboard (Recommended)
1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy the contents of `supabase/fix-all-product-colors.sql`
5. Paste into the SQL editor
6. Click "Run" button
7. Check the results to verify all products now have color variants

### Option 2: Using psql Command Line
```bash
# Connect to your Supabase database
psql "postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Run the script
\i supabase/fix-all-product-colors.sql
```

### Option 3: Using Supabase CLI
```bash
# Make sure you're logged in
supabase login

# Link your project
supabase link --project-ref [YOUR-PROJECT-REF]

# Run the migration
supabase db push
```

## Verification
After running the script, you can verify by:

1. **Check in Supabase Dashboard:**
   - Go to Table Editor
   - Select `products` table
   - Look at the `colors` column
   - Each product should now have a JSON array of color objects

2. **Check in Frontend:**
   - Visit any product page (e.g., SANDESH LAPTOP BAG - Milky Blue)
   - Scroll to "Available Colors" section
   - You should now see ALL 4 colors: Teal Blue, Mint Green, Mocha Tan, Milky Blue
   - Each color should be clickable and link to that variant

## What This Fixes
- ✅ SANDESH LAPTOP BAG now shows all 4 colors
- ✅ LEKHA WALLET now shows all 4 colors
- ✅ VISTARA TOTE now shows all 4 colors
- ✅ VISTAPACK now shows all 4 colors
- ✅ VISTARA BACKPACK now shows all 4 colors
- ✅ PRIZMA SLING now shows all 3 colors
- ✅ Wallet now shows all 4 colors

## Expected Result
When you visit any product variant (e.g., "SANDESH LAPTOP BAG - Milky Blue"), you should see:

**Available Colors:**
- ⭕ Teal Blue (clickable, links to teal blue variant)
- ⭕ Mint Green (clickable, links to mint green variant)
- ⭕ Mocha Tan (clickable, links to mocha tan variant)
- ✅ Milky Blue (selected, currently viewing)

The correct color names and hex values will display, matching what's in your admin panel and database.
