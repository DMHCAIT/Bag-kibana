import { NextRequest, NextResponse } from 'next/server';
import { products, getProductById } from '@/lib/products-data';
import type { Product as BaseProduct } from '@/lib/products-data';

// In-memory storage for updated products (in production, use a database)
const updatedProducts = new Map<string, any>();

// GET - Fetch single product by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if we have an updated version
    if (updatedProducts.has(id)) {
      return NextResponse.json(updatedProducts.get(id), {
        headers: {
          'Cache-Control': 'private, no-cache',
        }
      });
    }

    const product = getProductById(id);

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found', id },
        { status: 404 }
      );
    }

    // Return product with additional admin fields
    const adminProduct = {
      ...product,
      stock: 50, // Default stock
      is_bestseller: product.sections?.includes('bestsellers') || false,
      is_new: product.sections?.includes('new-arrivals') || false,
      care_instructions: [
        "Keep away from direct sunlight",
        "Store in a dust bag when not in use",
        "Clean with a soft, dry cloth",
        "Avoid contact with water and oils"
      ],
    };

    return NextResponse.json(adminProduct, {
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

// PATCH - Update product (partial update)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    // Find existing product
    const existingProduct = updatedProducts.has(id) 
      ? updatedProducts.get(id)
      : getProductById(id);
      
    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found', id },
        { status: 404 }
      );
    }

    // Merge update data with existing product
    const updatedProduct = {
      ...existingProduct,
      ...data,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString(),
    };

    // Handle sections based on is_bestseller and is_new flags
    const sections: string[] = [];
    if (data.is_bestseller) sections.push('bestsellers');
    if (data.is_new) sections.push('new-arrivals');
    if (sections.length > 0) {
      updatedProduct.sections = sections;
    }

    // Store the updated product
    updatedProducts.set(id, updatedProduct);

    return NextResponse.json({
      ...updatedProduct,
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

// PUT - Update product (full update)
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
    };

    // Handle sections based on is_bestseller and is_new flags
    const sections: string[] = [];
    if (data.is_bestseller) sections.push('bestsellers');
    if (data.is_new) sections.push('new-arrivals');
    if (sections.length > 0) {
      updatedProduct.sections = sections;
    }

    // Validate required fields
    if (!updatedProduct.name || !updatedProduct.category || !updatedProduct.price || updatedProduct.price <= 0) {
      return NextResponse.json(
        { error: 'Missing required fields (name, category, price)' },
        { status: 400 }
      );
    }

    // Store the updated product
    updatedProducts.set(id, updatedProduct);

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
    if (!product && !updatedProducts.has(id)) {
      return NextResponse.json(
        { error: 'Product not found', id },
        { status: 404 }
      );
    }

    // Remove from updated products if exists
    updatedProducts.delete(id);

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
