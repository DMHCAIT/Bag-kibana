import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET - Fetch site content (public)
// ?section=hero_home - get specific section
// ?section=hero_home,footer - get multiple sections
// No params - get all active content
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section");

    let query = supabase
      .from("site_content")
      .select("*")
      .eq("is_active", true)
      .order("section")
      .order("display_order");

    if (section) {
      const sections = section.split(",").map((s) => s.trim());
      if (sections.length === 1) {
        query = query.eq("section", sections[0]);
      } else {
        query = query.in("section", sections);
      }
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching site content:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Group by section for easy frontend consumption
    const grouped: Record<string, Record<string, any>> = {};
    for (const item of data || []) {
      if (!grouped[item.section]) {
        grouped[item.section] = {};
      }
      // Parse JSON values
      let value = item.content_value;
      if (item.content_type === "json") {
        try {
          value = JSON.parse(value);
        } catch {}
      } else if (item.content_type === "number") {
        value = Number(value);
      } else if (item.content_type === "boolean") {
        value = value === "true";
      }
      grouped[item.section][item.content_key] = {
        value,
        type: item.content_type,
        metadata: item.metadata,
        id: item.id,
      };
    }

    return NextResponse.json({ content: grouped, raw: data });
  } catch (error) {
    console.error("Error in site content API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
