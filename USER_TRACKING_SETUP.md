# User Tracking & Login History - Implementation Guide

## Overview
Enhanced the admin panel with comprehensive user tracking, login history, and detailed customer information.

## What Was Created

### 1. Database Schema (`supabase/add-user-tracking.sql`)
Run this SQL file in your Supabase SQL Editor to create:

#### Enhanced Users Table
Added new fields to track:
- `phone` - User phone number
- `phone_verified` - Phone verification status
- `last_login_at` - Last login timestamp
- `login_count` - Total number of logins
- `status` - User status (active/inactive/suspended/deleted)
- `registration_method` - How user registered (phone/email/google/facebook)
- `ip_address` - User's IP address
- `user_agent` - Browser/device information
- `referral_source` - Where user came from

#### Login History Table
Tracks every login attempt with:
- User identification (user_id, phone, email)
- Login method (phone_otp, email_password, etc.)
- Device information (device_type, browser, os)
- Location data (country, city)
- IP address and user agent
- Status (success/failed/blocked)
- Failure reason (if failed)
- Timestamp

#### User Activity Logs Table
Comprehensive activity tracking:
- Activity type (registration, login, logout, order_placed, etc.)
- Activity description
- Metadata (JSON for additional data)
- IP address and user agent
- Timestamp

### 2. API Endpoints

#### `/api/auth/register` (NEW)
- Handles user registration with phone OTP
- Creates user account in Supabase Auth
- Stores user details in public.users table
- Logs registration activity
- Tracks device and location information
- Returns user data and isNewUser flag

#### `/api/auth/verify-otp` (ENHANCED)
- Now checks if user exists after OTP verification
- Updates last login timestamp
- Logs successful login
- Returns user information

#### `/api/admin/customers` (ENHANCED)
- Returns enhanced customer data including:
  - Phone number and verification status
  - Registration method
  - Last login time
  - Login count
  - Account status
  - Order statistics

#### `/api/admin/login-history` (NEW)
- Fetches login history with filters
- Supports status filtering (success/failed/blocked)
- Provides detailed device and location info

### 3. Admin Pages

#### Enhanced Customers Page (`/admin/customers`)
Now displays:
- Customer avatar with role badge (admin/customer)
- Contact information (email + phone with verification badge)
- Account status (active/inactive/suspended)
- Registration method and date
- Activity metrics (login count, last login)
- Order statistics
- Total spent

#### New Login History Page (`/admin/login-history`)
Features:
- Real-time login tracking
- Status indicators (success/failed/blocked)
- Device type icons (mobile/tablet/desktop)
- Browser and OS information
- IP address tracking
- Location data
- Time-based filtering
- Search by phone, email, or IP
- Statistics dashboard (total logins, successful, failed, mobile logins)

## Setup Instructions

### Step 1: Run Database Migration
1. Open Supabase Dashboard
2. Go to SQL Editor
3. Create New Query
4. Copy and paste content from `supabase/add-user-tracking.sql`
5. Click "Run"

### Step 2: Verify Tables Created
Check that these tables exist:
- `login_history`
- `user_activity_logs`
- `users` (with new columns added)

### Step 3: Test the System

#### Test User Registration:
1. Go to your login/signup page
2. Enter phone number and request OTP
3. Verify OTP
4. Check `/admin/customers` - new user should appear with:
   - Registration method: "phone"
   - Phone verified: ✓
   - Login count: 1
   - Status: active

#### Test Login Tracking:
1. Login with existing user
2. Go to `/admin/login-history`
3. Should see new login entry with:
   - Device type
   - Browser info
   - IP address
   - Status: success

## Features Tracking

### User Registration Tracks:
✅ Phone number
✅ Email (optional)
✅ Full name (optional)
✅ Registration method
✅ Device information
✅ IP address
✅ Referral source
✅ Initial login timestamp

### Login Tracks:
✅ Every login attempt (success/failed)
✅ Login method (phone OTP, email, social)
✅ Device type (mobile/tablet/desktop)
✅ Browser and OS
✅ IP address
✅ Location (if available)
✅ Timestamp

### User Activity Tracks:
✅ Registration events
✅ Login/logout events
✅ Order placement
✅ Profile updates
✅ Address changes
✅ Cart updates
✅ Payment completions

## Admin Panel Features

### Customers Page (`/admin/customers`)
- Complete customer directory
- Search by name, email, or phone
- View registration method
- See verification status
- Track login activity
- Monitor order history
- View total spending
- Filter by status

### Login History Page (`/admin/login-history`)
- Real-time login monitoring
- Security audit trail
- Failed login detection
- Device analytics
- Geographic tracking
- Status filtering
- Search functionality
- Statistics dashboard

## Security Features

1. **Phone Verification**: Users must verify phone via OTP
2. **Failed Login Tracking**: Monitor suspicious login attempts
3. **IP Address Logging**: Track user locations
4. **Device Fingerprinting**: Identify unique devices
5. **Activity Audit Trail**: Complete user action history
6. **Status Management**: Ability to suspend/block users

## Analytics & Insights

The system now provides:
- User registration trends
- Login patterns by device
- Failed login analysis
- User engagement metrics
- Customer lifetime value
- Retention statistics

## Next Steps (Optional Enhancements)

1. **Email Notifications**: Alert admins on suspicious activity
2. **Rate Limiting**: Block IPs with too many failed attempts
3. **Two-Factor Authentication**: Additional security layer
4. **Session Management**: Track active sessions
5. **Export Reports**: Download customer/login data as CSV
6. **Advanced Analytics**: Charts and graphs for trends
7. **Geolocation API**: Enhanced location tracking
8. **User Segmentation**: Group customers by behavior

## Troubleshooting

### If customers page shows no data:
1. Check if SQL migration ran successfully
2. Verify new columns exist in users table
3. Check browser console for API errors
4. Verify Supabase connection

### If login history is empty:
1. Make sure `login_history` table exists
2. Test a fresh login to generate data
3. Check API endpoint `/api/admin/login-history`
4. Verify RLS policies allow admin access

### If OTP verification doesn't create user:
1. Check if `otp_store` table exists (from previous setup)
2. Verify `/api/auth/register` endpoint is accessible
3. Check Supabase Auth settings
4. Review server logs for errors

## Support

For issues:
1. Check Supabase logs in dashboard
2. Review browser console errors
3. Verify all SQL migrations completed
4. Test API endpoints individually
5. Check RLS policies for admin role
