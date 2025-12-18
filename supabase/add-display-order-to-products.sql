-- Add display_order column to products table
-- This allows manual sorting of products by position

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_products_display_order ON products(display_order);

-- Update existing products with sequential order based on created_at
WITH numbered_products AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (ORDER BY created_at) as row_num
  FROM products
)
UPDATE products p
SET display_order = np.row_num
FROM numbered_products np
WHERE p.id = np.id
AND p.display_order = 0;

-- Add comment to column
COMMENT ON COLUMN products.display_order IS 'Manual sort order for products. Lower numbers appear first.';
