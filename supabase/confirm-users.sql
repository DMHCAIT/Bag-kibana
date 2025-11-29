-- Confirm email for users (if they show "Waiting for verification")
-- Run this in Supabase SQL Editor

-- Check current confirmation status
SELECT 
  id,
  email,
  email_confirmed_at,
  CASE 
    WHEN email_confirmed_at IS NULL THEN 'Not Confirmed - Cannot login'
    ELSE 'Confirmed - Can login'
  END as status
FROM auth.users
WHERE email IN ('rubykhan0003@gmail.com', 'santhosh@dmhca.in');

-- Manually confirm email for santhosh@dmhca.in (if needed)
UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE email = 'santhosh@dmhca.in'
  AND email_confirmed_at IS NULL;

-- Manually confirm email for rubykhan0003@gmail.com (if needed)
UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE email = 'rubykhan0003@gmail.com'
  AND email_confirmed_at IS NULL;

-- Verify confirmation status again
SELECT 
  id,
  email,
  email_confirmed_at,
  confirmed_at,
  'Email confirmed - Ready to login' as status
FROM auth.users
WHERE email IN ('rubykhan0003@gmail.com', 'santhosh@dmhca.in');
