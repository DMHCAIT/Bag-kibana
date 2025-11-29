import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // First try to get from database
    const { data: dbProduct, error: dbError } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (!dbError && dbProduct) {
      // Transform database product to match frontend Product type
      const product = {
        id: (dbProduct as any).id,
        name: (dbProduct as any).name,
        category: (dbProduct as any).category,
        price: (dbProduct as any).price,
        description: (dbProduct as any).description,
        color: (dbProduct as any).color,
        images: Array.isArray((dbProduct as any).images) ? (dbProduct as any).images : [(dbProduct as any).images].filter(Boolean),
        stock: (dbProduct as any).stock,
        features: Array.isArray((dbProduct as any).features) ? (dbProduct as any).features : [],
        care_instructions: Array.isArray((dbProduct as any).care_instructions) ? (dbProduct as any).care_instructions : [],
      };
      
      return NextResponse.json({ product });
    }

    // If not found in database, fall back to static data
    const { getProductById } = await import('@/lib/products-data');
    const staticProduct = getProductById(id);
    
    if (!staticProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ product: staticProduct });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}