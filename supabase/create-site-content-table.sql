-- =====================================================
-- SITE CONTENT TABLE - Stores all editable website content
-- Run this in Supabase SQL Editor
-- =====================================================

-- Main site_content table for all editable content
CREATE TABLE IF NOT EXISTS site_content (
  id SERIAL PRIMARY KEY,
  section VARCHAR(100) NOT NULL,        -- e.g., 'hero_home', 'footer', 'header'
  content_key VARCHAR(100) NOT NULL,    -- e.g., 'title', 'image_url', 'subtitle'
  content_value TEXT,                   -- The actual content value
  content_type VARCHAR(50) DEFAULT 'text', -- 'text', 'image', 'url', 'html', 'json', 'number', 'boolean'
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',          -- Extra data (alt text, link targets, etc.)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(section, content_key)
);

-- Create index for fast lookups
CREATE INDEX IF NOT EXISTS idx_site_content_section ON site_content(section);
CREATE INDEX IF NOT EXISTS idx_site_content_active ON site_content(is_active);
CREATE INDEX IF NOT EXISTS idx_site_content_section_key ON site_content(section, content_key);

-- Enable RLS
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- Allow public read access (website needs to read content)
DROP POLICY IF EXISTS "Allow public read access on site_content" ON site_content;
CREATE POLICY "Allow public read access on site_content"
  ON site_content FOR SELECT
  USING (true);

-- Allow all operations for authenticated users (admin)
DROP POLICY IF EXISTS "Allow all operations for admin on site_content" ON site_content;
CREATE POLICY "Allow all operations for admin on site_content"
  ON site_content FOR ALL
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- INSERT DEFAULT CONTENT
-- =====================================================

-- HERO SECTION - Homepage
INSERT INTO site_content (section, content_key, content_value, content_type, metadata) VALUES
('hero_home', 'image_url', 'https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/HERO%20SECTION/KIBANA%20HOME%20PAGE.jpg%20(1).jpeg', 'image', '{"alt": "KibanaLife Collection"}'),
('hero_home', 'title', '', 'text', '{}'),
('hero_home', 'subtitle', '', 'text', '{}'),
('hero_home', 'cta_text', 'Shop Now', 'text', '{}'),
('hero_home', 'cta_link', '/shop', 'url', '{}')
ON CONFLICT (section, content_key) DO NOTHING;

-- HERO SECTION - Men's Page
INSERT INTO site_content (section, content_key, content_value, content_type, metadata) VALUES
('hero_men', 'image_url', 'https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/HERO%20SECTION/Men''s%20page%20%20for%20kibana.jpg.jpeg', 'image', '{"alt": "Men''s Collection"}'),
('hero_men', 'title', 'MEN''S COLLECTION', 'text', '{}'),
('hero_men', 'subtitle', 'Discover our collection of premium bags designed for the modern gentleman', 'text', '{}')
ON CONFLICT (section, content_key) DO NOTHING;

-- HERO SECTION - Women's Page
INSERT INTO site_content (section, content_key, content_value, content_type, metadata) VALUES
('hero_women', 'image_url', 'https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/HERO%20SECTION/Cover%20page%20.jpg%20(1).jpeg', 'image', '{"alt": "Women''s Collection"}'),
('hero_women', 'title', 'WOMEN''S COLLECTION', 'text', '{}'),
('hero_women', 'subtitle', 'Explore our curated collection of luxury bags for women', 'text', '{}')
ON CONFLICT (section, content_key) DO NOTHING;

-- BESTSELLERS SECTION
INSERT INTO site_content (section, content_key, content_value, content_type, metadata) VALUES
('bestsellers', 'title', 'BESTSELLERS', 'text', '{}'),
('bestsellers', 'subtitle', 'Our most loved bags', 'text', '{}'),
('bestsellers', 'discount_percent', '30', 'number', '{}'),
('bestsellers', 'view_all_link', '/shop', 'url', '{}')
ON CONFLICT (section, content_key) DO NOTHING;

