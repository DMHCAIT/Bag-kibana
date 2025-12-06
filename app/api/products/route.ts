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
      .order('created_at', { ascending: false });

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
    dbProducts.forEach(product => {
      if (!productsByName[product.name]) {
        productsByName[product.name] = [];
      }
      productsByName[product.name].push(product);
    });

    // Enrich each product's colors array with images from variants
    formattedProducts.forEach((product: any) => {
      if (product.colors && product.colors.length > 0) {
        const variants = productsByName[product.name] || [];
        const colorImageMap: { [key: string]: string } = {};
        
        variants.forEach((variant: any) => {
          const colorKey = variant.color.toLowerCase().trim();
          colorImageMap[colorKey] = variant.color_image || (variant.images && variant.images[0]) || '';
        });

        product.colors = product.colors.map((colorOption: any) => {
          const colorKey = colorOption.name.toLowerCase().trim();
          return {
            ...colorOption,
            image: colorImageMap[colorKey] || colorOption.image || null
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
          'Cache-Control': 'public, max-age=60, stale-while-revalidate=30',
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
