import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET - Fetch all orders from database
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search')?.toLowerCase();
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = (page - 1) * limit;

    console.log('Fetching orders from database...');

    // Build query
    let query = supabaseAdmin
      .from('orders')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    // Filter by status
    if (status && status !== 'all') {
      query = query.eq('order_status', status);
    }

    // Search - use ilike for case-insensitive search
    if (search) {
      query = query.or(`customer_name.ilike.%${search}%,customer_email.ilike.%${search}%`);
    }

    // Pagination
    query = query.range(offset, offset + limit - 1);

    const { data: orders, error, count } = await query;

    if (error) {
      console.error('Supabase error fetching orders:', error);
      return NextResponse.json({
        orders: [],
        totalOrders: 0,
        totalPages: 0,
        currentPage: page,
        limit,
        stats: { total: 0 },
        error: error.message
      }, {
        status: 200,
        headers: { 'Cache-Control': 'no-store' },
      });
    }

    console.log(`Found ${orders?.length || 0} orders`);

    // Get stats
    const { data: allOrders } = await supabaseAdmin
      .from('orders')
      .select('order_status, payment_status, payment_method, total');

    const stats = {
      total: allOrders?.length || 0,
      pending: allOrders?.filter((o: any) => o.order_status === 'pending').length || 0,
      confirmed: allOrders?.filter((o: any) => o.order_status === 'confirmed').length || 0,
      processing: allOrders?.filter((o: any) => o.order_status === 'processing').length || 0,
      shipped: allOrders?.filter((o: any) => o.order_status === 'shipped').length || 0,
      delivered: allOrders?.filter((o: any) => o.order_status === 'delivered').length || 0,
      cancelled: allOrders?.filter((o: any) => o.order_status === 'cancelled').length || 0,
      codOrders: allOrders?.filter((o: any) => o.payment_method === 'cod').length || 0,
      razorpayOrders: allOrders?.filter((o: any) => o.payment_method === 'razorpay').length || 0,
      totalRevenue: allOrders?.filter((o: any) => o.payment_status === 'paid').reduce((sum: number, o: any) => sum + (o.total || 0), 0) || 0,
    };

    return NextResponse.json({
      orders: orders || [],
      totalOrders: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
      currentPage: page,
      limit,
      stats,
    }, {
      status: 200,
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
    });
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch orders', orders: [], totalOrders: 0 },
      { status: 500 }
    );
  }
}

// POST - Create new order in database
export async function POST(req: NextRequest) {
  try {
    const orderData = await req.json();
    
    console.log('=== Creating New Order ===');
    console.log('Received order data:', JSON.stringify(orderData, null, 2));

    // Build shipping address as proper jsonb
    let shippingAddress = orderData.shipping_address;
    if (typeof shippingAddress === 'string') {
      shippingAddress = {
        full_name: orderData.customer_name || '',
        phone: orderData.customer_phone || '',
        address_line1: shippingAddress,
        city: '',
        state: '',
        postal_code: '',
        country: 'India',
      };
    } else if (!shippingAddress || typeof shippingAddress !== 'object') {
      shippingAddress = {
        full_name: orderData.customer_name || `${orderData.firstName || ''} ${orderData.lastName || ''}`.trim(),
        phone: orderData.customer_phone || orderData.phone || '',
        address_line1: orderData.address || '',
        city: orderData.city || '',
        state: orderData.state || '',
        postal_code: orderData.pincode || '',
        country: 'India',
      };
    }

    // Build billing address
    let billingAddress = orderData.billing_address;
    if (!billingAddress || typeof billingAddress !== 'object') {
      billingAddress = shippingAddress;
    }

    // Prepare order for database - user_id set to null to avoid FK constraint issues
    const newOrder = {
      user_id: null, // Set to null to avoid foreign key issues with auth.users
      customer_name: orderData.customer_name || `${orderData.firstName || ''} ${orderData.lastName || ''}`.trim() || 'Customer',
      customer_email: orderData.customer_email || orderData.email || '',
      customer_phone: orderData.customer_phone || orderData.phone || '',
      shipping_address: shippingAddress,
      billing_address: billingAddress,
      items: orderData.items || [],
      subtotal: Number(orderData.subtotal) || Number(orderData.total) || 0,
      shipping_fee: Number(orderData.shipping_fee) || 0,
      total: Number(orderData.total) || 0,
      payment_method: orderData.payment_method || 'cod',
      payment_status: orderData.payment_status || (orderData.payment_method === 'cod' ? 'pending' : 'paid'),
      payment_id: orderData.payment_id || orderData.razorpay_payment_id || null,
      order_status: orderData.order_status || 'pending',
      tracking_number: orderData.tracking_number || null,
      notes: orderData.notes || null,
    };

    console.log('Inserting order:', JSON.stringify(newOrder, null, 2));

    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .insert([newOrder])
      .select()
      .single();

    if (error) {
      console.error('=== Supabase Error ===');
      console.error('Error message:', error.message);
      console.error('Error details:', error.details);
      console.error('Error hint:', error.hint);
      console.error('Error code:', error.code);
      
      return NextResponse.json(
        { 
          success: false,
          error: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        },
        { status: 500 }
      );
    }

    console.log('=== Order Created Successfully ===');
    console.log('Order ID:', order.id);

    return NextResponse.json({
      success: true,
      order,
      message: 'Order created successfully',
    }, {
      status: 201,
    });
  } catch (error: any) {
    console.error('=== Exception Creating Order ===');
    console.error('Error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Failed to create order',
      },
      { status: 500 }
    );
  }
}
