import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Helper function to format database product for frontend
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
    stock: dbProduct.stock,
    rating: dbProduct.rating || 4.5,
    reviews: dbProduct.reviews || 0,
    images: dbProduct.images || [],
    description: dbProduct.description,
    specifications: dbProduct.specifications || {},
    features: dbProduct.features || [],
    careInstructions: dbProduct.care_instructions || [],
    colors: dbProduct.colors || [],
    sections: dbProduct.sections || [
      ...(dbProduct.is_bestseller ? ['bestsellers'] : []),
      ...(dbProduct.is_new ? ['new-arrivals'] : []),
    ],
  };
}

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

    // Try to find by slug first, then by numeric id
    let query = supabaseAdmin
      .from('products')
      .select('*');

    // Check if id is numeric
    const numericId = parseInt(id);
    if (!isNaN(numericId)) {
      // Numeric ID lookup
      query = query.eq('id', numericId);
    } else {
      // Slug-based lookup (e.g., "wallet-mint-green")
      query = query.eq('slug', id);
    }

    const { data: products, error } = await query.limit(1);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Database error', details: error.message },
        { status: 500 }
      );
    }

    if (!products || products.length === 0) {
      return NextResponse.json(
        { error: 'Product not found', id },
        { status: 404 }
      );
    }

    const product = formatDbProduct(products[0]);

    // Fetch all variants of the same product to populate color images
    if (product.name && product.colors && product.colors.length > 0) {
      const { data: variants } = await supabaseAdmin
        .from('products')
        .select('color, color_image, images')
        .eq('name', product.name);

      if (variants && variants.length > 0) {
        // Create a map of color -> image
        const colorImageMap: { [key: string]: string } = {};
        variants.forEach((variant: any) => {
          const colorKey = variant.color.toLowerCase().trim();
          // Prefer color_image, fallback to first product image
          colorImageMap[colorKey] = variant.color_image || (variant.images && variant.images[0]) || '';
        });

        // Enrich colors array with images
        product.colors = product.colors.map((colorOption: any) => {
          const colorKey = colorOption.name.toLowerCase().trim();
          return {
            ...colorOption,
            image: colorImageMap[colorKey] || colorOption.image || null
          };
        });
      }
    }

    return NextResponse.json(
      { 
        product,
        source: 'database',
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
