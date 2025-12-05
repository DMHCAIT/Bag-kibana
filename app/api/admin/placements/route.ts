import { createClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

// GET - Fetch all placements or placements for a specific section
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section");

    const supabase = createClient();

    let query = supabase
      .from("product_placements")
      .select(`
        id,
        product_id,
        section,
        display_order,
        is_active,
        created_at,
        updated_at,
        products (
          id,
          name,
          slug,
          color,
          price,
          images,
          description
        )
      `)
      .order("section")
      .order("display_order");

    // Filter by section if provided
    if (section) {
      query = query.eq("section", section);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching placements:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error("Error in GET /api/admin/placements:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create a new placement
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { product_id, section, display_order = 0, is_active = true } = body;

    if (!product_id || !section) {
      return NextResponse.json(
        { error: "product_id and section are required" },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Check if product exists
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("id")
      .eq("id", product_id)
      .single();

    if (productError || !product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Check if placement already exists
    const { data: existing } = await supabase
      .from("product_placements")
      .select("id")
      .eq("product_id", product_id)
      .eq("section", section)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "Product already placed in this section" },
        { status: 409 }
      );
    }

    // Create placement
    const { data, error } = await supabase
      .from("product_placements")
      .insert({
        product_id,
        section,
        display_order,
        is_active,
      })
      .select(`
        id,
        product_id,
        section,
        display_order,
        is_active,
        created_at,
        updated_at,
        products (
          id,
          name,
          slug,
          color,
          price,
          images
        )
      `)
      .single();

    if (error) {
      console.error("Error creating placement:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/admin/placements:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Remove a placement
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Placement ID is required" },
        { status: 400 }
      );
    }

    const supabase = createClient();

    const { error } = await supabase
      .from("product_placements")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting placement:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/admin/placements:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
