# 📱 WhatsApp & SMS Notifications Setup Guide

## Overview
Automated notifications for:
1. **Order Confirmations** - Instant WhatsApp + SMS when order is placed
2. **Cart Abandonment Reminders** - WhatsApp reminder after 30 minutes of cart inactivity

---

## 🔧 Setup Steps

### 1. Twilio Account Setup

1. **Sign up for Twilio** (if not already done)
   - Visit: https://www.twilio.com/try-twilio
   - Get $15 free trial credit

2. **Get Your Credentials**
   - Account SID: Found on dashboard
   - Auth Token: Found on dashboard
   - Phone Number: Get a Twilio number with SMS capabilities

3. **WhatsApp Setup**
   - Go to Messaging → Try it out → Send a WhatsApp message
   - Follow instructions to connect your Twilio WhatsApp sender
   - Join the sandbox: Send "join <your-sandbox-code>" to the Twilio WhatsApp number
   - For production: Apply for WhatsApp Business API approval

### 2. Environment Variables

Add to `.env.local`:

```env
# Twilio Credentials
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# Site URL for cart links
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### 3. Database Setup

Run the SQL migration to create the cart_reminders table:

```bash
# Navigate to your project
cd /Users/rubeenakhan/Desktop/Bag\ kibana/kibana-homepage

# Run the SQL file in Supabase SQL Editor
# File: supabase/create-cart-reminders-table.sql
```

Or manually execute in Supabase Dashboard → SQL Editor:

```sql
CREATE TABLE IF NOT EXISTS cart_reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  item_count INTEGER NOT NULL,
  cart_items JSONB DEFAULT '[]',
  cart_total DECIMAL(10,2) DEFAULT 0,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  reminder_sent BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'pending',
  sms_sent BOOLEAN DEFAULT FALSE,
  whatsapp_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cart_reminders_phone ON cart_reminders(customer_phone);
CREATE INDEX idx_cart_reminders_status ON cart_reminders(status);
CREATE INDEX idx_cart_reminders_sent ON cart_reminders(reminder_sent);
```

---

## 📨 Features Implemented

### ✅ Order Confirmation Notifications

**Triggers**: Automatically when order is placed (COD or Razorpay)

**WhatsApp Message**:
```
🎉 Order Confirmed!

Thank you [Name]! Your order has been confirmed.

📦 Order ID: ORDER-123
💰 Total: ₹2,999
🛍️ Items: 2x Leather Bag

📍 Delivery Address:
[Full Address]

We'll send you tracking details once your order ships.

Need help? Reply to this message or call us.

Thank you for shopping with KibanaLife! 🛍️
```

**SMS Message**:
```
KibanaLife: Order ORDER-123 confirmed! Total: ₹2,999. Items: 2x Leather Bag. Track at kibanalife.com/tracking
```

### ✅ Cart Abandonment Reminders

**Triggers**: 30 minutes after user adds items to cart without checking out

**WhatsApp Message**:
```
👋 Hi [Name]!

You left 2 item(s) in your cart:

🛍️ 2x Leather Bag
💰 Total: ₹2,999

🎁 Complete your order now and get 50% OFF automatically applied!

👉 Visit: kibanalife.com/cart

Limited time offer! Don't miss out.

