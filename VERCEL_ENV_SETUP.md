# Adding Environment Variables to Vercel

Your build is failing because Razorpay API keys are not configured. Follow these steps:

## Step 1: Get Your Razorpay API Keys

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Sign up or log in
3. Go to **Settings** → **API Keys**
4. Generate API keys (use **Test Mode** for testing)
5. Copy both:
   - **Key ID** (starts with `rzp_test_` or `rzp_live_`)
   - **Key Secret**

## Step 2: Add Environment Variables to Vercel

### Option A: Through Vercel Dashboard (Recommended)

1. Go to your Vercel project: https://vercel.com/dmhcait/bag-kibana
2. Click **Settings** → **Environment Variables**
3. Add these two variables:

   **Variable 1:**
   - Name: `RAZORPAY_KEY_ID`
   - Value: `rzp_test_XXXXXXXXXXX` (your key ID)
   - Environment: Select all (Production, Preview, Development)

   **Variable 2:**
   - Name: `RAZORPAY_KEY_SECRET`
   - Value: `XXXXXXXXXXX` (your key secret)
   - Environment: Select all (Production, Preview, Development)

4. Click **Save**

### Option B: Through Vercel CLI

```bash
vercel env add RAZORPAY_KEY_ID
# Paste your key ID when prompted

vercel env add RAZORPAY_KEY_SECRET
# Paste your key secret when prompted
```

## Step 3: Redeploy

After adding environment variables, redeploy:

1. Go to **Deployments** tab
2. Click on the latest failed deployment
3. Click **Redeploy**

OR trigger a new deployment:
```bash
git commit --allow-empty -m "Trigger redeploy"
git push origin main
```

## Step 4: Verify

Once deployed successfully:
1. Visit your site
2. Add items to cart
3. Go to checkout
4. Test payment with Razorpay test card:
   - Card: `4111 1111 1111 1111`
   - CVV: Any 3 digits
   - Expiry: Any future date

---

## For Local Development

Create a `.env.local` file:
```bash
RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXX
RAZORPAY_KEY_SECRET=XXXXXXXXXXX
```

Never commit `.env.local` to git (it's already in `.gitignore`).

---

## Test vs Live Keys

- **Test Mode** (`rzp_test_`): For development/testing
- **Live Mode** (`rzp_live_`): For production (requires KYC verification)

Start with test keys, then switch to live keys when you're ready to go live.
