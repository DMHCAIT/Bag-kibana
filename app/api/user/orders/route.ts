import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET - Fetch orders for a specific user by email
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('user_id');
    const email = searchParams.get('email');

    console.log('Fetching user orders:', { userId, email });

    if (!userId && !email) {
      return NextResponse.json(
        { error: 'user_id or email is required', orders: [] },
        { status: 400 }
      );
    }

    // Query orders by email (case-insensitive)
    let query = supabaseAdmin
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (email) {
      // Use ilike for case-insensitive email matching
      query = query.ilike('customer_email', email);
    } else if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data: orders, error } = await query;

    if (error) {
      console.error('Error fetching user orders:', error);
      return NextResponse.json(
        { error: error.message, orders: [] },
        { status: 500 }
      );
    }

    console.log(`Found ${orders?.length || 0} orders for ${email || userId}`);

    return NextResponse.json({
      orders: orders || [],
      total: orders?.length || 0,
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache',
      },
    });
  } catch (error: any) {
    console.error('Error fetching user orders:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch orders', orders: [] },
      { status: 500 }
    );
  }
}
