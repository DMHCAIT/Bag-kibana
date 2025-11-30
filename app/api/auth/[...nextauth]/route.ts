import { NextRequest, NextResponse } from 'next/server';

// Stub NextAuth routes to prevent 404 errors
// Authentication is currently disabled

export async function GET(request: NextRequest) {
  const { pathname } = new URL(request.url);
  
  // Handle session endpoint
  if (pathname.includes('/session')) {
    return NextResponse.json({
      user: null,
      expires: new Date().toISOString(),
    });
  }
  
  // Handle providers endpoint
  if (pathname.includes('/providers')) {
    return NextResponse.json({});
  }
  
  // Handle csrf endpoint
  if (pathname.includes('/csrf')) {
    return NextResponse.json({ csrfToken: '' });
  }
  
  // Default response
  return NextResponse.json({ message: 'Authentication is currently disabled' }, { status: 200 });
}

export async function POST(request: NextRequest) {
  const { pathname } = new URL(request.url);
  
  // Handle signin endpoint
  if (pathname.includes('/signin') || pathname.includes('/callback')) {
    return NextResponse.json({ 
      error: 'Authentication is currently disabled',
      url: '/'
    }, { status: 200 });
  }
  
  // Handle signout endpoint  
  if (pathname.includes('/signout')) {
    return NextResponse.json({ url: '/' });
  }
  
  // Default response
  return NextResponse.json({ message: 'Authentication is currently disabled' }, { status: 200 });
}

