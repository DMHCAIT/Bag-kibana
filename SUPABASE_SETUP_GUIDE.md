# Supabase Setup Guide for Kibana Admin Panel

## ✅ Step 1: Environment Variables (COMPLETED)
Your `.env.local` file has been configured with:
- Supabase URL
- Supabase Anon Key
- Supabase Service Role Key
- NextAuth Secret

## 📋 Step 2: Run Database Schema

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard/project/hrahjiccbwvhtocabxja

2. **Navigate to SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New query"

3. **Copy and Paste Schema**
   - Open the file: `supabase/schema.sql`
   - Copy ALL the contents
   - Paste into the Supabase SQL Editor

4. **Run the Schema**
   - Click "Run" button (or press Cmd/Ctrl + Enter)
   - Wait for success message
   - You should see: "Success. No rows returned"

This will create:
- ✅ Users table (with admin/customer roles)
- ✅ Products table (for inventory)
- ✅ Orders table (for order management)
- ✅ Addresses table (for saved addresses)
- ✅ Wishlist table (for customer wishlists)
- ✅ Row Level Security policies
- ✅ Indexes for performance
- ✅ Triggers for auto-updating timestamps

## 🔐 Step 3: Create Admin User

After running the schema, create your first admin user:

### Option A: Using Supabase Dashboard (Recommended)

1. **Go to Authentication**
   - Click "Authentication" in sidebar
   - Click "Users" tab
   - Click "Add user" → "Create new user"

2. **Fill in Details**
   - Email: your-admin@email.com
   - Password: (choose a secure password)
   - Click "Create user"

3. **Set Admin Role**
   - Go to "SQL Editor"
   - Run this query (replace with your email):
   ```sql
   INSERT INTO public.users (id, email, full_name, role)
   VALUES (
     (SELECT id FROM auth.users WHERE email = 'your-admin@email.com'),
     'your-admin@email.com',
     'Admin Name',
     'admin'
   );
   ```

### Option B: Using SQL Only

Run this in SQL Editor (replace values):
```sql
-- Create auth user
INSERT INTO auth.users (
  instance_id,
  id,
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
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@kibana.com',
  crypt('YourSecurePassword123', gen_salt('bf')),
  NOW(),
  '{"full_name": "Admin User"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- Create profile in public.users
INSERT INTO public.users (id, email, full_name, role)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'admin@kibana.com'),
  'admin@kibana.com',
  'Admin User',
  'admin'
);
```

## 🚀 Step 4: Start Your Application

1. **Install Dependencies** (if not done)
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Test Admin Login**
   - Go to: http://localhost:3000/login
   - Use your admin credentials
   - You should be redirected to: http://localhost:3000/admin

## 📊 Step 5: Add Sample Data (Optional)

To test the admin panel, add some sample products:

```sql
INSERT INTO public.products (name, category, color, price, description, stock, images)
VALUES 
  ('Leather Tote Bag', 'Women', 'Brown', 4999.00, 'Premium leather tote bag', 25, ARRAY['https://example.com/bag1.jpg']),
  ('Canvas Backpack', 'Unisex', 'Black', 2999.00, 'Durable canvas backpack', 50, ARRAY['https://example.com/bag2.jpg']),
  ('Crossbody Bag', 'Women', 'Beige', 3499.00, 'Elegant crossbody bag', 30, ARRAY['https://example.com/bag3.jpg']);
```

## 🔍 Verify Setup

### Check Tables Created:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

Should show: users, products, orders, addresses, wishlist

### Check Admin User:
```sql
SELECT id, email, role FROM public.users WHERE role = 'admin';
```

Should show your admin user

### Check RLS Policies:
```sql
SELECT tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';
```

Should show multiple policies for each table

## 🎯 Next Steps

1. ✅ **Test Login**: Go to /login and sign in with admin credentials
2. ✅ **Access Admin Panel**: Visit /admin to see dashboard
3. ✅ **Add Products**: Go to /admin/products to add inventory
4. ✅ **Test Orders**: Create test orders to verify system
5. ✅ **View Reports**: Check /admin/reports for analytics

## 🆘 Troubleshooting

### Issue: "Failed to fetch" or Connection Errors
- Verify Supabase URL and keys in `.env.local`
- Restart dev server: `npm run dev`
- Check Supabase project is active

### Issue: "Unauthorized" or Login Fails
- Verify admin user exists: Check SQL query above
- Ensure `role = 'admin'` in public.users table
- Clear browser cookies and try again

### Issue: RLS Policies Blocking Access
- Run the schema again (it's idempotent)
- Verify user has admin role in database
- Check browser console for specific errors

### Issue: Tables Not Created
- Ensure you ran the FULL schema.sql file
- Check for SQL errors in Supabase SQL Editor
- Try running each section separately

## 📚 Admin Panel Features

Once setup is complete, you'll have access to:

- **Dashboard** (`/admin`) - Overview stats and metrics
- **Orders** (`/admin/orders`) - View, update, refund orders
- **Products** (`/admin/products`) - Manage inventory and catalog
- **Customers** (`/admin/customers`) - View customer data and stats
- **Reports** (`/admin/reports`) - Sales analytics and insights

## 🔒 Security Notes

1. **Never commit** `.env.local` to Git (it's in .gitignore)
2. **Service Role Key** is powerful - only use server-side
3. **Change default passwords** after first login
4. **Enable 2FA** on your Supabase account
5. **Review RLS policies** before production deployment

## 📞 Support

If you encounter issues:
1. Check Supabase logs in Dashboard → Logs
2. Check browser console for errors
3. Review `ADMIN_SETUP.md` for additional guidance
4. Check Next.js terminal output for server errors

---

**Status**: Environment configured ✅ | Database schema ready ✅ | Ready to deploy ✅
