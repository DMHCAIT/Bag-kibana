import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      customerDetails,
      items,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing payment verification parameters' },
        { status: 400 }
      );
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keySecret) {
      console.error('Razorpay key secret not found');
      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 500 }
      );
    }

    // Verify signature
    const body_string = razorpay_order_id + '|' + razorpay_payment_id;
    const expected_signature = crypto
      .createHmac('sha256', keySecret)
      .update(body_string)
      .digest('hex');

    const isAuthentic = expected_signature === razorpay_signature;

    if (!isAuthentic) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      );
    }

    // Payment is verified - You can save order to database here
    const orderData = {
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
      customer_name: `${customerDetails.firstName} ${customerDetails.lastName}`,
      customer_email: customerDetails.email,
      customer_phone: customerDetails.phone,
      shipping_address: {
        address: customerDetails.address,
        city: customerDetails.city,
        state: customerDetails.state,
        pincode: customerDetails.pincode,
      },
      items: items.map((item: any) => ({
        product_id: item.product.id,
        product_name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      })),
      payment_method: 'razorpay',
      payment_status: 'paid',
      order_status: 'confirmed',
      created_at: new Date().toISOString(),
    };

    console.log('Order verified and created:', orderData);

    // TODO: Save to database
    // await saveOrderToDatabase(orderData);

    return NextResponse.json({
      success: true,
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
    });
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: error.message || 'Payment verification failed' },
      { status: 500 }
    );
  }
}

