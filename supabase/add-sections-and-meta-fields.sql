-- Add missing product fields for admin panel
-- Run this in Supabase SQL Editor

-- Add sections column (for product placement like 'bestsellers', 'new-arrivals')
ALTER TABLE products 
  ADD COLUMN IF NOT EXISTS sections TEXT[] DEFAULT '{}';

-- Add slug column if not exists (for SEO-friendly URLs)
ALTER TABLE products 
  ADD COLUMN IF NOT EXISTS slug TEXT;

-- Add colors column if not exists (for color variants)
ALTER TABLE products 
  ADD COLUMN IF NOT EXISTS colors JSONB DEFAULT '[]'::jsonb;

-- Add meta fields for SEO
ALTER TABLE products 
  ADD COLUMN IF NOT EXISTS meta_title TEXT,
  ADD COLUMN IF NOT EXISTS meta_description TEXT,
  ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- Add status and published_at fields
ALTER TABLE products 
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE;

-- Add sale_price field
ALTER TABLE products 
  ADD COLUMN IF NOT EXISTS sale_price DECIMAL(10, 2);

-- Update published_at for existing products
UPDATE products 
SET published_at = created_at 
WHERE published_at IS NULL AND status = 'published';

-- Create unique constraint on slug
CREATE UNIQUE INDEX IF NOT EXISTS idx_products_slug ON products(slug) WHERE slug IS NOT NULL;

-- Create index on sections for faster queries
CREATE INDEX IF NOT EXISTS idx_products_sections ON products USING GIN(sections);

-- Create index on tags for faster queries
CREATE INDEX IF NOT EXISTS idx_products_tags ON products USING GIN(tags);

-- Create index on status
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Successfully added missing columns to products table!';
  RAISE NOTICE '';
  RAISE NOTICE 'Added columns:';
  RAISE NOTICE '  - sections (TEXT[])';
  RAISE NOTICE '  - slug (TEXT)';
  RAISE NOTICE '  - colors (JSONB)';
  RAISE NOTICE '  - meta_title (TEXT)';
  RAISE NOTICE '  - meta_description (TEXT)';
  RAISE NOTICE '  - tags (TEXT[])';
  RAISE NOTICE '  - status (TEXT)';
  RAISE NOTICE '  - published_at (TIMESTAMP)';
  RAISE NOTICE '  - sale_price (DECIMAL)';
  RAISE NOTICE '';
  RAISE NOTICE '📋 The admin panel should now work properly!';
END $$;
