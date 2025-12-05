-- ============================================
-- CREATE PRODUCT PLACEMENTS SYSTEM
-- ============================================
-- This allows admin to control which products appear in which homepage sections

-- Create product_placements table
CREATE TABLE IF NOT EXISTS product_placements (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  section VARCHAR(50) NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure a product can only appear once per section
  UNIQUE(product_id, section)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_product_placements_section ON product_placements(section, display_order);
CREATE INDEX IF NOT EXISTS idx_product_placements_active ON product_placements(is_active);
CREATE INDEX IF NOT EXISTS idx_product_placements_product ON product_placements(product_id);

-- Add RLS (Row Level Security) policies
ALTER TABLE product_placements ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active placements
CREATE POLICY "Public can view active placements" ON product_placements
  FOR SELECT USING (is_active = true);

-- Allow authenticated users (admin) full access
CREATE POLICY "Authenticated users can manage placements" ON product_placements
  FOR ALL USING (auth.role() = 'authenticated');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_product_placements_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_product_placements_timestamp ON product_placements;
CREATE TRIGGER update_product_placements_timestamp
  BEFORE UPDATE ON product_placements
  FOR EACH ROW
  EXECUTE FUNCTION update_product_placements_updated_at();

-- ============================================
-- AVAILABLE SECTIONS
-- ============================================
-- 'bestsellers' - Bestsellers Section
-- 'new-collection' - New Collection Carousel
-- 'featured' - Featured products anywhere
-- 'hero-products' - Products highlighted in hero areas
-- ============================================

-- Insert some sample placements (you can remove these after testing)
-- These will show actual products from your database

-- Example: Add first 4 products to bestsellers section
INSERT INTO product_placements (product_id, section, display_order, is_active)
SELECT id, 'bestsellers', ROW_NUMBER() OVER (ORDER BY id), true
FROM products
LIMIT 4
ON CONFLICT (product_id, section) DO NOTHING;

-- Example: Add first 6 products to new collection
INSERT INTO product_placements (product_id, section, display_order, is_active)
SELECT id, 'new-collection', ROW_NUMBER() OVER (ORDER BY id), true
FROM products
LIMIT 6
ON CONFLICT (product_id, section) DO NOTHING;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check all placements
SELECT 
  pp.id,
  pp.section,
  pp.display_order,
  pp.is_active,
  p.name as product_name,
  p.color,
  p.slug
FROM product_placements pp
JOIN products p ON pp.product_id = p.id
ORDER BY pp.section, pp.display_order;

-- Count placements by section
SELECT 
  section,
  COUNT(*) as total_products,
  COUNT(CASE WHEN is_active THEN 1 END) as active_products
FROM product_placements
GROUP BY section
ORDER BY section;

-- ============================================
-- HELPFUL QUERIES FOR ADMIN
-- ============================================

-- Get all products in a specific section (e.g., bestsellers)
-- SELECT p.* 
-- FROM products p
-- JOIN product_placements pp ON p.id = pp.product_id
-- WHERE pp.section = 'bestsellers' AND pp.is_active = true
-- ORDER BY pp.display_order;

-- Remove a product from a section
-- DELETE FROM product_placements 
-- WHERE product_id = ? AND section = ?;

-- Change display order
-- UPDATE product_placements 
-- SET display_order = ? 
-- WHERE id = ?;

-- Toggle active status
-- UPDATE product_placements 
-- SET is_active = NOT is_active 
-- WHERE id = ?;
