import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-middleware';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Get sales analytics data
 */
export async function GET(request: NextRequest) {
  // Verify admin authentication
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30'; // days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    // Get orders for the period
    const { data: orders, error: ordersError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });

    if (ordersError) {
      console.error('Error fetching orders:', ordersError);
      return NextResponse.json(
        { error: 'Failed to fetch analytics data' },
        { status: 500 }
      );
    }

    // Calculate analytics
    const totalRevenue = orders?.reduce((sum: number, order: any) => sum + (order.total || 0), 0) || 0;
    const totalOrders = orders?.length || 0;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Orders by status
    const ordersByStatus = orders?.reduce((acc: Record<string, number>, order: any) => {
      acc[order.order_status] = (acc[order.order_status] || 0) + 1;
      return acc;
    }, {}) || {};

    // Orders by payment method
    const ordersByPaymentMethod = orders?.reduce((acc: Record<string, number>, order: any) => {
      acc[order.payment_method] = (acc[order.payment_method] || 0) + 1;
      return acc;
    }, {}) || {};

    // Daily revenue
    const dailyRevenue = orders?.reduce((acc: Record<string, number>, order: any) => {
      const date = new Date(order.created_at).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + (order.total || 0);
      return acc;
    }, {}) || {};

    // Top selling products
    const productSales: Record<string, any> = {};
    orders?.forEach((order: any) => {
      order.items?.forEach((item: any) => {
        const key = item.product_id || item.product_name;
        if (!productSales[key]) {
          productSales[key] = {
            product_id: item.product_id,
            product_name: item.product_name,
            quantity: 0,
            revenue: 0,
          };
        }
        productSales[key].quantity += item.quantity || 0;
        productSales[key].revenue += (item.price || 0) * (item.quantity || 0);
      });
    });

    const topProducts = Object.values(productSales)
      .sort((a: any, b: any) => b.revenue - a.revenue)
      .slice(0, 10);

    // Get customer metrics
    const uniqueCustomers = new Set(orders?.map((o: any) => o.customer_email)).size;

    return NextResponse.json({
      success: true,
      period: parseInt(period),
      metrics: {
        total_revenue: totalRevenue,
        total_orders: totalOrders,
        average_order_value: averageOrderValue,
        unique_customers: uniqueCustomers,
      },
      orders_by_status: ordersByStatus,
      orders_by_payment_method: ordersByPaymentMethod,
      daily_revenue: Object.entries(dailyRevenue).map(([date, revenue]) => ({
        date,
        revenue,
      })),
      top_products: topProducts,
    });
  } catch (error) {
    console.error('Analytics fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
