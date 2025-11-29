# Vercel Deployment Guide - Fix Build Error

## ❌ Current Error
```
Error: supabaseUrl is required.
```

This happens because Vercel doesn't have your environment variables.

## ✅ Fix: Add Environment Variables to Vercel

### Step 1: Go to Vercel Project Settings

1. Open your Vercel dashboard: https://vercel.com/dashboard
2. Find your project: **Bag-kibana** (or kibana-homepage)
3. Click on the project
4. Click **Settings** tab
5. Click **Environment Variables** in the left sidebar

### Step 2: Add All Required Variables

Add these **one by one** (click "Add Another" for each):

#### Supabase Configuration
```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://hrahjiccbwvhtocabxja.supabase.co
Environment: Production, Preview, Development (check all 3)
```

```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhyYWhqaWNjYnd2aHRvY2FieGphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyMDMwMDIsImV4cCI6MjA3OTc3OTAwMn0.2kY-tXAKf7QdaWDo5fOBGXft_Doz2zf4hZ7VWL-JxFg
Environment: Production, Preview, Development (check all 3)
```

```
Name: SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhyYWhqaWNjYnd2aHRvY2FieGphIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDIwMzAwMiwiZXhwIjoyMDc5Nzc5MDAyfQ.2q8IkVeZ5hQKdqO0E4WhvGDgDxViGlx-qw29aW6g_oU
Environment: Production, Preview, Development (check all 3)
```

#### NextAuth Configuration
```
Name: NEXTAUTH_URL
Value: https://your-project-name.vercel.app
Environment: Production
```
**Note**: Replace `your-project-name` with your actual Vercel deployment URL

For Preview/Development:
```
Name: NEXTAUTH_URL
Value: http://localhost:3000
Environment: Preview, Development
```

```
Name: NEXTAUTH_SECRET
Value: jQ578GpzcKgPkzI70SGR/Y/u7TPTCyE7vU0v0tQ90WA=
Environment: Production, Preview, Development (check all 3)
```

#### Razorpay Configuration (Optional - for now)
```
Name: RAZORPAY_KEY_ID
Value: rzp_test_dummy_key
Environment: Production, Preview, Development (check all 3)
```

```
Name: RAZORPAY_KEY_SECRET
Value: dummy_secret_key
Environment: Production, Preview, Development (check all 3)
```

```
Name: NEXT_PUBLIC_RAZORPAY_KEY_ID
Value: rzp_test_dummy_key
Environment: Production, Preview, Development (check all 3)
```

### Step 3: Redeploy

After adding all environment variables:

1. Go to **Deployments** tab
2. Find the latest failed deployment
3. Click the **three dots** (•••) menu
4. Click **Redeploy**
5. Check **Use existing Build Cache** (optional)
6. Click **Redeploy**

OR simply push a new commit:
```bash
git commit --allow-empty -m "Trigger redeploy with env vars"
git push origin main
```

## 🎯 Quick Copy-Paste for Vercel

If you prefer to copy-paste into Vercel's bulk add feature:

```env
NEXT_PUBLIC_SUPABASE_URL=https://hrahjiccbwvhtocabxja.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhyYWhqaWNjYnd2aHRvY2FieGphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyMDMwMDIsImV4cCI6MjA3OTc3OTAwMn0.2kY-tXAKf7QdaWDo5fOBGXft_Doz2zf4hZ7VWL-JxFg
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhyYWhqaWNjYnd2aHRvY2FieGphIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDIwMzAwMiwiZXhwIjoyMDc5Nzc5MDAyfQ.2q8IkVeZ5hQKdqO0E4WhvGDgDxViGlx-qw29aW6g_oU
NEXTAUTH_SECRET=jQ578GpzcKgPkzI70SGR/Y/u7TPTCyE7vU0v0tQ90WA=
RAZORPAY_KEY_ID=rzp_test_dummy_key
RAZORPAY_KEY_SECRET=dummy_secret_key
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_dummy_key
```

**Important**: You'll need to set `NEXTAUTH_URL` separately for each environment:
- Production: `https://your-actual-vercel-url.vercel.app`
- Preview: Can be auto-generated or use localhost
- Development: `http://localhost:3000`

## 📋 Checklist

- [ ] Add NEXT_PUBLIC_SUPABASE_URL to Vercel
- [ ] Add NEXT_PUBLIC_SUPABASE_ANON_KEY to Vercel
- [ ] Add SUPABASE_SERVICE_ROLE_KEY to Vercel
- [ ] Add NEXTAUTH_SECRET to Vercel
- [ ] Add NEXTAUTH_URL (with your actual Vercel URL)
- [ ] Add Razorpay keys (optional for now)
- [ ] Redeploy from Vercel dashboard
- [ ] Wait for build to complete (2-3 minutes)
- [ ] Test deployment URL

## 🔍 Verify Deployment

After successful deployment:

1. **Test Homepage**: Visit your Vercel URL
2. **Test Login**: Go to `/login` - should load without errors
3. **Test Admin**: Log in and visit `/admin` - requires database setup first

## ⚠️ Important Notes

1. **NEXTAUTH_URL**: Must match your actual deployment URL in production
2. **Service Role Key**: Very sensitive - only use server-side
3. **Database**: Remember to run `schema.sql` in Supabase before testing admin features
4. **First Deploy**: May take 3-5 minutes for full deployment

## 🆘 Still Having Issues?

### Check Build Logs
- Go to Vercel → Deployments → Click on latest deployment
- Review the build logs for specific errors

### Common Issues

**Issue**: "NEXTAUTH_URL" must be a valid URL
- **Fix**: Ensure NEXTAUTH_URL includes `https://` and your full Vercel URL

**Issue**: Database connection errors
- **Fix**: Double-check Supabase URL and keys are correct
- **Fix**: Ensure Supabase project is active (not paused)

**Issue**: Middleware deprecation warning
- **Note**: This is just a warning, doesn't affect deployment

## 🚀 After Successful Deployment

1. Update your `.env.local` NEXTAUTH_URL to match production URL (for testing)
2. Run database schema in Supabase (if not done)
3. Create admin user
4. Test login at your Vercel URL
5. Access admin panel

---

**Next Step**: After Vercel deployment succeeds, follow `SUPABASE_SETUP_GUIDE.md` to set up your database.
