# 📱 WhatsApp & SMS Notifications Setup Guide

## Overview
Automated notifications system for:
- ✅ Order confirmation (SMS + WhatsApp)
- ✅ Cart abandonment reminders (SMS + WhatsApp)

## 🚀 Setup Instructions

### 1. Twilio Account Setup

1. **Sign up for Twilio**: https://www.twilio.com/try-twilio
2. **Get your credentials**:
   - Account SID
   - Auth Token
   - Phone Number (for SMS)
   - WhatsApp Number (optional, for WhatsApp)

### 2. Environment Variables

Add to your `.env.local`:

```env
# Twilio Configuration
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890  # Your Twilio phone number
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886  # Twilio WhatsApp Sandbox or your approved number

# Site URL for cart links
NEXT_PUBLIC_SITE_URL=https://kibanalife.com
```

### 3. Twilio WhatsApp Sandbox Setup (For Testing)

**For production, you need WhatsApp Business API approval. For testing:**

1. Go to Twilio Console → Messaging → Try it out → Try WhatsApp
2. Join the sandbox by sending the code to the sandbox number
3. Use the sandbox number: `whatsapp:+14155238886`

**For production:**
- Apply for WhatsApp Business API: https://www.twilio.com/whatsapp
- Get your sender approved
- Replace `TWILIO_WHATSAPP_NUMBER` with your approved sender

### 4. Database Setup

Run the migration to create the `cart_reminders` table:

```bash
# Execute the SQL file in Supabase SQL Editor
supabase/create-cart-reminders-table.sql
```

Or run directly in Supabase SQL Editor:

```sql
CREATE TABLE IF NOT EXISTS cart_reminders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_name TEXT,
  customer_phone TEXT NOT NULL,
  item_count INTEGER NOT NULL,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'pending',
  sms_sent BOOLEAN DEFAULT false,
  whatsapp_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 5. Install Dependencies

The required package is already in your project:

```bash
npm install twilio
```

## 📨 Features Implemented

### Order Confirmation Notifications

**Triggers**: After successful payment verification

**Sends**:
1. **SMS**: Brief order confirmation with order ID and tracking link
2. **WhatsApp**: Detailed order summary with items, address, and tracking link

**Example SMS**:
```
Hi John Doe! 🎉

Your order #ORDER-123 has been confirmed!

Total: ₹2,999

Track your order: https://kibanalife.com/order-tracking

Thank you for shopping with KibanaLife!
```

**Example WhatsApp**:
```
🎉 *Order Confirmed!*

Hi John Doe,

Your order has been successfully placed!

*Order ID:* ORDER-123

*Items:*
1. VISTARA TOTE - Black (Qty: 1) - ₹2,999

*Total Amount:* ₹2,999

*Shipping to:*
123 Main Street, Mumbai, Maharashtra - 400001

We'll notify you once your order is shipped.

*Track your order:*
https://kibanalife.com/order-tracking

Thank you for choosing KibanaLife! 🛍️
```

### Cart Abandonment Reminders

**Triggers**: 30 minutes after user adds items to cart (no checkout)

**Sends**:
1. **SMS**: Short reminder with cart link and discount
2. **WhatsApp**: Friendly reminder with item count and special offer

**Example SMS**:
```
Hi John! You have 3 items in your cart. 🛒

Get 50% OFF now! Complete your order: https://kibanalife.com/cart

- KibanaLife
```

**Example WhatsApp**:
```
Hi John! 👋

🛒 You left 3 items in your cart.

🎁 *Special Offer: 50% OFF* on all products!

Complete your purchase now:
https://kibanalife.com/cart

⏰ Hurry! This offer won't last long.

