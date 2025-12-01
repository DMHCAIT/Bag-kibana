import { NextRequest, NextResponse } from 'next/server';

// Mock report data - in production, this would come from database analytics
function generateMockReportData(days: number) {
  const now = new Date();
  const dailyData = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    dailyData.push({
      date: date.toISOString().split('T')[0],
      revenue: Math.floor(Math.random() * 50000) + 10000,
      orders: Math.floor(Math.random() * 20) + 5,
      customers: Math.floor(Math.random() * 15) + 3,
      avgOrderValue: Math.floor(Math.random() * 3000) + 2000,
    });
  }

  return dailyData;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get('days') || '30');

    const dailyData = generateMockReportData(days);
    
    // Calculate totals
    const totalRevenue = dailyData.reduce((sum, day) => sum + day.revenue, 0);
    const totalOrders = dailyData.reduce((sum, day) => sum + day.orders, 0);
    const totalCustomers = dailyData.reduce((sum, day) => sum + day.customers, 0);
    const avgOrderValue = totalOrders > 0 ? Math.floor(totalRevenue / totalOrders) : 0;

    // Calculate growth percentages (compared to previous period)
    const currentPeriodRevenue = dailyData.slice(-Math.floor(days / 2)).reduce((sum, day) => sum + day.revenue, 0);
    const previousPeriodRevenue = dailyData.slice(0, Math.floor(days / 2)).reduce((sum, day) => sum + day.revenue, 0);
    const revenueGrowth = previousPeriodRevenue > 0 
      ? ((currentPeriodRevenue - previousPeriodRevenue) / previousPeriodRevenue * 100).toFixed(1)
      : '0';

    // Top selling products (mock data)
    const topProducts = [
      { name: 'VISTARA TOTE - Teal Blue', sales: 45, revenue: 224955 },
      { name: 'SANDESH LAPTOP BAG - Milky Blue', sales: 38, revenue: 246962 },
      { name: 'PRIZMA SLING - Mint Green', sales: 32, revenue: 127968 },
      { name: 'VISTAPACK - Teal Blue', sales: 28, revenue: 125972 },
      { name: 'LEKHA WALLET - Mocha Tan', sales: 25, revenue: 74975 },
    ];

    // Category performance (mock data)
    const categoryPerformance = [
      { category: 'Tote Bag', sales: 120, revenue: 599880, percentage: 35 },
      { category: 'Laptop Bag', sales: 98, revenue: 636902, percentage: 28 },
      { category: 'Sling Bag', sales: 85, revenue: 339915, percentage: 22 },
      { category: 'Backpack', sales: 62, revenue: 278938, percentage: 15 },
    ];

    return NextResponse.json({
      summary: {
        totalRevenue,
        totalOrders,
        totalCustomers,
        avgOrderValue,
        revenueGrowth: parseFloat(revenueGrowth),
        period: `${days} days`,
      },
      dailyData,
      topProducts,
      categoryPerformance,
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error: any) {
    console.error('Error generating report:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate report' },
      { status: 500 }
    );
  }
}
