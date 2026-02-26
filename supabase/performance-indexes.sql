-- Performance optimization indexes for faster queries

-- Products table indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_bestseller ON products(is_bestseller) WHERE is_bestseller = true;
CREATE INDEX IF NOT EXISTS idx_products_is_new ON products(is_new) WHERE is_new = true;
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_display_order ON products(display_order);
CREATE INDEX IF NOT EXISTS idx_products_name_color ON products(name, color);

-- Product placements indexes
CREATE INDEX IF NOT EXISTS idx_placements_section_active ON product_placements(section, is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_placements_product_id ON product_placements(product_id);
CREATE INDEX IF NOT EXISTS idx_placements_display_order ON product_placements(display_order);

-- Site content indexes
CREATE INDEX IF NOT EXISTS idx_site_content_section ON site_content(section);
CREATE INDEX IF NOT EXISTS idx_site_content_key ON site_content(content_key);
CREATE INDEX IF NOT EXISTS idx_site_content_active ON site_content(is_active) WHERE is_active = true;

-- Orders indexes for faster admin queries
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Instagram posts index
CREATE INDEX IF NOT EXISTS idx_instagram_posts_active ON instagram_posts(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_instagram_posts_display_order ON instagram_posts(display_order);

-- Analyze tables for better query planning
ANALYZE products;
ANALYZE product_placements;
ANALYZE site_content;
ANALYZE orders;
