import { NextRequest, NextResponse } from 'next/server';
import { products, Product } from '@/lib/products-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limit = searchParams.get('limit');

    // Always use static data for reliability
    let filteredProducts: Product[] = products;

    // Filter by category
    if (category && category !== 'all') {
      filteredProducts = filteredProducts.filter((p: Product) => 
        p.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Search by name
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter((p: Product) =>
        p.name.toLowerCase().includes(searchLower) ||
        p.color.toLowerCase().includes(searchLower) ||
        p.category.toLowerCase().includes(searchLower)
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
        status: 'success'
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching products:', error);
    
    // Return all products as fallback
    return NextResponse.json(
      { 
        products: products,
        total: products.length,
        status: 'fallback',
        error: 'Using static data'
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      }
    );
  }
}
