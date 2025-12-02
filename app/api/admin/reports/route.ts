import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get('days') || '30');

    // Calculate date range
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    const cutoffISO = cutoffDate.toISOString();

    // Get all orders within the period
    const { data: orders, error: ordersError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .gte('created_at', cutoffISO)
      .order('created_at', { ascending: false });

    if (ordersError) {
      console.error('Error fetching orders for report:', ordersError);
      throw ordersError;
    }

    // Get previous period orders for comparison
    const previousCutoff = new Date(cutoffDate);
    previousCutoff.setDate(previousCutoff.getDate() - days);
    
    const { data: previousOrders } = await supabaseAdmin
      .from('orders')
      .select('total, payment_status')
      .gte('created_at', previousCutoff.toISOString())
      .lt('created_at', cutoffISO);

    // Calculate totals
    const paidOrders = orders?.filter((o: any) => o.payment_status === 'paid') || [];
    const totalRevenue = paidOrders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);
    const totalOrders = orders?.length || 0;
    const avgOrderValue = totalOrders > 0 ? Math.floor(totalRevenue / totalOrders) : 0;

    // Previous period calculations
    const previousPaidOrders = previousOrders?.filter((o: any) => o.payment_status === 'paid') || [];
    const previousRevenue = previousPaidOrders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);
    const previousOrderCount = previousOrders?.length || 0;

    const revenueChange = previousRevenue > 0 
      ? parseFloat(((totalRevenue - previousRevenue) / previousRevenue * 100).toFixed(1))
      : (totalRevenue > 0 ? 100 : 0);

    const ordersChange = previousOrderCount > 0
      ? parseFloat(((totalOrders - previousOrderCount) / previousOrderCount * 100).toFixed(1))
      : (totalOrders > 0 ? 100 : 0);

    // Calculate top products from order items
    const productSales: Record<string, { name: string; color: string; total_sold: number; revenue: number }> = {};
    
    orders?.forEach((order: any) => {
      const items = order.items || [];
      items.forEach((item: any) => {
        const key = item.name || item.product_id;
        if (!productSales[key]) {
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

    // Get unique customers from orders
    const customerMap = new Map<string, any>();
    orders?.forEach(order => {
      const email = order.customer_email;
      if (!email) return;
      
      if (customerMap.has(email)) {
        const existing = customerMap.get(email);
        existing.order_count += 1;
        existing.total_spent += order.total || 0;
      } else {
        customerMap.set(email, {
          id: email,
          name: order.customer_name || 'Unknown',
          email: email,
          order_count: 1,
          total_spent: order.total || 0,
        });
      }
    });

    const topCustomers = Array.from(customerMap.values())
      .sort((a, b) => b.total_spent - a.total_spent)
      .slice(0, 5);

    // Generate daily revenue data
    const revenueByDay: Array<{ date: string; revenue: number }> = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayRevenue = paidOrders
        .filter(o => o.created_at.split('T')[0] === dateStr)
        .reduce((sum, o) => sum + (o.total || 0), 0);
      
      revenueByDay.push({ date: dateStr, revenue: dayRevenue });
    }

    // Get total customers count
    const { count: totalCustomers } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true });

    return NextResponse.json({
      totalRevenue,
      totalOrders,
      averageOrderValue: avgOrderValue,
      totalCustomers: totalCustomers || customerMap.size,
      revenueChange,
      ordersChange,
      topProducts,
      topCustomers,
      revenueByDay,
      period: `${days} days`,
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (error: any) {
    console.error('Error generating report:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to generate report',
        totalRevenue: 0,
        totalOrders: 0,
        averageOrderValue: 0,
        totalCustomers: 0,
        revenueChange: 0,
        ordersChange: 0,
        topProducts: [],
        topCustomers: [],
        revenueByDay: [],
      },
      { status: 500 }
    );
  }
}
