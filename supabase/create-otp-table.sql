-- Create OTP Store table for authentication
-- This table persists OTPs in the database for production/serverless compatibility

CREATE TABLE IF NOT EXISTS otp_store (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone VARCHAR(20) NOT NULL UNIQUE,
  otp VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Add indexes for fast lookups
  CONSTRAINT otp_length CHECK (LENGTH(otp) = 6),
  CONSTRAINT phone_not_empty CHECK (LENGTH(phone) > 0)
);

-- Create index on phone for fast lookups
CREATE INDEX idx_otp_store_phone ON otp_store(phone);

-- Create index on expires_at for cleanup queries
CREATE INDEX idx_otp_store_expires_at ON otp_store(expires_at);

-- Set up automatic cleanup of expired OTPs (optional, requires pg_cron extension)
-- Note: This requires the pg_cron extension to be enabled in Supabase
-- Contact Supabase support or run manually: DELETE FROM otp_store WHERE expires_at < NOW();

-- Grant permissions (adjust to your auth role)
ALTER TABLE otp_store ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous access (since users aren't logged in during OTP verification)
CREATE POLICY "Allow anonymous OTP operations" ON otp_store
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create policy for cleanup operations
CREATE POLICY "Allow service role for cleanup" ON otp_store
  FOR DELETE
  USING (true);
