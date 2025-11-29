-- COMPREHENSIVE DEBUG SCRIPT
-- Run this to see EXACTLY what's happening

-- Step 1: Check if users exist in auth.users
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

-- Step 2: Check if users exist in public.users
SELECT 
  '2. PUBLIC USERS CHECK' as step,
  id,
  email,
  full_name,
  role,
  created_at
FROM public.users
WHERE email IN ('rubykhan0003@gmail.com', 'santhosh@dmhca.in');

-- Step 3: Check if IDs match between tables
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

-- Step 4: If missing, add them NOW
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

-- Step 5: Final verification - BOTH MUST SHOW RESULTS
SELECT 
  '4. FINAL CHECK - AUTH SIDE' as step,
  email,
  id,
  '✅' as exists
FROM auth.users 
WHERE email IN ('rubykhan0003@gmail.com', 'santhosh@dmhca.in')

UNION ALL

SELECT 
  '4. FINAL CHECK - PUBLIC SIDE' as step,
  email,
  id,
  CASE 
    WHEN role = 'admin' THEN '✅ ADMIN'
    ELSE '⚠️ CUSTOMER'
  END as exists
FROM public.users
WHERE email IN ('rubykhan0003@gmail.com', 'santhosh@dmhca.in');

-- Step 6: Check table structure (just in case)
SELECT 
  '5. TABLE STRUCTURE CHECK' as step,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'users'
ORDER BY ordinal_position;
