-- Add slug and colors columns to products table
-- This enables:
-- 1. SEO-friendly URLs: /products/wallet-mint-green instead of /products/45
-- 2. Color variants display on product pages

-- Step 1: Add slug column
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS slug TEXT;

-- Step 2: Add colors column (JSONB array for color variants)
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS colors JSONB DEFAULT '[]'::jsonb;

-- Step 3: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_colors ON public.products USING GIN(colors);

-- Step 4: Generate slugs for existing products
-- Format: product-name-color (e.g., "wallet-mint-green")
UPDATE public.products 
SET slug = LOWER(
  REGEXP_REPLACE(
    REGEXP_REPLACE(
      name || '-' || color,
      '[^a-zA-Z0-9\s-]', '', 'g'
    ),
    '\s+', '-', 'g'
  )
)
WHERE slug IS NULL OR slug = '';

-- Step 5: Make slug UNIQUE and NOT NULL
ALTER TABLE public.products 
ADD CONSTRAINT products_slug_unique UNIQUE (slug);

ALTER TABLE public.products 
ALTER COLUMN slug SET NOT NULL;

-- Step 6: Initialize colors array for products that don't have it
-- This creates a single color entry based on the product's current color
UPDATE public.products 
SET colors = jsonb_build_array(
  jsonb_build_object(
    'name', color,
    'value', '#CCCCCC',  -- Default gray, should be updated with actual color
    'available', true
  )
)
WHERE colors IS NULL OR colors = '[]'::jsonb;

-- Step 7: Show results
SELECT 
  id, 
  name, 
  color, 
  slug,
  colors
FROM public.products 
ORDER BY id;
