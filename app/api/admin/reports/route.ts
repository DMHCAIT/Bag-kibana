import { NextRequest, NextResponse } from 'next/server';
import { getAllOrders, getAllCustomers, getOrderStats, getCustomerStats } from '@/lib/orders-store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get('days') || '30');

    // Get real data from stores
    const allOrders = getAllOrders();
    const allCustomers = getAllCustomers();
    const orderStats = getOrderStats();
    const customerStats = getCustomerStats();

    // Filter orders by date range
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const filteredOrders = allOrders.filter(order => {
      const orderDate = new Date(order.created_at);
      return orderDate >= cutoffDate;
    });

    // Calculate totals from real orders
    const totalRevenue = filteredOrders
      .filter(o => o.payment_status === 'paid')
      .reduce((sum, o) => sum + (o.total || 0), 0);
    
    const totalOrders = filteredOrders.length;
    const avgOrderValue = totalOrders > 0 ? Math.floor(totalRevenue / totalOrders) : 0;

    // Calculate previous period for comparison
    const previousCutoff = new Date(cutoffDate);
    previousCutoff.setDate(previousCutoff.getDate() - days);
    
    const previousPeriodOrders = allOrders.filter(order => {
      const orderDate = new Date(order.created_at);
      return orderDate >= previousCutoff && orderDate < cutoffDate;
    });

    const previousRevenue = previousPeriodOrders
      .filter(o => o.payment_status === 'paid')
      .reduce((sum, o) => sum + (o.total || 0), 0);

    const revenueChange = previousRevenue > 0 
      ? parseFloat(((totalRevenue - previousRevenue) / previousRevenue * 100).toFixed(1))
      : (totalRevenue > 0 ? 100 : 0);

    const ordersChange = previousPeriodOrders.length > 0
      ? parseFloat(((totalOrders - previousPeriodOrders.length) / previousPeriodOrders.length * 100).toFixed(1))
      : (totalOrders > 0 ? 100 : 0);

    // Calculate top products from order items
    const productSales: Record<string, { name: string; color: string; total_sold: number; revenue: number }> = {};
    
    filteredOrders.forEach(order => {
      (order.items || []).forEach(item => {
        const key = item.name || item.product_id;
        if (!productSales[key]) {
          // Extract color from name if format is "Name - Color"
          const parts = (item.name || '').split(' - ');
          productSales[key] = {
            name: parts[0] || item.name || 'Unknown Product',
            color: parts[1] || '',
            total_sold: 0,
            revenue: 0,
          };
        }
        productSales[key].total_sold += item.quantity || 1;
        productSales[key].revenue += (item.price || 0) * (item.quantity || 1);
      });
    });

    const topProducts = Object.entries(productSales)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Get top customers by total spent
    const topCustomers = [...allCustomers]
      .sort((a, b) => (b.total_spent || 0) - (a.total_spent || 0))
      .slice(0, 5)
      .map(c => ({
        id: c.id,
        name: c.full_name || 'Unknown',
        email: c.email,
        total_spent: c.total_spent || 0,
        order_count: c.order_count || 0,
      }));

    // Generate daily revenue data
    const revenueByDay: Array<{ date: string; revenue: number }> = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayRevenue = filteredOrders
        .filter(o => {
          const orderDate = new Date(o.created_at).toISOString().split('T')[0];
          return orderDate === dateStr && o.payment_status === 'paid';
        })
        .reduce((sum, o) => sum + (o.total || 0), 0);
      
      revenueByDay.push({ date: dateStr, revenue: dayRevenue });
    }

    return NextResponse.json({
      totalRevenue,
      totalOrders,
      averageOrderValue: avgOrderValue,
      totalCustomers: allCustomers.length,
      revenueChange,
      ordersChange,
      topProducts,
      topCustomers,
      revenueByDay,
      // Also include overall stats
      stats: {
        orders: orderStats,
        customers: customerStats,
      },
      period: `${days} days`,
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
