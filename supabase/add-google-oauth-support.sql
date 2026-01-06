-- Add Google ID field to users table for OAuth integration
-- This allows users to login with Google and link their accounts

ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS google_id TEXT UNIQUE;

-- Create index for faster Google ID lookups
CREATE INDEX IF NOT EXISTS idx_users_google_id ON public.users(google_id);

-- Add comment
COMMENT ON COLUMN public.users.google_id IS 'Google OAuth user ID for linking accounts';