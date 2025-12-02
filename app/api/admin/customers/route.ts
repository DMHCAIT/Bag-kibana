import { NextRequest, NextResponse } from 'next/server';
import { 
  getAllCustomers, 
  searchCustomers, 
  getCustomerStats,
  Customer 
} from '@/lib/orders-store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.toLowerCase();
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '100');

    let filteredCustomers: Customer[];

    // Get customers based on search
    if (search) {
      filteredCustomers = searchCustomers(search);
    } else {
      filteredCustomers = getAllCustomers();
    }

    // Sort by created_at (newest first)
    filteredCustomers.sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateB - dateA;
    });

    // Pagination
    const totalCustomers = filteredCustomers.length;
    const totalPages = Math.ceil(totalCustomers / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);

    // Get stats
    const stats = getCustomerStats();

    return NextResponse.json({
      customers: paginatedCustomers,
      totalCustomers,
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
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}
