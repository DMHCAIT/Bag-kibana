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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limit = searchParams.get('limit');
    const section = searchParams.get('section');

    // Fetch from database
    let query = supabaseAdmin
      .from('products')
      .select('*')
      .order('name', { ascending: true })
      .order('display_order', { ascending: true })
      .order('color', { ascending: true });

    // Filter by category
    if (category && category !== 'all') {
      query = query.ilike('category', `%${category}%`);
    }

    // Search by name
    if (search) {
      query = query.or(`name.ilike.%${search}%,color.ilike.%${search}%`);
    }

    // Filter by section
    if (section) {
      if (section === 'bestsellers') {
        query = query.eq('is_bestseller', true);
      } else if (section === 'new-arrivals') {
        query = query.eq('is_new', true);
      }
    }

    // Apply limit
    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const { data: dbProducts, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { products: [], total: 0, error: error.message },
        { status: 500 }
      );
    }

    if (!dbProducts || dbProducts.length === 0) {
      return NextResponse.json({
        products: [],
        total: 0,
        source: 'database',
        message: 'No products found in database'
      });
    }

    const formattedProducts = dbProducts.map(formatDbProduct);

    // Enrich products with color images
    // Group products by name to get all variants
    const productsByName: { [name: string]: any[] } = {};
    dbProducts.forEach((product: any) => {
      if (!productsByName[product.name]) {
        productsByName[product.name] = [];
      }
      productsByName[product.name].push(product);
    });

    // Enrich each product's colors array with images from variants
    formattedProducts.forEach((product: any) => {
      const variants = productsByName[product.name] || [];
      
      // Helper function to normalize color names for matching
      const normalizeColor = (color: string) => {
        return color.toLowerCase().trim()
          .replace(/\s+/g, ' ')  // normalize spaces
          .replace(/[^a-z0-9\s]/g, '');  // remove special chars
      };
      
      // Build color image map from variants
      const colorImageMap: { [key: string]: string } = {};
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
      
      // ALWAYS regenerate colors from actual variants to ensure data accuracy
      // This fixes issues where database colors array doesn't match actual variants
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
      
      // OLD CODE KEPT FOR REFERENCE BUT NOT USED
      if (false) {
        // Enrich existing colors array with images
        const shouldLog = ['VISTARA TOTE', 'VISTAPACK', 'PRIZMA SLING'].includes(product.name);
        if (shouldLog && product.color === variants[0]?.color) {
          console.log(`\n🎨 Color Mapping for ${product.name}:`);
          console.log('Available variants:', variants.map((v: any) => v.color).join(', '));
          console.log('Colors array:', product.colors.map((c: any) => c.name).join(', '));
          console.log('Color image map keys:', Object.keys(colorImageMap));
        }

        product.colors = product.colors.map((colorOption: any) => {
          const normalizedOptionName = normalizeColor(colorOption.name);
          const exactKey = colorOption.name.toLowerCase().trim();
          // Try exact match first, then normalized match
          const mappedImage = colorImageMap[exactKey] || colorImageMap[normalizedOptionName];
          
          // Fallback to current product's first image if no specific color image found
          const fallbackImage = product.images && product.images.length > 0 ? product.images[0] : null;
          
          if (shouldLog && product.color === variants[0]?.color) {
            console.log(`  - ${colorOption.name}: ${mappedImage ? '✅ Found' : '❌ Missing'}`);
          }
          
          return {
            ...colorOption,
            // Priority: mapped variant image > existing color image > current product's first image
            image: mappedImage || colorOption.image || fallbackImage
          };
        });
      }
    });

    return NextResponse.json(
      {
        products: formattedProducts,
        total: formattedProducts.length,
        source: 'database',
        status: 'success'
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { 
        products: [],
        total: 0,
        error: error.message,
        status: 'error'
      },
      { status: 500 }
    );
  }
}
