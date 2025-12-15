-- =====================================================
-- RATE LIMITING AND EMAIL LOGS TABLES MIGRATION
-- =====================================================
-- This migration adds support for:
-- 1. Database-backed rate limiting (for multi-instance deployments)
-- 2. Email logging system (for tracking sent emails)
-- =====================================================

-- Create rate_limits table for tracking API request rates
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  identifier VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '15 minutes')
);

-- Create index on identifier and created_at for faster lookups
CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier_created 
ON public.rate_limits(identifier, created_at DESC);

-- Create index on expires_at for cleanup queries
CREATE INDEX IF NOT EXISTS idx_rate_limits_expires 
ON public.rate_limits(expires_at);

-- Add comment
COMMENT ON TABLE public.rate_limits IS 'Stores rate limiting data for API endpoints across multiple instances';

-- =====================================================
-- EMAIL LOGS TABLE
-- =====================================================

-- Create email_logs table for tracking sent emails
CREATE TABLE IF NOT EXISTS public.email_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  to_email VARCHAR(255) NOT NULL,
  subject TEXT NOT NULL,
  html TEXT NOT NULL,
  text TEXT,
  type VARCHAR(50) NOT NULL, -- 'order_confirmation', 'order_status_update', etc.
  reference_id VARCHAR(255), -- Order ID, User ID, etc.
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'sent', 'failed'
  error_message TEXT,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for email logs
CREATE INDEX IF NOT EXISTS idx_email_logs_type 
ON public.email_logs(type);

CREATE INDEX IF NOT EXISTS idx_email_logs_status 
ON public.email_logs(status);

CREATE INDEX IF NOT EXISTS idx_email_logs_reference 
ON public.email_logs(reference_id);

CREATE INDEX IF NOT EXISTS idx_email_logs_created 
ON public.email_logs(created_at DESC);

-- Add comment
COMMENT ON TABLE public.email_logs IS 'Tracks all emails sent by the system for auditing and retry purposes';

-- =====================================================
-- CLEANUP FUNCTION FOR RATE LIMITS
-- =====================================================

-- Function to clean up expired rate limit entries
CREATE OR REPLACE FUNCTION cleanup_expired_rate_limits()
RETURNS void AS $$
BEGIN
  DELETE FROM public.rate_limits
  WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Add comment
COMMENT ON FUNCTION cleanup_expired_rate_limits() IS 'Removes expired rate limit entries to keep table size manageable';

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on rate_limits (admin only access)
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Policy: Only service role can access rate limits
CREATE POLICY "Service role can manage rate limits"
ON public.rate_limits
FOR ALL
TO service_role
USING (true);

-- Enable RLS on email_logs (admin only access)
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Only service role and admins can access email logs
CREATE POLICY "Service role can manage email logs"
ON public.email_logs
FOR ALL
TO service_role
USING (true);

CREATE POLICY "Admins can view email logs"
ON public.email_logs
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- =====================================================
-- GRANTS
-- =====================================================

-- Grant appropriate permissions
GRANT SELECT, INSERT, DELETE ON public.rate_limits TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.email_logs TO authenticated;

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Verify tables were created
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'rate_limits') THEN
    RAISE NOTICE 'rate_limits table created successfully';
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'email_logs') THEN
    RAISE NOTICE 'email_logs table created successfully';
  END IF;
END $$;
