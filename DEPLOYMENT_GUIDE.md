# KIBANA E-Commerce Platform - Complete Setup & Deployment Guide

## 📋 System Architecture Overview

### Technology Stack
- **Frontend**: Next.js 15+ (App Router) + React 18 + TypeScript
- **Styling**: Tailwind CSS 3.4+
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Payment**: Razorpay
- **Authentication**: Google OAuth + OTP-based
- **SMS**: Twilio (for OTP delivery)
- **Analytics**: Google Tag Manager (GTM-WVDS2TSN) + Meta Pixel
- **Hosting**: Vercel

---

## 🚀 Pre-Deployment Checklist

### 1. Environment Variables Setup

Create a `.env.local` file in the project root with:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://hrahjiccbwvhtocabxja.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Razorpay Configuration
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret_key_here

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com

# Twilio Configuration (Optional - for SMS OTP)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+1234567890

# Google Tag Manager
NEXT_PUBLIC_GTM_ID=GTM-WVDS2TSN

# Meta Pixel
NEXT_PUBLIC_META_PIXEL_ID=your_pixel_id_here

# Environment
NODE_ENV=production
```

### 2. Database Setup (Supabase)

#### Run OTP Table Migration

1. Go to Supabase Dashboard → SQL Editor
2. Copy and run the SQL from: `supabase/create-otp-table.sql`
3. Verify the table is created with proper indexes

```sql
-- Run this to verify
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'otp_store';
```

#### Existing Tables Verification

Ensure these tables exist and have proper structure:

```bash
Tables Required:
✓ orders - Order management (required)
✓ products - Product catalog (required)
✓ users - User accounts (required)
✓ otp_store - OTP authentication (newly created)
✓ placements - Product section placements (optional)
```

### 3. API Routes Configuration

#### Critical API Endpoints

```
POST /api/auth/send-otp          - Generate and send OTP via SMS
POST /api/auth/verify-otp        - Verify OTP for login
POST /api/razorpay/create-order  - Create Razorpay order
POST /api/razorpay/verify-payment - Verify payment and save order
GET  /api/products               - Fetch all products
GET  /api/products/[id]          - Fetch single product
POST /api/admin/orders           - Create new order
GET  /api/admin/orders           - Fetch all orders
```

### 4. Email & SMS Configuration

#### Twilio Setup (Optional but Recommended for Production)

1. Create Twilio account at https://www.twilio.com
2. Get your:
   - Account SID
   - Auth Token
   - Phone Number (Twilio number for sending SMS)
3. Add to `.env.local`

**In Development**: OTPs are logged to console and returned in response

**In Production**: OTPs are sent via Twilio SMS

#### Google OAuth Setup

1. Go to Google Cloud Console
2. Create OAuth 2.0 credentials
3. Add authorized redirect URIs:
   ```
   http://localhost:3000/api/auth/callback/google
   https://yourdomain.com/api/auth/callback/google
   ```

### 5. Razorpay Configuration

1. Create account at https://razorpay.com
2. Get API Keys from Dashboard → Settings → API Keys
3. Test Keys for development, Live Keys for production
4. Add to `.env.local`

---

## 📦 Deployment Steps

### Step 1: Prepare for Production Build

```bash
# Install dependencies
npm install

# Run linter and type check
npm run type-check

# Build the project
npm run build

# Test production build locally
npm run start
```

### Step 2: Deploy to Vercel

#### Option A: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy (follow prompts)
vercel --prod

# Add environment variables in Vercel Dashboard
# Settings → Environment Variables
```

#### Option B: Using Git Integration

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Project Settings
4. Vercel automatically deploys on push

### Step 3: Post-Deployment Verification

```bash
# Verify environment variables are set
curl https://yourdomain.com/api/test-db

# Expected response:
{
  "environment": {
    "supabaseUrl": "Set",
    "supabaseAnonKey": "Set",
    "supabaseServiceKey": "Set",
    "razorpayKeyId": "Set"
  },
  "database": {
    "orders": 0,
    "products": 0,
    "users": 0
  }
}
```