- KibanaLife Team
```

**Implementation**:
- Hook triggers after 30 minutes of cart inactivity
- Only sends once per session
- Resets when cart is emptied

---

## 🔌 API Endpoints

### 1. Order Confirmation
**POST** `/api/notifications/order-confirmation`

**Request**:
```json
{
  "orderId": "ORDER-123",
  "customerName": "John Doe",
  "customerPhone": "+919876543210",
  "orderTotal": 2999,
  "items": [
    { "name": "Leather Bag", "quantity": 2 }
  ],
  "deliveryAddress": "123 Main St, Mumbai, Maharashtra - 400001"
}
```

**Response**:
```json
{
  "success": true,
  "whatsapp": { "sid": "SM..." },
  "sms": { "sid": "SM..." }
}
```

### 2. Cart Reminder
**POST** `/api/notifications/cart-reminder`

**Request**:
```json
{
  "userId": "user-uuid",
  "customerName": "John Doe",
  "customerPhone": "+919876543210",
  "itemCount": 2,
  "cartItems": [
    { "name": "Leather Bag", "quantity": 2, "price": 2999 }
  ],
  "cartTotal": 2999
}
```

---

## 🧪 Testing

### Test Order Confirmation:
```bash
curl -X POST http://localhost:3000/api/notifications/order-confirmation \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "TEST-001",
    "customerName": "Test User",
    "customerPhone": "+919876543210",
    "orderTotal": 2999,
    "items": [{"name": "Test Bag", "quantity": 1}],
    "deliveryAddress": "Test Address"
  }'
```

### Test Cart Reminder:
```bash
curl -X POST http://localhost:3000/api/notifications/cart-reminder \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Test User",
    "customerPhone": "+919876543210",
    "itemCount": 1,
    "cartItems": [{"name": "Test Bag", "quantity": 1, "price": 2999}],
    "cartTotal": 2999
  }'
```

---

## 📋 Configuration Checklist

- [ ] Twilio account created
- [ ] WhatsApp sandbox joined (for testing)
- [ ] Environment variables added to `.env.local`
- [ ] `cart_reminders` table created in Supabase
- [ ] Tested order confirmation notification
- [ ] Tested cart reminder notification
- [ ] Updated phone number format (+91XXXXXXXXXX)
- [ ] Applied for WhatsApp Business API (for production)

---

## 🚀 Going to Production

### WhatsApp Production Setup:
1. Apply for WhatsApp Business API through Twilio
2. Get message templates approved by WhatsApp
3. Update template names in code
4. Replace sandbox number with production number

### Message Templates (for WhatsApp approval):
**Template 1: Order Confirmation**
```
Name: order_confirmation
Category: TRANSACTIONAL

Your order {{1}} has been confirmed! Total: {{2}}. Items: {{3}}. 
Track at kibanalife.com/tracking
```

**Template 2: Cart Reminder**
```
Name: cart_reminder
Category: MARKETING

Hi {{1}}! You left {{2}} items in your cart. 
Complete checkout now for 50% OFF: kibanalife.com/cart
```

---

## 📊 Monitoring

Check notification logs in Supabase:

```sql
-- View all cart reminders
SELECT * FROM cart_reminders ORDER BY created_at DESC LIMIT 50;

-- Check success rate
SELECT 
  COUNT(*) as total,
  SUM(CASE WHEN whatsapp_sent THEN 1 ELSE 0 END) as whatsapp_success,
  SUM(CASE WHEN sms_sent THEN 1 ELSE 0 END) as sms_success
FROM cart_reminders;
```

---

## 🛠️ Troubleshooting

**WhatsApp not sending:**
- Verify sandbox is joined
- Check TWILIO_WHATSAPP_NUMBER format
- Ensure phone number includes country code (+91)

**SMS not sending:**
- Verify Twilio phone number has SMS capability
- Check account balance
- Verify phone number format

**Cart reminder not triggering:**
- Check browser console for errors
- Verify user has phone number in profile
- Check 30-minute timeout hasn't been cancelled

---

## 💡 Tips

1. **Phone Number Format**: Always use international format (+919876543210)
2. **Testing**: Use Twilio console to verify messages
3. **Costs**: Monitor Twilio usage to track costs
4. **Compliance**: Ensure users opt-in for marketing messages
5. **Rate Limits**: Twilio has rate limits, implement queuing for high volume

---

## 📞 Support

Need help? Contact:
- Twilio Support: https://support.twilio.com
- WhatsApp Business API: https://www.twilio.com/whatsapp

---

**Status**: ✅ Implementation Complete
**Last Updated**: December 20, 2025
