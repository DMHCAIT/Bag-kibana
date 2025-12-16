-- =====================================================
-- USER TRACKING AND LOGIN HISTORY TABLES
-- =====================================================
-- This migration adds comprehensive user tracking features:
-- 1. Enhanced users table with additional fields
-- 2. Login history tracking
-- 3. User activity logs
-- =====================================================

-- Add additional fields to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS login_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'deleted')),
ADD COLUMN IF NOT EXISTS registration_method TEXT DEFAULT 'phone' CHECK (registration_method IN ('phone', 'email', 'google', 'facebook')),
ADD COLUMN IF NOT EXISTS ip_address TEXT,
ADD COLUMN IF NOT EXISTS user_agent TEXT,
ADD COLUMN IF NOT EXISTS referral_source TEXT;

-- Create index on phone
CREATE INDEX IF NOT EXISTS idx_users_phone ON public.users(phone);
CREATE INDEX IF NOT EXISTS idx_users_status ON public.users(status);
CREATE INDEX IF NOT EXISTS idx_users_last_login ON public.users(last_login_at DESC);

-- =====================================================
-- LOGIN HISTORY TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.login_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  phone TEXT,
  email TEXT,
  login_method TEXT NOT NULL CHECK (login_method IN ('phone_otp', 'email_password', 'google', 'facebook')),
  ip_address TEXT,
  user_agent TEXT,
  device_type TEXT,
  browser TEXT,
  os TEXT,
  location_country TEXT,
  location_city TEXT,
  status TEXT NOT NULL DEFAULT 'success' CHECK (status IN ('success', 'failed', 'blocked')),
  failure_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for login history
CREATE INDEX IF NOT EXISTS idx_login_history_user_id ON public.login_history(user_id);
CREATE INDEX IF NOT EXISTS idx_login_history_created_at ON public.login_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_login_history_status ON public.login_history(status);
CREATE INDEX IF NOT EXISTS idx_login_history_phone ON public.login_history(phone);

-- Add comment
COMMENT ON TABLE public.login_history IS 'Tracks all login attempts (successful and failed) for security and analytics';

-- =====================================================
-- USER ACTIVITY LOGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.user_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL CHECK (activity_type IN (
    'registration', 'login', 'logout', 'password_change', 'profile_update',
    'order_placed', 'order_cancelled', 'address_added', 'address_updated',
    'wishlist_added', 'cart_updated', 'payment_completed', 'phone_verified'
  )),
  activity_description TEXT,
  metadata JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for user activity
CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON public.user_activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_type ON public.user_activity_logs(activity_type);
CREATE INDEX IF NOT EXISTS idx_user_activity_created_at ON public.user_activity_logs(created_at DESC);

-- Add comment
COMMENT ON TABLE public.user_activity_logs IS 'Comprehensive log of all user activities for tracking and analytics';

-- =====================================================
-- USER REGISTRATION TRACKING VIEW
-- =====================================================
CREATE OR REPLACE VIEW public.user_registration_stats AS
SELECT 
  DATE(created_at) as registration_date,
  COUNT(*) as registrations,
  COUNT(CASE WHEN registration_method = 'phone' THEN 1 END) as phone_registrations,
  COUNT(CASE WHEN registration_method = 'email' THEN 1 END) as email_registrations,
  COUNT(CASE WHEN registration_method = 'google' THEN 1 END) as google_registrations,
  COUNT(CASE WHEN phone_verified THEN 1 END) as verified_users
FROM public.users
GROUP BY DATE(created_at)
ORDER BY registration_date DESC;

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Login history policies
ALTER TABLE public.login_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own login history" ON public.login_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all login history" ON public.login_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "System can insert login history" ON public.login_history
  FOR INSERT WITH CHECK (true);

-- User activity logs policies
ALTER TABLE public.user_activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own activity" ON public.user_activity_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all activity" ON public.user_activity_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "System can insert activity logs" ON public.user_activity_logs
  FOR INSERT WITH CHECK (true);

-- =====================================================
-- FUNCTIONS FOR USER TRACKING
-- =====================================================

-- Function to update last login
CREATE OR REPLACE FUNCTION update_user_last_login(user_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.users
  SET 
    last_login_at = NOW(),
    login_count = COALESCE(login_count, 0) + 1
  WHERE id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log user activity
CREATE OR REPLACE FUNCTION log_user_activity(
  p_user_id UUID,
  p_activity_type TEXT,
  p_description TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT NULL,
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_log_id UUID;
BEGIN
  INSERT INTO public.user_activity_logs (
    user_id, activity_type, activity_description, 
    metadata, ip_address, user_agent
  )
  VALUES (
    p_user_id, p_activity_type, p_description,
    p_metadata, p_ip_address, p_user_agent
  )
  RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION update_user_last_login TO authenticated, anon;
GRANT EXECUTE ON FUNCTION log_user_activity TO authenticated, anon;

-- Grant view access
GRANT SELECT ON public.user_registration_stats TO authenticated;

COMMENT ON SCHEMA public IS 'Enhanced user tracking and login history system';