---

## 🧪 Testing Checklist

### 1. Authentication Flow

- [ ] OTP generation (console logs in dev, SMS in prod)
- [ ] OTP verification (5-minute expiry)
- [ ] User creation after OTP verification
- [ ] Session persistence across pages
- [ ] Logout functionality

### 2. Product Browsing

- [ ] Homepage loads products
- [ ] Product filtering works (category, price, color)
- [ ] Product detail page loads correctly
- [ ] Image gallery works
- [ ] Related products display
- [ ] Product variants show correct colors

### 3. Shopping Cart

- [ ] Add product to cart
- [ ] Update quantity
- [ ] Remove product from cart
- [ ] Cart persists on page reload
- [ ] Discount calculation (25% OFF)
- [ ] Cart summary displays correctly

### 4. Checkout & Payment

- [ ] Checkout page requires authentication
- [ ] Form validation works
- [ ] COD (Cash on Delivery) flow:
  - [ ] Order creation in database
  - [ ] Order ID generated correctly
  - [ ] Redirect to order-success page
  
- [ ] Razorpay payment flow:
  - [ ] Razorpay modal opens
  - [ ] Payment can be completed
  - [ ] Payment verification succeeds
  - [ ] Order saved to database
  - [ ] Redirect to order-success page

### 5. Admin Dashboard

- [ ] Access admin panel
- [ ] View orders list
- [ ] Filter orders by status
- [ ] Search orders
- [ ] View individual order details
- [ ] Update order status
- [ ] View products
- [ ] Add new product
- [ ] Edit product
- [ ] Delete product

### 6. Analytics

- [ ] Google Tag Manager events fire correctly
- [ ] Meta Pixel tracks purchases
- [ ] Order tracking data captured

---

## 🐛 Debugging Guide

### Common Issues & Solutions

#### 1. OTP Not Sending

**Problem**: OTP generated but not received via SMS

**Solutions**:
- Development mode: Check browser console for OTP
- Check Twilio credentials in `.env.local`
- Verify phone number format (should be +91XXXXXXXXXX)
- Check Twilio account balance
- Check Twilio SMS logs: https://www.twilio.com/console/sms/logs

#### 2. Database Connection Issues

**Problem**: "Database connection not available" error

**Check**:
```bash
# Test database connection
curl https://yourdomain.com/api/test-db

# Should show database status
```

