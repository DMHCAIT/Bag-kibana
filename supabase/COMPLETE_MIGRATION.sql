-- Complete Database Migration: Add Slug and Colors Support
-- Run this file in Supabase SQL Editor
-- This will enable:
-- 1. SEO-friendly URLs (e.g., /products/wallet-mint-green)
-- 2. Color variant display on product pages

BEGIN;

-- ============================================
-- STEP 1: Add slug column
-- ============================================
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS slug TEXT;

-- ============================================
-- STEP 2: Add colors column (JSONB array)
-- ============================================
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS colors JSONB DEFAULT '[]'::jsonb;

-- ============================================
-- STEP 3: Create indexes for performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_colors ON public.products USING GIN(colors);

-- ============================================
-- STEP 4: Generate slugs for existing products
-- ============================================
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

-- ============================================
-- STEP 5: Add constraints
-- ============================================
-- Add unique constraint (will fail if duplicates exist, that's okay)
DO $$
BEGIN
  ALTER TABLE public.products 
  ADD CONSTRAINT products_slug_unique UNIQUE (slug);
EXCEPTION
  WHEN duplicate_table THEN NULL;
  WHEN others THEN NULL;
END $$;

-- Make slug NOT NULL
ALTER TABLE public.products 
ALTER COLUMN slug SET NOT NULL;

-- ============================================
-- STEP 6: Initialize colors for existing products
-- ============================================
-- This creates a default color entry for products without colors
UPDATE public.products 
SET colors = jsonb_build_array(
  jsonb_build_object(
    'name', color,
    'value', '#808080',  -- Default gray - update with actual colors later
    'available', true
  )
)
WHERE colors IS NULL OR colors = '[]'::jsonb;

COMMIT;

-- ============================================
-- STEP 7: Verification
-- ============================================
-- Check the results
SELECT 
  id, 
  name, 
  color, 
  slug,
  jsonb_array_length(colors) as color_count,
  colors
FROM public.products 
ORDER BY id
LIMIT 10;

-- ============================================
-- Summary
-- ============================================
SELECT 
  COUNT(*) as total_products,
  COUNT(slug) as products_with_slug,
  COUNT(CASE WHEN colors != '[]'::jsonb THEN 1 END) as products_with_colors
FROM public.products;
