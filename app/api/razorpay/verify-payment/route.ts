import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase';
import { emailService } from '@/lib/email-service';

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

    // Payment is verified - Save order to database
    const orderData = {
      id: razorpay_order_id,
      payment_id: razorpay_payment_id,
      customer_name: `${customerDetails.firstName} ${customerDetails.lastName}`,
      customer_email: customerDetails.email,
      customer_phone: customerDetails.phone,
      shipping_address: {
        full_name: `${customerDetails.firstName} ${customerDetails.lastName}`,
        address_line1: customerDetails.address,
        city: customerDetails.city,
        state: customerDetails.state,
        postal_code: customerDetails.pincode,
        country: 'India',
      },
      items: items.map((item: any) => ({
        product_id: item.product.id,
        product_name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        image: item.product.images?.[0],
      })),
      payment_method: 'razorpay',
      payment_status: 'paid',
      order_status: 'confirmed',
      subtotal: items.reduce((sum: number, item: any) => sum + (item.product.price * item.quantity), 0),
      shipping: 0, // Free shipping
      total: items.reduce((sum: number, item: any) => sum + (item.product.price * item.quantity), 0),
      created_at: new Date().toISOString(),
    };

    // Save order to database
    try {
      const { data: savedOrder, error: dbError } = await supabaseAdmin
        .from('orders')
        .insert({
          id: orderData.id,
          customer_name: orderData.customer_name,
          customer_email: orderData.customer_email,
          customer_phone: orderData.customer_phone,
          shipping_address: orderData.shipping_address,
          items: orderData.items,
          payment_method: orderData.payment_method,
          payment_status: orderData.payment_status,
          order_status: orderData.order_status,
          subtotal: orderData.subtotal,
          shipping: orderData.shipping,
          total: orderData.total,
          razorpay_payment_id: orderData.payment_id,
        })
        .select()
        .single();

      if (dbError) {
        console.error('Database error saving order:', dbError);
        // Continue even if database save fails (payment already captured)
      } else {
        console.log('Order saved to database:', savedOrder?.id);
        
        // Send order confirmation email (async, don't wait)
        emailService.sendOrderConfirmation({
          orderId: orderData.id,
          customerName: orderData.customer_name,
          customerEmail: orderData.customer_email,
          items: orderData.items,
          subtotal: orderData.subtotal,
          shipping: orderData.shipping,
          total: orderData.total,
          shippingAddress: orderData.shipping_address,
          orderStatus: orderData.order_status,
          paymentMethod: orderData.payment_method,
          orderDate: orderData.created_at,
        }).catch(err => console.error('Email send error:', err));
      }
    } catch (dbError) {
      console.error('Exception saving order to database:', dbError);
    }

    console.log('Order verified and created:', orderData);

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

