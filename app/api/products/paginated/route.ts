import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface PaginationParams {
  page?: string;
  limit?: string;
  category?: string;
  search?: string;
  minPrice?: string;
  maxPrice?: string;
  sortBy?: 'newest' | 'price-asc' | 'price-desc' | 'popular';
}

interface PaginatedResponse {
  data: Record<string, unknown>[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  meta: {
    responseTime: number;
    cached: boolean;
    timestamp: string;
  };
}

export async function GET(request: NextRequest): Promise<NextResponse<PaginatedResponse | { error: string }>> {
  try {
    const startTime = Date.now();
    const { searchParams } = new URL(request.url);

    // Parse pagination parameters
    const params: PaginationParams = {
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '20',
      category: searchParams.get('category') || undefined,
      search: searchParams.get('search') || undefined,
      minPrice: searchParams.get('minPrice') || undefined,
      maxPrice: searchParams.get('maxPrice') || undefined,
      sortBy: (searchParams.get('sortBy') as PaginationParams['sortBy']) || 'newest',
    };

    // Validate and sanitize parameters
    const page = Math.max(1, parseInt(params.page || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(params.limit || '20', 10))); // Max 100 items per page
    const offset = (page - 1) * limit;

    // Build query
    let query = supabase
      .from('products')
      .select('*', { count: 'exact' });

    // Apply filters
    if (params.category && params.category !== 'all') {
      query = query.eq('category', params.category);
    }

    if (params.search) {
      // Full-text search on name and description
      query = query.or(`name.ilike.%${params.search}%,description.ilike.%${params.search}%`);
    }

    if (params.minPrice) {
      query = query.gte('price', parseInt(params.minPrice, 10));
    }

    if (params.maxPrice) {
      query = query.lte('price', parseInt(params.maxPrice, 10));
    }

    // Apply status filter (only show active products)
    query = query.eq('status', 'active');

    // Apply sorting
    switch (params.sortBy) {
      case 'price-asc':
        query = query.order('price', { ascending: true });
        break;
      case 'price-desc':
        query = query.order('price', { ascending: false });
        break;
      case 'popular':
        query = query.order('sales_count', { ascending: false });
        break;
      case 'newest':
      default:
        query = query.order('created_at', { ascending: false });
        break;
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    // Execute query
    const { data, error, count } = await query;

    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch products' },
        { status: 500 }
      );
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / limit);
    const responseTime = Date.now() - startTime;

    // Set cache headers
    const response = NextResponse.json({
      data: data || [],
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      meta: {
        responseTime,
        cached: false,
        timestamp: new Date().toISOString(),
      },
    });

    // Cache for 1 hour for public pages, 5 minutes for filtered results
    const cacheTime = params.search || params.category ? 300 : 3600;
    response.headers.set('Cache-Control', `public, s-maxage=${cacheTime}, stale-while-revalidate=86400`);
    response.headers.set('CDN-Cache-Control', `max-age=${cacheTime}`);
    response.headers.set('X-Response-Time', `${responseTime}ms`);

    return response;
  } catch (error) {
    console.error('Pagination API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Generate static params for common pagination pages
export async function generateStaticParams() {
  const pages = [1, 2, 3]; // Pre-render first 3 pages
  const categories = ['bags', 'wallets', 'accessories'];

  const params = [];
  for (const page of pages) {
    for (const category of categories) {
      params.push({
        page: page.toString(),
        category,
      });
    }
  }

  return params;
}

// Revalidate every 60 seconds
export const revalidate = 60;
