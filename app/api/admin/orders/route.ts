import { NextRequest, NextResponse } from 'next/server';
import { 
  getAllOrders, 
  searchOrders, 
  getOrdersByStatus, 
  createOrder,
  getOrderStats,
  Order 
} from '@/lib/orders-store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search')?.toLowerCase();
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '100');

    let filteredOrders: Order[];

    // Get orders based on filters
    if (search) {
      filteredOrders = searchOrders(search);
    } else if (status && status !== 'all') {
      filteredOrders = getOrdersByStatus(status);
    } else {
      filteredOrders = getAllOrders();
    }

    // Sort by created_at (newest first)
    filteredOrders.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return dateB - dateA;
    });

    // Pagination
    const totalOrders = filteredOrders.length;
    const totalPages = Math.ceil(totalOrders / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

    // Get stats
    const stats = getOrderStats();

    return NextResponse.json({
      orders: paginatedOrders,
      totalOrders,
      totalPages,
      currentPage: page,
      limit,
      stats,
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

    const newOrder = createOrder({
      user_id: orderData.user_id || null,
      customer_name: orderData.customer_name || `${orderData.firstName || ''} ${orderData.lastName || ''}`.trim(),
      customer_email: orderData.customer_email || orderData.email || '',
      customer_phone: orderData.customer_phone || orderData.phone || '',
      order_status: orderData.order_status || 'pending',
      payment_status: orderData.payment_status || (orderData.payment_method === 'cod' ? 'pending' : 'paid'),
      total: orderData.total || 0,
      items: orderData.items || [],
      shipping_address: orderData.shipping_address || `${orderData.address || ''}, ${orderData.city || ''}, ${orderData.state || ''} - ${orderData.pincode || ''}`,
      payment_method: orderData.payment_method || 'razorpay',
      razorpay_order_id: orderData.razorpay_order_id,
      razorpay_payment_id: orderData.razorpay_payment_id,
    });

    return NextResponse.json({
      success: true,
      order: newOrder,
      message: 'Order created successfully',
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
