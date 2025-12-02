import { NextRequest, NextResponse } from 'next/server';
import { products as staticProducts } from '@/lib/products-data';

// GET - Fetch products by section (uses static products)
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

    // Filter static products by section
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
          'Cache-Control': 'public, max-age=60, stale-while-revalidate=30',
        },
      }
    );
  } catch (error: any) {
    console.error('Error fetching section products:', error);
    
    return NextResponse.json(
      {
        section: '',
        products: [],
        total: 0,
        status: 'error',
        error: error.message
      },
      { status: 500 }
    );
  }
}
