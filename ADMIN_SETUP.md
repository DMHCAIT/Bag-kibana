# 🚀 Admin Panel & Database Setup Guide

## Overview
This guide will help you set up the complete admin panel with database, authentication, and CMS features for your Kibana e-commerce store.

## Features Implemented

### ✅ Admin Panel Features
- **Dashboard** - Overview of orders, revenue, products, and customers
- **Order Management** - View all orders, update status, process refunds
- **Product CMS** - Add/edit/delete products, manage inventory, upload images
- **Customer Management** - View customer profiles, order history, addresses
- **Sales Reports** - Revenue analytics, charts, export to PDF/CSV
- **Role-Based Access** - Secure admin-only routes

### ✅ Customer Features
- **User Accounts** - Login/signup with email & password
- **Order History** - View past orders and track shipments
- **Saved Addresses** - Store shipping and billing addresses
- **Wishlist** - Save favorite products
- **Email Notifications** - Order confirmations and updates

---

## 📋 Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works!)
- Email service account (Resend recommended)

---

## Step 1: Set Up Supabase Database

### 1.1 Create a Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Click **"New Project"**
3. Fill in details:
   - **Name**: `kibana-store`
   - **Database Password**: (Generate a strong password and save it)
   - **Region**: Choose closest to you
4. Click **"Create new project"** (takes ~2 minutes)

### 1.2 Run Database Schema

1. In your Supabase project, go to **SQL Editor** (left sidebar)
2. Click **"New query"**
3. Open the file `supabase/schema.sql` in your project
4. Copy all the SQL code and paste it into the SQL Editor
5. Click **"Run"** to execute the schema
6. You should see success messages for all tables created

### 1.3 Get API Keys

1. Go to **Settings** → **API** (in Supabase dashboard)
2. Copy these values:
   - **Project URL** (starts with `https://`)
   - **anon public** key
   - **service_role** key (click "Reveal" to see it)

---

## Step 2: Configure Environment Variables

### 2.1 Create .env.local file

```bash
cp .env.example .env.local
```

### 2.2 Fill in the values

Open `.env.local` and add your keys:

```env
# Supabase (from Step 1.3)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# NextAuth (generate a secret)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=run_this_command: openssl rand -base64 32

# Razorpay (existing)
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

### 2.3 Generate NextAuth Secret

Run this command in terminal:
```bash
openssl rand -base64 32
```

Copy the output and paste it as `NEXTAUTH_SECRET` value.

---

## Step 3: Enable Supabase Authentication

### 3.1 Enable Email Auth

1. In Supabase, go to **Authentication** → **Providers**
2. Make sure **Email** is enabled (should be by default)
3. Under **Email Templates**, customize if needed:
   - Confirmation email
   - Password reset email

### 3.2 Configure Site URL

1. Go to **Authentication** → **URL Configuration**
2. Add these URLs:
   - **Site URL**: `http://localhost:3000`
   - **Redirect URLs**: `http://localhost:3000/api/auth/callback/credentials`

### 3.3 (Optional) Disable Email Confirmation

For development, you can disable email confirmation:
1. Go to **Authentication** → **Providers** → **Email**
2. Toggle **"Confirm email"** to OFF
3. Click **Save**

---

## Step 4: Create Admin User

### 4.1 Sign Up First User

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Visit `http://localhost:3000/signup`

3. Create your admin account:
   - Full Name: Your name
   - Email: your-admin@email.com
   - Password: Strong password

4. You'll be redirected to login

### 4.2 Promote User to Admin

1. In Supabase, go to **SQL Editor**
2. Run this query (replace with your email):

```sql
UPDATE public.users
SET role = 'admin'
WHERE email = 'your-admin@email.com';
```

3. Click **"Run"**

### 4.3 Test Admin Access

1. Log out and log back in with your admin account
2. Visit `http://localhost:3000/admin`
3. You should see the admin dashboard!

---

## Step 5: Migrate Existing Products to Database

### 5.1 Create Migration Script

Your existing products are in `data/products.ts`. Run this migration to move them to Supabase:

