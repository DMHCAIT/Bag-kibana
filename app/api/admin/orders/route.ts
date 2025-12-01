import { NextRequest, NextResponse } from 'next/server';

// Mock orders data - in production, this would come from database
const mockOrders = [
  {
    id: 'ORD-001',
    customerName: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    status: 'delivered',
    total: 4999,
    items: 2,
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    products: ['VISTARA TOTE - Teal Blue'],
  },
  {
    id: 'ORD-002',
    customerName: 'Rahul Verma',
    email: 'rahul.v@example.com',
    status: 'processing',
    total: 6499,
    items: 1,
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    products: ['SANDESH LAPTOP BAG - Milky Blue'],
  },
  {
    id: 'ORD-003',
    customerName: 'Anita Desai',
    email: 'anita.d@example.com',
    status: 'pending',
    total: 3999,
    items: 1,
    date: new Date().toISOString(), // Today
    products: ['PRIZMA SLING - Mint Green'],
  },
  {
    id: 'ORD-004',
    customerName: 'Karan Malhotra',
    email: 'karan.m@example.com',
    status: 'shipped',
    total: 9498,
    items: 2,
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    products: ['VISTARA TOTE - Mint Green', 'VISTAPACK - Teal Blue'],
  },
  {
    id: 'ORD-005',
    customerName: 'Neha Kapoor',
    email: 'neha.k@example.com',
    status: 'delivered',
    total: 2999,
    items: 1,
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    products: ['LEKHA WALLET - Teal Blue'],
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search')?.toLowerCase();
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    let filteredOrders = [...mockOrders];

    // Filter by status
    if (status && status !== 'all') {
      filteredOrders = filteredOrders.filter(order => order.status === status);
    }

    // Search by customer name, email, or order ID
    if (search) {
      filteredOrders = filteredOrders.filter(order =>
        order.customerName.toLowerCase().includes(search) ||
        order.email.toLowerCase().includes(search) ||
        order.id.toLowerCase().includes(search)
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
