# 📦 Delhivery Shipping Integration

## Overview
This integration allows you to automatically create shipments and track orders using Delhivery's API.

## Setup Complete ✅
- ✅ API Token configured: `5848ef142112626abd97ef02cc7d5c66c3454563`
- ✅ Service file created: `lib/delhivery-service.ts`
- ✅ API endpoint created: `/api/shipping/delhivery`

## Configuration Required

### Update Business Details
Edit `lib/delhivery-service.ts` and update the following:

```typescript
// Line 105-112: Return/Pickup Address
return_pin: '110001',        // ⚠️ Update with your pickup pincode
return_city: 'Delhi',        // ⚠️ Update with your city
return_phone: '+919876543210', // ⚠️ Update with your phone
return_add: 'Your Business Address', // ⚠️ Update with your full address
return_state: 'Delhi',       // ⚠️ Update with your state

// Line 118-119: Seller Address
seller_add: 'Your Business Address', // ⚠️ Update

// Line 130: GST Number
seller_gst_tin: 'YOUR_GST_NUMBER', // ⚠️ Update with your actual GST
```

## API Endpoints

### 1. Create Shipment
**POST** `/api/shipping/delhivery`

**Request Body:**
```json
{
  "orderId": "ORDER-123",
  "customerName": "John Doe",
  "customerPhone": "+919876543210",
  "shippingAddress": {
    "addressLine1": "123 Main Street",
    "addressLine2": "Apartment 4B",
    "city": "Mumbai",
    "state": "Maharashtra",
    "postalCode": "400001",
    "country": "India"
  },
  "items": [
    {
      "name": "Leather Bag",
      "sku": "BAG-001",
      "quantity": 1,
      "price": 2999
    }
  ],
  "subtotal": 2999,
  "totalAmount": 2999,
  "paymentMode": "prepaid"
}
```

**Response:**
```json
{
  "success": true,
  "waybill": "DHL123456789",
  "message": "Shipment created successfully"
}
```

### 2. Track Shipment
**GET** `/api/shipping/delhivery?waybill=DHL123456789`

**Response:**
```json
{
  "success": true,
  "trackingData": {
    "waybill": "DHL123456789",
    "status": "In Transit",
    "scans": [...]
  }
}
```

### 3. Check Pincode Serviceability
**GET** `/api/shipping/delhivery?pincode=400001`

**Response:**
```json
{
  "serviceable": true
}
```

## Integration with Order System

### Automatic Shipment on Order Confirmation

Update `app/api/razorpay/verify-payment/route.ts`:

```typescript
import { createShipment } from '@/lib/delhivery-service';

// After order is created successfully
const shipmentResult = await createShipment({
  orderId: order.id,
  customerName: orderData.customer_name,
  customerPhone: orderData.customer_phone,
  shippingAddress: orderData.shipping_address,
  items: orderData.items,
  subtotal: orderData.subtotal,
  totalAmount: orderData.total,
  paymentMode: 'prepaid',
});

if (shipmentResult.success) {
  // Update order with waybill
  await supabaseAdmin
    .from('orders')
    .update({ 
      tracking_number: shipmentResult.waybill,
      shipment_status: 'created'
    })
    .eq('id', order.id);
}
```

## Testing

### 1. Test Pincode Serviceability
```bash
curl "https://yourdomain.com/api/shipping/delhivery?pincode=110001"
```

### 2. Test Shipment Creation
```bash
curl -X POST https://yourdomain.com/api/shipping/delhivery \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "TEST-001",
    "customerName": "Test Customer",
    "customerPhone": "+919876543210",
    "shippingAddress": {
      "addressLine1": "Test Address",
      "city": "Mumbai",
      "state": "Maharashtra",
      "postalCode": "400001",
      "country": "India"
    },
    "items": [{
      "name": "Test Product",
      "sku": "TEST-001",
      "quantity": 1,
      "price": 100
    }],
    "subtotal": 100,
    "totalAmount": 100,
    "paymentMode": "prepaid"
  }'
```

### 3. Test Tracking
```bash
curl "https://yourdomain.com/api/shipping/delhivery?waybill=YOUR_WAYBILL"
```

## Database Schema Updates

Add tracking fields to orders table:

```sql
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS tracking_number TEXT,
ADD COLUMN IF NOT EXISTS shipment_status TEXT,
ADD COLUMN IF NOT EXISTS courier_name TEXT DEFAULT 'Delhivery';

CREATE INDEX IF NOT EXISTS idx_orders_tracking ON orders(tracking_number);
```

## Admin Panel Integration

### Show Tracking in Order Details

Update `app/admin/orders/[id]/page.tsx`:

```tsx
{order.tracking_number && (
  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
    <h3 className="font-semibold text-blue-900 mb-2">Tracking Information</h3>
    <p className="text-sm text-blue-800">
      Waybill: <strong>{order.tracking_number}</strong>
    </p>
    <a
      href={`https://www.delhivery.com/track/package/${order.tracking_number}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 hover:underline text-sm"
    >
      Track on Delhivery →
    </a>
  </div>
)}
```

## Important Notes

### HSN Code
- Current HSN code: **4202** (Leather goods/bags)
- Update if selling different products

### Package Dimensions
Default dimensions in the service:
- Width: 30 cm
- Height: 20 cm  
- Weight: 0.5 kg

Update based on your actual products!

### Payment Modes
- **Prepaid**: Online payment already received
- **COD**: Cash on Delivery (Delhivery will collect)

### Return Address
Make sure to update your return/pickup address details in the service file. This is where failed deliveries will be returned.

## Production Checklist

- [ ] Update pickup address in `lib/delhivery-service.ts`
- [ ] Update GST number
- [ ] Update phone number for pickup
- [ ] Test with real pincode
- [ ] Test shipment creation
- [ ] Verify API token is in production environment variables
- [ ] Add tracking_number column to orders table
- [ ] Test order flow end-to-end

## Support

For Delhivery API issues:
- Documentation: https://developers.delhivery.com/
- Support: support@delhivery.com

## Environment Variables

Make sure these are set in production (Vercel):

```bash
DELHIVERY_API_TOKEN=5848ef142112626abd97ef02cc7d5c66c3454563
DELHIVERY_API_URL=https://track.delhivery.com/api/cmu/create.json
```
