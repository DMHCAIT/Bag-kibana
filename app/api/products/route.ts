import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Cache the static products import for faster fallback
let cachedStaticProducts: any = null;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '0');

    // First try to get from database with a timeout
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database timeout')), 3000)
    );
    
    let query = supabase.from('products').select('*');
    
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }
    
    if (search) {
      query = query.or(`name.ilike.%${search}%, description.ilike.%${search}%`);
    }

    if (limit > 0) {
      query = query.limit(limit);
    }

    const { data: dbProducts, error: dbError } = await Promise.race([
      query,
      timeoutPromise
    ]).catch(() => ({ data: null, error: 'timeout' })) as any;

    if (!dbError && dbProducts && dbProducts.length > 0) {
      // Transform database products to match frontend Product type
      const products = dbProducts.map((dbProduct: any) => ({
        id: dbProduct.id,
        name: dbProduct.name,
        category: dbProduct.category,
        price: dbProduct.price,
        description: dbProduct.description,
        color: dbProduct.color,
        images: Array.isArray(dbProduct.images) ? dbProduct.images : [dbProduct.images].filter(Boolean),
        stock: dbProduct.stock,
        features: Array.isArray(dbProduct.features) ? dbProduct.features : [],
        care_instructions: Array.isArray(dbProduct.care_instructions) ? dbProduct.care_instructions : [],
      }));
      
      return NextResponse.json(
        { products },
        { 
          headers: { 
            'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30' 
          } 
        }
      );
    }

    // If no products in database, fall back to static data (cached)
    if (!cachedStaticProducts) {
      const { products: staticProducts } = await import('@/lib/products-data');
      cachedStaticProducts = staticProducts;
    }
    
    let filteredProducts = cachedStaticProducts;
    
    if (category && category !== 'all') {
      filteredProducts = filteredProducts.filter(p => p.category === category);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(searchLower) || 
        p.description.toLowerCase().includes(searchLower)
      );
    }

    if (limit > 0) {
      filteredProducts = filteredProducts.slice(0, limit);
    }

    return NextResponse.json(
      { products: filteredProducts },
      { 
        headers: { 
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60' 
        } 
      }
    );
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}