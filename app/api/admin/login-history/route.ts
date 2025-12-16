import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET - Fetch login history
export async function GET(req: NextRequest) {
  try {
    console.log('📊 Fetching login history...');
    
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const status = searchParams.get('status');

    // Check if table exists first
    console.log('🔍 Checking login_history table...');
    
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
      console.error('❌ Login history fetch error:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      
      // Check if it's a missing table error
      if (error.code === 'PGRST116' || error.message.includes('relation') || error.message.includes('does not exist')) {
        return NextResponse.json(
          { 
            error: 'Login history table not found. Please run the database migration (supabase/add-user-tracking.sql) in your Supabase SQL Editor.',
            loginHistory: [],
            needsMigration: true
          },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { error: `Database error: ${error.message}`, loginHistory: [], details: error },
        { status: 500 }
      );
    }

    console.log(`✅ Successfully fetched ${loginHistory?.length || 0} login history entries`);

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
    console.error('💥 Unexpected error in login history API:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to fetch login history', 
        loginHistory: [],
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
