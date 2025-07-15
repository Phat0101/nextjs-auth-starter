# Helmet.js Alternative for Security Headers

## Overview
This document provides an alternative approach to implementing security headers using Helmet.js instead of the current next.config.ts approach.

## Why Consider Helmet.js?

### Advantages
- **Simplified API**: More intuitive configuration
- **Dynamic Headers**: Easier to set headers conditionally
- **Middleware Integration**: Better integration with Express-style middleware
- **Maintained Library**: Regular updates and security patches
- **TypeScript Support**: Built-in TypeScript definitions

### Disadvantages
- **Additional Dependency**: Adds ~100KB to bundle size
- **Runtime Overhead**: Headers set during request processing
- **Next.js Specific**: May not work optimally with Next.js Edge Runtime

## Implementation

### 1. Installation

```bash
npm install helmet
npm install --save-dev @types/helmet
```

### 2. Basic Implementation

#### Option A: App Router Middleware
```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import helmet from 'helmet'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  // Apply Helmet security headers
  const helmetHeaders = helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "blob:"],
        fontSrc: ["'self'", "data:"],
        objectSrc: ["'self'", "data:"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'self'"],
        frameSrc: ["'self'", "data:"],
        upgradeInsecureRequests: []
      }
    },
    crossOriginEmbedderPolicy: false,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    }
  })

  // Apply headers to response
  for (const [key, value] of Object.entries(helmetHeaders)) {
    response.headers.set(key, value)
  }

  return response
}
```

#### Option B: API Route Implementation
```typescript
// lib/helmet-config.ts
import helmet from 'helmet'

export const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "blob:"],
      fontSrc: ["'self'", "data:"],
      objectSrc: ["'self'", "data:"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'self'"],
      frameSrc: ["'self'", "data:"],
      upgradeInsecureRequests: [],
      reportUri: ["/api/csp-report"]
    }
  },
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  frameguard: { action: 'sameorigin' },
  xssFilter: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
})

// Apply to API routes
export const withHelmet = (handler: any) => {
  return (req: any, res: any) => {
    helmetConfig(req, res, () => {
      handler(req, res)
    })
  }
}
```

### 3. Advanced Configuration

#### Dynamic CSP Based on Route
```typescript
// lib/dynamic-helmet.ts
import helmet from 'helmet'

export const getDynamicHelmetConfig = (pathname: string) => {
  const baseConfig = {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "blob:"],
        fontSrc: ["'self'", "data:"],
        objectSrc: ["'self'", "data:"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'self'"],
        frameSrc: ["'self'", "data:"],
        upgradeInsecureRequests: [],
        reportUri: ["/api/csp-report"]
      }
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    }
  }

  // PDF viewing routes need special handling
  if (pathname.startsWith('/jobs/') && pathname.includes('/')) {
    return helmet({
      ...baseConfig,
      frameguard: { action: 'sameorigin' },
      contentSecurityPolicy: {
        directives: {
          ...baseConfig.contentSecurityPolicy.directives,
          frameSrc: ["'self'", "data:", "blob:"]
        }
      }
    })
  }

  return helmet(baseConfig)
}
```

#### Nonce Implementation with Helmet
```typescript
// lib/helmet-nonce.ts
import helmet from 'helmet'
import { randomBytes } from 'crypto'

export const helmetWithNonce = (req: any, res: any, next: any) => {
  const nonce = randomBytes(16).toString('base64')
  
  // Store nonce in request for later use
  req.nonce = nonce
  
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", `'nonce-${nonce}'`, "'strict-dynamic'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "blob:"],
        fontSrc: ["'self'", "data:"],
        objectSrc: ["'self'", "data:"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'self'"],
        frameSrc: ["'self'", "data:"],
        upgradeInsecureRequests: [],
        reportUri: ["/api/csp-report"]
      }
    }
  })(req, res, next)
}
```

### 4. Migration from Current Implementation

#### Step 1: Install Dependencies
```bash
npm install helmet @types/helmet
```

#### Step 2: Replace next.config.ts Headers
Remove the `headers()` function from `next.config.ts`:

```typescript
// next.config.ts - Remove this section
async headers() {
  return [
    {
      source: "/(.*)",
      headers: [
        // ... security headers
      ]
    }
  ]
}
```

#### Step 3: Update Middleware
Replace the current middleware with Helmet implementation:

