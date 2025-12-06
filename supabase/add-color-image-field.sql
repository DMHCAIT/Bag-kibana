-- Add color_image field to products table
-- This stores the URL of the color swatch image (circular product image)

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS color_image TEXT;

-- Add comment
COMMENT ON COLUMN products.color_image IS 'URL of circular color swatch image for the product variant';

-- Example update (you can customize these URLs):
-- UPDATE products SET color_image = 'https://your-supabase-url/storage/v1/object/public/color-swatches/product-color.png' WHERE id = 1;
