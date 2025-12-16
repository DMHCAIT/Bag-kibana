import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Configure route to accept larger payloads
export const runtime = 'nodejs';
export const maxDuration = 60; // 60 seconds timeout
export const dynamic = 'force-dynamic';

// POST - Upload image(s)
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    // Support both 'file' (single) and 'files' (multiple)
    const singleFile = formData.get('file') as File | null;
    const multipleFiles = formData.getAll('files') as File[];
    const files = singleFile ? [singleFile] : multipleFiles;

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        continue; // Skip non-image files
      }

      // Validate file size (max 100MB - practical limit for web uploads)
      if (file.size > 100 * 1024 * 1024) {
        return NextResponse.json(
          { error: `File ${file.name} is too large (${(file.size / 1024 / 1024).toFixed(2)}MB). Max size is 100MB.` },
          { status: 400 }
        );
      }

      // Generate unique filename
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(7);
      const ext = file.name.split('.').pop();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filename = `${timestamp}-${randomStr}-${sanitizedName}`;

      try {
        // REAL IMPLEMENTATION WITH SUPABASE
        const buffer = Buffer.from(await file.arrayBuffer());
        
        const { data, error } = await supabaseAdmin.storage
          .from('product-images')
          .upload(`products/${filename}`, buffer, {
            contentType: file.type,
            cacheControl: '3600',
            upsert: false
          });

        if (error) {
          console.error('Supabase upload error:', error);
          throw error;
        }

        const { data: { publicUrl } } = supabaseAdmin.storage
          .from('product-images')
          .getPublicUrl(`products/${filename}`);

        uploadedUrls.push(publicUrl);
        console.log(`✅ Uploaded: ${filename} -> ${publicUrl}`);
      } catch (uploadError: any) {
        console.error(`Failed to upload ${file.name}:`, uploadError);
        return NextResponse.json(
          { error: `Failed to upload ${file.name}: ${uploadError.message}` },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      message: `${uploadedUrls.length} file(s) uploaded successfully`,
      url: uploadedUrls[0], // For single file upload
      urls: uploadedUrls, // For multiple files
      status: 'success'
    }, {
      status: 201,
      headers: {
        'Cache-Control': 'no-store',
      }
    });
  } catch (error) {
    console.error('Error uploading files:', error);
    return NextResponse.json(
      { error: 'Failed to upload files', details: error },
      { status: 500 }
    );
  }
}

// DELETE - Delete image(s)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const urls = searchParams.get('urls')?.split(',') || [];

    if (urls.length === 0) {
      return NextResponse.json(
        { error: 'No URLs provided' },
        { status: 400 }
      );
    }

    // REAL IMPLEMENTATION: Delete from Supabase Storage
    try {
      const filePaths = urls.map(url => {
        const urlObj = new URL(url);
        // Extract path after 'product-images/'
        const pathParts = urlObj.pathname.split('product-images/');
        return pathParts.length > 1 ? pathParts[1] : '';
      }).filter(path => path);

      if (filePaths.length === 0) {
        return NextResponse.json(
          { error: 'Invalid URLs provided' },
          { status: 400 }
        );
      }

      const { data, error } = await supabaseAdmin.storage
        .from('product-images')
        .remove(filePaths);

      if (error) {
        console.error('Supabase delete error:', error);
        throw error;
      }

      console.log(`✅ Deleted ${filePaths.length} file(s) from storage`);
    } catch (deleteError: any) {
      console.error('Failed to delete files:', deleteError);
      return NextResponse.json(
        { error: `Failed to delete files: ${deleteError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: `${urls.length} file(s) deleted successfully`,
      deletedUrls: urls,
      status: 'success'
    }, {
      headers: {
        'Cache-Control': 'no-store',
      }
    });
  } catch (error) {
    console.error('Error deleting files:', error);
    return NextResponse.json(
      { error: 'Failed to delete files', details: error },
      { status: 500 }
    );
  }
}

