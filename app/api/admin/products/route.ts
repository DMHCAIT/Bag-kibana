import { NextRequest, NextResponse } from 'next/server';
import { products } from '@/lib/products-data';
import type { Product } from '@/lib/types/product';

// GET - Fetch all products with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Filters
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const section = searchParams.get('section');
    const search = searchParams.get('search');
    const isFeatured = searchParams.get('featured');
    const isNewArrival = searchParams.get('newArrival');
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    let filteredProducts = [...products];

    // Apply filters
    if (category && category !== 'all') {
      filteredProducts = filteredProducts.filter(p => 
        p.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (status) {
      filteredProducts = filteredProducts.filter(p => 
        (p as any).status === status || 'published' // Default to published for legacy products
      );
    }

    if (section) {
      filteredProducts = filteredProducts.filter(p => 
        (p as any).sections?.includes(section) || false
      );
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.color.toLowerCase().includes(searchLower) ||
        p.category.toLowerCase().includes(searchLower) ||
        p.id.toLowerCase().includes(searchLower)
      );
    }

    if (isFeatured === 'true') {
      filteredProducts = filteredProducts.filter(p => (p as any).isFeatured === true);
    }

    if (isNewArrival === 'true') {
      filteredProducts = filteredProducts.filter(p => (p as any).isNewArrival === true);
    }

    // Sort by updated date (newest first)
    filteredProducts.sort((a, b) => {
      const dateA = (a as any).updatedAt || (a as any).createdAt || '2025-01-01';
      const dateB = (b as any).updatedAt || (b as any).createdAt || '2025-01-01';
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });

    // Paginate
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
      status: 'success'
    }, {
      headers: {
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products', details: error },
      { status: 500 }
    );
  }
}

// POST - Create new product
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'category', 'color', 'price', 'images', 'description'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Generate ID
    const id = data.id || `${data.name.toLowerCase().replace(/\s+/g, '-')}-${data.color.toLowerCase().replace(/\s+/g, '-')}`;

    // Check if product already exists
    const existing = products.find(p => p.id === id);
    if (existing && !data.id) {
      return NextResponse.json(
        { error: 'Product with this ID already exists', id },
        { status: 409 }
      );
    }

    // Create new product
    const newProduct: Product = {
      id,
      name: data.name,
      category: data.category,
      color: data.color,
      price: parseFloat(data.price),
      salePrice: data.salePrice ? parseFloat(data.salePrice) : undefined,
      stock: parseInt(data.stock || '100'),
      rating: parseFloat(data.rating || '4.5'),
      reviews: parseInt(data.reviews || '0'),
      images: data.images,
      description: data.description,
      specifications: data.specifications || {
        material: '',
        texture: '',
        closureType: '',
        hardware: '',
        compartments: [],
        idealFor: ''
      },
      features: data.features || [],
      colors: data.colors || [],
      sections: data.sections || [],
      slug: data.slug || id,
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
      tags: data.tags || [],
      status: data.status || 'published',
      isFeatured: data.isFeatured || false,
      isNewArrival: data.isNewArrival || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: data.status === 'published' ? new Date().toISOString() : undefined
    } as Product;

    // In a real app, save to database
    // For now, we'll just return the created product
    // products.push(newProduct); // Don't actually add to static data

    return NextResponse.json({
      product: newProduct,
      message: 'Product created successfully',
      status: 'success'
    }, {
      status: 201,
      headers: {
        'Cache-Control': 'no-store',
      }
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product', details: error },
      { status: 500 }
    );
  }
}

// DELETE - Delete multiple products
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

    // In a real app, delete from database
    // For now, just return success
    return NextResponse.json({
      message: `${ids.length} product(s) deleted successfully`,
      deletedIds: ids,
      status: 'success'
    }, {
      headers: {
        'Cache-Control': 'no-store',
      }
    });
  } catch (error) {
    console.error('Error deleting products:', error);
    return NextResponse.json(
      { error: 'Failed to delete products', details: error },
      { status: 500 }
    );
  }
}
