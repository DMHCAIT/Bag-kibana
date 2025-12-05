# Setup Product Placements Database

## The Problem
The placements page shows "Something went wrong" because the `product_placements` table doesn't exist in your Supabase database yet.

## The Solution - Run This SQL Script

### Step 1: Go to Supabase Dashboard
1. Open https://supabase.com/dashboard
2. Select your project
3. Click on "SQL Editor" in the left sidebar

### Step 2: Copy and Run This SQL

Copy the ENTIRE contents of the file: `supabase/create-product-placements.sql`

Or copy this simplified version:

```sql
-- Create product_placements table
CREATE TABLE IF NOT EXISTS product_placements (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  section VARCHAR(50) NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, section)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_product_placements_section ON product_placements(section, display_order);
CREATE INDEX IF NOT EXISTS idx_product_placements_active ON product_placements(is_active);
CREATE INDEX IF NOT EXISTS idx_product_placements_product ON product_placements(product_id);

-- Enable RLS
ALTER TABLE product_placements ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active placements
CREATE POLICY "Public can view active placements" ON product_placements
  FOR SELECT USING (is_active = true);

-- Allow authenticated users (admin) full access
CREATE POLICY "Authenticated users can manage placements" ON product_placements
  FOR ALL USING (auth.role() = 'authenticated');

-- Auto-update timestamp function
CREATE OR REPLACE FUNCTION update_product_placements_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS update_product_placements_timestamp ON product_placements;
CREATE TRIGGER update_product_placements_timestamp
  BEFORE UPDATE ON product_placements
  FOR EACH ROW
  EXECUTE FUNCTION update_product_placements_updated_at();
```

### Step 3: Click "Run" Button

The SQL editor will execute the script and create the table.

### Step 4: Verify Table Exists

In the Supabase dashboard:
1. Click on "Table Editor" in the left sidebar
2. You should now see `product_placements` in the list of tables

### Step 5: Test the Placements Page

Go back to your site and visit: `/admin/placements`

The page should now load without errors and show:
- Section selector dropdown
- Product selector
- Add placement button
- Empty list (until you add products)

## What This Creates

The `product_placements` table lets you control:
- Which products appear in which homepage sections
- The order they appear (display_order)
- Whether they're visible (is_active)

Available sections:
- `bestsellers` - Bestsellers Section
- `new-collection` - New Collection Carousel
- `featured` - Featured Products
- `hero-products` - Hero Products

## Troubleshooting

If you still get errors after running the SQL:
1. Check browser console for specific error messages
2. Verify the table exists in Supabase Table Editor
3. Check that your `products` table has an `id` column (not just slug)
4. Ensure you're logged in as admin when accessing `/admin/placements`
