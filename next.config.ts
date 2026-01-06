import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // reactCompiler: true, // Temporarily disabled due to Babel issues
  
  // Force fresh build with version increment - v3 FINAL
  generateBuildId: async () => {
    return `v3-final-${Date.now()}`;
  },
  
  // Production optimizations
  poweredByHeader: false,
  generateEtags: true,
  compress: true,
  
  // Image optimization - disabled for Supabase Storage compatibility
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hrahjiccbwvhtocabxja.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    domains: ['hrahjiccbwvhtocabxja.supabase.co'],
  },
  
  // Experimental features for performance
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  
  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NODE_ENV === 'development' ? '*' : 'https://kibanalife.com',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
