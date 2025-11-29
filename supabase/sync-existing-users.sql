-- Add existing Supabase Auth users to public.users table
-- Run this in Supabase SQL Editor

-- First, check which users exist in auth but not in public.users
SELECT 
  au.id,
  au.email,
  au.raw_user_meta_data->>'full_name' as full_name,
  CASE 
    WHEN pu.id IS NULL THEN 'Missing in public.users'
    ELSE 'Already exists'
  END as status
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id;

-- Add rubykhan0003@gmail.com to public.users (if not exists)
INSERT INTO public.users (id, email, full_name, role)
SELECT 
  id,
  'rubykhan0003@gmail.com',
  COALESCE(raw_user_meta_data->>'full_name', 'User'),
  'customer'  -- Change to 'admin' if this should be an admin user
FROM auth.users 
WHERE email = 'rubykhan0003@gmail.com'
ON CONFLICT (id) DO NOTHING;

-- Add santhosh@dmhca.in to public.users as admin (if not exists)
INSERT INTO public.users (id, email, full_name, role)
SELECT 
  id,
  'santhosh@dmhca.in',
  COALESCE(raw_user_meta_data->>'full_name', 'Santhosh Reddy'),
  'admin'
FROM auth.users 
WHERE email = 'santhosh@dmhca.in'
ON CONFLICT (id) DO NOTHING;

-- Verify both users are now in public.users
SELECT 
  u.id,
  u.email,
  u.full_name,
  u.role,
  u.created_at
FROM public.users u
WHERE u.email IN ('rubykhan0003@gmail.com', 'santhosh@dmhca.in')
ORDER BY u.created_at DESC;

-- If you want to make rubykhan0003@gmail.com an admin instead:
-- UPDATE public.users 
-- SET role = 'admin' 
-- WHERE email = 'rubykhan0003@gmail.com';
