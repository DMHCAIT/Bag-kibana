import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Product } from '@/lib/products-data';

// Cache the static products import
let cachedStaticProducts: Product[] | null = null;

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

    // First try to get from database with timeout
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database timeout')), 2000)
    );

    const { data: dbProduct, error: dbError } = await Promise.race([
      supabase.from('products').select('*').eq('id', id).single(),
      timeoutPromise
    ]).catch(() => ({ data: null, error: 'timeout' })) as any;

    if (!dbError && dbProduct) {
      // Transform database product to match frontend Product type
      const product = {
        id: dbProduct.id,
        name: dbProduct.name,
        category: dbProduct.category,
        color: dbProduct.color,
        price: dbProduct.price,
        rating: dbProduct.rating || 4.5,
        reviews: dbProduct.reviews || 0,
        images: Array.isArray(dbProduct.images) ? dbProduct.images : [dbProduct.images].filter(Boolean),
        description: dbProduct.description,
        specifications: dbProduct.specifications || {
          material: dbProduct.material || 'Premium Leather',
          texture: dbProduct.texture || 'Smooth',
          closureType: dbProduct.closure_type || 'Zipper',
          hardware: dbProduct.hardware || 'Gold-tone',
          compartments: Array.isArray(dbProduct.compartments) ? dbProduct.compartments : [],
          shoulderDrop: dbProduct.shoulder_drop,
          capacity: dbProduct.capacity,
          dimensions: dbProduct.dimensions,
          idealFor: dbProduct.ideal_for || 'Women',
        },
        features: Array.isArray(dbProduct.features) ? dbProduct.features : [],
        colors: Array.isArray(dbProduct.colors) ? dbProduct.colors : [],
      };
      
      return NextResponse.json(
        { product },
        { 
          headers: { 
            'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=60' 
          } 
        }
      );
    }

    // If not in database, fall back to static data (cached)
    if (!cachedStaticProducts) {
      const { products: staticProducts } = await import('@/lib/products-data');
      cachedStaticProducts = staticProducts;
    }
    const product = cachedStaticProducts.find((p: any) => p.id === id);

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { product },
      { 
        headers: { 
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=120' 
        } 
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

