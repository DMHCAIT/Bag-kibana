# KIBANA E-Commerce - Cart & Payment Integration

This project now includes a complete shopping cart and Razorpay payment integration.

## 🛒 Features Implemented

### 1. Shopping Cart System
- ✅ Add to cart functionality on all product pages
- ✅ Cart context with React Context API
- ✅ LocalStorage persistence
- ✅ Cart icon with item count badge in header
- ✅ Full cart page with quantity management
- ✅ Remove items from cart
- ✅ Real-time subtotal calculation

### 2. Checkout Process
- ✅ Complete checkout form with validation
- ✅ Customer details collection (name, email, phone, address)
- ✅ Order summary display
- ✅ Form validation with error messages

### 3. Razorpay Payment Integration
- ✅ Razorpay order creation API
- ✅ Secure payment gateway integration
- ✅ Payment signature verification
- ✅ Order confirmation page
- ✅ Success/failure handling

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Razorpay

1. **Create Razorpay Account**:
   - Go to [https://dashboard.razorpay.com/signup](https://dashboard.razorpay.com/signup)
   - Sign up for a free account
   - Complete KYC verification (for live mode)

2. **Get API Keys**:
   - Login to [Razorpay Dashboard](https://dashboard.razorpay.com/)
   - Go to Settings → API Keys
   - Generate Test Keys (or Live Keys if verified)
   - You'll get:
     - **Key ID**: starts with `rzp_test_` or `rzp_live_`
     - **Key Secret**: Keep this secret!

3. **Configure Environment Variables**:
   - Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```
   
   - Edit `.env.local` and add your keys:
   ```env
   RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXXXXX
   RAZORPAY_KEY_SECRET=YYYYYYYYYYYYYYYY
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXXXXX
   ```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📱 Testing the Payment Flow

### Test Mode (Recommended for Development)

1. **Add Products to Cart**:
   - Browse products on homepage or shop page
   - Click "Add to Cart" button
   - See cart count update in header

2. **View Cart**:
   - Click cart icon in header
   - Adjust quantities or remove items
   - Click "Proceed to Checkout"

3. **Checkout**:
   - Fill in customer details
   - Click "Proceed to Payment"
   - Razorpay checkout modal will open

4. **Test Payment**:
   Use these Razorpay test cards:

   **Successful Payment:**
   - Card: `4111 1111 1111 1111`
   - CVV: Any 3 digits
   - Expiry: Any future date
   - Name: Any name

   **Failed Payment:**
   - Card: `4000 0000 0000 0002`
   - CVV: Any 3 digits
   - Expiry: Any future date

   **More test cards**: [Razorpay Test Cards](https://razorpay.com/docs/payments/payments/test-card-upi-details/)

5. **Order Confirmation**:
   - After successful payment, you'll be redirected to success page
   - Cart will be automatically cleared
   - Order ID will be displayed

## 🔐 Security Notes

- **Never commit `.env.local`** to git (already in `.gitignore`)
- Use **test keys** in development
- Use **live keys** only in production after KYC verification
- Payment signature verification is done server-side
- Customer data should be stored securely (currently not persisted)

## 🏗️ Project Structure

```
kibana-homepage/
├── app/
│   ├── api/
│   │   └── razorpay/
│   │       ├── create-order/
│   │       │   └── route.ts          # Create Razorpay order
│   │       └── verify-payment/
│   │           └── route.ts          # Verify payment signature
│   ├── cart/
│   │   └── page.tsx                  # Shopping cart page
│   ├── checkout/
│   │   └── page.tsx                  # Checkout form
│   ├── order-success/
│   │   └── page.tsx                  # Order confirmation
│   └── layout.tsx                    # Wrapped with CartProvider
├── contexts/
│   └── CartContext.tsx               # Cart state management
├── lib/
│   └── types/
│       └── cart.ts                   # TypeScript interfaces
├── components/
│   ├── Header.tsx                    # Header with cart icon
│   ├── NewCollectionCarousel.tsx     # With add to cart
│   └── BestsellersSection.tsx        # With add to cart
└── .env.local                        # Environment variables (not in git)
```

## 🎨 Cart Features

- **Persistent Cart**: Cart data saved in localStorage
- **Real-time Updates**: Cart count updates immediately
- **Quantity Management**: Increase/decrease quantities
- **Color Selection**: Store selected color variant
- **Price Calculation**: Auto-calculate subtotals
- **Responsive Design**: Works on mobile and desktop

## 💳 Payment Features

- **Secure Gateway**: Razorpay PCI DSS compliant
- **Multiple Payment Methods**: Cards, UPI, Netbanking, Wallets
- **Signature Verification**: Server-side security
- **Order Tracking**: Unique order ID generation
- **Success Handling**: Automatic cart clearing
- **Error Handling**: Failed payment management

## 🔄 Next Steps

### For Production Deployment:

1. **Database Integration**:
   - Store orders in database (MongoDB, PostgreSQL, etc.)
   - Save customer information
   - Track order status

2. **Email Notifications**:
   - Order confirmation emails
   - Shipping updates
   - Invoice generation

3. **Admin Dashboard**:
   - View orders
   - Update order status
   - Manage products

4. **Enhanced Features**:
   - Wishlist functionality
   - User authentication
   - Order history
   - Product reviews
   - Discount coupons

5. **Go Live**:
   - Complete Razorpay KYC
   - Switch to live API keys
   - Configure webhooks for order updates
   - Set up proper error logging

## 📞 Support

For Razorpay integration issues:
- [Razorpay Documentation](https://razorpay.com/docs/)
- [Razorpay Support](https://razorpay.com/support/)

For project issues:
- Check console for error messages
- Verify environment variables
- Ensure all dependencies are installed

## 🎉 Testing Checklist

- [ ] Add product to cart
- [ ] Update cart quantities
- [ ] Remove items from cart
- [ ] Cart persists on page reload
- [ ] Checkout form validation works
- [ ] Payment modal opens correctly
- [ ] Test successful payment
- [ ] Test failed payment
- [ ] Order success page displays
- [ ] Cart clears after purchase
- [ ] All responsive layouts work

---

**Important**: This is a demo implementation. For production use, implement proper database storage, user authentication, and follow security best practices.
