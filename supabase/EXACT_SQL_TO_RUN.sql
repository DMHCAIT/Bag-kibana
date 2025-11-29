-- ═══════════════════════════════════════════════════════════════════
-- EXACT SQL TO ADD MISSING FIELDS TO YOUR DATABASE
-- Run this in Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════════════

-- Step 1: Add missing columns to products table
ALTER TABLE public.products 
  ADD COLUMN IF NOT EXISTS rating DECIMAL(3,1) DEFAULT 4.5,
  ADD COLUMN IF NOT EXISTS reviews INTEGER DEFAULT 10,
  ADD COLUMN IF NOT EXISTS is_bestseller BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_new BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS specifications JSONB DEFAULT '{}'::jsonb;

-- Step 2: Add constraints for data validation
ALTER TABLE public.products
  ADD CONSTRAINT check_rating_range CHECK (rating >= 0 AND rating <= 5),
  ADD CONSTRAINT check_reviews_positive CHECK (reviews >= 0),
  ADD CONSTRAINT check_stock_positive CHECK (stock >= 0);

-- Step 3: Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_products_rating ON public.products(rating DESC);
CREATE INDEX IF NOT EXISTS idx_products_bestseller ON public.products(is_bestseller) WHERE is_bestseller = true;
CREATE INDEX IF NOT EXISTS idx_products_new ON public.products(is_new) WHERE is_new = true;
CREATE INDEX IF NOT EXISTS idx_products_stock ON public.products(stock);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);

-- Step 4: Update existing products with default values (if any exist)
UPDATE public.products 
SET 
  rating = COALESCE(rating, 4.5),
  reviews = COALESCE(reviews, 10),
  is_bestseller = COALESCE(is_bestseller, false),
  is_new = COALESCE(is_new, false),
  specifications = COALESCE(specifications, '{
    "material": "Vegan Leather",
    "texture": "Textured",
    "closureType": "Magnetic Snap",
    "hardware": "Gold-toned",
    "compartments": ["1 main compartment", "2 inner pockets"],
    "shoulderDrop": "10 inches",
    "capacity": "Fits essentials and more",
    "dimensions": "12 x 8 x 4 inches (L x H x W)"
  }'::jsonb)
WHERE rating IS NULL OR reviews IS NULL OR specifications IS NULL OR specifications = '{}'::jsonb;

-- Step 5: Verify the changes
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'products'
  AND column_name IN ('rating', 'reviews', 'is_bestseller', 'is_new', 'specifications')
ORDER BY column_name;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Successfully added 5 new columns to products table!';
  RAISE NOTICE '✅ Added: rating, reviews, is_bestseller, is_new, specifications';
  RAISE NOTICE '✅ Added data validation constraints';
  RAISE NOTICE '✅ Created performance indexes';
  RAISE NOTICE '✅ Updated existing products with default values';
  RAISE NOTICE '';
  RAISE NOTICE '📊 Your products table now has ALL required fields!';
  RAISE NOTICE '';
  RAISE NOTICE '🎯 Next step: Add your products using add-vistara-products-fixed.sql';
END $$;

