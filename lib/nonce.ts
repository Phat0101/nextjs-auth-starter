export const generateNonce = (): string => {
  const randomValues = new Uint8Array(16);
  crypto.getRandomValues(randomValues);
  let binary = '';
  for (let i = 0; i < randomValues.length; i++) {
    binary += String.fromCharCode(randomValues[i]);
  }
  return btoa(binary);
}

export const createCSPWithNonce = (nonce: string): string => {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    `style-src 'self' 'nonce-${nonce}'`,
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
  ].join("; ")
} 