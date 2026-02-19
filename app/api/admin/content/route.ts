import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET - Fetch all content items
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    let query = supabase
      .from("site_content")
      .select("*")
      .order("display_order", { ascending: true });

    if (type) {
      query = query.eq("section", type);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching content:", error);
      return NextResponse.json({ contents: [] });
    }

    // Map to the format the content admin page expects
    const contents = (data || []).map((item) => ({
      id: item.id.toString(),
      type: item.section,
      title: item.content_key,
      content: item.content_value || "",
      image: item.content_type === "image" ? item.content_value : "",
      link: item.content_type === "url" ? item.content_value : "",
      status: item.is_active ? "published" : "draft",
      position: item.display_order,
      metadata: item.metadata || {},
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    }));

    return NextResponse.json({ contents });
  } catch (error) {
    console.error("Error in content API:", error);
    return NextResponse.json({ contents: [] });
  }
}

// POST - Create new content item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, title, content, image, link, status, position, metadata } = body;

    const { data, error } = await supabase
      .from("site_content")
      .insert({
        section: type || "page",
        content_key: title || "untitled",
        content_value: content || image || link || "",
        content_type: image ? "image" : link ? "url" : "text",
        display_order: position || 0,
        is_active: status === "published",
        metadata: { ...metadata, original_title: title, link, image },
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating content:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      id: data.id.toString(),
      type: data.section,
      title: data.content_key,
      content: data.content_value,
      status: data.is_active ? "published" : "draft",
      position: data.display_order,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    });
  } catch (error) {
    console.error("Error in content POST:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
