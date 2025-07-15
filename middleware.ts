import { NextRequest, NextResponse } from 'next/server';
import { generateNonce, createCSPWithNonce } from './lib/nonce';

export function middleware(request: NextRequest) {
  const nonce = generateNonce();
  const csp = createCSPWithNonce(nonce);
  
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', csp);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Set CSP header on the response with higher priority
  response.headers.set('Content-Security-Policy', csp);
  
  // Add other critical security headers
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes - handled separately)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt, sitemap.xml (SEO files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
}; 