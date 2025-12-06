import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    // Get all products
    const { data: products } = await supabaseAdmin
      .from('products')
      .select('id, name, color, colors, color_image, images')
      .limit(5);

    return NextResponse.json({
      products: products?.map((p: any) => ({
        id: p.id,
        name: p.name,
        color: p.color,
        has_color_image: !!p.color_image,
        color_image: p.color_image,
        first_image: p.images?.[0],
        colors_array: p.colors,
        colors_count: p.colors?.length || 0
      })),
      message: 'Check if color names in colors array match product color field'
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
