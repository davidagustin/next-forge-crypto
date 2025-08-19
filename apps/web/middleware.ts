import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)', '/crypto'],
};

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow crypto routes without any restrictions
  if (pathname.startsWith('/crypto') || pathname.startsWith('/api/crypto')) {
    return NextResponse.next();
  }

  // Handle locale redirection for non-crypto routes
  if (pathname === '/') {
    const newUrl = request.nextUrl.clone();
    newUrl.pathname = '/en';
    return NextResponse.redirect(newUrl);
  }

  return NextResponse.next();
}