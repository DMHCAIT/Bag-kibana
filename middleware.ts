import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  // Temporarily allow all access to admin routes without authentication
  // This removes the login requirement for admin access
  
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  const isAccountRoute = req.nextUrl.pathname.startsWith("/account");

  // Allow direct access to admin routes (no authentication required)
  if (isAdminRoute) {
    return NextResponse.next();
  }

  // For account routes, redirect to shop since auth is disabled
  if (isAccountRoute) {
    return NextResponse.redirect(new URL("/shop", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images and other public assets
     */
    "/((?!api|_next/static|_next/image|favicon.ico|images|videos).*)",
    "/admin/:path*", 
    "/account/:path*"
  ],
};