```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { getDynamicHelmetConfig } from './lib/dynamic-helmet'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const response = NextResponse.next()
  
  // Get dynamic helmet configuration
  const helmetConfig = getDynamicHelmetConfig(pathname)
  
  // Apply Helmet headers
  const mockReq = { url: request.url }
  const mockRes = {
    setHeader: (name: string, value: string) => {
      response.headers.set(name, value)
    }
  }
  
  helmetConfig(mockReq, mockRes, () => {})
  
  // Remove sensitive headers
  response.headers.delete('x-powered-by')
  response.headers.delete('server')
  
  return response
}
```

#### Step 4: Update API Routes
```typescript
// app/api/jobs/route.ts
import { withHelmet } from '@/lib/helmet-config'

export const GET = withHelmet(async (request: Request) => {
  // Your existing API logic
})
```

### 5. Environment-Specific Configuration

```typescript
// lib/helmet-env.ts
import helmet from 'helmet'

const isDevelopment = process.env.NODE_ENV === 'development'

export const getEnvironmentHelmetConfig = () => {
  return helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: isDevelopment 
          ? ["'self'", "'unsafe-inline'", "'unsafe-eval'"]
          : ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "blob:"],
        fontSrc: ["'self'", "data:"],
        objectSrc: ["'self'", "data:"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'self'"],
        frameSrc: ["'self'", "data:"],
        upgradeInsecureRequests: !isDevelopment ? [] : undefined,
        reportUri: ["/api/csp-report"]
      }
    },
    hsts: isDevelopment ? false : {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    },
    crossOriginEmbedderPolicy: false
  })
}
```

### 6. Testing Helmet Implementation

```typescript
// __tests__/helmet.test.ts
import { getDynamicHelmetConfig } from '@/lib/dynamic-helmet'

describe('Helmet Configuration', () => {
  test('should configure CSP for PDF routes', () => {
    const config = getDynamicHelmetConfig('/jobs/123')
    expect(config).toBeDefined()
    // Add specific assertions for PDF route configuration
  })

  test('should configure CSP for regular routes', () => {
    const config = getDynamicHelmetConfig('/dashboard')
    expect(config).toBeDefined()
    // Add specific assertions for regular route configuration
  })
})
```

## Comparison Matrix

| Feature | Current Implementation | Helmet.js Alternative |
|---------|----------------------|----------------------|
| **Setup Complexity** | Medium | Low |
| **Bundle Size** | No impact | +100KB |
| **Runtime Performance** | No impact | Minimal impact |
| **TypeScript Support** | Manual typing | Built-in |
| **Dynamic Headers** | Complex | Simple |
| **Maintenance** | Manual updates | Library updates |
| **Next.js Compatibility** | Perfect | Good |
| **CSP Nonce Support** | Custom implementation | Built-in |
| **Header Validation** | Manual | Automatic |

## Recommendations

### When to Use Helmet.js
- You prefer library-based solutions
- You need dynamic header configuration
- You want automatic security updates
- You're comfortable with additional dependencies

### When to Use Current Implementation
- You want minimal dependencies
- You need maximum Next.js compatibility
- You prefer static configuration
- Bundle size is a critical concern

## Migration Checklist

- [ ] Install Helmet.js dependencies
- [ ] Remove headers from next.config.ts
- [ ] Update middleware with Helmet configuration
- [ ] Update API routes to use Helmet
- [ ] Test all security headers are present
- [ ] Verify PDF viewing still works
- [ ] Check for CSP violations
- [ ] Run security scanner tests
- [ ] Update documentation

## Performance Considerations

### Bundle Size Impact
```bash
# Check bundle size before and after
npm run build
# Compare .next/static/chunks sizes
```

### Runtime Performance
```typescript
// lib/helmet-performance.ts
import { performance } from 'perf_hooks'

export const measureHelmetPerformance = () => {
  const start = performance.now()
  // Apply Helmet configuration
  const end = performance.now()
  console.log(`Helmet processing time: ${end - start}ms`)
}
```

## Conclusion

The Helmet.js alternative provides a more maintainable and feature-rich approach to security headers, but comes with trade-offs in bundle size and runtime performance. Choose based on your specific requirements and constraints.

For the current PDF extraction application, the existing implementation is well-suited and provides optimal performance. Consider Helmet.js for future projects or if you need more dynamic header configuration. 