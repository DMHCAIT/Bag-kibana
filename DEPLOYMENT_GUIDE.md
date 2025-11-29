# 🚀 KIBANA E-Commerce - Deployment Guide

## Prerequisites Checklist

Before deploying, ensure you have:
- ✅ Razorpay account with API keys
- ✅ Domain name (optional but recommended)
- ✅ Product images ready to upload
- ✅ All environment variables configured

---

## 📋 Step-by-Step Deployment Process

### 1. **Set Up Razorpay Account** (REQUIRED for payments)

1. **Sign up for Razorpay:**
   - Go to https://dashboard.razorpay.com/signup
   - Complete verification (business/individual)
   - Get your account activated

2. **Get API Keys:**
   ```
   Dashboard → Settings → API Keys → Generate Keys
   ```
   - Copy `Key ID` (starts with `rzp_live_` for production)
   - Copy `Key Secret`

3. **Update `.env.local`:**
   ```env
   RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXXXXX
   RAZORPAY_KEY_SECRET=your_secret_key_here
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXXXXX
   ```

4. **Configure Razorpay Webhook (for production):**
   - Go to Dashboard → Webhooks
   - Add webhook URL: `https://yourdomain.com/api/razorpay/webhook`
   - Select events: `payment.captured`, `payment.failed`, `order.paid`

---

### 2. **Prepare Your Code for Production**

#### A. Add Product Images

Currently using placeholder images. You need to:

1. **Prepare images:**
   - Format: JPG/PNG/WebP
   - Size: 1200x1600px recommended (3:4 aspect ratio)
   - Compress images (use TinyPNG or similar)
   - Name consistently: `product-name-color-1.jpg`, etc.

2. **Option 1: Use Cloudinary (Recommended)**
   ```bash
   npm install cloudinary
   ```
   
3. **Option 2: Use Vercel Blob Storage**
   ```bash
   npm install @vercel/blob
   ```

4. **Option 3: Store in `/public/images/products/`**
   - Create folder structure
   - Update image paths in `products-data.ts`

#### B. Build and Test Locally

```bash
# Build for production
npm run build

# Test production build locally
npm run start
```

Fix any build errors that appear.

---

### 3. **Choose Hosting Platform**

### **Option A: Vercel (Recommended - Easiest)**

