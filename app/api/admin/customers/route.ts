import { NextRequest, NextResponse } from 'next/server';

// In-memory customer database - will be populated from actual orders
let customersDatabase: any[] = [];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.toLowerCase();
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '100');

    let filteredCustomers = [...customersDatabase];

    // Search by name or email (with null checks)
    if (search) {
      filteredCustomers = filteredCustomers.filter(customer =>
        (customer.full_name?.toLowerCase() || '').includes(search) ||
        (customer.email?.toLowerCase() || '').includes(search)
      );
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

    return NextResponse.json({
      customers: paginatedCustomers,
      totalCustomers,
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
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}

// Helper function to update customer data from orders
export function updateCustomerFromOrder(orderData: any) {
  const existingCustomerIndex = customersDatabase.findIndex(
    c => c.email === orderData.customer_email
  );

  if (existingCustomerIndex >= 0) {
    // Update existing customer
    const customer = customersDatabase[existingCustomerIndex];
    customer.order_count = (customer.order_count || 0) + 1;
    customer.total_spent = (customer.total_spent || 0) + (orderData.total || 0);
  } else {
    // Add new customer
    customersDatabase.push({
      id: `CUST-${Date.now().toString().slice(-6)}`,
      email: orderData.customer_email,
      full_name: orderData.customer_name,
      role: 'customer',
      created_at: new Date().toISOString(),
      order_count: 1,
      total_spent: orderData.total || 0,
    });
  }
}

