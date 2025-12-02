import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { products as staticProducts } from '@/lib/products-data';

// GET - Fetch all products from Supabase (with fallback to static)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Filters
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    // Try to fetch from Supabase first
    let query = supabaseAdmin
      .from('products')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,color.ilike.%${search}%,category.ilike.%${search}%`);
    }

    query = query.range(offset, offset + limit - 1);

    const { data: dbProducts, error, count } = await query;

    // If database has products, use them
    if (!error && dbProducts && dbProducts.length > 0) {
      return NextResponse.json({
        products: dbProducts.map(formatDbProduct),
        pagination: {
          page,
          limit,
          total: count || dbProducts.length,
          totalPages: Math.ceil((count || dbProducts.length) / limit),
          hasMore: offset + limit < (count || 0)
        },
        source: 'database',
        status: 'success'
      }, {
        headers: {
          'Cache-Control': 'private, no-cache, no-store, must-revalidate',
        }
      });
    }

    // Fallback to static products
    let filteredProducts = [...staticProducts];

    if (category && category !== 'all') {
      filteredProducts = filteredProducts.filter((p: any) => 
        p.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter((p: any) =>
        p.name.toLowerCase().includes(searchLower) ||
        p.color.toLowerCase().includes(searchLower) ||
        p.category.toLowerCase().includes(searchLower)
      );
    }

    const total = filteredProducts.length;
    const paginatedProducts = filteredProducts.slice(offset, offset + limit);

    return NextResponse.json({
      products: paginatedProducts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: offset + limit < total
      },
      source: 'static',
      status: 'success'
    }, {
      headers: {
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products', products: staticProducts },
      { status: 500 }
    );
  }
}

// POST - Create new product in Supabase
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'category', 'color', 'price', 'description'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Prepare product for database
    const newProduct = {
      name: data.name,
      category: data.category,
      color: data.color,
      price: parseFloat(data.price),
      description: data.description,
      images: data.images || [],
      stock: parseInt(data.stock || '100'),
      features: data.features || [],
      care_instructions: data.care_instructions || [],
      rating: parseFloat(data.rating || '4.5'),
      reviews: parseInt(data.reviews || '0'),
      is_bestseller: data.is_bestseller || data.isBestseller || false,
      is_new: data.is_new || data.isNewArrival || false,
      specifications: data.specifications || {},
    };

    console.log('Creating product in database:', newProduct);

    const { data: product, error } = await supabaseAdmin
      .from('products')
      .insert([newProduct])
      .select()
      .single();

    if (error) {
      console.error('Supabase error creating product:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to create product' },
        { status: 500 }
      );
    }

    console.log('Product created successfully:', product.id);

    return NextResponse.json({
      product: formatDbProduct(product),
      message: 'Product created successfully',
      status: 'success'
    }, {
      status: 201,
      headers: {
        'Cache-Control': 'no-store',
      }
    });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}

// DELETE - Delete multiple products from Supabase
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ids = searchParams.get('ids')?.split(',') || [];

    if (ids.length === 0) {
      return NextResponse.json(
        { error: 'No product IDs provided' },
        { status: 400 }
      );
    }

    // Delete from Supabase
    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .in('id', ids.map(id => parseInt(id)));

    if (error) {
      console.error('Supabase error deleting products:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to delete products' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: `${ids.length} product(s) deleted successfully`,
      deletedIds: ids,
      status: 'success'
    }, {
      headers: {
        'Cache-Control': 'no-store',
      }
    });
  } catch (error: any) {
    console.error('Error deleting products:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete products' },
      { status: 500 }
    );
  }
}

// Helper function to format database product to match frontend expectations
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
    isBestseller: dbProduct.is_bestseller,
    isNewArrival: dbProduct.is_new,
    createdAt: dbProduct.created_at,
    updatedAt: dbProduct.updated_at,
  };
}
