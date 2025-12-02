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
    colors: [], // Will be populated from related products if needed
    sections: [
      ...(dbProduct.is_bestseller ? ['bestsellers'] : []),
      ...(dbProduct.is_new ? ['new-arrivals'] : []),
    ],
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limit = searchParams.get('limit');
    const section = searchParams.get('section');

    // Fetch from Supabase only
    let query = supabaseAdmin
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (category && category !== 'all') {
      query = query.ilike('category', category);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,color.ilike.%${search}%,category.ilike.%${search}%`);
    }

    if (section === 'bestsellers') {
      query = query.eq('is_bestseller', true);
    } else if (section === 'new-arrivals') {
      query = query.eq('is_new', true);
    }

    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const { data: dbProducts, error } = await query;

    if (error) {
      console.error('Supabase error fetching products:', error);
      return NextResponse.json(
        { 
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
    console.error('Error fetching products:', error);
    
    return NextResponse.json(
      { 
        products: [],
        total: 0,
        source: 'database',
        status: 'error',
        error: error.message || 'Failed to fetch products'
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-cache',
        },
      }
    );
  }
}
