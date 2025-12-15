import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET - Fetch all customers from database (derived from orders)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.toLowerCase();
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = (page - 1) * limit;

    // First try to get users from users table
    let query = supabaseAdmin
      .from('users')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    query = query.range(offset, offset + limit - 1);

    const { data: users, count: usersCount } = await query;

    // Also get customer data from orders (for customers who may not be in users table)
    const { data: orders } = await supabaseAdmin
      .from('orders')
      .select('customer_email, customer_name, customer_phone, total, created_at');

    // Aggregate customer data from orders
    const customerMap = new Map<string, any>();

    if (orders) {
      orders.forEach((order: any) => {
        const email = order.customer_email;
        if (!email) return;

        if (customerMap.has(email)) {
          const existing = customerMap.get(email);
          existing.order_count += 1;
          existing.total_spent += order.total || 0;
        } else {
          customerMap.set(email, {
            id: email,
            email: email,
            full_name: order.customer_name,
            phone: order.customer_phone,
            role: 'customer',
            created_at: order.created_at,
            order_count: 1,
            total_spent: order.total || 0,
          });
        }
      });
    }

    // Merge with users data
    const customers: any[] = [];

    if (users) {
      users.forEach((user: any) => {
        const orderData = customerMap.get(user.email);
        customers.push({
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
          created_at: user.created_at,
          order_count: orderData?.order_count || 0,
          total_spent: orderData?.total_spent || 0,
        });
        customerMap.delete(user.email);
      });
    }

    // Add remaining customers from orders who don't have user accounts
    customerMap.forEach(customer => {
      if (!search || 
          customer.full_name?.toLowerCase().includes(search) || 
          customer.email?.toLowerCase().includes(search)) {
        customers.push(customer);
      }
    });

    // Sort by order count then by created_at
    customers.sort((a, b) => {
      if (b.order_count !== a.order_count) {
        return b.order_count - a.order_count;
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    // Get stats
    const totalCustomers = customers.length;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const stats = {
      total: totalCustomers,
      newCustomers: customers.filter(c => new Date(c.created_at) >= thirtyDaysAgo).length,
      activeCustomers: customers.filter(c => c.order_count > 0).length,
      totalSpent: customers.reduce((sum, c) => sum + (c.total_spent || 0), 0),
    };

    // Paginate
    const paginatedCustomers = customers.slice(offset, offset + limit);

    return NextResponse.json({
      customers: paginatedCustomers,
      totalCustomers,
      totalPages: Math.ceil(totalCustomers / limit),
      currentPage: page,
      limit,
      stats,
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (error: any) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch customers', customers: [], totalCustomers: 0 },
      { status: 500 }
    );
  }
}
