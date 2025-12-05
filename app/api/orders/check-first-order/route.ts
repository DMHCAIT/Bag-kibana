import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    // Get user from session/cookies
    const authHeader = request.headers.get("cookie");
    
    if (!authHeader) {
      return NextResponse.json({ isFirstOrder: true });
    }

    // Extract user_id from session
    // This is a simplified check - you might want to use proper auth
    const { data: { user } } = await supabaseAdmin.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ isFirstOrder: true });
    }

    // Check if user has any previous orders
    const { data: orders, error } = await supabaseAdmin
      .from("orders")
      .select("id")
      .eq("user_id", user.id)
      .limit(1);

    if (error) {
      console.error("Error checking first order:", error);
      return NextResponse.json({ isFirstOrder: true });
    }

    return NextResponse.json({ 
      isFirstOrder: !orders || orders.length === 0 
    });
  } catch (error) {
    console.error("Error in check-first-order:", error);
    return NextResponse.json({ isFirstOrder: true });
  }
}
