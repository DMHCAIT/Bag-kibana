import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET - Fetch all site content (including inactive) for admin
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section");

    let query = supabase
      .from("site_content")
      .select("*")
      .order("section")
      .order("display_order");

    if (section) {
      query = query.eq("section", section);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching site content:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error("Error in admin site content API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create new content entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { section, content_key, content_value, content_type, metadata, display_order, is_active } = body;

    if (!section || !content_key) {
      return NextResponse.json(
        { error: "section and content_key are required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("site_content")
      .insert({
        section,
        content_key,
        content_value: content_value || "",
        content_type: content_type || "text",
        metadata: metadata || {},
        display_order: display_order || 0,
        is_active: is_active !== undefined ? is_active : true,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating site content:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error in admin site content POST:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Bulk update content entries
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { updates } = body; // Array of { id, content_value, metadata, is_active, ... }

    if (!updates || !Array.isArray(updates)) {
      return NextResponse.json(
        { error: "updates array is required" },
        { status: 400 }
      );
    }

    const results = [];
    const errors = [];

    for (const update of updates) {
      const { id, ...fields } = update;
      
      if (!id) {
        errors.push({ error: "id is required", update });
        continue;
      }

      // If content_type is json, stringify the value if it's an object
      if (fields.content_value && typeof fields.content_value === "object") {
        fields.content_value = JSON.stringify(fields.content_value);
      }

      const { data, error } = await supabase
        .from("site_content")
        .update(fields)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        errors.push({ id, error: error.message });
      } else {
        results.push(data);
      }
    }

    return NextResponse.json({ updated: results, errors });
  } catch (error) {
    console.error("Error in admin site content PUT:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
