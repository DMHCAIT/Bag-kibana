-- =================================================================
-- RUN THESE QUERIES ONE BY ONE IN SUPABASE SQL EDITOR
-- Copy each query, paste, and click RUN before moving to next one
-- =================================================================

-- QUERY 1: Check if users exist in auth.users
-- Copy and run this first:

SELECT 
  '1. AUTH USERS CHECK' as step,
  id,
  email,
  email_confirmed_at,
  last_sign_in_at,
  CASE 
    WHEN email_confirmed_at IS NULL THEN '❌ NOT CONFIRMED'
    ELSE '✅ CONFIRMED'
  END as confirmation_status
FROM auth.users 
WHERE email IN ('rubykhan0003@gmail.com', 'santhosh@dmhca.in');

-- =================================================================

-- QUERY 2: Check if users exist in public.users
-- After Query 1, copy and run this:

SELECT 
  '2. PUBLIC USERS CHECK' as step,
  id,
  email,
  full_name,
  role,
  created_at
FROM public.users
WHERE email IN ('rubykhan0003@gmail.com', 'santhosh@dmhca.in');

-- =================================================================

-- QUERY 3: Check if IDs match between tables
-- After Query 2, copy and run this:

SELECT 
  '3. ID MATCH CHECK' as step,
  au.email,
  au.id as auth_user_id,
  pu.id as public_user_id,
  CASE 
    WHEN pu.id IS NULL THEN '❌ MISSING FROM public.users'
    WHEN au.id = pu.id THEN '✅ IDs MATCH'
    ELSE '❌ IDs DO NOT MATCH'
  END as status
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE au.email IN ('rubykhan0003@gmail.com', 'santhosh@dmhca.in');

-- =================================================================

-- QUERY 4: Add missing users to public.users
-- If Query 3 showed "MISSING FROM public.users", run this:

INSERT INTO public.users (id, email, full_name, role)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', 
    CASE 
      WHEN au.email = 'rubykhan0003@gmail.com' THEN 'Rubeen Khan'
      WHEN au.email = 'santhosh@dmhca.in' THEN 'Santhosh Reddy'
      ELSE 'User'
    END
  ) as full_name,
  'admin' as role
FROM auth.users au
WHERE au.email IN ('rubykhan0003@gmail.com', 'santhosh@dmhca.in')
  AND NOT EXISTS (
    SELECT 1 FROM public.users pu WHERE pu.id = au.id
  );

-- =================================================================

-- QUERY 5: Final verification
-- After Query 4, run this to verify both users are ready:

SELECT 
  email,
  full_name,
  role,
  created_at,
  '✅ READY TO LOGIN' as status
FROM public.users
WHERE email IN ('rubykhan0003@gmail.com', 'santhosh@dmhca.in');

-- =================================================================
-- EXPECTED RESULTS:
-- Query 1: Should show 2 users with ✅ CONFIRMED status
-- Query 2: Should show 2 users OR be empty (if missing)
-- Query 3: Should show if users are MISSING or IDs MATCH
-- Query 4: Will insert users if they were missing
-- Query 5: Should show 2 users with admin role
-- =================================================================
