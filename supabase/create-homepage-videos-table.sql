-- Homepage Videos Table
-- Run this in Supabase SQL Editor
-- Stores videos displayed below "Collections in Focus" on the homepage

CREATE TABLE IF NOT EXISTS homepage_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for fast retrieval
CREATE INDEX IF NOT EXISTS idx_homepage_videos_active 
ON homepage_videos(is_active, display_order) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_homepage_videos_order 
ON homepage_videos(display_order);

-- Also create a storage bucket for videos if not exists
-- Run this separately in Supabase Dashboard > Storage > New Bucket:
-- Bucket name: videos
-- Public: Yes
-- File size limit: 100MB
-- Allowed MIME types: video/mp4, video/webm, video/quicktime
