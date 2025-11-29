import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

interface Customer {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  created_at: string;
}

interface Order {
  total_amount: number;
}

export async function GET() {
  // Authentication removed - direct access enabled for admin APIs

  try {
    // Fetch customers with order statistics
    const { data: customers, error } = await supabaseAdmin
      .from("users")
      .select(`
        id,
        email,
        full_name,
        role,
        created_at
      `)
      .eq("role", "customer")
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Get order statistics for each customer
    const customersWithStats = await Promise.all(
      (customers || []).map(async (customer: Customer) => {
        const { data: orders } = await supabaseAdmin
          .from("orders")
          .select("total_amount")
          .eq("user_id", customer.id)
          .eq("payment_status", "paid");

        const order_count = orders?.length || 0;
        const total_spent = (orders as Order[])?.reduce((sum: number, order: Order) => sum + order.total_amount, 0) || 0;

        return {
          ...customer,
          order_count,
          total_spent,
        };
      })
    );

    return NextResponse.json({ customers: customersWithStats });
  } catch (error) {
    console.error("Failed to fetch customers:", error);
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}
