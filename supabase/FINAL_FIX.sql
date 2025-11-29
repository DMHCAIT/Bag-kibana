-- FINAL FIX: Add authenticated users to public.users table
-- The users can login to Supabase, but NextAuth needs them in public.users

-- First, let's see what we have
SELECT 'AUTH USERS' as table_name, email, id FROM auth.users
WHERE email IN ('rubykhan0003@gmail.com', 'santhosh@dmhca.in')
UNION ALL
SELECT 'PUBLIC USERS' as table_name, email, id FROM public.users
WHERE email IN ('rubykhan0003@gmail.com', 'santhosh@dmhca.in');

-- Now add them to public.users (this is what's missing!)
INSERT INTO public.users (id, email, full_name, role)
SELECT 
  id,
  email,
  CASE 
    WHEN email = 'rubykhan0003@gmail.com' THEN 'Rubeen Khan'
    WHEN email = 'santhosh@dmhca.in' THEN 'Santhosh Reddy'
    ELSE 'User'
  END as full_name,
  'admin' as role
FROM auth.users 
WHERE email IN ('rubykhan0003@gmail.com', 'santhosh@dmhca.in')
ON CONFLICT (id) DO UPDATE SET
  role = EXCLUDED.role,
  full_name = EXCLUDED.full_name,
  updated_at = NOW();

-- Verify BOTH users are now in BOTH tables
SELECT 
  au.email,
  au.id as auth_id,
  au.last_sign_in_at,
  pu.id as profile_id,
  pu.role,
  CASE 
    WHEN pu.id IS NOT NULL THEN '✅ Ready to login via NextAuth'
    ELSE '❌ Missing from public.users - WILL GET 401 ERROR'
  END as status
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE au.email IN ('rubykhan0003@gmail.com', 'santhosh@dmhca.in');
