import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  distDir: "build",
  env: {
    AUTH_SECRET: process.env.AUTH_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXT_AUTH_SECRET: process.env.NEXT_AUTH_SECRET,
  },
  
  // Disable the 'X-Powered-By' header
  poweredByHeader: false,
  
  // Add security headers
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: "/(.*)",
        headers: [
          // X-Frame-Options - Prevents clickjacking attacks
          // Set to SAMEORIGIN to allow PDF iframes
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN"
          },
          
          // X-Content-Type-Options - Prevents MIME type sniffing
          {
            key: "X-Content-Type-Options",
            value: "nosniff"
          },
          
          // Strict-Transport-Security - Enforces HTTPS
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload"
          },
          
          // X-XSS-Protection - Enables XSS filtering
          {
            key: "X-XSS-Protection",
            value: "1; mode=block"
          },
          
          // Referrer-Policy - Controls referrer information
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin"
          },
          
          // Permissions-Policy - Controls browser features
          {
            key: "Permissions-Policy",
            value: [
              "camera=()",
              "microphone=()",
              "geolocation=()",
              "payment=()",
              "usb=()",
              "magnetometer=()",
              "gyroscope=()",
              "accelerometer=()"
            ].join(", ")
          }
        ]
      }
    ];
  }
};

export default nextConfig;
