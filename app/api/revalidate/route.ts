import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

/**
 * On-Demand ISR Revalidation Endpoint
 * 
 * Usage:
 * curl -X POST http://localhost:3000/api/revalidate \
 *   -H "x-revalidate-secret: YOUR_SECRET_TOKEN" \
 *   -H "Content-Type: application/json" \
 *   -d '{"path": "/products/product-id"}'
 */

export async function POST(request: NextRequest) {
  try {
    // Verify secret token for security
    const secret = request.headers.get('x-revalidate-secret');
    if (secret !== process.env.REVALIDATE_SECRET) {
      console.warn('Invalid revalidate secret');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { path } = body;

    // Validate request
    if (!path) {
      return NextResponse.json(
        { error: 'Path is required' },
        { status: 400 }
      );
    }

    const revalidateStartTime = Date.now();
    const revalidatedPaths: string[] = [];

    // Revalidate by path
    if (Array.isArray(path)) {
      path.forEach((p: string) => {
        revalidatePath(p);
        revalidatedPaths.push(p);
      });
    } else {
      revalidatePath(path);
      revalidatedPaths.push(path);
    }

    const revalidateTime = Date.now() - revalidateStartTime;

    console.log(`✅ ISR Revalidation completed in ${revalidateTime}ms`, {
      paths: revalidatedPaths,
    });

    return NextResponse.json(
      {
        revalidated: true,
        timestamp: new Date().toISOString(),
        revalidateTime: `${revalidateTime}ms`,
        paths: revalidatedPaths,
        message: `Successfully revalidated ${revalidatedPaths.length} paths`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('ISR Revalidation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Revalidation failed';
    
    return NextResponse.json(
      {
        error: errorMessage,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint to check revalidation status
export async function GET() {
  return NextResponse.json({
    message: 'ISR Revalidation endpoint is active',
    method: 'POST',
    usage: {
      description: 'Send POST request with x-revalidate-secret header',
      example: {
        curl: 'curl -X POST http://localhost:3000/api/revalidate -H "x-revalidate-secret: YOUR_SECRET" -H "Content-Type: application/json" -d \'{"path": "/products/123"}\'',
        body: {
          path: '/products/[id] or ["/shop", "/products/[id]"]',
          tag: 'products or ["products", "collections"]',
        },
      },
    },
  });
}
