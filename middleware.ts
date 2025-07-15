import { NextRequest, NextResponse } from 'next/server';
import { generateNonce, createCSPWithNonce, isNonceEnabled } from './lib/nonce';

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const pathname = request.nextUrl.pathname;
  
  // Create the response
  const response = NextResponse.next();
  
  // Add security headers that might need route-specific customization
  
  // Generate nonce for CSP if enabled
  if (isNonceEnabled()) {
    const nonce = generateNonce();
    response.headers.set('x-nonce', nonce);
    response.headers.set('Content-Security-Policy', createCSPWithNonce(nonce));
  } else {
    // For PDF viewing routes, we need to allow self-framing
    if (pathname.startsWith('/jobs/') && pathname.includes('/')) {
      response.headers.set('X-Frame-Options', 'SAMEORIGIN');
      
      // More permissive CSP for PDF viewing
      response.headers.set('Content-Security-Policy', [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: blob:",
        "font-src 'self' data:",
        "object-src 'self' data:",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'self'",
        "frame-src 'self' data:",
        "block-all-mixed-content",
        "upgrade-insecure-requests",
        "report-uri /api/csp-report"
      ].join("; "));
    }
  }
  
  // Add additional security headers for all routes
  response.headers.set('X-DNS-Prefetch-Control', 'off');
  response.headers.set('X-Permitted-Cross-Domain-Policies', 'none');
  
  // Remove potentially sensitive headers
  response.headers.delete('X-Powered-By');
  response.headers.delete('Server');
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 