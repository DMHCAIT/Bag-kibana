import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    // Fetch a few products to check their colors field
    const { data: products, error } = await supabaseAdmin
      .from('products')
      .select('id, name, color, colors, images')
      .in('name', ['VISTARA TOTE', 'VISTAPACK', 'SANDESH LAPTOP BAG', 'PRIZMA SLING', 'WALLET'])
      .limit(10);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Format response to show what we have
    const analysis = products?.map(p => ({
      name: p.name,
      color: p.color,
      hasColors: !!p.colors,
      colorsCount: p.colors ? (Array.isArray(p.colors) ? p.colors.length : 'not array') : 0,
      colorsData: p.colors,
      hasImages: !!p.images,
      imagesCount: p.images ? p.images.length : 0,
      firstImage: p.images?.[0] || null
    }));

    return NextResponse.json({
      status: 'success',
      count: products?.length || 0,
      analysis,
      rawProducts: products
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
