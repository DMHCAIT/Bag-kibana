/**
 * Delhivery Shipping Integration
 * Handles order shipment creation and tracking
 */

const DELHIVERY_API_TOKEN = process.env.DELHIVERY_API_TOKEN || '';
const DELHIVERY_API_URL = process.env.DELHIVERY_API_URL || 'https://track.delhivery.com/api/cmu/create.json';

interface ShipmentAddress {
  name: string;
  add: string;
  city: string;
  pin: string;
  state: string;
  country: string;
  phone: string;
}

interface ShipmentItem {
  name: string;
  sku: string;
  units: number;
  selling_price: string;
  discount: string;
  tax: string;
  hsn: string;
}

interface CreateShipmentPayload {
  shipments: Array<{
    name: string;
    add: string;
    pin: string;
    city: string;
    state: string;
    country: string;
    phone: string;
    order: string;
    payment_mode: string;
    return_pin: string;
    return_city: string;
    return_phone: string;
    return_add: string;
    return_state: string;
    return_country: string;
    products_desc: string;
    hsn_code: string;
    cod_amount: string;
    order_date: string;
    total_amount: string;
    seller_add: string;
    seller_name: string;
    seller_inv: string;
    quantity: string;
    waybill: string;
    shipment_width: string;
    shipment_height: string;
    weight: string;
    seller_gst_tin: string;
    shipping_mode: string;
    address_type: string;
  }>;
}

interface DelhiveryResponse {
  success: boolean;
  waybill?: string;
  error?: string;
  packages?: Array<{
    waybill: string;
    status: string;
  }>;
}

/**
 * Create a shipment with Delhivery
 */
export async function createShipment(orderData: {
  orderId: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  items: Array<{
    name: string;
    sku: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  totalAmount: number;
  paymentMode: 'prepaid' | 'cod';
}): Promise<{ success: boolean; waybill?: string; error?: string }> {
  try {
    if (!DELHIVERY_API_TOKEN) {
      throw new Error('Delhivery API token not configured');
    }

    // Prepare shipment data
    const shipmentData: CreateShipmentPayload = {
      shipments: [
        {
          name: orderData.customerName,
          add: `${orderData.shippingAddress.addressLine1}${orderData.shippingAddress.addressLine2 ? ', ' + orderData.shippingAddress.addressLine2 : ''}`,
          pin: orderData.shippingAddress.postalCode,
          city: orderData.shippingAddress.city,
          state: orderData.shippingAddress.state,
          country: orderData.shippingAddress.country || 'India',
          phone: orderData.customerPhone,
          order: orderData.orderId,
          payment_mode: orderData.paymentMode === 'prepaid' ? 'Prepaid' : 'COD',
          
          // Return address (your business address)
          return_pin: '110001', // Update with your pickup pincode
          return_city: 'Delhi', // Update with your city
          return_phone: '+919876543210', // Update with your phone
          return_add: 'Your Business Address', // Update with your address
          return_state: 'Delhi', // Update with your state
          return_country: 'India',
          
          // Product details
          products_desc: orderData.items.map(item => item.name).join(', '),
          hsn_code: '4202', // HSN code for leather goods/bags
          cod_amount: orderData.paymentMode === 'cod' ? orderData.totalAmount.toString() : '0',
          order_date: new Date().toISOString().split('T')[0],
          total_amount: orderData.totalAmount.toString(),
          
          // Seller details
          seller_add: 'Your Business Address', // Update with your address
          seller_name: 'KIBANA',
          seller_inv: orderData.orderId,
          quantity: orderData.items.reduce((sum, item) => sum + item.quantity, 0).toString(),
          waybill: '', // Leave empty, Delhivery will generate
          
          // Package dimensions (in cm and kg)
          shipment_width: '30',
          shipment_height: '20',
          weight: '0.5', // Update based on actual product weight
          
          // Business details
          seller_gst_tin: 'YOUR_GST_NUMBER', // Update with your GST number
          shipping_mode: 'Surface',
          address_type: 'home',
        },
      ],
    };

    // Make API request
    const response = await fetch(DELHIVERY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${DELHIVERY_API_TOKEN}`,
      },
      body: JSON.stringify({
        format: 'json',
        data: JSON.stringify(shipmentData),
      }),
    });

    const result: DelhiveryResponse = await response.json();

    if (!response.ok || !result.success) {
      console.error('Delhivery shipment creation failed:', result);
      return {
        success: false,
        error: result.error || 'Failed to create shipment',
      };
    }

    console.log('✅ Delhivery shipment created:', result);

    return {
      success: true,
      waybill: result.waybill || result.packages?.[0]?.waybill,
    };
  } catch (error: any) {
    console.error('❌ Error creating Delhivery shipment:', error);
    return {
      success: false,
      error: error.message || 'Failed to create shipment',
    };
  }
}

/**
 * Track a shipment using waybill number
 */
export async function trackShipment(waybill: string): Promise<{
  success: boolean;
  trackingData?: any;
  error?: string;
}> {
  try {
    if (!DELHIVERY_API_TOKEN) {
      throw new Error('Delhivery API token not configured');
    }

    const response = await fetch(
      `https://track.delhivery.com/api/v1/packages/json/?waybill=${waybill}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Token ${DELHIVERY_API_TOKEN}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: 'Failed to track shipment',
      };
    }

    return {
      success: true,
      trackingData: result,
    };
  } catch (error: any) {
    console.error('❌ Error tracking shipment:', error);
    return {
      success: false,
      error: error.message || 'Failed to track shipment',
    };
  }
}

/**
 * Get serviceability for a pincode
 */
export async function checkServiceability(pincode: string): Promise<{
  serviceable: boolean;
  error?: string;
}> {
  try {
    if (!DELHIVERY_API_TOKEN) {
      throw new Error('Delhivery API token not configured');
    }

    const response = await fetch(
      `https://track.delhivery.com/c/api/pin-codes/json/?filter_codes=${pincode}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Token ${DELHIVERY_API_TOKEN}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok || !result.delivery_codes || result.delivery_codes.length === 0) {
      return {
        serviceable: false,
        error: 'Pincode not serviceable',
      };
    }

    return {
      serviceable: true,
    };
  } catch (error: any) {
    console.error('❌ Error checking serviceability:', error);
    return {
      serviceable: false,
      error: error.message || 'Failed to check serviceability',
    };
  }
}
