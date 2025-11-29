-- Script to fix authentication for existing users
-- Run this in Supabase SQL Editor to create proper auth entries

-- IMPORTANT: The users shown in the Supabase Users table are actually from public.users
-- They need to be created in auth.users to enable proper authentication

-- Step 1: Check current users in public.users table
SELECT 
  id,
  email, 
  full_name, 
  role,
  created_at
FROM public.users 
WHERE email IN ('santhosh@dmhca.in', 'rubykhan0003@gmail.com');

-- Step 2: These users need to be created in auth.users with proper passwords
-- This MUST be done via Supabase Dashboard since we cannot directly insert into auth.users

-- INSTRUCTIONS TO FIX AUTHENTICATION:
-- =====================================

-- 1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/hrahjiccbwvhtocabxja
-- 2. Click on "Authentication" → "Users"
-- 3. You'll see the current users in the list - these are actually from public.users
-- 4. For each user (santhosh@dmhca.in and rubykhan0003@gmail.com):

--    a. Click "Add user" → "Create new user"
--    b. Enter the email address
--    c. Set a secure password  
--    d. Click "Create user"
--    e. Note the new UUID generated for this user

-- 5. After creating auth users, update the public.users table to use the correct UUIDs:

-- Example (replace the UUIDs with the ones generated in step 4):
/*
UPDATE public.users 
SET id = 'NEW_UUID_FROM_AUTH_USERS'
WHERE email = 'santhosh@dmhca.in';

UPDATE public.users 
SET id = 'NEW_UUID_FROM_AUTH_USERS' 
WHERE email = 'rubykhan0003@gmail.com';
*/

-- 6. Verify the setup by checking that auth.users and public.users have matching UUIDs:
/*
SELECT 
  au.id as auth_id,
  au.email as auth_email,
  pu.id as public_id, 
  pu.email as public_email,
  pu.role
FROM auth.users au
FULL OUTER JOIN public.users pu ON au.id = pu.id
WHERE au.email IN ('santhosh@dmhca.in', 'rubykhan0003@gmail.com')
   OR pu.email IN ('santhosh@dmhca.in', 'rubykhan0003@gmail.com');
*/

-- Alternative approach: If you want to keep existing UUIDs in public.users,
-- you need to manually insert into auth.users (ADVANCED - requires RLS bypass):

-- WARNING: This approach requires superuser access and is NOT recommended
-- Only use if you have direct database access outside of Supabase's normal flow

/*
-- This would require direct database access with superuser privileges:
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_user_meta_data,
  raw_app_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES 
(
  '00000000-0000-0000-0000-000000000000'::uuid,
  'abfe79b5-e677-448d-a78b-6053271cf64f'::uuid, -- Existing UUID from public.users
  'authenticated',
  'authenticated', 
  'santhosh@dmhca.in',
  crypt('YOUR_SECURE_PASSWORD', gen_salt('bf')), -- Replace with actual password
  NOW(),
  NOW(),
  NOW(),
  '{"full_name":"santhosh reddy"}'::jsonb,
  '{"provider":"email","providers":["email"]}'::jsonb,
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);
*/

-- RECOMMENDED APPROACH: Use Supabase Dashboard method above!