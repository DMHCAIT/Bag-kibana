import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getCached, setCached } from '@/lib/redis';
import { products as staticProducts } from '@/lib/products-data';

// Run on edge network for faster global response
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 600; // Cache for 10 minutes

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

    // Create cache key based on query parameters
    const cacheKey = `products:${category || 'all'}:${search || 'none'}:${limit || 'all'}:${section || 'all'}`;
    
    // Try to get from Redis cache first
    const cached = await getCached(cacheKey);
    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          'X-Cache': 'HIT',
          'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1800',
        },
      });
    }

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
      console.log('📦 Falling back to static products data');
      
      // Fallback to static products
      let fallbackProducts = staticProducts;
      
      // Apply same filters to static products
      if (category && category !== 'all') {
        fallbackProducts = fallbackProducts.filter(p => 
          p.category.toLowerCase().includes(category.toLowerCase())
        );
      }
      
      if (search) {
        fallbackProducts = fallbackProducts.filter(p =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.color.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      if (section) {
        fallbackProducts = fallbackProducts.filter(p => 
          p.sections?.includes(section)
        );
      }
      
      if (limit) {
        fallbackProducts = fallbackProducts.slice(0, parseInt(limit));
      }
      
      return NextResponse.json({
        products: fallbackProducts,
        total: fallbackProducts.length,
        source: 'static-fallback',
        message: 'Using static products data due to database connection issue'
      });
    }

    if (!dbProducts || dbProducts.length === 0) {
      console.log('📦 No products in database, using static data');
      
      // If database is empty, use static products
      let fallbackProducts = staticProducts;
      
      // Apply filters
      if (category && category !== 'all') {
        fallbackProducts = fallbackProducts.filter(p => 
          p.category.toLowerCase().includes(category.toLowerCase())
        );
      }
      
      if (search) {
        fallbackProducts = fallbackProducts.filter(p =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.color.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      if (section) {
        fallbackProducts = fallbackProducts.filter(p => 
          p.sections?.includes(section)
        );
      }
      
      if (limit) {
        fallbackProducts = fallbackProducts.slice(0, parseInt(limit));
      }
      
      return NextResponse.json({
        products: fallbackProducts,
        total: fallbackProducts.length,
        source: 'static',
        message: 'Using static products data'
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

    const response = {
      products: formattedProducts,
      total: formattedProducts.length,
      source: 'database',
      status: 'success'
    };

    // Cache the response in Redis (15 minutes)
    await setCached(cacheKey, response, 900);

    return NextResponse.json(response, {
      headers: {
        'X-Cache': 'MISS',
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1800',
      },
    });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    console.log('📦 Exception occurred, falling back to static products data');
    
    // Fallback to static products on any error
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limit = searchParams.get('limit');
    const section = searchParams.get('section');
    
    let fallbackProducts = staticProducts;
    
    // Apply filters
    if (category && category !== 'all') {
      fallbackProducts = fallbackProducts.filter(p => 
        p.category.toLowerCase().includes(category.toLowerCase())
      );
    }
    
    if (search) {
      fallbackProducts = fallbackProducts.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.color.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (section) {
      fallbackProducts = fallbackProducts.filter(p => 
        p.sections?.includes(section)
      );
    }
    
    if (limit) {
      fallbackProducts = fallbackProducts.slice(0, parseInt(limit));
    }
    
    return NextResponse.json({
      products: fallbackProducts,
      total: fallbackProducts.length,
      source: 'static-error-fallback',
      message: 'Using static products data due to error'
    });
  }
}
