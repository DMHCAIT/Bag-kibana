import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Helper function to format database product for frontend
function formatDbProduct(dbProduct: any) {
  return {
    id: dbProduct.id?.toString() || `product-${dbProduct.id}`,
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
    colors: dbProduct.colors || [],
    sections: dbProduct.sections || [
      ...(dbProduct.is_bestseller ? ['bestsellers'] : []),
      ...(dbProduct.is_new ? ['new-arrivals'] : []),
    ],
  };
}

// GET - Fetch products by section from database
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ section: string }> }
) {
  try {
    const { section } = await params;

    if (!section) {
      return NextResponse.json(
        { error: 'Section parameter is required' },
        { status: 400 }
      );
    }

    // Build query based on section
    let query = supabaseAdmin
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    // Filter by section
    if (section === 'bestsellers') {
      query = query.eq('is_bestseller', true);
    } else if (section === 'new-arrivals' || section === 'new') {
      query = query.eq('is_new', true);
    } else if (section === 'featured') {
      query = query.eq('is_featured', true);
    }

    const { data: dbProducts, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { section, products: [], total: 0, error: error.message },
        { status: 500 }
      );
    }

    if (!dbProducts || dbProducts.length === 0) {
      return NextResponse.json({
        section,
        products: [],
        total: 0,
        source: 'database',
        message: `No products found for section: ${section}`
      });
    }

    const formattedProducts = dbProducts.map(formatDbProduct);

    return NextResponse.json(
      {
        section,
        products: formattedProducts,
        total: formattedProducts.length,
        source: 'database',
        status: 'success'
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=60, stale-while-revalidate=30',
        },
      }
    );
  } catch (error: any) {
    console.error('Error fetching section products:', error);
    
    return NextResponse.json(
      {
        section: '',
        products: [],
        total: 0,
        status: 'error',
        error: error.message
      },
      { status: 500 }
    );
  }
}
