-- Kibana Admin User Creation Script
-- Run this AFTER you've run the main schema.sql file

-- Step 1: First, create the user in Supabase Auth
-- Go to Authentication → Users → Add User in Supabase Dashboard
-- OR use this SQL (if you have access to auth schema):

-- Option A: Create user via Supabase Dashboard (RECOMMENDED)
-- 1. Go to: https://supabase.com/dashboard/project/hrahjiccbwvhtocabxja
-- 2. Click "Authentication" → "Users"
-- 3. Click "Add user" → "Create new user"
-- 4. Email: santhosh@dmhca.in
-- 5. Password: (your secure password)
-- 6. Click "Create user"
-- 7. Copy the user's ID (it will be shown in the users list)

-- Option B: Create user via SQL (advanced)
-- If you have access to the auth schema, uncomment and run:
/*
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'santhosh@dmhca.in',
  crypt('YourSecurePassword123', gen_salt('bf')),
  NOW(),
  '{"full_name": "Santhosh Reddy"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);
*/

-- Step 2: After creating the auth user, run this to add profile
-- IMPORTANT: Replace the email below with YOUR email if different
INSERT INTO public.users (id, email, full_name, role)
SELECT 
  id,
  'santhosh@dmhca.in',
  'Santhosh Reddy',
  'admin'
FROM auth.users 
WHERE email = 'santhosh@dmhca.in'
ON CONFLICT (id) DO NOTHING;

-- Step 3: Verify the admin user was created
SELECT id, email, full_name, role, created_at 
FROM public.users 
WHERE role = 'admin';

-- If you see your user in the results above, you're all set! ✅
