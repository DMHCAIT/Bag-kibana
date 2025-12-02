import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET - Fetch orders for a specific user
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('user_id');
    const email = searchParams.get('email');

    if (!userId && !email) {
      return NextResponse.json(
        { error: 'user_id or email is required' },
        { status: 400 }
      );
    }

    let query = supabaseAdmin
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    // Filter by user_id or email
    if (userId) {
      query = query.eq('user_id', userId);
    } else if (email) {
      query = query.eq('customer_email', email);
    }

    const { data: orders, error } = await query;

    if (error) {
      console.error('Error fetching user orders:', error);
      throw error;
    }

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

