import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET - Fetch orders for a specific user by email
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const phone = searchParams.get('phone');

    if (!email && !phone) {
      return NextResponse.json(
        { error: 'Email or phone is required', orders: [] },
        { status: 400 }
      );
    }

    console.log('Fetching orders for:', { email, phone });

    let query = supabaseAdmin.from('orders').select('*');

    // Query by email if provided
    if (email) {
      query = query.or(`customer_email.ilike.${email},customer_email.ilike.%${email}%`);
    }

    // Also query by phone if provided  
    if (phone) {
      const cleanPhone = phone.replace(/\s+/g, '');
      query = query.or(`customer_phone.ilike.%${cleanPhone}%,customer_phone.ilike.${cleanPhone}`);
    }

    const { data: orders, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      return NextResponse.json(
        { error: error.message, orders: [] },
        { status: 500 }
      );
    }

    console.log(`Found ${orders?.length || 0} orders for user`);

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
