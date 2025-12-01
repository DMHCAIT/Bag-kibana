import { NextRequest, NextResponse } from 'next/server';
import { products } from '@/lib/products-data';
import type { Product } from '@/lib/products-data';

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

    // Filter products by section
    const sectionProducts = products.filter((product: any) => {
      const productSections = product.sections || [];
      return productSections.includes(section);
    });

    // If no products found in section, return empty array (not error)
    return NextResponse.json(
      {
        section,
        products: sectionProducts,
        total: sectionProducts.length,
        status: 'success'
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching section products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch section products', details: error },
      { status: 500 }
    );
  }
}

