import { NextRequest, NextResponse } from 'next/server';
import { products, getProductById } from '@/lib/products-data';
import type { Product as BaseProduct } from '@/lib/products-data';

// GET - Fetch single product by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = getProductById(id);

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found', id },
        { status: 404 }
      );
    }

    return NextResponse.json({
      product,
      status: 'success'
    }, {
      headers: {
        'Cache-Control': 'private, no-cache',
      }
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product', details: error },
      { status: 500 }
    );
  }
}

// PUT - Update product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    // Find existing product
    const existingProduct = getProductById(id);
    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found', id },
        { status: 404 }
      );
    }

    // Update product (merge with existing data)
    const updatedProduct: any = {
      ...existingProduct,
      ...data,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString(),
      publishedAt: data.status === 'published' && (existingProduct as any).status !== 'published'
        ? new Date().toISOString()
        : (existingProduct as any).publishedAt
    };

    // Validate required fields
    if (!updatedProduct.name || !updatedProduct.category || !updatedProduct.price || updatedProduct.price <= 0) {
      return NextResponse.json(
        { error: 'Missing required fields (name, category, price)' },
        { status: 400 }
      );
    }

    // In a real app, save to database
    // For now, just return the updated product
    return NextResponse.json({
      product: updatedProduct,
      message: 'Product updated successfully',
      status: 'success'
    }, {
      headers: {
        'Cache-Control': 'no-store',
      }
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product', details: error },
      { status: 500 }
    );
  }
}

// DELETE - Delete single product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if product exists
    const product = getProductById(id);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found', id },
        { status: 404 }
      );
    }

    // In a real app, delete from database
    // For now, just return success
    return NextResponse.json({
      message: 'Product deleted successfully',
      id,
      status: 'success'
    }, {
      headers: {
        'Cache-Control': 'no-store',
      }
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product', details: error },
      { status: 500 }
    );
  }
}