-- NEW COLLECTION SECTION
INSERT INTO site_content (section, content_key, content_value, content_type, metadata) VALUES
('new_collection', 'title', 'NEW COLLECTION', 'text', '{}'),
('new_collection', 'subtitle', 'Discover our latest exclusive designs', 'text', '{}'),
('new_collection', 'discount_percent', '30', 'number', '{}'),
('new_collection', 'view_all_link', '/shop', 'url', '{}')
ON CONFLICT (section, content_key) DO NOTHING;

-- COLLECTIONS IN FOCUS
INSERT INTO site_content (section, content_key, content_value, content_type, metadata) VALUES
('collections_focus', 'title', 'COLLECTIONS IN FOCUS', 'text', '{}'),
('collections_focus', 'subtitle', 'Curated selections for every occasion', 'text', '{}'),
('collections_focus', 'collection_1_title', 'TOTE', 'text', '{}'),
('collections_focus', 'collection_1_subtitle', 'Elegant & Spacious', 'text', '{}'),
('collections_focus', 'collection_1_image', 'https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/09-10-2025--livia00489-Photoroom.png', 'image', '{"alt": "Tote Collection"}'),
('collections_focus', 'collection_1_link', '/collections/tote', 'url', '{}'),
('collections_focus', 'collection_2_title', 'CLUTCH', 'text', '{}'),
('collections_focus', 'collection_2_subtitle', 'Compact & Chic', 'text', '{}'),
('collections_focus', 'collection_2_image', 'https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/09-10-2025--livia00932-Photoroom.png', 'image', '{"alt": "Clutch Collection"}'),
('collections_focus', 'collection_2_link', '/collections/clutch', 'url', '{}'),
('collections_focus', 'collection_3_title', 'SLING', 'text', '{}'),
('collections_focus', 'collection_3_subtitle', 'Light & Versatile', 'text', '{}'),
('collections_focus', 'collection_3_image', 'https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/sling-collection-mocha.jpg', 'image', '{"alt": "Sling Collection"}'),
('collections_focus', 'collection_3_link', '/collections/sling', 'url', '{}')
ON CONFLICT (section, content_key) DO NOTHING;

-- SPLIT BANNER SECTION
INSERT INTO site_content (section, content_key, content_value, content_type, metadata) VALUES
('split_banner', 'women_image', '/women-model.png', 'image', '{"alt": "Women Collection"}'),
('split_banner', 'women_title', 'WOMEN', 'text', '{}'),
('split_banner', 'women_cta', 'Shop All Women', 'text', '{}'),
('split_banner', 'women_link', '/women', 'url', '{}'),
('split_banner', 'men_image', '/man-model-monochrome.png', 'image', '{"alt": "Men Collection"}'),
('split_banner', 'men_title', 'MEN', 'text', '{}'),
('split_banner', 'men_cta', 'Shop All Men', 'text', '{}'),
('split_banner', 'men_link', '/men', 'url', '{}')
ON CONFLICT (section, content_key) DO NOTHING;

-- VIDEO SHOWCASE SECTION
INSERT INTO site_content (section, content_key, content_value, content_type, metadata) VALUES
('video_showcase', 'title', 'VIDEO SHOWCASE', 'text', '{}'),
('video_showcase', 'subtitle', 'Discover our craftsmanship in motion', 'text', '{}')
ON CONFLICT (section, content_key) DO NOTHING;

-- HEADER
INSERT INTO site_content (section, content_key, content_value, content_type, metadata) VALUES
('header', 'logo_url', 'https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/KIBANA%20copy.png', 'image', '{"alt": "KIBANA Logo"}'),
('header', 'nav_links', '[{"label":"Shop","url":"/shop"},{"label":"Women","url":"/women"},{"label":"Men","url":"/men"}]', 'json', '{}')
ON CONFLICT (section, content_key) DO NOTHING;

