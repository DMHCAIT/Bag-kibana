import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Helper function to generate slug from name and color
function generateSlug(name: string, color: string): string {
  const combined = `${name}-${color}`;
  return combined
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
}

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
    id: dbProduct.slug || dbProduct.id?.toString() || `product-${dbProduct.id}`,
    dbId: dbProduct.id,
    slug: dbProduct.slug,
    name: dbProduct.name,
    category: dbProduct.category,
    color: dbProduct.color,
    price: dbProduct.price,
    salePrice: dbProduct.sale_price,
    stock: dbProduct.stock || 50,
    rating: dbProduct.rating || 4.5,
    reviews: dbProduct.reviews || 0,
    images: dbProduct.images || [],
    description: dbProduct.description,
    specifications: dbProduct.specifications || {},
    features: dbProduct.features || [],
    careInstructions: dbProduct.care_instructions || [],
    care_instructions: dbProduct.care_instructions || [],
    colors: dbProduct.colors || [],
    sections: dbProduct.sections || [],
    is_bestseller: dbProduct.is_bestseller,
    is_new: dbProduct.is_new,
    isBestseller: dbProduct.is_bestseller,
    isNewArrival: dbProduct.is_new,
    createdAt: dbProduct.created_at,
    updatedAt: dbProduct.updated_at,
  };
}

// GET - Fetch single product by ID from database
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const dbId = extractDbId(id);
    
    if (dbId === null) {
      return NextResponse.json(
        { error: 'Invalid product ID', id },
        { status: 400 }
      );
    }

    const { data: dbProduct, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('id', dbId)
      .single();

    if (error || !dbProduct) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Product not found', id },
        { status: 404 }
      );
    }

    return NextResponse.json(formatDbProduct(dbProduct), {
      headers: {
        'Cache-Control': 'private, no-cache',
      }
    });
  } catch (error: any) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch product' },
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
      return NextResponse.json(
        { error: 'Invalid product ID', id },
        { status: 400 }
      );
    }

    // Fetch current product to get name/color for slug generation
    const { data: currentProduct } = await supabaseAdmin
      .from('products')
      .select('name, color')
      .eq('id', dbId)
      .single();

    // Prepare update data for Supabase
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (data.name !== undefined) updateData.name = data.name;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.color !== undefined) updateData.color = data.color;

    // Regenerate slug if name or color changed
    if (currentProduct && (data.name !== undefined || data.color !== undefined)) {
      const newName = data.name !== undefined ? data.name : currentProduct.name;
      const newColor = data.color !== undefined ? data.color : currentProduct.color;
      updateData.slug = generateSlug(newName, newColor);
    }
    if (data.price !== undefined) updateData.price = parseFloat(data.price);
    if (data.sale_price !== undefined) updateData.sale_price = parseFloat(data.sale_price);
    if (data.description !== undefined) updateData.description = data.description;
    if (data.images !== undefined) updateData.images = data.images;
    if (data.stock !== undefined) updateData.stock = parseInt(data.stock);
    if (data.features !== undefined) updateData.features = data.features;
    if (data.care_instructions !== undefined) updateData.care_instructions = data.care_instructions;
    if (data.careInstructions !== undefined) updateData.care_instructions = data.careInstructions;
    if (data.specifications !== undefined) updateData.specifications = data.specifications;
    if (data.rating !== undefined) updateData.rating = parseFloat(data.rating);
    if (data.reviews !== undefined) updateData.reviews = parseInt(data.reviews);
    if (data.is_bestseller !== undefined) updateData.is_bestseller = data.is_bestseller;
    if (data.isBestseller !== undefined) updateData.is_bestseller = data.isBestseller;
    if (data.is_new !== undefined) updateData.is_new = data.is_new;
    if (data.isNewArrival !== undefined) updateData.is_new = data.isNewArrival;
    if (data.colors !== undefined) updateData.colors = data.colors;
    if (data.sections !== undefined) updateData.sections = data.sections;

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
        { error: 'Invalid product ID', id },
        { status: 400 }
      );
    }

    // Full update data
    const updateData = {
      name: data.name,
      category: data.category,
      color: data.color || '',
      price: parseFloat(data.price),
      sale_price: data.sale_price ? parseFloat(data.sale_price) : null,
      description: data.description || '',
      images: data.images || [],
      stock: parseInt(data.stock || '50'),
      features: data.features || [],
      care_instructions: data.care_instructions || data.careInstructions || [],
      specifications: data.specifications || {},
      rating: parseFloat(data.rating || '4.5'),
      reviews: parseInt(data.reviews || '0'),
      is_bestseller: data.is_bestseller || data.isBestseller || false,
      is_new: data.is_new || data.isNewArrival || false,
      colors: data.colors || [],
      sections: data.sections || [],
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
        { error: 'Invalid product ID', id },
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
