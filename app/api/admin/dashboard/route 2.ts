import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Return fallback dashboard stats
    const stats = {
      totalRevenue: 0,
      totalOrders: 0,
      totalProducts: 0,
      totalCustomers: 0,
      recentOrders: [],
      status: 'fallback',
      error: 'Dashboard data is not available yet'
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json(
      { 
        totalRevenue: 0,
        totalOrders: 0,
        totalProducts: 0,
        totalCustomers: 0,
        recentOrders: [],
        error: 'Failed to load dashboard data',
        status: 'error'
      },
      { status: 200 } // Return 200 to prevent errors, just with empty data
    );
  }
}

