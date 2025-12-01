import { NextRequest, NextResponse } from 'next/server';

// POST - Upload image(s)
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

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

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: `File ${file.name} is too large. Max size is 5MB.` },
          { status: 400 }
        );
      }

      // In a real app, upload to Supabase Storage or S3
      // For now, we'll simulate an upload and return a placeholder URL
      
      // Generate unique filename
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(7);
      const ext = file.name.split('.').pop();
      const filename = `${timestamp}-${randomStr}.${ext}`;

      // Simulated upload URL (in production, this would be actual Supabase URL)
      const uploadedUrl = `https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/${filename}`;
      
      uploadedUrls.push(uploadedUrl);

      /* REAL IMPLEMENTATION WITH SUPABASE:
      const { createClient } = require('@supabase/supabase-js');
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role key for server-side uploads
      );

      const buffer = Buffer.from(await file.arrayBuffer());
      
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(`products/${filename}`, buffer, {
          contentType: file.type,
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(`products/${filename}`);

      uploadedUrls.push(publicUrl);
      */
    }

    return NextResponse.json({
      message: `${uploadedUrls.length} file(s) uploaded successfully`,
      urls: uploadedUrls,
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

    // In a real app, delete from Supabase Storage
    /* REAL IMPLEMENTATION:
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const filePaths = urls.map(url => {
      const urlObj = new URL(url);
      return urlObj.pathname.split('/').slice(-1)[0]; // Get filename
    });

    const { data, error } = await supabase.storage
      .from('product-images')
      .remove(filePaths);

    if (error) throw error;
    */

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

