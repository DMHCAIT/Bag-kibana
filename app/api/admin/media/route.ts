import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET - List all media files from Supabase storage
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get("folder") || "";
    const search = searchParams.get("search") || "";
    const bucket = searchParams.get("bucket") || "product-images";

    const { data: files, error } = await supabase.storage
      .from(bucket)
      .list(folder, {
        limit: 100,
        offset: 0,
        sortBy: { column: "created_at", order: "desc" },
      });

    if (error) {
      console.error("Error listing media:", error);
      return NextResponse.json({ files: [], error: error.message });
    }

    // Build public URLs for each file
    const mediaFiles = (files || [])
      .filter((f) => f.name !== ".emptyFolderPlaceholder")
      .filter((f) => !search || f.name.toLowerCase().includes(search.toLowerCase()))
      .map((file) => {
        const path = folder ? `${folder}/${file.name}` : file.name;
        const { data: urlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(path);

        return {
          id: file.id || file.name,
          name: file.name,
          path,
          url: urlData.publicUrl,
          size: file.metadata?.size || 0,
          type: file.metadata?.mimetype || "unknown",
          folder: folder || "root",
          bucket,
          created_at: file.created_at,
          updated_at: file.updated_at,
        };
      });

    // Also list folders (buckets)
    const buckets = ["product-images", "HERO SECTION", "videos"];

    return NextResponse.json({
      files: mediaFiles,
      buckets,
      currentFolder: folder,
      currentBucket: bucket,
    });
  } catch (error) {
    console.error("Error in media API:", error);
    return NextResponse.json({ files: [], error: "Internal server error" });
  }
}

// POST - Upload media file
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "";
    const bucket = (formData.get("bucket") as string) || "product-images";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Error uploading media:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return NextResponse.json({
      success: true,
      file: {
        name: fileName,
        path: data.path,
        url: urlData.publicUrl,
        bucket,
      },
    });
  } catch (error) {
    console.error("Error in media upload:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete media file
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { paths, bucket } = body;

    if (!paths || !Array.isArray(paths) || paths.length === 0) {
      return NextResponse.json(
        { error: "paths array is required" },
        { status: 400 }
      );
    }

    const { error } = await supabase.storage
      .from(bucket || "product-images")
      .remove(paths);

    if (error) {
      console.error("Error deleting media:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, deleted: paths.length });
  } catch (error) {
    console.error("Error in media DELETE:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
