import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { products as staticProducts } from '@/lib/products-data';

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
    rating: dbProduct.rating,
    reviews: dbProduct.reviews,
    images: dbProduct.images || [],
    description: dbProduct.description,
    specifications: dbProduct.specifications || {},
    features: dbProduct.features || [],
    careInstructions: dbProduct.care_instructions || [],
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

    // Try to get from database first
    const dbId = extractDbId(id);
    
    if (dbId !== null) {
      const { data: dbProduct, error } = await supabaseAdmin
        .from('products')
        .select('*')
        .eq('id', dbId)
        .single();

      if (!error && dbProduct) {
        return NextResponse.json(
          { 
            product: formatDbProduct(dbProduct),
            source: 'database',
            status: 'success'
          },
          {
            headers: {
              'Cache-Control': 'private, max-age=60, stale-while-revalidate=30',
            },
          }
        );
      }
    }

    // Fallback to static products
    const staticProduct = staticProducts.find((p: any) => p.id === id);

    if (!staticProduct) {
      return NextResponse.json(
        { error: 'Product not found', id },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        product: staticProduct,
        source: 'static',
        status: 'success'
      },
      {
        headers: {
          'Cache-Control': 'private, max-age=60, stale-while-revalidate=30',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
