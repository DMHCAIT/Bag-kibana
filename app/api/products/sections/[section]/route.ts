import { NextRequest, NextResponse } from 'next/server';
import { getProductsBySection } from '@/lib/products-store';

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

    // Use shared product store (includes admin updates)
    const sectionProducts = getProductsBySection(section);

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
          // Short cache to see updates quickly
          'Cache-Control': 'private, no-cache, must-revalidate',
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
