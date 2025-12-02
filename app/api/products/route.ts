import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { products as staticProducts } from '@/lib/products-data';

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limit = searchParams.get('limit');
    const section = searchParams.get('section');

    // Try to fetch from Supabase first
    let query = supabaseAdmin
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (category && category !== 'all') {
      query = query.eq('category', category);
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

    // If database has products, combine with static (database takes priority)
    if (!error && dbProducts && dbProducts.length > 0) {
      const formattedDbProducts = dbProducts.map(formatDbProduct);
      
      // Filter static products that aren't in database
      let filteredStaticProducts = staticProducts.filter((sp: any) => {
        // Don't include static products if we have database products
        return false;
      });

      const allProducts = [...formattedDbProducts, ...filteredStaticProducts];

      return NextResponse.json(
        { 
          products: allProducts,
          total: allProducts.length,
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

    // Fallback to static products
    let filteredProducts = [...staticProducts] as any[];

    // Filter by category
    if (category && category !== 'all') {
      filteredProducts = filteredProducts.filter((p: any) => 
        p.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Search by name
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter((p: any) =>
        p.name.toLowerCase().includes(searchLower) ||
        p.color.toLowerCase().includes(searchLower)
      );
    }

    // Filter by section
    if (section) {
      filteredProducts = filteredProducts.filter((p: any) => 
        p.sections?.includes(section)
      );
    }

    // Apply limit
    if (limit) {
      const limitNum = parseInt(limit, 10);
      if (!isNaN(limitNum) && limitNum > 0) {
        filteredProducts = filteredProducts.slice(0, limitNum);
      }
    }

    return NextResponse.json(
      { 
        products: filteredProducts,
        total: filteredProducts.length,
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
    console.error('Error fetching products:', error);
    
    // Return static products as fallback
    return NextResponse.json(
      { 
        products: staticProducts,
        total: staticProducts.length,
        source: 'fallback',
        status: 'error',
        error: 'Using static data'
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'private, no-cache',
        },
      }
    );
  }
}