**Solutions**:
- Verify Supabase credentials
- Check Supabase project status (https://app.supabase.com)
- Verify network connectivity to Supabase
- Check RLS policies on tables

#### 3. Payment Not Going Through

**Problem**: Razorpay payment fails or order not created

**Solutions**:
- Verify Razorpay API keys (test vs. live)
- Check Razorpay dashboard for payment status
- Verify order was saved: `GET /api/admin/orders`
- Check payment verification logs: `console.log` in `/api/razorpay/verify-payment`

#### 4. Products Not Loading

**Problem**: "No products found in database" error

**Solutions**:
- Verify products table has data
- Check API response: `GET /api/products`
- Verify product image URLs are accessible
- Check for database query errors in API logs

#### 5. Images Not Displaying

**Problem**: Product images show as broken

**Solutions**:
- Verify Supabase Storage bucket is public
- Check image URLs in database
- Verify bucket permissions:
  ```sql
  SELECT * FROM storage.buckets WHERE name = 'product-images';
  ```

---

## 📊 Performance Optimization

### 1. Database Query Optimization

```sql
-- Add indexes for faster queries
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_orders_customer_email ON orders(customer_email);
CREATE INDEX idx_orders_status ON orders(order_status);
```

### 2. Image Optimization

- All product images are optimized using Next.js Image component
- Images are cached by Supabase CDN
- Sizes are set for responsive loading

### 3. API Response Caching

- Orders list API uses `Cache-Control: no-store` to ensure fresh data
- Product list can be cached on client-side (60 seconds TTL recommended)

### 4. Frontend Optimization

- Lazy loading for related products
- Pagination on admin pages
- Debounced search filters

---

## 📱 Responsive Design

Tested on:
- ✓ Mobile (375px - iPhone SE)
- ✓ Tablet (768px - iPad)
- ✓ Desktop (1024px+)
- ✓ Large Desktop (1440px+)

All pages use responsive typography and spacing via Tailwind breakpoints.

---

## 🔒 Security Considerations

### 1. API Security

- Service Role Key kept private in `.env` (never exposed to client)
- All sensitive operations use server-side routes
- CORS headers properly configured

### 2. Payment Security

- Razorpay signature verification before saving orders
- No sensitive payment data stored in database
- Payment ID and status tracked for reconciliation

### 3. Database Security

- RLS (Row Level Security) policies on all public tables
- Anonymous users can only read public data
- Admin operations require proper authentication

### 4. OTP Security

- 6-digit OTP with 5-minute expiry
- Rate limiting recommended (not yet implemented)
- OTP never transmitted via insecure channels

---

## 📞 Support & Maintenance

### Regular Maintenance Tasks

**Weekly**:
- [ ] Review order status and fulfill pending orders
- [ ] Check error logs for issues
- [ ] Monitor website uptime

**Monthly**:
- [ ] Review analytics reports
- [ ] Check payment reconciliation
- [ ] Update product inventory

**Quarterly**:
- [ ] Security audit
- [ ] Performance review
- [ ] Database cleanup (delete old OTPs)

### Useful Dashboards

- Vercel Deployments: https://vercel.com/dashboard
- Supabase: https://app.supabase.com
- Razorpay Dashboard: https://dashboard.razorpay.com
- Google Analytics: https://analytics.google.com
- Google Tag Manager: https://tagmanager.google.com

---

## 🎯 Key Features Summary

### ✅ Implemented

- [x] Product catalog with filtering and search
- [x] User authentication (Google OAuth + OTP)
- [x] Shopping cart with persistent storage
- [x] Checkout with COD and Razorpay payment
- [x] Order management system
- [x] Admin dashboard
- [x] Order tracking
- [x] Product reviews (5-star rating)
- [x] Email notifications (order confirmation)
- [x] Mobile-responsive design
- [x] Analytics integration (GTM + Meta Pixel)

### 🔄 Recommended Future Features

- [ ] Wishlist functionality
- [ ] Advanced product search (filters, sorting)
- [ ] User reviews and ratings
- [ ] Email notifications
- [ ] SMS order updates
- [ ] Referral program
- [ ] Loyalty points
- [ ] Multiple payment methods
- [ ] Inventory management
- [ ] Multi-vendor support

---

## 📚 API Documentation

### Authentication Endpoints

```
POST /api/auth/send-otp
{
  "phone": "+919876543210"
}
Response: { success: true, message: "OTP sent" }

POST /api/auth/verify-otp
{
  "phone": "+919876543210",
  "otp": "123456"
}
Response: { success: true, message: "OTP verified", phone: "+919876543210" }
```

### Product Endpoints

```
GET /api/products
- Query params: category, price_range, search, limit, offset
- Response: { success: true, products: [], total: 0 }

GET /api/products/[id]
- Response: { success: true, product: {...} }
```

### Order Endpoints

```
POST /api/admin/orders
- Headers: { "Content-Type": "application/json" }
- Body: { customer_email, customer_phone, items, total, ... }
- Response: { success: true, order: {...} }

GET /api/admin/orders
- Query params: status, search, page, limit
- Response: { orders: [], totalOrders: 0, stats: {...} }
```

---

## 📖 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Razorpay API Docs](https://razorpay.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vercel Deployment Guide](https://vercel.com/docs/concepts/deployments/overview)

---

**Last Updated**: December 2024
**Version**: 1.0.0
**Status**: Production Ready ✅
