import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET - Fetch login history
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const status = searchParams.get('status');

    let query = supabaseAdmin
      .from('login_history')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data: loginHistory, error } = await query;

    if (error) {
      console.error('Login history fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch login history', loginHistory: [] },
        { status: 500 }
      );
    }

    return NextResponse.json({
      loginHistory: loginHistory || [],
      total: loginHistory?.length || 0,
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (error: any) {
    console.error('Error fetching login history:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch login history', loginHistory: [] },
      { status: 500 }
    );
  }
}
