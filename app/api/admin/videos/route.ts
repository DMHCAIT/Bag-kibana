import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Ensure homepage_videos table exists
async function ensureTable() {
  const { error } = await supabase.rpc("exec_sql", {
    sql: `
      CREATE TABLE IF NOT EXISTS homepage_videos (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        description TEXT,
        video_url TEXT NOT NULL,
        thumbnail_url TEXT,
        display_order INTEGER NOT NULL DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_homepage_videos_active 
        ON homepage_videos(is_active, display_order) WHERE is_active = true;
    `,
  });
  if (error) {
    console.error("Error ensuring homepage_videos table:", error);
  }
}

// GET - Fetch all videos (admin - includes inactive)
export async function GET() {
  try {
    await ensureTable();

    const { data, error } = await supabase
      .from("homepage_videos")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching videos:", error);
      return NextResponse.json(
        { error: "Failed to fetch videos" },
        { status: 500 }
      );
    }

    return NextResponse.json({ videos: data || [] });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create new video
export async function POST(request: NextRequest) {
  try {
    await ensureTable();

    const body = await request.json();
    const { title, description, video_url, thumbnail_url, is_active } = body;

    if (!title || !video_url) {
      return NextResponse.json(
        { error: "Title and video URL are required" },
        { status: 400 }
      );
    }

    // Get next display_order
    const { data: lastVideo } = await supabase
      .from("homepage_videos")
      .select("display_order")
      .order("display_order", { ascending: false })
      .limit(1)
      .single();

    const nextOrder = (lastVideo?.display_order ?? -1) + 1;

    const { data, error } = await supabase
      .from("homepage_videos")
      .insert({
        title: title.trim(),
        description: description?.trim() || null,
        video_url: video_url.trim(),
        thumbnail_url: thumbnail_url?.trim() || null,
        display_order: nextOrder,
        is_active: is_active !== false,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating video:", error);
      return NextResponse.json(
        { error: "Failed to create video" },
        { status: 500 }
      );
    }

    return NextResponse.json({ video: data }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
