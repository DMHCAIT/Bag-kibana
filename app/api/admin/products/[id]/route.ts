import { NextRequest, NextResponse } from 'next/server';
import { getProduct, updateProduct, deleteProduct, Product } from '@/lib/products-store';

// GET - Fetch single product by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = getProduct(id);

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found', id },
        { status: 404 }
      );
    }

    // Return product with additional admin fields
    const adminProduct = {
      ...product,
      stock: (product as any).stock || 50, // Default stock
      is_bestseller: product.sections?.includes('bestsellers') || false,
      is_new: product.sections?.includes('new-arrivals') || false,
      care_instructions: (product as any).care_instructions || [
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

    // Handle sections based on is_bestseller and is_new flags
    const sections: string[] = [];
    if (data.is_bestseller) sections.push('bestsellers');
    if (data.is_new) sections.push('new-arrivals');
    
    const updateData: Partial<Product> = {
      ...data,
      sections: sections.length > 0 ? sections : undefined,
    };

    const updatedProduct = updateProduct(id, updateData);

    if (!updatedProduct) {
      return NextResponse.json(
        { error: 'Product not found', id },
        { status: 404 }
      );
    }

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

    // Handle sections based on is_bestseller and is_new flags
    const sections: string[] = [];
    if (data.is_bestseller) sections.push('bestsellers');
    if (data.is_new) sections.push('new-arrivals');
    
    const updateData: Partial<Product> = {
      ...data,
      sections: sections.length > 0 ? sections : undefined,
    };

    // Validate required fields
    if (!data.name || !data.category || !data.price || data.price <= 0) {
      return NextResponse.json(
        { error: 'Missing required fields (name, category, price)' },
        { status: 400 }
      );
    }

    const updatedProduct = updateProduct(id, updateData);

    if (!updatedProduct) {
      return NextResponse.json(
        { error: 'Product not found', id },
        { status: 404 }
      );
    }

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
    const product = getProduct(id);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found', id },
        { status: 404 }
      );
    }

    deleteProduct(id);

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
