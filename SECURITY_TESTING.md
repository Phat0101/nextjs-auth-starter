# Security Testing Guide

## Overview
This guide covers comprehensive testing procedures for the security headers implementation in the Next.js PDF extraction application.

## Phase 1: Local Testing

### 1. Header Validation
Start your development server and verify all security headers are present:

```bash
npm run dev
```

### 2. Browser DevTools Testing
1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Reload the page
4. Click on the document request
5. Check **Response Headers** for:
   - `Content-Security-Policy`
   - `X-Frame-Options`
   - `X-Content-Type-Options`
   - `Strict-Transport-Security`
   - `X-XSS-Protection`
   - `Referrer-Policy`
   - `Permissions-Policy`

### 3. Command Line Testing
Test headers with curl:

```bash
# Test main page headers
curl -I http://localhost:3000

# Test API route headers
curl -I http://localhost:3000/api/jobs

# Test PDF viewing headers
curl -I http://localhost:3000/jobs/1
```

### 4. CSP Testing

#### Basic CSP Validation
1. Open browser console
2. Look for CSP violations (red error messages)
3. Test all application functionality:
   - Job creation
   - PDF viewing
   - Navigation
   - Form submissions

#### Common CSP Issues to Check
- ✅ No `unsafe-inline` script violations
- ✅ External resources loading correctly
- ✅ PDF iframes working
- ✅ Fonts loading from allowed sources

### 5. Nonce-Based CSP Testing

To enable nonce-based CSP:
```bash
# Set environment variable
export ENABLE_NONCE_CSP=true
npm run dev
```

Verify nonce implementation:
1. Check `x-nonce` header in response
2. Verify inline scripts have matching nonce attribute
3. Test that CSP violations are reduced

## Phase 2: Production Testing

### 1. Build and Test Locally
```bash
npm run build
npm start
```

### 2. Azure Deployment Testing
After deploying to Azure:

```bash
# Test production headers
curl -I https://your-app.azurewebsites.net

# Test HTTPS enforcement
curl -I http://your-app.azurewebsites.net
```

### 3. Online Security Scanners

#### SecurityHeaders.com
1. Go to https://securityheaders.com
2. Enter your deployed URL
3. Check for A+ rating
4. Review any warnings or missing headers

#### SSL Labs
1. Go to https://www.ssllabs.com/ssltest/
2. Test your HTTPS configuration
3. Verify A+ rating

#### Mozilla Observatory
1. Go to https://observatory.mozilla.org
2. Scan your site for security issues
3. Review recommendations

## Phase 3: CSP Violation Monitoring

### 1. CSP Report Testing
Test the CSP reporting endpoint:

```bash
# Test CSP report endpoint
curl -X POST http://localhost:3000/api/csp-report \
  -H "Content-Type: application/json" \
  -d '{"test": "violation"}'
```

### 2. Simulate CSP Violations
Add test inline scripts to trigger violations:

```html
<!-- This should trigger a CSP violation -->
<script>console.log('This should be blocked')</script>
```

### 3. Monitor CSP Reports
1. Check server logs for CSP violation reports
2. Review violation patterns
3. Adjust CSP as needed

## Phase 4: Comprehensive Security Testing

### 1. XSS Testing
Test for potential XSS vulnerabilities:
- Try injecting `<script>alert('xss')</script>` in forms
- Test URL parameters for script injection
- Verify CSP blocks execution

### 2. Clickjacking Testing
Test frame protection:
```html
<!-- This should be blocked -->
<iframe src="https://your-app.azurewebsites.net"></iframe>
```

### 3. MIME Type Testing
Test content type protection:
- Upload files with incorrect extensions
- Verify browser doesn't execute unexpected content

### 4. HTTPS Testing
- Test HTTP to HTTPS redirects
- Verify HSTS header prevents HTTP connections
- Test with different browsers

## Phase 5: Performance Impact Testing

### 1. Page Load Testing
Compare performance with and without security headers:
```bash
# Use lighthouse
npm install -g lighthouse
lighthouse https://your-app.azurewebsites.net --view
```

### 2. CSP Impact Testing
Test CSP overhead:
- Compare nonce-based vs basic CSP
- Monitor memory usage
- Test with large PDF files

## Security Testing Checklist

### Pre-Deployment
- [ ] All security headers present in development
- [ ] CSP allows required functionality
- [ ] No CSP violations in normal usage
- [ ] PDF viewing works correctly
- [ ] Forms submit successfully
- [ ] External resources load correctly

### Post-Deployment
- [ ] HTTPS certificate valid
- [ ] Security headers present in production
- [ ] CSP reporting endpoint working
- [ ] No mixed content warnings
- [ ] SecurityHeaders.com gives A+ rating
- [ ] SSL Labs gives A+ rating
- [ ] No console errors in production

### Ongoing Monitoring
- [ ] Regular CSP violation report review
- [ ] Monthly security scanner checks
- [ ] Update security headers as needed
- [ ] Monitor for new security recommendations

## Common Issues and Solutions

### CSP Violations
**Issue**: Inline scripts blocked
**Solution**: Add nonce or move to external files

**Issue**: External resources blocked
**Solution**: Add to appropriate CSP directive

### PDF Viewing Issues
**Issue**: PDFs not loading in iframe
**Solution**: Check `frame-src` directive

**Issue**: PDF fonts not loading
**Solution**: Add font sources to `font-src`

### Performance Issues
**Issue**: Headers adding overhead
**Solution**: Optimize CSP complexity

**Issue**: Nonce generation slow
**Solution**: Consider caching strategies

## Environment Variables

```bash
# Enable nonce-based CSP
ENABLE_NONCE_CSP=true

# CSP reporting level
CSP_REPORT_ONLY=false
```

## Monitoring and Alerts

Set up monitoring for:
- CSP violation frequency
- Security header presence
- HTTPS certificate expiration
- Security scanner rating changes

## Tools and Resources

### Online Tools
- SecurityHeaders.com
- SSL Labs
- Mozilla Observatory
- CSP Evaluator

### Browser Extensions
- Security Headers
- CSP Evaluator
- HTTPS Everywhere

### Command Line Tools
- curl
- nmap
- sslyze
- lighthouse

## Success Metrics

- ✅ SecurityHeaders.com: A+ rating
- ✅ SSL Labs: A+ rating
- ✅ Mozilla Observatory: A+ rating
- ✅ Zero CSP violations in normal usage
- ✅ All functionality working correctly
- ✅ No security warnings in browser console

## Maintenance Schedule

- **Daily**: Monitor CSP violation reports
- **Weekly**: Check security headers presence
- **Monthly**: Run security scanner tests
- **Quarterly**: Review and update CSP policies
- **Annually**: Comprehensive security audit 