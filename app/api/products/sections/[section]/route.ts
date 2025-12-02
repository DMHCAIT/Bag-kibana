import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { products as staticProducts } from '@/lib/products-data';

// Helper function to format database product for frontend
function formatDbProduct(dbProduct: any) {
  return {
    id: `product-${dbProduct.id}`,
    dbId: dbProduct.id,
    name: dbProduct.name,
    category: dbProduct.category,
    color: dbProduct.color,
    price: dbProduct.price,
    salePrice: dbProduct.sale_price,
    stock: dbProduct.stock,
    rating: dbProduct.rating,
    reviews: dbProduct.reviews,
    images: dbProduct.images || [],
    description: dbProduct.description,
    specifications: dbProduct.specifications || {},
    features: dbProduct.features || [],
    careInstructions: dbProduct.care_instructions || [],
    sections: [
      ...(dbProduct.is_bestseller ? ['bestsellers'] : []),
      ...(dbProduct.is_new ? ['new-arrivals'] : []),
    ],
  };
}

// GET - Fetch products by section
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ section: string }> }
) {
  try {
    const { section } = await params;

    if (!section) {
      return NextResponse.json(
        { error: 'Section parameter is required' },
        { status: 400 }
      );
    }

    // Map section names to database columns
    const sectionColumn = section === 'bestsellers' ? 'is_bestseller' : 
                          section === 'new-arrivals' ? 'is_new' : null;

    // Try to fetch from Supabase first
    if (sectionColumn) {
      const { data: dbProducts, error } = await supabaseAdmin
        .from('products')
        .select('*')
        .eq(sectionColumn, true)
        .order('created_at', { ascending: false });

      if (!error && dbProducts && dbProducts.length > 0) {
        return NextResponse.json(
          {
            section,
            products: dbProducts.map(formatDbProduct),
            total: dbProducts.length,
            source: 'database',
            status: 'success'
          },
          {
            headers: {
              'Cache-Control': 'private, max-age=60, stale-while-revalidate=30',
            },
          }
        );
      }
    }

    // Fallback to static products
    const sectionProducts = staticProducts.filter((p: any) => 
      p.sections?.includes(section)
    );

    return NextResponse.json(
      {
        section,
        products: sectionProducts,
        total: sectionProducts.length,
        source: 'static',
        status: 'success'
      },
      {
        headers: {
          'Cache-Control': 'private, max-age=60, stale-while-revalidate=30',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching section products:', error);
    
    // Fallback to static products on error
    const { section } = await params;
    const sectionProducts = staticProducts.filter((p: any) => 
      p.sections?.includes(section)
    );
    
    return NextResponse.json(
      {
        section,
        products: sectionProducts,
        total: sectionProducts.length,
        source: 'fallback',
        status: 'error'
      },
      { status: 200 }
    );
  }
}
