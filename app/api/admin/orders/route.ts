import { NextRequest, NextResponse } from 'next/server';
import { updateCustomerFromOrder } from '../customers/route';

// In-memory order storage - starts empty, will be populated by real orders
let ordersDatabase: any[] = [];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search')?.toLowerCase();
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '100');

    let filteredOrders = [...ordersDatabase];

    // Filter by status
    if (status && status !== 'all') {
      filteredOrders = filteredOrders.filter(order => order.order_status === status);
    }

    // Search by customer name, email, or order ID (with null checks)
    if (search) {
      filteredOrders = filteredOrders.filter(order =>
        (order.customer_name?.toLowerCase() || '').includes(search) ||
        (order.customer_email?.toLowerCase() || '').includes(search) ||
        (order.id?.toLowerCase() || '').includes(search)
      );
    }

    // Pagination
    const totalOrders = filteredOrders.length;
    const totalPages = Math.ceil(totalOrders / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

    return NextResponse.json({
      orders: paginatedOrders,
      totalOrders,
      totalPages,
      currentPage: page,
      limit,
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST - Create new order
export async function POST(req: NextRequest) {
  try {
    const orderData = await req.json();

    const newOrder = {
      id: `ORD-${Date.now().toString().slice(-6)}`,
      customer_name: orderData.customer_name || `${orderData.firstName} ${orderData.lastName}`,
      customer_email: orderData.customer_email || orderData.email,
      customer_phone: orderData.customer_phone || orderData.phone,
      order_status: orderData.order_status || 'pending',
      payment_status: orderData.payment_status || (orderData.payment_method === 'cod' ? 'pending' : 'paid'),
      total: orderData.total,
      items: orderData.items || [],
      created_at: new Date().toISOString(),
      shipping_address: orderData.shipping_address || `${orderData.address}, ${orderData.city}, ${orderData.state} - ${orderData.pincode}`,
      payment_method: orderData.payment_method,
      razorpay_order_id: orderData.razorpay_order_id,
      razorpay_payment_id: orderData.razorpay_payment_id,
    };

    ordersDatabase.unshift(newOrder); // Add to beginning of array

    // Update customer database
    try {
      updateCustomerFromOrder(newOrder);
    } catch (customerError) {
      console.error('Error updating customer:', customerError);
      // Continue even if customer update fails
    }

    return NextResponse.json({
      success: true,
      order: newOrder,
    }, {
      status: 201,
    });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}
