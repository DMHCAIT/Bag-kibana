-- Create newsletter_subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  source TEXT DEFAULT 'footer',
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribed_at ON newsletter_subscribers(subscribed_at DESC);

-- Enable Row Level Security
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can subscribe (insert)
CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscribers
  FOR INSERT
  WITH CHECK (true);

-- Policy: Only authenticated users can view subscribers
CREATE POLICY "Only authenticated users can view newsletter subscribers"
  ON newsletter_subscribers
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policy: Only authenticated users can update/delete
CREATE POLICY "Only authenticated users can manage subscribers"
  ON newsletter_subscribers
  FOR UPDATE
  USING (auth.role() = 'authenticated');
