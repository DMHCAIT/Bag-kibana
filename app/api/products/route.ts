import { NextRequest, NextResponse } from 'next/server';
import { getAllProducts, searchProducts, getProductsByCategory, Product } from '@/lib/products-store';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limit = searchParams.get('limit');

    // Use shared product store (includes admin updates)
    let filteredProducts: Product[] = getAllProducts();

    // Filter by category
    if (category && category !== 'all') {
      filteredProducts = getProductsByCategory(category);
    }

    // Search by name
    if (search) {
      filteredProducts = searchProducts(search);
      
      // If also filtering by category
      if (category && category !== 'all') {
        filteredProducts = filteredProducts.filter(p => 
          p.category.toLowerCase() === category.toLowerCase()
        );
      }
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
          // Short cache to see updates quickly
          'Cache-Control': 'private, no-cache, must-revalidate',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching products:', error);
    
    // Return all products as fallback
    const allProducts = getAllProducts();
    return NextResponse.json(
      { 
        products: allProducts,
        total: allProducts.length,
        status: 'fallback',
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
