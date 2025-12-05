import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

// GET - Fetch products for a specific section (public endpoint)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section");

    if (!section) {
      return NextResponse.json(
        { error: "Section parameter is required" },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin;

    const { data, error } = await supabase
      .from("product_placements")
      .select(`
        id,
        display_order,
        products (
          id,
          name,
          slug,
          color,
          price,
          images,
          description,
          category,
          colors
        )
      `)
      .eq("section", section)
      .eq("is_active", true)
      .order("display_order");

    if (error) {
      console.error("Error fetching section products:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Extract products from the nested structure
    const products = data?.map((item: any) => item.products) || [];

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error in GET /api/placements:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
