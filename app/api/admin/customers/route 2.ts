import { NextRequest, NextResponse } from 'next/server';

// Mock customer data - in production, this would come from database
const mockCustomers = [
  {
    id: 'cust-001',
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    phone: '+91 98765 43210',
    totalOrders: 5,
    totalSpent: 24995,
    joinedDate: '2024-10-15',
    status: 'active',
    lastOrderDate: '2024-12-01',
  },
  {
    id: 'cust-002',
    name: 'Rahul Verma',
    email: 'rahul.v@example.com',
    phone: '+91 98765 43211',
    totalOrders: 3,
    totalSpent: 14997,
    joinedDate: '2024-11-01',
    status: 'active',
    lastOrderDate: '2024-11-30',
  },
  {
    id: 'cust-003',
    name: 'Anita Desai',
    email: 'anita.d@example.com',
    phone: '+91 98765 43212',
    totalOrders: 7,
    totalSpent: 34993,
    joinedDate: '2024-09-20',
    status: 'active',
    lastOrderDate: '2024-11-28',
  },
  {
    id: 'cust-004',
    name: 'Karan Malhotra',
    email: 'karan.m@example.com',
    phone: '+91 98765 43213',
    totalOrders: 2,
    totalSpent: 9998,
    joinedDate: '2024-11-10',
    status: 'active',
    lastOrderDate: '2024-11-25',
  },
  {
    id: 'cust-005',
    name: 'Neha Kapoor',
    email: 'neha.k@example.com',
    phone: '+91 98765 43214',
    totalOrders: 4,
    totalSpent: 19996,
    joinedDate: '2024-10-05',
    status: 'active',
    lastOrderDate: '2024-11-20',
  },
  {
    id: 'cust-006',
    name: 'Vikram Singh',
    email: 'vikram.s@example.com',
    phone: '+91 98765 43215',
    totalOrders: 1,
    totalSpent: 4999,
    joinedDate: '2024-11-25',
    status: 'active',
    lastOrderDate: '2024-11-25',
  },
  {
    id: 'cust-007',
    name: 'Meera Patel',
    email: 'meera.p@example.com',
    phone: '+91 98765 43216',
    totalOrders: 6,
    totalSpent: 29994,
    joinedDate: '2024-09-15',
    status: 'active',
    lastOrderDate: '2024-11-22',
  },
  {
    id: 'cust-008',
    name: 'Arjun Reddy',
    email: 'arjun.r@example.com',
    phone: '+91 98765 43217',
    totalOrders: 2,
    totalSpent: 12998,
    joinedDate: '2024-11-05',
    status: 'inactive',
    lastOrderDate: '2024-11-10',
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search')?.toLowerCase();
    const sortBy = searchParams.get('sortBy') || 'totalSpent';
    const order = searchParams.get('order') || 'desc';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    let filteredCustomers = [...mockCustomers];

    // Filter by status
    if (status && status !== 'all') {
      filteredCustomers = filteredCustomers.filter(customer => customer.status === status);
    }

    // Search by name, email, or phone
    if (search) {
      filteredCustomers = filteredCustomers.filter(customer =>
        customer.name.toLowerCase().includes(search) ||
        customer.email.toLowerCase().includes(search) ||
        customer.phone.includes(search)
      );
    }

    // Sort
    filteredCustomers.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'totalSpent':
          comparison = a.totalSpent - b.totalSpent;
          break;
        case 'totalOrders':
          comparison = a.totalOrders - b.totalOrders;
          break;
        case 'joinedDate':
          comparison = new Date(a.joinedDate).getTime() - new Date(b.joinedDate).getTime();
          break;
        case 'lastOrderDate':
          comparison = new Date(a.lastOrderDate).getTime() - new Date(b.lastOrderDate).getTime();
          break;
        default:
          comparison = 0;
      }
      return order === 'desc' ? -comparison : comparison;
    });

    // Pagination
    const totalCustomers = filteredCustomers.length;
    const totalPages = Math.ceil(totalCustomers / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);

    // Calculate summary stats
    const totalRevenue = filteredCustomers.reduce((sum, c) => sum + c.totalSpent, 0);
    const avgOrderValue = filteredCustomers.length > 0 
      ? totalRevenue / filteredCustomers.reduce((sum, c) => sum + c.totalOrders, 0)
      : 0;

    return NextResponse.json({
      customers: paginatedCustomers,
      totalCustomers,
      totalPages,
      currentPage: page,
      limit,
      summary: {
        totalRevenue,
        avgOrderValue: Math.round(avgOrderValue),
        activeCustomers: filteredCustomers.filter(c => c.status === 'active').length,
        inactiveCustomers: filteredCustomers.filter(c => c.status === 'inactive').length,
      },
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error: any) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}
