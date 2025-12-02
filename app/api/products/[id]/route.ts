import { NextRequest, NextResponse } from 'next/server';
import { products as staticProducts } from '@/lib/products-data';

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

    // Find product in static data
    const product = staticProducts.find((p: any) => p.id === id);

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found', id },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        product,
        source: 'static',
        status: 'success'
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=60, stale-while-revalidate=30',
        },
      }
    );
  } catch (error: any) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
