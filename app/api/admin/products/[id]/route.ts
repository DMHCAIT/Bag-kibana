import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { products as staticProducts } from '@/lib/products-data';

// Helper to extract database ID from product ID (e.g., "product-123" -> 123)
function extractDbId(id: string): number | null {
  if (id.startsWith('product-')) {
    const numId = parseInt(id.replace('product-', ''));
    return isNaN(numId) ? null : numId;
  }
  const numId = parseInt(id);
  return isNaN(numId) ? null : numId;
}

// Helper function to format database product
function formatDbProduct(dbProduct: any) {
  return {
    id: `product-${dbProduct.id}`,
    dbId: dbProduct.id,
    name: dbProduct.name,
    category: dbProduct.category,
    color: dbProduct.color,
    price: dbProduct.price,
    salePrice: dbProduct.sale_price,
    stock: dbProduct.stock || 50,
    rating: dbProduct.rating,
    reviews: dbProduct.reviews,
    images: dbProduct.images || [],
    description: dbProduct.description,
    specifications: dbProduct.specifications || {},
    features: dbProduct.features || [],
    careInstructions: dbProduct.care_instructions || [],
    care_instructions: dbProduct.care_instructions || [],
    is_bestseller: dbProduct.is_bestseller,
    is_new: dbProduct.is_new,
    isBestseller: dbProduct.is_bestseller,
    isNewArrival: dbProduct.is_new,
    createdAt: dbProduct.created_at,
    updatedAt: dbProduct.updated_at,
  };
}

// GET - Fetch single product by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Try to get from database first
    const dbId = extractDbId(id);
    
    if (dbId !== null) {
      const { data: dbProduct, error } = await supabaseAdmin
        .from('products')
        .select('*')
        .eq('id', dbId)
        .single();

      if (!error && dbProduct) {
        return NextResponse.json(formatDbProduct(dbProduct), {
          headers: {
            'Cache-Control': 'private, no-cache',
          }
        });
      }
    }

    // Fallback to static products
    const staticProduct = staticProducts.find((p: any) => p.id === id);
    
    if (!staticProduct) {
      return NextResponse.json(
        { error: 'Product not found', id },
        { status: 404 }
      );
    }

    // Return static product with admin fields
    const adminProduct = {
      ...staticProduct,
      stock: (staticProduct as any).stock || 50,
      is_bestseller: (staticProduct as any).sections?.includes('bestsellers') || false,
      is_new: (staticProduct as any).sections?.includes('new-arrivals') || false,
      care_instructions: (staticProduct as any).care_instructions || [
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
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// PATCH - Update product in Supabase
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    const dbId = extractDbId(id);
    
    if (dbId === null) {
      // Static products can't be edited - prompt to add to database
      return NextResponse.json(
        { error: 'Cannot edit static products. Please add product to database first.', id },
        { status: 400 }
      );
    }

    // Prepare update data for Supabase
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (data.name !== undefined) updateData.name = data.name;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.color !== undefined) updateData.color = data.color;
    if (data.price !== undefined) updateData.price = parseFloat(data.price);
    if (data.description !== undefined) updateData.description = data.description;
    if (data.images !== undefined) updateData.images = data.images;
    if (data.stock !== undefined) updateData.stock = parseInt(data.stock);
    if (data.features !== undefined) updateData.features = data.features;
    if (data.care_instructions !== undefined) updateData.care_instructions = data.care_instructions;
    if (data.specifications !== undefined) updateData.specifications = data.specifications;
    if (data.rating !== undefined) updateData.rating = parseFloat(data.rating);
    if (data.reviews !== undefined) updateData.reviews = parseInt(data.reviews);
    if (data.is_bestseller !== undefined) updateData.is_bestseller = data.is_bestseller;
    if (data.is_new !== undefined) updateData.is_new = data.is_new;

    console.log('Updating product:', dbId, updateData);

    const { data: updatedProduct, error } = await supabaseAdmin
      .from('products')
      .update(updateData)
      .eq('id', dbId)
      .select()
      .single();

    if (error) {
      console.error('Supabase error updating product:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to update product' },
        { status: 500 }
      );
    }

    if (!updatedProduct) {
      return NextResponse.json(
        { error: 'Product not found', id },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...formatDbProduct(updatedProduct),
      message: 'Product updated successfully',
      status: 'success'
    }, {
      headers: {
        'Cache-Control': 'no-store',
      }
    });
  } catch (error: any) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update product' },
      { status: 500 }
    );
  }
}

// PUT - Full update product in Supabase
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    // Validate required fields
    if (!data.name || !data.category || !data.price || data.price <= 0) {
      return NextResponse.json(
        { error: 'Missing required fields (name, category, price)' },
        { status: 400 }
      );
    }

    const dbId = extractDbId(id);
    
    if (dbId === null) {
      return NextResponse.json(
        { error: 'Cannot edit static products. Please add product to database first.', id },
        { status: 400 }
      );
    }

    // Full update data
    const updateData = {
      name: data.name,
      category: data.category,
      color: data.color || '',
      price: parseFloat(data.price),
      description: data.description || '',
      images: data.images || [],
      stock: parseInt(data.stock || '50'),
      features: data.features || [],
      care_instructions: data.care_instructions || [],
      specifications: data.specifications || {},
      rating: parseFloat(data.rating || '4.5'),
      reviews: parseInt(data.reviews || '0'),
      is_bestseller: data.is_bestseller || false,
      is_new: data.is_new || false,
      updated_at: new Date().toISOString(),
    };

    const { data: updatedProduct, error } = await supabaseAdmin
      .from('products')
      .update(updateData)
      .eq('id', dbId)
      .select()
      .single();

    if (error) {
      console.error('Supabase error updating product:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to update product' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      product: formatDbProduct(updatedProduct),
      message: 'Product updated successfully',
      status: 'success'
    }, {
      headers: {
        'Cache-Control': 'no-store',
      }
    });
  } catch (error: any) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE - Delete product from Supabase
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const dbId = extractDbId(id);
    
    if (dbId === null) {
      return NextResponse.json(
        { error: 'Cannot delete static products', id },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', dbId);

    if (error) {
      console.error('Supabase error deleting product:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to delete product' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Product deleted successfully',
      id,
      status: 'success'
    }, {
      headers: {
        'Cache-Control': 'no-store',
      }
    });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete product' },
      { status: 500 }
    );
  }
}
