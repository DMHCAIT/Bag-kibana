import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";
export const maxDuration = 120; // 2 minutes for large video uploads

// POST - Upload video to Supabase Storage
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ["video/mp4", "video/webm", "video/quicktime"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: MP4, WebM, QuickTime" },
        { status: 400 }
      );
    }

    // Validate file size (100MB)
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error: `File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Max 100MB.`,
        },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(7);
    const ext = file.name.split(".").pop() || "mp4";
    const sanitizedName = file.name
      .replace(/[^a-zA-Z0-9.-]/g, "_")
      .replace(/\.[^/.]+$/, "");
    const filename = `homepage/${timestamp}-${randomStr}-${sanitizedName}.${ext}`;

    // Convert to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to Supabase Storage
    const { error } = await supabaseAdmin.storage
      .from("videos")
      .upload(filename, buffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Supabase storage upload error:", error);

      // If bucket doesn't exist, try with product-images bucket as fallback
      if (error.message?.includes("not found") || error.message?.includes("Bucket")) {
        const fallbackFilename = `videos/${timestamp}-${randomStr}-${sanitizedName}.${ext}`;
        const { error: fallbackError } =
          await supabaseAdmin.storage
            .from("product-images")
            .upload(fallbackFilename, buffer, {
              contentType: file.type,
              cacheControl: "3600",
              upsert: false,
            });

        if (fallbackError) {
          console.error("Fallback upload error:", fallbackError);
          return NextResponse.json(
            { error: "Upload failed. Please create a 'videos' storage bucket in Supabase." },
            { status: 500 }
          );
        }

        const {
          data: { publicUrl },
        } = supabaseAdmin.storage
          .from("product-images")
          .getPublicUrl(fallbackFilename);

        return NextResponse.json({ url: publicUrl }, { status: 201 });
      }

      return NextResponse.json(
        { error: error.message || "Upload failed" },
        { status: 500 }
      );
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from("videos").getPublicUrl(filename);

    return NextResponse.json({ url: publicUrl }, { status: 201 });
  } catch (err) {
    console.error("Video upload error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
