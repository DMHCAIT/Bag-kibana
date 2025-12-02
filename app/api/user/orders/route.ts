import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET - Fetch orders for a specific user by email
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required', orders: [] },
        { status: 400 }
      );
    }

    console.log('Fetching orders for:', email);

    // Query orders by email (case-insensitive)
    const { data: orders, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .ilike('customer_email', email)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      return NextResponse.json(
        { error: error.message, orders: [] },
        { status: 500 }
      );
    }

    console.log(`Found ${orders?.length || 0} orders for ${email}`);

    return NextResponse.json({
      orders: orders || [],
      total: orders?.length || 0,
    }, {
      headers: { 'Cache-Control': 'no-store, no-cache' },
    });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: error.message, orders: [] },
      { status: 500 }
    );
  }
}
