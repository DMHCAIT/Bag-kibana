import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase';
import { emailService } from '@/lib/email-service';
import { sendOrderConfirmationNotifications } from '@/lib/notification-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      customerDetails,
      items,
      discountedTotal,
      discountAmount,
      shippingAddress,
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

    // Payment is verified - use discounted prices sent from checkout
    const subtotal = discountedTotal || items.reduce((sum: number, item: any) => sum + (Math.round(item.product.price * 0.7) * item.quantity), 0);
    const discount = discountAmount || Math.round(items.reduce((sum: number, item: any) => sum + (item.product.price * item.quantity), 0) * 0.3);

    const address = shippingAddress || {
      full_name: `${customerDetails.firstName} ${customerDetails.lastName}`,
      phone: customerDetails.phone,
      address_line1: customerDetails.address,
      city: customerDetails.city,
      state: customerDetails.state,
      postal_code: customerDetails.pincode,
      country: 'India',
    };

    const orderData = {
      customer_name: `${customerDetails.firstName} ${customerDetails.lastName}`,
      customer_email: customerDetails.email,
      customer_phone: customerDetails.phone,
      shipping_address: address,
      billing_address: address,
      items: items.map((item: any) => ({
        product_id: item.product.id,
        product_name: item.product.name,
        name: `${item.product.name} - ${item.product.color}`,
        color: item.product.color,
        quantity: item.quantity,
        price: Math.round(item.product.price * 0.7),
        image: item.product.images?.[0],
      })),
      payment_method: 'razorpay',
      payment_status: 'paid',
      payment_id: razorpay_payment_id,
      order_status: 'confirmed',
      subtotal: subtotal,
      shipping_fee: 0,
      total: subtotal,
      razorpay_payment_id: razorpay_payment_id,
      created_at: new Date().toISOString(),
    };

    // Save order to database
    let savedOrderId = razorpay_order_id;
    try {
      const { data: savedOrder, error: dbError } = await supabaseAdmin
        .from('orders')
        .insert({
          customer_name: orderData.customer_name,
          customer_email: orderData.customer_email,
          customer_phone: orderData.customer_phone,
          shipping_address: orderData.shipping_address,
          billing_address: orderData.billing_address,
          items: orderData.items,
          payment_method: orderData.payment_method,
          payment_status: orderData.payment_status,
          payment_id: orderData.payment_id,
          order_status: orderData.order_status,
          subtotal: orderData.subtotal,
          shipping_fee: 0,
          total: orderData.total,
        })
        .select()
        .single();

      if (dbError) {
        console.error('Database error saving order:', dbError);
      } else if (savedOrder) {
        savedOrderId = savedOrder.id;
        console.log('Order saved to database:', savedOrder.id);
        
        // Send order confirmation email (async, don't wait)
        emailService.sendOrderConfirmation({
          orderId: savedOrder.id,
          customerName: orderData.customer_name,
          customerEmail: orderData.customer_email,
          items: orderData.items,
          subtotal: orderData.subtotal,
          shipping: 0,
          total: orderData.total,
          shippingAddress: orderData.shipping_address,
          orderStatus: orderData.order_status,
          paymentMethod: orderData.payment_method,
          orderDate: orderData.created_at,
        }).catch(err => console.error('Email send error:', err));

        // Send SMS and WhatsApp notifications (async, don't wait)
        sendOrderConfirmationNotifications({
          orderId: savedOrder.id,
          customerName: orderData.customer_name,
          customerPhone: orderData.customer_phone,
          totalAmount: orderData.total,
          items: orderData.items.map((item: any) => ({
            name: item.product_name || item.name,
            quantity: item.quantity,
            price: item.price
          })),
          shippingAddress: `${orderData.shipping_address.address_line1}, ${orderData.shipping_address.city}, ${orderData.shipping_address.state} - ${orderData.shipping_address.postal_code}`
        }).catch(err => console.error('Notification send error:', err));
      }
    } catch (dbError) {
      console.error('Exception saving order to database:', dbError);
    }

    return NextResponse.json({
      success: true,
      order_id: savedOrderId,
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

