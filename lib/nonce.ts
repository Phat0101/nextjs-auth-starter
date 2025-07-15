import { randomBytes } from 'crypto'

export const generateNonce = (): string => {
  return randomBytes(16).toString('base64')
}

export const createCSPWithNonce = (nonce: string): string => {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
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
  ].join("; ")
} 