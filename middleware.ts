import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Protect admin routes (except login page)
  if (path.startsWith('/admin') && !path.startsWith('/admin/login')) {
    // Check for auth cookie
    const authCookie = request.cookies.get('adminAuth');
    
    // If no auth cookie, redirect to login
    if (!authCookie) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
