import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

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

// GET - Fetch products by section from database only
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

    // Map section names to database columns
    const sectionColumn = section === 'bestsellers' ? 'is_bestseller' : 
                          section === 'new-arrivals' ? 'is_new' : null;

    if (!sectionColumn) {
      return NextResponse.json(
        {
          section,
          products: [],
          total: 0,
          source: 'database',
          status: 'success'
        },
        {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
          },
        }
      );
    }

    // Fetch from Supabase
    const { data: dbProducts, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq(sectionColumn, true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error fetching section products:', error);
      return NextResponse.json(
        {
          section,
          products: [],
          total: 0,
          source: 'database',
          status: 'error',
          error: error.message
        },
        {
          status: 200,
          headers: {
            'Cache-Control': 'no-cache',
          },
        }
      );
    }

    const formattedProducts = (dbProducts || []).map(formatDbProduct);

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
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      }
    );
  } catch (error: any) {
    console.error('Error fetching section products:', error);
    
    const { section } = await params;
    
    return NextResponse.json(
      {
        section,
        products: [],
        total: 0,
        source: 'database',
        status: 'error',
        error: error.message || 'Failed to fetch products'
      },
      { status: 200 }
    );
  }
}
