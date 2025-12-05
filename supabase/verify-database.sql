-- ============================================
-- DATABASE VERIFICATION SCRIPT
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Check if products table has data
SELECT 
  'Products Count' as check_name,
  COUNT(*) as count,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ PASS - Products exist'
    ELSE '❌ FAIL - No products found. Run add-vistara-products-fixed.sql'
  END as status
FROM products;

-- 2. Check if product_placements table exists and has correct structure
SELECT 
  'Placements Table Structure' as check_name,
  COUNT(*) as count,
  '✅ PASS - Table exists' as status
FROM product_placements;

-- 3. Show sample products with all necessary fields
SELECT 
  '📦 Sample Products' as section,
  id,
  name,
  color,
  slug,
  price,
  CASE WHEN images IS NOT NULL THEN ARRAY_LENGTH(images, 1) ELSE 0 END as image_count
FROM products
LIMIT 3;

-- 4. Show current placements by section
SELECT 
  '📍 Current Placements by Section' as report,
  section,
  COUNT(*) as products_in_section,
  ARRAY_AGG(product_id ORDER BY display_order) as product_ids
FROM product_placements
GROUP BY section;

-- 5. Show detailed placement info with product names
SELECT 
  '🔍 Detailed Placements' as report,
  pp.id as placement_id,
  pp.product_id,
  p.name as product_name,
  p.color,
  pp.section,
  pp.display_order,
  pp.is_active
FROM product_placements pp
JOIN products p ON pp.product_id = p.id
ORDER BY pp.section, pp.display_order;

-- 6. Find products NOT placed in any section (available for placement)
SELECT 
  '✨ Available Products (Not Placed Anywhere)' as report,
  COUNT(*) as available_count
FROM products p
WHERE NOT EXISTS (
  SELECT 1 FROM product_placements pp 
  WHERE pp.product_id = p.id
);

-- 7. Show which products are available for each section
SELECT 
  '📋 Products Available for Bestsellers Section' as report,
  p.id,
  p.name,
  p.color,
  p.slug
FROM products p
WHERE NOT EXISTS (
  SELECT 1 FROM product_placements pp 
  WHERE pp.product_id = p.id 
  AND pp.section = 'bestsellers'
)
LIMIT 5;

-- 8. Check RLS policies
SELECT 
  '🔒 RLS Policies Check' as check_name,
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'product_placements';

-- ============================================
-- EXPECTED RESULTS:
-- ============================================
-- ✅ Products Count: Should show > 0
-- ✅ Placements Table: Should exist
-- 📦 Sample Products: Should show 3 products with id, name, color, slug
-- 📍 Current Placements: Shows how many products in each section
-- 🔍 Detailed Placements: Lists all placements with product details
-- ✨ Available Products: Shows products not yet placed
-- 📋 Products Available for Section: Shows which products can be added
-- 🔒 RLS Policies: Should show 2 policies (public read, authenticated manage)
-- ============================================
