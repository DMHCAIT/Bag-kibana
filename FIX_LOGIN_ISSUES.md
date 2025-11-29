# 🔧 Login Issues - Complete Fix Guide

## 🚨 Current Problems

Based on your errors:
1. ❌ **401 Unauthorized** - User exists in Supabase Auth but not in `public.users` table
2. ⚠️ **"Waiting for verification"** - `santhosh@dmhca.in` email not confirmed
3. ❌ **Invalid email or password** - Either wrong credentials OR missing profile

## ✅ Complete Fix (3 Steps)

### Step 1: Confirm Email Addresses

Both users need to be confirmed before they can login.

**Go to Supabase SQL Editor and run:**

```sql
-- Confirm both users
UPDATE auth.users 
SET email_confirmed_at = NOW(),
    confirmed_at = NOW()
WHERE email IN ('rubykhan0003@gmail.com', 'santhosh@dmhca.in')
  AND email_confirmed_at IS NULL;

-- Check status
SELECT email, email_confirmed_at FROM auth.users 
WHERE email IN ('rubykhan0003@gmail.com', 'santhosh@dmhca.in');
```

### Step 2: Add Users to public.users Table

**Run this SQL to create profiles:**

```sql
-- Add rubykhan0003@gmail.com (as customer or admin)
INSERT INTO public.users (id, email, full_name, role)
SELECT 
  id,
  'rubykhan0003@gmail.com',
  'Rubeen Khan',
  'admin'  -- Change to 'customer' if needed
FROM auth.users 
WHERE email = 'rubykhan0003@gmail.com'
ON CONFLICT (id) DO NOTHING;

-- Add santhosh@dmhca.in (as admin)
INSERT INTO public.users (id, email, full_name, role)
SELECT 
  id,
  'santhosh@dmhca.in',
  'Santhosh Reddy',
  'admin'
FROM auth.users 
WHERE email = 'santhosh@dmhca.in'
ON CONFLICT (id) DO NOTHING;

-- Verify both profiles exist
SELECT id, email, full_name, role FROM public.users 
WHERE email IN ('rubykhan0003@gmail.com', 'santhosh@dmhca.in');
```

### Step 3: Test Login

1. **Clear browser cache and cookies** (important!)
2. Go to: https://www.kibanalife.com/login
3. Try logging in with:
   - Email: `rubykhan0003@gmail.com`
   - Password: (the password you set when creating this user)

If successful, you should be redirected to `/admin` dashboard.

---

## 🔍 Verification Checklist

Run these queries to verify everything is set up correctly:

### Check 1: Users exist in auth.users
```sql
SELECT 
  id,
  email,
  email_confirmed_at,
  CASE 
    WHEN email_confirmed_at IS NULL THEN '❌ Not Confirmed'
    ELSE '✅ Confirmed'
  END as status
FROM auth.users
WHERE email IN ('rubykhan0003@gmail.com', 'santhosh@dmhca.in');
```

**Expected result**: Both users show "✅ Confirmed"

### Check 2: Users exist in public.users
```sql
SELECT 
  id,
  email,
  full_name,
  role,
  CASE 
    WHEN role = 'admin' THEN '✅ Can access /admin'
    ELSE '⚠️ Customer only'
  END as access
FROM public.users
WHERE email IN ('rubykhan0003@gmail.com', 'santhosh@dmhca.in');
```

**Expected result**: Both users exist with roles assigned

### Check 3: IDs match between tables
```sql
SELECT 
  au.email,
  au.id as auth_id,
  pu.id as profile_id,
  CASE 
    WHEN au.id = pu.id THEN '✅ IDs Match'
    ELSE '❌ IDs DO NOT Match'
  END as status
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE au.email IN ('rubykhan0003@gmail.com', 'santhosh@dmhca.in');
```

**Expected result**: Both show "✅ IDs Match"

---

## 🎯 Quick Fix - Run All at Once

Copy and paste this entire script into Supabase SQL Editor:

```sql
-- Step 1: Confirm emails (remove confirmed_at - it's auto-generated)
UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE email IN ('rubykhan0003@gmail.com', 'santhosh@dmhca.in')
  AND email_confirmed_at IS NULL;

-- Step 2: Add to public.users
INSERT INTO public.users (id, email, full_name, role)
SELECT 
  id,
  'rubykhan0003@gmail.com',
  'Rubeen Khan',
  'admin'
FROM auth.users 
WHERE email = 'rubykhan0003@gmail.com'
ON CONFLICT (id) DO UPDATE SET 
  role = EXCLUDED.role,
  full_name = EXCLUDED.full_name;

INSERT INTO public.users (id, email, full_name, role)
SELECT 
  id,
  'santhosh@dmhca.in',
  'Santhosh Reddy',
  'admin'
FROM auth.users 
WHERE email = 'santhosh@dmhca.in'
ON CONFLICT (id) DO UPDATE SET 
  role = EXCLUDED.role,
  full_name = EXCLUDED.full_name;

-- Step 3: Verify everything
SELECT 
  'AUTH CHECK' as check_type,
  au.email,
  CASE 
    WHEN au.email_confirmed_at IS NOT NULL THEN '✅ Confirmed'
    ELSE '❌ Not Confirmed'
  END as status
FROM auth.users au
WHERE au.email IN ('rubykhan0003@gmail.com', 'santhosh@dmhca.in')

UNION ALL

SELECT 
  'PROFILE CHECK' as check_type,
  pu.email,
  CASE 
    WHEN pu.role = 'admin' THEN '✅ Admin Access'
    ELSE '⚠️ Customer Access'
  END as status
FROM public.users pu
WHERE pu.email IN ('rubykhan0003@gmail.com', 'santhosh@dmhca.in')

UNION ALL

SELECT 
  'ID MATCH CHECK' as check_type,
  au.email,
  CASE 
    WHEN au.id = pu.id THEN '✅ IDs Match'
    ELSE '❌ IDs Mismatch'
  END as status
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE au.email IN ('rubykhan0003@gmail.com', 'santhosh@dmhca.in');
```

**Expected output**: All checks show ✅

---

## 🆘 Still Can't Login?

### Issue: "Invalid email or password"
**Causes:**
1. Wrong password
2. User not confirmed
3. User not in public.users table

**Fix:**
- Reset password in Supabase Dashboard:
  - Authentication → Users → Click user → Reset password
- Run the SQL scripts above

### Issue: "User profile not found"
**Cause:** User exists in auth.users but not in public.users

**Fix:**
```sql
-- Check which users are missing profiles
SELECT 
  au.id,
  au.email,
  CASE 
    WHEN pu.id IS NULL THEN '❌ Missing Profile'
    ELSE '✅ Has Profile'
  END as status
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id;
```

### Issue: Still getting 401 errors
**Causes:**
1. Environment variables not set in Vercel
2. NEXTAUTH_SECRET mismatch
3. Supabase Service Role Key incorrect

**Fix:**
- Verify environment variables in Vercel
- Check `.env.local` matches Vercel settings
- Restart dev server: `npm run dev`

---

## 📝 After Login Works

Once you can login successfully:

1. ✅ Go to `/admin` - You should see the dashboard
2. ✅ Go to `/admin/products` - Add some products
3. ✅ Go to `/admin/orders` - View orders
4. ✅ Go to `/admin/customers` - View customers
5. ✅ Go to `/admin/reports` - View analytics

---

## 🔐 Password Reset (If Needed)

If you forgot the password for either user:

1. Go to Supabase Dashboard → Authentication → Users
2. Find the user
3. Click the user
4. Click "Reset Password"
5. Choose "Send reset email" or "Generate new password"

---

## 📋 Summary

**For login to work, you need:**
1. ✅ User in `auth.users` (with confirmed email)
2. ✅ User in `public.users` (with role assigned)
3. ✅ Matching IDs between both tables
4. ✅ Correct password
5. ✅ Environment variables set in Vercel

**Files to help:**
- `supabase/sync-existing-users.sql` - Sync auth users to public.users
- `supabase/confirm-users.sql` - Confirm user emails
- `CREATE_ADMIN_USER.md` - Full setup guide
