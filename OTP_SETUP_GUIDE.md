# Real OTP Implementation Setup Guide

## Current Status
✅ **API endpoints created**: `/api/auth/send-otp` and `/api/auth/verify-otp`
✅ **AuthContext updated**: Now uses API calls instead of local simulation
✅ **Development mode**: Shows OTP in console/alert for testing
⚠️ **Production SMS**: Requires SMS service provider setup

## SMS Service Provider Options

### 1. MSG91 (Recommended for India)
**Best for Indian mobile numbers with competitive pricing**

1. **Sign up**: https://msg91.com/
2. **Get API credentials**:
   - API Key
   - Template ID (for OTP messages)
3. **Add environment variables**:
   ```bash
   MSG91_API_KEY=your_api_key_here
   MSG91_TEMPLATE_ID=your_template_id_here
   ```
4. **Uncomment MSG91 code in `/app/api/auth/send-otp/route.ts`**

**Pricing**: ₹0.15-0.25 per SMS

### 2. Twilio (Global)
**Most popular, reliable worldwide**

1. **Sign up**: https://www.twilio.com/
2. **Get credentials**:
   - Account SID
   - Auth Token  
   - Phone Number
3. **Install package**:
   ```bash
   npm install twilio
   ```
4. **Add environment variables**:
   ```bash
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_number
   ```
5. **Uncomment Twilio code in `/app/api/auth/send-otp/route.ts`**

**Pricing**: $0.0075 per SMS (~₹0.60)

### 3. AWS SNS
**If already using AWS infrastructure**

1. **Setup AWS credentials**
2. **Install AWS SDK**:
   ```bash
   npm install @aws-sdk/client-sns
   ```
3. **Add environment variables**:
   ```bash
   AWS_ACCESS_KEY_ID=your_key
   AWS_SECRET_ACCESS_KEY=your_secret
   AWS_REGION=ap-south-1
   ```

### 4. Firebase Auth (Phone Auth)
**Google's solution with built-in verification**

1. **Setup Firebase project**
2. **Enable Phone Authentication**
3. **Install Firebase SDK**:
   ```bash
   npm install firebase
   ```

## Quick Setup for Testing (MSG91)

1. **Register at MSG91**: https://msg91.com/
2. **Create OTP template**:
   - Template: "Your KIBANA OTP is ##OTP##. Valid for 5 minutes."
   - Get Template ID
3. **Add credentials to Vercel**:
   ```bash
   vercel env add MSG91_API_KEY
   vercel env add MSG91_TEMPLATE_ID
   ```
4. **Uncomment MSG91 code** in `/app/api/auth/send-otp/route.ts`:
   ```javascript
   const response = await fetch('https://api.msg91.com/api/v5/otp', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'authkey': process.env.MSG91_API_KEY
     },
     body: JSON.stringify({
       template_id: process.env.MSG91_TEMPLATE_ID,
       mobile: phone,
       authkey: process.env.MSG91_API_KEY,
       otp: otp
     })
   });
   ```

## Production Considerations

### 1. Rate Limiting
Add rate limiting to prevent OTP abuse:
```javascript
// In send-otp/route.ts - add rate limiting by IP/phone
const rateLimitKey = `otp_${req.ip || 'unknown'}_${phone}`;
// Implement Redis-based rate limiting
```

### 2. OTP Storage
Replace in-memory storage with Redis:
```bash
npm install redis
```

### 3. Security
- Use HTTPS only
- Implement IP rate limiting  
- Add phone number verification
- Log suspicious activities

### 4. Monitoring
- Track OTP success/failure rates
- Monitor SMS delivery status
- Set up alerts for high failure rates

## Environment Variables to Add

```bash
# For MSG91 (Recommended for India)
MSG91_API_KEY=your_msg91_api_key
MSG91_TEMPLATE_ID=your_template_id

# For Twilio (Global)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_twilio_number

# For production (Redis cache)
REDIS_URL=your_redis_connection_string
```

## Testing

1. **Development**: OTP shows in console/alert
2. **Staging**: Use MSG91 test credentials
3. **Production**: Full SMS service with monitoring

## Cost Estimation

For 1000 OTP SMS per month:
- **MSG91**: ₹150-250
- **Twilio**: ₹600-750  
- **AWS SNS**: ₹400-500

Choose MSG91 for the best cost-effectiveness in India.