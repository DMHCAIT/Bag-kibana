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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limit = searchParams.get('limit');
    const section = searchParams.get('section');
    const source = searchParams.get('source'); // 'db' for database only

    // If source=db, only fetch from database
    if (source === 'db') {
      let query = supabaseAdmin
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (category && category !== 'all') {
        query = query.ilike('category', category);
      }

      if (limit) {
        query = query.limit(parseInt(limit));
      }

      const { data: dbProducts, error } = await query;

      if (error || !dbProducts) {
        return NextResponse.json({ products: [], total: 0, source: 'database' });
      }

      return NextResponse.json({
        products: dbProducts.map(formatDbProduct),
        total: dbProducts.length,
        source: 'database'
      });
    }

    // Default: Use static products (original behavior)
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
          'Cache-Control': 'public, max-age=60, stale-while-revalidate=30',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching products:', error);
    
    // Always return static products on error
    return NextResponse.json(
      { 
        products: staticProducts,
        total: staticProducts.length,
        source: 'static',
        status: 'fallback'
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, max-age=60',
        },
      }
    );
  }
}
