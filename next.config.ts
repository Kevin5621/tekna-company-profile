import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker
  output: 'standalone',
  webpack: (config) => {
    // Handle GLB and GLTF files
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      type: "asset/resource",
    });

    // Exclude Deno/Supabase functions from compilation
    config.externals = config.externals || {};
    config.externals["supabase/functions"] = "commonjs supabase/functions";

    return config;
  },
  // Exclude supabase functions from TypeScript checking
  typescript: {
    ignoreBuildErrors: false,
    tsconfigPath: "./tsconfig.json",
  },
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Add headers for SEO and performance
  async headers() {
    return [
      {
        source: "/(.*).glb",
        headers: [
          {
            key: "Content-Type",
            value: "model/gltf-binary",
          },
        ],
      },
      {
        source: "/(.*).gltf",
        headers: [
          {
            key: "Content-Type",
            value: "model/gltf+json",
          },
        ],
      },
      {
        source: "/images/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/blog/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, s-maxage=86400",
          },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ];
  },
  // Enable compression
  compress: true,
  // Enable source maps in development
  productionBrowserSourceMaps: false,
  // Optimize bundle size
  experimental: {
    // optimizeCss: true, // Disabled due to critters module issue
    // Optimize page loading performance
    optimizePackageImports: ['@tabler/icons-react', 'lucide-react'],
  },
  // External packages for server components
  serverExternalPackages: ['@supabase/supabase-js'],
  // Enable static optimization
  staticPageGenerationTimeout: 120,
  // Optimize navigation performance
  onDemandEntries: {
    // Period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // Number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
};

export default nextConfig;
