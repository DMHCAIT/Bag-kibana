import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

// PUT - Update a placement
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    const { display_order, is_active, section } = body;

    const supabase = supabaseAdmin;

    const updateData: any = {};
    if (display_order !== undefined) updateData.display_order = display_order;
    if (is_active !== undefined) updateData.is_active = is_active;
    if (section !== undefined) updateData.section = section;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("product_placements")
      .update(updateData)
      .eq("id", id)
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
      console.error("Error updating placement:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in PUT /api/admin/placements/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Remove a specific placement
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const supabase = supabaseAdmin;

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
    console.error("Error in DELETE /api/admin/placements/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
