import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET - Test database connection and show status
export async function GET(req: NextRequest) {
  const results: any = {
    timestamp: new Date().toISOString(),
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing',
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing',
    supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Missing',
    tests: {},
  };

  // Test 1: Check orders table
  try {
    const { data: orders, error, count } = await supabaseAdmin
      .from('orders')
      .select('*', { count: 'exact' })
      .limit(5);

    if (error) {
      results.tests.orders = { 
        status: 'error', 
        error: error.message,
        hint: error.hint,
        code: error.code
      };
    } else {
      results.tests.orders = { 
        status: 'success', 
        count: count,
        sample: orders?.slice(0, 2).map((o: any) => ({
          id: o.id,
          customer_name: o.customer_name,
          customer_email: o.customer_email,
          total: o.total,
          created_at: o.created_at
        }))
      };
    }
  } catch (e: any) {
    results.tests.orders = { status: 'exception', error: e.message };
  }

  // Test 2: Check products table
  try {
    const { data: products, error, count } = await supabaseAdmin
      .from('products')
      .select('*', { count: 'exact' })
      .limit(3);

    if (error) {
      results.tests.products = { 
        status: 'error', 
        error: error.message,
        hint: error.hint
      };
    } else {
      results.tests.products = { 
        status: 'success', 
        count: count,
        sample: products?.slice(0, 2).map((p: any) => ({
          id: p.id,
          name: p.name,
          price: p.price
        }))
      };
    }
  } catch (e: any) {
    results.tests.products = { status: 'exception', error: e.message };
  }

  // Test 3: Check users table
  try {
    const { data: users, error, count } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact' })
      .limit(3);

    if (error) {
      results.tests.users = { 
        status: 'error', 
        error: error.message,
        hint: error.hint
      };
    } else {
      results.tests.users = { 
        status: 'success', 
        count: count,
        sample: users?.slice(0, 2).map((u: any) => ({
          id: u.id,
          email: u.email
        }))
      };
    }
  } catch (e: any) {
    results.tests.users = { status: 'exception', error: e.message };
  }

  // Test 4: Try to insert a test order
  try {
    const testOrder = {
      customer_name: 'Test Customer',
      customer_email: 'test@test.com',
      customer_phone: '1234567890',
      shipping_address: { address: 'Test Address' },
      billing_address: { address: 'Test Address' },
      items: [{ name: 'Test Product', quantity: 1, price: 100 }],
      subtotal: 100,
      shipping_fee: 0,
      total: 100,
      payment_method: 'test',
      payment_status: 'pending',
      order_status: 'pending',
    };

    const { data, error } = await supabaseAdmin
      .from('orders')
      .insert([testOrder])
      .select()
      .single();

    if (error) {
      results.tests.insertOrder = { 
        status: 'error', 
        error: error.message,
        hint: error.hint,
        code: error.code,
        details: error.details
      };
    } else {
      // Delete the test order
      await supabaseAdmin.from('orders').delete().eq('id', data.id);
      results.tests.insertOrder = { 
        status: 'success', 
        message: 'Test order created and deleted successfully',
        orderId: data.id
      };
    }
  } catch (e: any) {
    results.tests.insertOrder = { status: 'exception', error: e.message };
  }

  return NextResponse.json(results, {
    headers: { 'Cache-Control': 'no-store' }
  });
}

