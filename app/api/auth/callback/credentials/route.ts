import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Handle credentials callback
  const searchParams = request.nextUrl.searchParams;
  const error = searchParams.get('error');
  
  if (error) {
    // Redirect to login with error
    return NextResponse.redirect(new URL(`/login?error=${error}`, request.url));
  }
  
  // Successful authentication - redirect to home or dashboard
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  return NextResponse.redirect(new URL(callbackUrl, request.url));
}

export async function POST(request: NextRequest) {
  // Handle POST callback for credentials
  try {
    const body = await request.json();
    
    // Return success response
    return NextResponse.json({ 
      success: true,
      message: 'Authentication successful'
    }, { status: 200 });
    
  } catch (error) {
    console.error('Credentials callback error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Authentication failed'
    }, { status: 401 });
  }
}