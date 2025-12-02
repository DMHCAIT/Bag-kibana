import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Helper to extract database ID from product ID
function extractDbId(id: string): number | null {
  if (id.startsWith('product-')) {
    const numId = parseInt(id.replace('product-', ''));
    return isNaN(numId) ? null : numId;
  }
  const numId = parseInt(id);
  return isNaN(numId) ? null : numId;
}

// Helper function to format database product for frontend
function formatDbProduct(dbProduct: any) {
  return {
    id: `product-${dbProduct.id}`,
    dbId: dbProduct.id,
    name: dbProduct.name,
    category: dbProduct.category,
    color: dbProduct.color,
    price: dbProduct.price,
    salePrice: dbProduct.sale_price,
    stock: dbProduct.stock,
    rating: dbProduct.rating || 4.5,
    reviews: dbProduct.reviews || 0,
    images: dbProduct.images || [],
    description: dbProduct.description,
    specifications: dbProduct.specifications || {},
    features: dbProduct.features || [],
    careInstructions: dbProduct.care_instructions || [],
    colors: [],
    sections: [
      ...(dbProduct.is_bestseller ? ['bestsellers'] : []),
      ...(dbProduct.is_new ? ['new-arrivals'] : []),
    ],
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const dbId = extractDbId(id);
    
    if (dbId === null) {
      return NextResponse.json(
        { error: 'Invalid product ID format', id },
        { status: 400 }
      );
    }

    // Fetch from Supabase
    const { data: dbProduct, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('id', dbId)
      .single();

    if (error) {
      console.error('Supabase error fetching product:', error);
      return NextResponse.json(
        { error: 'Product not found', id },
        { status: 404 }
      );
    }

    if (!dbProduct) {
      return NextResponse.json(
        { error: 'Product not found', id },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        product: formatDbProduct(dbProduct),
        source: 'database',
        status: 'success'
      },
      {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      }
    );
  } catch (error: any) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