Vercel is made by Next.js creators and offers best performance:

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   cd "/Users/rubeenakhan/Desktop/Bag kibana/kibana-homepage"
   vercel
   ```

3. **Follow prompts:**
   - Link to your account
   - Set project name: `kibana-handbags`
   - Select framework: Next.js (auto-detected)
   - Deploy!

4. **Add Environment Variables:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add:
     - `RAZORPAY_KEY_ID`
     - `RAZORPAY_KEY_SECRET`
     - `NEXT_PUBLIC_RAZORPAY_KEY_ID`

5. **Redeploy after adding env vars:**
   ```bash
   vercel --prod
   ```

**Free Tier Includes:**
- Automatic SSL certificate
- Global CDN
- Unlimited bandwidth
- Custom domain support

---

### **Option B: Netlify**

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build and Deploy:**
   ```bash
   npm run build
   netlify deploy --prod
   ```

3. **Add Environment Variables:**
   - Netlify Dashboard → Site Settings → Environment Variables
   - Add Razorpay keys

---

### **Option C: Traditional VPS (DigitalOcean, AWS, etc.)**

1. **Set up server:**
   ```bash
   # Install Node.js 18+
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2 for process management
   npm install -g pm2
   ```

2. **Clone/Upload your code:**
   ```bash
   git clone your-repo-url
   cd kibana-homepage
   npm install
   npm run build
   ```

3. **Set environment variables:**
   ```bash
   nano .env.local
   # Add your Razorpay keys
   ```

4. **Start with PM2:**
   ```bash
   pm2 start npm --name "kibana" -- start
   pm2 save
   pm2 startup
   ```

5. **Set up Nginx reverse proxy:**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

6. **Get SSL certificate:**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

---

### 4. **Set Up Domain (Optional)**

#### If using Vercel:
1. Buy domain from Namecheap, GoDaddy, etc.
2. In Vercel Dashboard → Your Project → Settings → Domains
3. Add your domain
4. Update DNS records as instructed

#### If using VPS:
1. Point A record to your server IP
2. Wait for DNS propagation (up to 48 hours)

---

### 5. **Post-Deployment Checklist**

#### Test Everything:

- [ ] Homepage loads correctly
- [ ] All navigation links work
- [ ] Product pages display properly
- [ ] Add to Cart functionality works
- [ ] Cart page shows items
- [ ] Checkout form validates properly
- [ ] **Razorpay payment modal opens**
- [ ] **Test payment with Razorpay test cards**
- [ ] Payment success page displays
- [ ] Order confirmation works
- [ ] Mobile responsive design works
- [ ] All collection pages load
- [ ] Search functionality (if implemented)

#### Security:

- [ ] Environment variables are set (not in code)
- [ ] `.env.local` is in `.gitignore`
- [ ] HTTPS is enabled
- [ ] Razorpay webhook signature verification works

#### Performance:

- [ ] Run Lighthouse audit (aim for 90+ score)
- [ ] Images are optimized
- [ ] Page load time < 3 seconds

---

### 6. **Set Up Analytics (Recommended)**

#### Google Analytics:
```bash
npm install @next/third-parties
```

Add to `app/layout.tsx`:
```typescript
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
      <GoogleAnalytics gaId="G-XXXXXXXXXX" />
    </html>
  )
}
```

#### Or use Vercel Analytics:
```bash
npm install @vercel/analytics
```

---

### 7. **Database Integration (Future Enhancement)**

Currently, orders are only stored client-side. For production, add:

#### Option 1: Supabase (Free tier available)
```bash
npm install @supabase/supabase-js
```

#### Option 2: MongoDB Atlas (Free tier available)
```bash
npm install mongodb mongoose
```

#### Option 3: PostgreSQL with Prisma
```bash
npm install @prisma/client
npm install -D prisma
```

---

## 🔧 Quick Commands Reference

```bash
# Local development
npm run dev

# Build for production
npm run build

# Test production build
npm run start

# Deploy to Vercel
vercel --prod

# Check build errors
npm run build 2>&1 | tee build.log
```

---

## 🆘 Troubleshooting

### Build fails:
```bash
# Clear cache and rebuild
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

### Environment variables not working:
- Make sure they're added in hosting platform dashboard
- Redeploy after adding variables
- Check variable names match exactly

### Payment not working:
- Verify Razorpay keys are LIVE keys (rzp_live_)
- Check webhook URL is correct
- Verify account is activated

### Images not loading:
- Check image paths
- Ensure images are in `/public` folder
- Use proper Next.js Image component

---

## 📊 Recommended Next Steps After Launch

1. **Set up backup system** for orders/data
2. **Implement email notifications** (SendGrid, Mailgun)
3. **Add user authentication** (NextAuth.js)
4. **Set up monitoring** (Sentry for errors)
5. **Implement order tracking**
6. **Add admin dashboard**
7. **Set up automated testing**

---

## 💰 Cost Estimates

### Free Tier (Good for starting):
- **Hosting:** Vercel Free (Hobby Plan)
- **Database:** Supabase Free (500MB)
- **Analytics:** Google Analytics Free
- **Images:** Vercel Blob Free (up to 1GB)
- **Razorpay:** No setup fees, only transaction fees

### Paid (For scaling):
- **Vercel Pro:** $20/month (better performance)
- **Cloudinary:** $89/month (image optimization)
- **Database:** $25-50/month
- **Domain:** $10-15/year

---

## 📞 Support Resources

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Razorpay Docs:** https://razorpay.com/docs
- **Razorpay Support:** support@razorpay.com

---

## 🎉 You're Ready to Launch!

Start with Vercel for easiest deployment, then optimize as you grow.

**Estimated deployment time:** 30-60 minutes (first time)
