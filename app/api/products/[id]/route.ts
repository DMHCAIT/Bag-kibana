import { NextRequest, NextResponse } from 'next/server';
import { products, getProductById } from '@/lib/products-data';

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

    // Use static data directly for reliability
    const product = getProductById(id);

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found', id },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        product,
        status: 'success'
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
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
