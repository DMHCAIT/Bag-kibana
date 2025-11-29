import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

interface Order {
  total_amount: number;
  created_at: string;
  payment_status: string;
  order_items?: any;
}

interface Customer {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
}

export async function GET(request: Request) {
  // Authentication removed - direct access enabled for admin APIs

  const { searchParams } = new URL(request.url);
  const days = parseInt(searchParams.get("days") || "30");

  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get current period orders
    const { data: currentOrders, error: ordersError } = await supabaseAdmin
      .from("orders")
      .select("*")
      .gte("created_at", startDate.toISOString())
      .eq("payment_status", "paid");

    if (ordersError) throw ordersError;

    // Get previous period for comparison
    const previousStartDate = new Date(startDate);
    previousStartDate.setDate(previousStartDate.getDate() - days);

    const { data: previousOrders } = await supabaseAdmin
      .from("orders")
      .select("total_amount")
      .gte("created_at", previousStartDate.toISOString())
      .lt("created_at", startDate.toISOString())
      .eq("payment_status", "paid");

    // Type cast the data
    const typedCurrentOrders = currentOrders as Order[] | null;
    const typedPreviousOrders = previousOrders as Order[] | null;

    // Calculate metrics
    const totalRevenue = typedCurrentOrders?.reduce((sum: number, order: Order) => sum + order.total_amount, 0) || 0;
    const totalOrders = typedCurrentOrders?.length || 0;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const previousRevenue = typedPreviousOrders?.reduce((sum: number, order: Order) => sum + order.total_amount, 0) || 0;
    const previousOrderCount = typedPreviousOrders?.length || 0;

    const revenueChange = previousRevenue > 0 
      ? Math.round(((totalRevenue - previousRevenue) / previousRevenue) * 100)
      : 0;
    const ordersChange = previousOrderCount > 0
      ? Math.round(((totalOrders - previousOrderCount) / previousOrderCount) * 100)
      : 0;

    // Get total customers
    const { count: totalCustomers } = await supabaseAdmin
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("role", "customer");

    // Get top products (from order items)
    // This is a simplified version - you'd need to parse order_items JSON
    const productSales: Record<string, { name: string; color: string; sold: number; revenue: number }> = {};
    
    typedCurrentOrders?.forEach((order: Order) => {
      try {
        const items = typeof order.order_items === 'string' 
          ? JSON.parse(order.order_items) 
          : order.order_items;
        
        items.forEach((item: { id: string; name: string; color: string; quantity: number; price: number }) => {
          const key = `${item.id}-${item.color}`;
          if (!productSales[key]) {
            productSales[key] = {
              name: item.name,
              color: item.color,
              sold: 0,
              revenue: 0,
            };
          }
          productSales[key].sold += item.quantity;
          productSales[key].revenue += item.price * item.quantity;
        });
      } catch (e) {
        console.error("Error parsing order items:", e);
      }
    });

    const topProducts = Object.entries(productSales)
      .map(([id, data]) => ({
        id,
        name: data.name,
        color: data.color,
        total_sold: data.sold,
        revenue: data.revenue,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // Get top customers
    const { data: customers } = await supabaseAdmin
      .from("users")
      .select("id, email, full_name")
      .eq("role", "customer");

    const typedCustomers = customers as Customer[] | null;

    const customerStats = await Promise.all(
      (typedCustomers || []).map(async (customer: Customer) => {
        const { data: customerOrders } = await supabaseAdmin
          .from("orders")
          .select("total_amount")
          .eq("user_id", customer.id)
          .eq("payment_status", "paid")
          .gte("created_at", startDate.toISOString());

        const typedCustomerOrders = customerOrders as Order[] | null;
        const total_spent = typedCustomerOrders?.reduce((sum: number, order: Order) => sum + order.total_amount, 0) || 0;
        const order_count = typedCustomerOrders?.length || 0;

        return {
          id: customer.id,
          name: customer.full_name || "No Name",
          email: customer.email,
          total_spent,
          order_count,
        };
      })
    );

    const topCustomers = customerStats
      .filter((c) => c.order_count > 0)
      .sort((a, b) => b.total_spent - a.total_spent)
      .slice(0, 10);

    // Revenue by day (simplified)
    const revenueByDay: Array<{ date: string; revenue: number }> = [];
    for (let i = 0; i < Math.min(days, 30); i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));

      const dayOrders = typedCurrentOrders?.filter((order: Order) => {
        const orderDate = new Date(order.created_at);
        return orderDate >= dayStart && orderDate <= dayEnd;
      });

      const dayRevenue = dayOrders?.reduce((sum: number, order: Order) => sum + order.total_amount, 0) || 0;

      revenueByDay.push({
        date: dayStart.toISOString().split("T")[0],
        revenue: dayRevenue,
      });
    }

    return NextResponse.json({
      totalRevenue: Math.round(totalRevenue),
      totalOrders,
      averageOrderValue: Math.round(averageOrderValue),
      totalCustomers: totalCustomers || 0,
      revenueChange,
      ordersChange,
      topProducts,
      topCustomers,
      revenueByDay: revenueByDay.reverse(),
    });
  } catch (error) {
    console.error("Failed to fetch report data:", error);
    return NextResponse.json(
      { error: "Failed to fetch report data" },
      { status: 500 }
    );
  }
}
