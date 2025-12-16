# 🔧 How to Fix "Login History Not Working"

## Problem
The login history page shows an error or no data because the database tables haven't been created yet.

## Solution: Run Database Migration

### Step 1: Open Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Select your project: **Bag-kibana** (or your project name)

### Step 2: Open SQL Editor
1. Click on **SQL Editor** in the left sidebar (icon: `</>`)
2. Click **New Query** button

### Step 3: Run the Migration
1. Open the file: `supabase/add-user-tracking.sql` in your code editor
2. **Copy ALL the contents** of that file (Cmd/Ctrl + A, then Cmd/Ctrl + C)
3. **Paste** into the Supabase SQL Editor
4. Click **Run** (or press Cmd/Ctrl + Enter)

### Step 4: Verify Success
You should see a message like:
```
Success. No rows returned
```

This is normal! It means the tables were created successfully.

### Step 5: Refresh Your Site
1. Go back to your admin panel: `/admin/login-history`
2. Refresh the page (F5 or Cmd/Ctrl + R)
3. You should now see "No login history yet" instead of an error

## What This Migration Does

The SQL file creates 3 important things:

1. **Enhanced `users` table** - Adds these fields:
   - `phone` - User's phone number
   - `phone_verified` - Whether phone is verified
   - `last_login_at` - Last login timestamp
   - `login_count` - Number of times user logged in
   - `status` - active/inactive/suspended/deleted
   - `registration_method` - phone/email/google/facebook
   - `ip_address` - Registration IP
   - `user_agent` - Browser/device info
   - `referral_source` - Where user came from

2. **`login_history` table** - Tracks every login:
   - User information (phone/email)
   - Login method (phone_otp, google, etc.)
   - Device info (mobile/tablet/desktop)
   - Browser and OS
   - IP address and location
   - Status (success/failed/blocked)
   - Timestamp

3. **`user_activity_logs` table** - Records user actions:
   - Registration, login, logout
   - Orders placed/cancelled
   - Profile updates
   - Cart/wishlist changes
   - Payment completions

## Populating Data

After running the migration, the tables are empty. To see data:

1. **Test Login**: 
   - Go to your site's login page
   - Enter a phone number
   - Verify the OTP
   - This will create an entry in `login_history`

2. **Check Admin Panel**:
   - Navigate to `/admin/login-history`
   - You should see the login entry you just created

## Common Issues

### ❌ "relation 'login_history' does not exist"
**Solution**: You haven't run the migration yet. Follow steps above.

### ❌ "permission denied for table login_history"
**Solution**: Your Supabase service role key might be missing.
1. Go to Supabase Dashboard → Settings → API
2. Copy the `service_role` key (not the `anon` key!)
3. Add to `.env.local`: `SUPABASE_SERVICE_ROLE_KEY=your_key_here`
4. Restart your dev server

### ❌ "No login history yet" but I just logged in
**Solution**: Check if OTP verification is working:
1. Open browser console (F12)
2. Look for errors when logging in
3. Check if `/api/auth/verify-otp` returns success
4. Verify the `otp_store` table exists (run `supabase/create-otp-table.sql` if needed)

## Files Involved

- 📄 `supabase/add-user-tracking.sql` - Main migration file
- 📄 `app/api/admin/login-history/route.ts` - API endpoint
- 📄 `app/admin/login-history/page.tsx` - Admin page
- 📄 `app/api/auth/verify-otp/route.ts` - Logs successful logins
- 📄 `app/api/auth/register/route.ts` - Logs registrations

## Need Help?

If you're still having issues:
1. Check browser console for errors (F12 → Console tab)
2. Check Supabase logs (Dashboard → Logs → API)
3. Verify all environment variables are set in `.env.local`
4. Make sure your dev server is running (`npm run dev`)

---

✅ Once migration is complete, the login history feature will work perfectly!
