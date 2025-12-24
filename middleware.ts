import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isAuthenticatedFromRequest } from './lib/auth';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protected routes that require authentication
  if (pathname.startsWith('/bookings') ||
      pathname.startsWith('/search') ||
      pathname.startsWith('/trains')) {
    if (!isAuthenticatedFromRequest(request)) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname + request.nextUrl.search);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/bookings', '/bookings/:path*', '/search', '/search/:path*', '/trains', '/trains/:path*']
};