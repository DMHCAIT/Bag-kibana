# 🔐 Create Admin User - Step by Step Guide

## ❌ Error Explanation

The error you got means:
- You tried to insert into `public.users` table
- But the user doesn't exist in Supabase Auth yet
- The `id` is NULL because there's no matching auth user

## ✅ Correct Process (2 Steps)

### Step 1: Create Auth User in Supabase Dashboard (EASIEST METHOD)

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard/project/hrahjiccbwvhtocabxja

2. **Navigate to Authentication**
   - In the left sidebar, click **"Authentication"**
   - Click **"Users"** tab at the top

3. **Add New User**
   - Click the **"Add user"** button (top right)
   - Select **"Create new user"**

4. **Fill in User Details**
   - **Email**: `santhosh@dmhca.in`
   - **Password**: Choose a secure password (min 6 characters)
   - **Auto Confirm User**: ✓ Check this box (so you don't need to verify email)
   - Click **"Create user"**

5. **Success!**
   - You'll see the new user in the users list
   - Note: The user is now in `auth.users` table

### Step 2: Add Admin Role to Public Users Table

1. **Go to SQL Editor**
   - Click **"SQL Editor"** in left sidebar
   - Click **"New query"**

2. **Copy and Run This Query**
   ```sql
   INSERT INTO public.users (id, email, full_name, role)
   SELECT 
     id,
     'santhosh@dmhca.in',
     'Santhosh Reddy',
     'admin'
   FROM auth.users 
   WHERE email = 'santhosh@dmhca.in';
   ```

3. **Click Run** (or press Cmd/Ctrl + Enter)

4. **Verify Success**
   - Run this query to check:
   ```sql
   SELECT id, email, full_name, role FROM public.users WHERE role = 'admin';
   ```
   - You should see your admin user!

## 🎉 Done! Now You Can Login

1. Go to your site: http://localhost:3000/login (or your Vercel URL)
2. Email: `santhosh@dmhca.in`
3. Password: (the password you created in Step 1)
4. Click Login
5. You'll be redirected to: `/admin` dashboard

---

## 🔄 Alternative: Create Multiple Admin Users

If you need more admins, repeat the process:

### Quick Add Another Admin:

1. **In Supabase Dashboard → Authentication → Users**
   - Add another user with their email

2. **In SQL Editor, run:**
   ```sql
   INSERT INTO public.users (id, email, full_name, role)
   SELECT 
     id,
     'newemail@example.com',  -- Change this
     'New Admin Name',         -- Change this
     'admin'
   FROM auth.users 
   WHERE email = 'newemail@example.com';  -- Change this
   ```

---

## 🔍 Troubleshooting

### Issue: "User already exists"
- Check if user is already in Authentication → Users
- If yes, just run Step 2 to add to public.users

### Issue: "Email not confirmed"
- In Authentication → Users, find the user
- Click the user → Click "Confirm email"

### Issue: "Still getting errors"
- Verify schema.sql was run successfully
- Check that `public.users` table exists:
  ```sql
  SELECT * FROM public.users LIMIT 5;
  ```

### Issue: "Can't login"
- Verify user exists in both tables:
  ```sql
  -- Check auth user
  SELECT id, email FROM auth.users WHERE email = 'santhosh@dmhca.in';
  
  -- Check public profile
  SELECT id, email, role FROM public.users WHERE email = 'santhosh@dmhca.in';
  ```
- Make sure both queries return results
- Verify role is 'admin' not 'customer'

---

## 📝 What This Does

1. **auth.users** table (Supabase Auth)
   - Stores authentication credentials
   - Handles login/password
   - Managed by Supabase

2. **public.users** table (Your app)
   - Stores user profile and role
   - Links to auth.users via ID
   - Used for admin/customer distinction

Both tables need matching records!

---

## 🎯 Summary

✅ **Step 1**: Create user in Supabase Dashboard → Authentication → Users
✅ **Step 2**: Add profile with admin role using SQL query
✅ **Test**: Login at /login with your credentials
✅ **Access**: You'll be redirected to /admin dashboard

**File Reference**: See `supabase/create-admin-user.sql` for SQL queries