-- FOOTER
INSERT INTO site_content (section, content_key, content_value, content_type, metadata) VALUES
('footer', 'newsletter_title', 'STAY CONNECTED', 'text', '{}'),
('footer', 'newsletter_subtitle', 'Subscribe for exclusive offers and updates', 'text', '{}'),
('footer', 'copyright', '© KIBANA {year}. All Rights Reserved', 'text', '{"note": "Use {year} placeholder for dynamic year"}'),
('footer', 'phone', '+91 97114 14110', 'text', '{}'),
('footer', 'email', '', 'text', '{}'),
('footer', 'shop_links', '[{"label":"Handbags","url":"/collections/handbags"},{"label":"Tote Bags","url":"/collections/tote"},{"label":"Clutches","url":"/collections/clutch"},{"label":"Sling Bags","url":"/collections/sling"},{"label":"Men''s Collection","url":"/men"}]', 'json', '{}'),
('footer', 'about_links', '[{"label":"Our Story","url":"/about"},{"label":"Craftsmanship","url":"/craftsmanship"},{"label":"Contact Us","url":"/contact"}]', 'json', '{}'),
('footer', 'support_links', '[{"label":"FAQs","url":"/faq"},{"label":"Shipping","url":"/shipping"},{"label":"Returns & Exchange","url":"/returns"},{"label":"Order Tracking","url":"/tracking"}]', 'json', '{}'),
('footer', 'social_facebook', 'https://facebook.com/kibanalife', 'url', '{}'),
('footer', 'social_instagram', 'https://www.instagram.com/kibanalifeofficial/', 'url', '{}'),
('footer', 'social_threads', 'https://threads.net/kibanalife', 'url', '{}'),
('footer', 'features', '["Premium Quality","Easy Returns","COD Available"]', 'json', '{}'),
('footer', 'policy_links', '[{"label":"Privacy Policy","url":"/privacy"},{"label":"Terms of Service","url":"/terms"},{"label":"Shipping Policy","url":"/shipping-policy"}]', 'json', '{}')
ON CONFLICT (section, content_key) DO NOTHING;

-- WOMEN'S PAGE CATEGORY CIRCLE CARDS
INSERT INTO site_content (section, content_key, content_value, content_type, metadata) VALUES
('women_categories', 'enabled', 'true', 'boolean', '{"note": "Set to false to auto-generate from products"}'),
('women_categories', 'cat_1_label', 'Tote', 'text', '{}'),
('women_categories', 'cat_1_image', '', 'image', '{"alt": "Tote"}'),
('women_categories', 'cat_1_link', '/collections/tote', 'url', '{}'),
('women_categories', 'cat_2_label', 'Sling', 'text', '{}'),
('women_categories', 'cat_2_image', '', 'image', '{"alt": "Sling"}'),
('women_categories', 'cat_2_link', '/collections/sling', 'url', '{}'),
('women_categories', 'cat_3_label', 'Clutch', 'text', '{}'),
('women_categories', 'cat_3_image', '', 'image', '{"alt": "Clutch"}'),
('women_categories', 'cat_3_link', '/collections/clutch', 'url', '{}'),
('women_categories', 'cat_4_label', 'Handbag', 'text', '{}'),
('women_categories', 'cat_4_image', '', 'image', '{"alt": "Handbag"}'),
('women_categories', 'cat_4_link', '/collections/handbag', 'url', '{}'),
('women_categories', 'cat_5_label', '', 'text', '{}'),
('women_categories', 'cat_5_image', '', 'image', '{}'),
('women_categories', 'cat_5_link', '', 'url', '{}'),
('women_categories', 'cat_6_label', '', 'text', '{}'),
('women_categories', 'cat_6_image', '', 'image', '{}'),
('women_categories', 'cat_6_link', '', 'url', '{}')
ON CONFLICT (section, content_key) DO NOTHING;

-- GLOBAL SETTINGS
INSERT INTO site_content (section, content_key, content_value, content_type, metadata) VALUES
('global', 'brand_name', 'KIBANA', 'text', '{}'),
('global', 'default_discount_percent', '30', 'number', '{}'),
('global', 'currency_symbol', '₹', 'text', '{}'),
('global', 'whatsapp_number', '+919711414110', 'text', '{}')
ON CONFLICT (section, content_key) DO NOTHING;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_site_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS site_content_updated_at ON site_content;
CREATE TRIGGER site_content_updated_at
  BEFORE UPDATE ON site_content
  FOR EACH ROW
  EXECUTE FUNCTION update_site_content_updated_at();
