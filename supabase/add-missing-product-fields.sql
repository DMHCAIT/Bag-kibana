-- ═══════════════════════════════════════════════════════════════════
-- Add Missing Product Fields for Complete E-Commerce Management
-- ═══════════════════════════════════════════════════════════════════

-- Step 1: Add new columns to products table
ALTER TABLE products 
  ADD COLUMN IF NOT EXISTS rating DECIMAL(3,1) DEFAULT 4.5,
  ADD COLUMN IF NOT EXISTS reviews INTEGER DEFAULT 10,
  ADD COLUMN IF NOT EXISTS specifications JSONB DEFAULT '{}'::jsonb;

-- Step 2: Update existing products with default values
UPDATE products 
SET 
  rating = 4.5,
  reviews = 10,
  specifications = '{
    "material": "Vegan Leather",
    "texture": "Textured",
    "closureType": "Magnetic Snap",
    "hardware": "Gold-toned",
    "compartments": ["1 main compartment", "2 inner pockets", "1 zip pocket"],
    "shoulderDrop": "10 inches",
    "capacity": "Fits essentials and more",
    "dimensions": "12 x 8 x 4 inches (L x H x W)"
  }'::jsonb
WHERE rating IS NULL OR specifications = '{}'::jsonb OR specifications IS NULL;

-- Step 3: Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_products_rating ON products(rating DESC);
CREATE INDEX IF NOT EXISTS idx_products_bestseller ON products(is_bestseller) WHERE is_bestseller = true;
CREATE INDEX IF NOT EXISTS idx_products_new ON products(is_new) WHERE is_new = true;
CREATE INDEX IF NOT EXISTS idx_products_stock ON products(stock);

-- Step 4: Add constraints
ALTER TABLE products
  ADD CONSTRAINT check_rating_range CHECK (rating >= 0 AND rating <= 5),
  ADD CONSTRAINT check_reviews_positive CHECK (reviews >= 0),
  ADD CONSTRAINT check_stock_positive CHECK (stock >= 0);

-- Step 5: Verify changes
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'products'
  AND column_name IN ('rating', 'reviews', 'specifications', 'is_bestseller', 'is_new')
ORDER BY column_name;

-- Step 6: Sample product data with all fields (EXAMPLE)
/*
INSERT INTO products (
  name, description, price, category, images, stock,
  color, rating, reviews, is_bestseller, is_new,
  features, care_instructions, specifications
)
VALUES (
  'VISTARA TOTE',
  'Spacious and stylish tote bag perfect for everyday use. Crafted with premium materials and elegant design.',
  4999,
  'TOTE',
  ARRAY[
    'https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/VISTARA%20TOTE%20(%20png%20)/VISTARA%20TOTE%20-%20Teal%20Blue/01.png'
  ],
  50,
  'Teal Blue',
  4.9,
  12,
  true,
  true,
  ARRAY['Premium vegan leather', 'Multiple compartments', 'Adjustable straps'],
  ARRAY['Spot clean with damp cloth', 'Avoid direct sunlight', 'Store in dust bag'],
  '{
    "material": "Vegan Leather",
    "texture": "Textured",
    "closureType": "Magnetic Snap",
    "hardware": "Gold-toned",
    "compartments": ["1 main compartment", "2 inner pockets", "1 zip pocket"],
    "shoulderDrop": "10 inches",
    "capacity": "Fits essentials and more",
    "dimensions": "12 x 8 x 4 inches (L x H x W)"
  }'::jsonb
);
*/

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Successfully added rating, reviews, and specifications columns!';
  RAISE NOTICE '✅ Updated existing products with default values';
  RAISE NOTICE '✅ Added performance indexes';
  RAISE NOTICE '✅ Added data validation constraints';
  RAISE NOTICE '';
  RAISE NOTICE '📋 Next Steps:';
  RAISE NOTICE '1. Update admin form to include new fields';
  RAISE NOTICE '2. Update API endpoints to handle new fields';
  RAISE NOTICE '3. Test adding/editing products with all fields';
END $$;