1. Go to **SQL Editor** in Supabase
2. Run this query to insert your existing products:

```sql
INSERT INTO public.products (name, category, price, description, color, images, stock, features, care_instructions)
VALUES
  -- Copy product data from your products.ts file
  -- Example:
  ('PRIZMA SLING', 'women', 2499.00, 'Premium quality sling bag', 'Mint Green', ARRAY['/images/products/prizma-mint.jpg'], 25, ARRAY['Adjustable strap', 'Water resistant'], ARRAY['Wipe clean with damp cloth']);
  
-- Repeat for all products
```

**OR** Use the admin panel UI:
1. Log in to admin panel
2. Go to **Products** → **Add Product**
3. Manually add products through the UI

---

## Step 6: Configure Email Notifications (Optional)

### 6.1 Sign Up for Resend

1. Go to [https://resend.com](https://resend.com)
2. Sign up for free account (100 emails/day on free tier)
3. Verify your domain OR use their test domain
4. Get your API key from Dashboard

### 6.2 Add Email Configuration

Add to `.env.local`:
```env
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=noreply@yourdomain.com
```

---

## Step 7: Deploy to Vercel

### 7.1 Add Environment Variables to Vercel

1. Go to Vercel dashboard → Your project
2. **Settings** → **Environment Variables**
3. Add all variables from `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXTAUTH_URL` (change to your production URL: `https://yourdomain.com`)
   - `NEXTAUTH_SECRET`
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
   - `RESEND_API_KEY` (if using email)
   - `EMAIL_FROM` (if using email)

### 7.2 Update Supabase URLs

1. In Supabase, go to **Authentication** → **URL Configuration**
2. Add production URLs:
   - **Site URL**: `https://yourdomain.com`
   - **Redirect URLs**: `https://yourdomain.com/api/auth/callback/credentials`

### 7.3 Deploy

```bash
git add .
git commit -m "Add admin panel with database"
git push origin main
```

Vercel will automatically deploy!

---

## 🎉 You're Done!

### Access Your Admin Panel

- **Local**: `http://localhost:3000/admin`
- **Production**: `https://yourdomain.com/admin`

### Default Routes

| Route | Description | Access |
|-------|-------------|--------|
| `/admin` | Dashboard overview | Admin only |
| `/admin/orders` | Order management | Admin only |
| `/admin/products` | Product CMS | Admin only |
| `/admin/customers` | Customer management | Admin only |
| `/admin/reports` | Sales analytics | Admin only |
| `/account` | Customer dashboard | Logged-in users |
| `/account/orders` | Order history | Logged-in users |
| `/account/addresses` | Saved addresses | Logged-in users |
| `/account/wishlist` | Wishlist | Logged-in users |
| `/login` | Sign in | Public |
| `/signup` | Create account | Public |

---

## 🔧 Troubleshooting

### "Unauthorized" Error
- Make sure your user has `role = 'admin'` in the database
- Log out and log back in after promoting to admin

### Database Connection Error
- Verify Supabase URL and keys in `.env.local`
- Check that keys are correctly added to Vercel

### Email Signup Not Working
- Check Supabase logs: **Authentication** → **Logs**
- Verify email confirmation is disabled (for development)

### Products Not Showing
- Make sure you ran the database migration
- Check Supabase: **Table Editor** → **products** table

---

## 📚 Next Steps

1. **Customize Email Templates** in Supabase
2. **Add Product Images** using Supabase Storage
3. **Set Up Domain Email** with Resend
4. **Enable Google/Social Login** in Supabase Auth
5. **Configure Backup Strategy** in Supabase Settings

---

## 🆘 Need Help?

- Supabase Docs: https://supabase.com/docs
- NextAuth Docs: https://next-auth.js.org
- Resend Docs: https://resend.com/docs

---

**Admin Panel Complete!** 🎊

You now have a full-featured admin panel with:
- ✅ Order management
- ✅ Product CMS
- ✅ Customer database
- ✅ Sales analytics
- ✅ User authentication
- ✅ Email notifications
- ✅ Secure role-based access
