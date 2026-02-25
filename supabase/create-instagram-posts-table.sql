-- Create instagram_posts table
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS instagram_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  post_url TEXT NOT NULL DEFAULT 'https://www.instagram.com/kibanalifeofficial/',
  caption TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE instagram_posts ENABLE ROW LEVEL SECURITY;

-- Public can read active posts
CREATE POLICY "Allow public read on instagram_posts"
  ON instagram_posts FOR SELECT
  USING (is_active = true);

-- Authenticated admins can do everything
CREATE POLICY "Allow admin all on instagram_posts"
  ON instagram_posts FOR ALL
  USING (auth.role() = 'service_role');

-- Index for ordering
CREATE INDEX IF NOT EXISTS instagram_posts_display_order_idx ON instagram_posts(display_order);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_instagram_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER instagram_posts_updated_at
  BEFORE UPDATE ON instagram_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_instagram_posts_updated_at();
