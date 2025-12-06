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
    if (product.name) {
      const { data: variants } = await supabaseAdmin
        .from('products')
        .select('color, color_image, images')
        .eq('name', product.name);

      if (variants && variants.length > 0) {
        // Create a map of color -> image
        const colorImageMap: { [key: string]: string } = {};
        
        // Helper function to normalize color names for matching
        const normalizeColor = (color: string) => {
          return color.toLowerCase().trim()
            .replace(/\s+/g, ' ')  // normalize spaces
            .replace(/[^a-z0-9\s]/g, '');  // remove special chars
        };
        
        variants.forEach((variant: any) => {
          const normalizedColor = normalizeColor(variant.color);
          // Priority: color_image field > first product image
          const imageToUse = variant.color_image || (variant.images && variant.images.length > 0 ? variant.images[0] : '');
          if (imageToUse) {
            colorImageMap[normalizedColor] = imageToUse;
            // Also store with original lowercase for exact matches
            colorImageMap[variant.color.toLowerCase().trim()] = imageToUse;
          }
        });

        // If colors array is empty or null, auto-generate from variants
        if (!product.colors || product.colors.length === 0) {
          product.colors = variants.map((variant: any) => {
            // For each variant, try to get its specific image, or fallback to current product's image
            const variantImage = variant.color_image || (variant.images && variant.images.length > 0 ? variant.images[0] : null);
            const fallbackImage = product.images && product.images.length > 0 ? product.images[0] : null;
            
            return {
              name: variant.color,
              value: '#000000', // Default color value
              available: true,
              // Use variant's image if available, otherwise use current product's first image
              image: variantImage || fallbackImage
            };
          });
          console.log(`✅ Auto-generated ${product.colors.length} colors for ${product.name} from variants`);
        } else {
          // Enrich existing colors array with images
          product.colors = product.colors.map((colorOption: any) => {
            const normalizedOptionName = normalizeColor(colorOption.name);
            const exactKey = colorOption.name.toLowerCase().trim();
            // Try exact match first, then normalized match
            const mappedImage = colorImageMap[exactKey] || colorImageMap[normalizedOptionName];
            
            // Fallback to current product's first image if no specific color image found
            const fallbackImage = product.images && product.images.length > 0 ? product.images[0] : null;
            
            return {
              ...colorOption,
              // Priority: mapped variant image > existing color image > current product's first image
              image: mappedImage || colorOption.image || fallbackImage
            };
          });
        }
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
