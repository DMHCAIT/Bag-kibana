import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// PUT - Update a video
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (body.title !== undefined) updateData.title = body.title.trim();
    if (body.description !== undefined)
      updateData.description = body.description?.trim() || null;
    if (body.video_url !== undefined)
      updateData.video_url = body.video_url.trim();
    if (body.thumbnail_url !== undefined)
      updateData.thumbnail_url = body.thumbnail_url?.trim() || null;
    if (body.display_order !== undefined)
      updateData.display_order = body.display_order;
    if (body.is_active !== undefined) updateData.is_active = body.is_active;

    const { data, error } = await supabase
      .from("homepage_videos")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating video:", error);
      return NextResponse.json(
        { error: "Failed to update video" },
        { status: 500 }
      );
    }

    return NextResponse.json({ video: data });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a video
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get video info first (for cleanup)
    const { data: video } = await supabase
      .from("homepage_videos")
      .select("video_url, thumbnail_url")
      .eq("id", id)
      .single();

    // Delete from database
    const { error } = await supabase
      .from("homepage_videos")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting video:", error);
      return NextResponse.json(
        { error: "Failed to delete video" },
        { status: 500 }
      );
    }

    // Try to clean up storage (non-blocking)
    if (video?.video_url?.includes("supabase.co/storage")) {
      try {
        const urlObj = new URL(video.video_url);
        const pathParts = urlObj.pathname.split("videos/");
        if (pathParts[1]) {
          await supabase.storage
            .from("videos")
            .remove([decodeURIComponent(pathParts[1])]);
        }
      } catch {
        // Storage cleanup is best-effort
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
