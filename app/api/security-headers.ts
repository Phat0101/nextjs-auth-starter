import { NextResponse } from 'next/server';

export function addSecurityHeaders(response: NextResponse) {
  // Add security headers to API responses
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-DNS-Prefetch-Control', 'off');
  response.headers.set('X-Permitted-Cross-Domain-Policies', 'none');
  
  // Remove potentially sensitive headers
  response.headers.delete('X-Powered-By');
  response.headers.delete('Server');
  
  return response;
}

export function createSecureResponse(data:unknown, options: { status?: number } = {}) {
  const response = NextResponse.json(data, { status: options.status || 200 });
  return addSecurityHeaders(response);
} 