import { NextResponse } from 'next/server';
import { getStoreDebugInfo, getOrderStats, getCustomerStats } from '@/lib/orders-store';

// Debug endpoint to check store status
export async function GET() {
  try {
    const debugInfo = getStoreDebugInfo();
    const orderStats = getOrderStats();
    const customerStats = getCustomerStats();

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      storeInfo: debugInfo,
      orderStats,
      customerStats,
      message: 'Store debug info retrieved successfully',
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache',
      },
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message || 'Failed to get debug info',
      timestamp: new Date().toISOString(),
    }, {
      status: 500,
    });
  }
}

