import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// PUT - Update content item
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { type, title, content, image, link, status, position, metadata } = body;

    const updateData: any = {};
    if (type) updateData.section = type;
    if (title) updateData.content_key = title;
    if (content !== undefined) updateData.content_value = content;
    if (image) {
      updateData.content_value = image;
      updateData.content_type = "image";
    }
    if (link) {
      updateData.content_value = link;
      updateData.content_type = "url";
    }
    if (status) updateData.is_active = status === "published";
    if (position !== undefined) updateData.display_order = position;
    if (metadata) updateData.metadata = metadata;

    const { data, error } = await supabase
      .from("site_content")
      .update(updateData)
      .eq("id", parseInt(id))
      .select()
      .single();

    if (error) {
      console.error("Error updating content:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      id: data.id.toString(),
      type: data.section,
      title: data.content_key,
      content: data.content_value,
      status: data.is_active ? "published" : "draft",
    });
  } catch (error) {
    console.error("Error in content PUT:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete content item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { error } = await supabase
      .from("site_content")
      .delete()
      .eq("id", parseInt(id));

    if (error) {
      console.error("Error deleting content:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in content DELETE:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