- KibanaLife Team
```

## 🔧 Implementation Details

### Files Created/Modified

1. **lib/notification-service.ts** - Core notification service
   - `sendOrderConfirmationSMS()`
   - `sendOrderConfirmationWhatsApp()`
   - `sendCartReminderSMS()`
   - `sendCartReminderWhatsApp()`

2. **app/api/notifications/cart-reminder/route.ts** - Cart reminder API endpoint

3. **hooks/useCartReminder.ts** - React hook for cart abandonment detection

4. **components/CartReminderProvider.tsx** - Provider component

5. **app/api/razorpay/verify-payment/route.ts** - Updated with notification calls

6. **app/layout.tsx** - Integrated CartReminderProvider

7. **supabase/create-cart-reminders-table.sql** - Database migration

## 🧪 Testing

### Test Order Confirmation

1. Complete a test order
2. Check console logs for notification status
3. Verify SMS/WhatsApp received

### Test Cart Reminder

1. Add items to cart
2. Wait 30 minutes (or reduce timeout in `useCartReminder.ts` for testing)
3. Check for reminder notification

**Quick Test** (modify `useCartReminder.ts` temporarily):
```typescript
// Change from 30 minutes to 1 minute
setTimeout(async () => {
  // ...
}, 1 * 60 * 1000); // 1 minute for testing
```

## 📊 Monitoring

### View Cart Reminder Logs

Query the database:

```sql
SELECT * FROM cart_reminders 
ORDER BY sent_at DESC 
LIMIT 20;
```

### Check Success Rate

```sql
SELECT 
  status,
  COUNT(*) as count,
  SUM(CASE WHEN sms_sent THEN 1 ELSE 0 END) as sms_success,
  SUM(CASE WHEN whatsapp_sent THEN 1 ELSE 0 END) as whatsapp_success
FROM cart_reminders
WHERE sent_at > NOW() - INTERVAL '7 days'
GROUP BY status;
```

## 🚨 Troubleshooting

### SMS Not Sending

1. **Check Twilio credentials** in `.env.local`
2. **Verify phone number format**: Should be E.164 format (+919876543210)
3. **Check Twilio account balance**
4. **Review console logs** for error messages

### WhatsApp Not Sending

1. **For testing**: Ensure sandbox is joined
2. **For production**: Verify WhatsApp sender is approved
3. **Check WhatsApp number format**: `whatsapp:+919876543210`
4. **Review Twilio WhatsApp logs**

### Cart Reminders Not Triggering

1. **Verify user is logged in** (required for cart reminders)
2. **Check user has phone number** in profile
3. **Ensure CartReminderProvider is in layout**
4. **Review browser console** for errors

## 💰 Pricing (Twilio)

**SMS**:
- India: ~$0.0065 per message
- International: Varies by country

**WhatsApp**:
- First 1,000 conversations/month: Free
- User-initiated: Free
- Business-initiated: ~$0.005-0.03 per message

**Recommendations**:
- Start with Twilio trial ($15-20 credit)
- Monitor usage in Twilio console
- Set up billing alerts
- Consider WhatsApp for cost-effective notifications

## 📝 Customization

### Change Reminder Timing

Edit `hooks/useCartReminder.ts`:

```typescript
// Current: 30 minutes
setTimeout(async () => {
  // ...
}, 30 * 60 * 1000);

// Change to 1 hour:
setTimeout(async () => {
  // ...
}, 60 * 60 * 1000);
```

### Customize Message Templates

Edit `lib/notification-service.ts` to change message content:

```typescript
const message = `Your custom message here...`;
```

### Add More Notification Types

Follow the pattern in `notification-service.ts`:
1. Create new function
2. Format message
3. Call Twilio API
4. Return success/failure

## 🔐 Security Notes

- Never commit `.env.local` to version control
- Use Twilio's test credentials for development
- Implement rate limiting for production
- Validate phone numbers before sending
- Log all notification attempts for auditing

## ✅ Checklist

- [ ] Twilio account created
- [ ] Environment variables added
- [ ] WhatsApp sandbox joined (for testing)
- [ ] Database migration run
- [ ] Dependencies installed
- [ ] Test order placed
- [ ] SMS received
- [ ] WhatsApp received
- [ ] Cart reminder tested
- [ ] Production WhatsApp approved (when ready)

## 📞 Support

For issues:
1. Check Twilio logs: https://console.twilio.com/
2. Review application logs
3. Contact Twilio support for delivery issues
4. Check phone number validity: https://www.twilio.com/lookup

---

**Status**: ✅ Ready for testing
**Last Updated**: December 17, 2025
