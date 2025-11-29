# 🚀 Quick Deployment - KIBANA E-Commerce

## Fastest Way to Deploy (5 Minutes)

### Step 1: Get Razorpay Keys (2 minutes)

1. Go to https://dashboard.razorpay.com/signup
2. Sign up and verify your account
3. Go to Settings → API Keys → Generate Keys
4. Copy both keys (Key ID and Secret)

### Step 2: Update Environment Variables (1 minute)

Open `.env.local` and replace with YOUR keys:

```env
RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXXXXX
RAZORPAY_KEY_SECRET=YOUR_SECRET_HERE
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXXXXX
```

**Note:** Use `rzp_test_` keys for testing, `rzp_live_` for production

### Step 3: Deploy to Vercel (2 minutes)

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to project
cd "/Users/rubeenakhan/Desktop/Bag kibana/kibana-homepage"

# Deploy
vercel
```

Follow the prompts:
- Login/Signup to Vercel
- Project name: `kibana-handbags`
- Framework: Next.js (auto-detected)
- Deploy!

### Step 4: Add Environment Variables in Vercel

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add these 3 variables:
   - `RAZORPAY_KEY_ID` = your key
   - `RAZORPAY_KEY_SECRET` = your secret
   - `NEXT_PUBLIC_RAZORPAY_KEY_ID` = your key (same as first)

### Step 5: Redeploy

```bash
vercel --prod
```

## ✅ Done! Your site is live!

Visit the URL Vercel gives you (something like: `kibana-handbags.vercel.app`)

---

## Test Checklist

After deployment, test:

- [ ] Homepage loads
- [ ] Add items to cart
- [ ] View cart
- [ ] Go to checkout
- [ ] Fill checkout form
- [ ] Click "Proceed to Payment"
- [ ] Razorpay modal appears
- [ ] Use test card: `4111 1111 1111 1111`
- [ ] Complete payment
- [ ] See order success page

---

## Common Issues & Fixes

### Payment modal doesn't open
- Check environment variables are added in Vercel
- Redeploy after adding variables
- Verify Razorpay keys are correct

### Build fails
```bash
npm run build
```
Fix any errors shown, then redeploy.

### Images not showing
- Images are placeholders currently
- You'll need to add real product images later

---

## Next Steps

1. **Add Real Product Images**
   - Upload to `/public/images/products/`
   - Or use Cloudinary/Vercel Blob

2. **Add Custom Domain** (optional)
   - Buy domain (Namecheap, GoDaddy)
   - Add in Vercel: Settings → Domains

3. **Set Up Database** (for storing orders)
   - Supabase (free tier)
   - Or MongoDB Atlas (free tier)

4. **Add Email Notifications**
   - SendGrid or Mailgun
   - For order confirmations

---

## Cost Summary

### Free (Good for starting):
- ✅ Vercel Hosting (Free Hobby Plan)
- ✅ Razorpay (No fees, only transaction charges)
- ✅ SSL Certificate (Auto-included)

### Paid (When you grow):
- Domain: $10-15/year
- Vercel Pro: $20/month (optional)
- Database: $0-25/month

---

## Support

- **Vercel Issues:** https://vercel.com/support
- **Razorpay Issues:** support@razorpay.com
- **Build Errors:** Run `npm run build` locally first

---

**Total Time: ~5-10 minutes** ⚡

Your site will be live at: `https://your-project-name.vercel.app`
