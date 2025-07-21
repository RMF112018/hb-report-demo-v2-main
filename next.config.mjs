/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_SYNCFUSION_LICENSE_KEY: process.env.NEXT_PUBLIC_SYNCFUSION_LICENSE_KEY || "",
  },
  eslint: {
    ignoreDuringBuilds: false, // Enable ESLint checking
  },
  typescript: {
    ignoreBuildErrors: false, // Enable TypeScript checking
  },

  images: {
    unoptimized: true,
  },
  // Add output configuration for better Vercel support
  output: "standalone",
  // Optimize for static generation where possible
  experimental: {
    optimizePackageImports: [
      "@radix-ui/react-icons",
      "lucide-react",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-tabs",
      "@radix-ui/react-select",
      "@radix-ui/react-toast",
      "@radix-ui/react-tooltip",
      "@radix-ui/react-popover",
      "@radix-ui/react-accordion",
      "@radix-ui/react-alert-dialog",
      "@radix-ui/react-avatar",
      "@radix-ui/react-checkbox",
      "@radix-ui/react-collapsible",
      "@radix-ui/react-context-menu",
      "@radix-ui/react-hover-card",
      "@radix-ui/react-label",
      "@radix-ui/react-menubar",
      "@radix-ui/react-navigation-menu",
      "@radix-ui/react-progress",
      "@radix-ui/react-radio-group",
      "@radix-ui/react-scroll-area",
      "@radix-ui/react-separator",
      "@radix-ui/react-slider",
      "@radix-ui/react-slot",
      "@radix-ui/react-switch",
      "@radix-ui/react-toggle",
      "@radix-ui/react-toggle-group",
    ],
  },
  // Configure React for production readiness
  reactStrictMode: true, // Enable React Strict Mode
  // Performance optimizations
  compiler: {
    // Remove console.logs in production
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"],
          }
        : false,
  },
  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Tree shaking optimizations
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: "all",
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all",
            priority: 10,
          },
          common: {
            name: "common",
            minChunks: 2,
            chunks: "all",
            priority: 5,
          },
        },
      },
    }

    return config
  },
  // Ensure static files are served correctly
  async rewrites() {
    return [
      {
        source: "/data/:path*",
        destination: "/public/data/:path*",
      },
    ]
  },
  // Add headers for JSON files
  async headers() {
    return [
      {
        source: "/public/data/:path*.json",
        headers: [
          {
            key: "Content-Type",
            value: "application/json",
          },
        ],
      },
      // Allow iframe embedding for PDF files - more specific pattern
      {
        source: "/drawings/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Content-Type",
            value: "application/pdf",
          },
        ],
      },
      // Default security headers for all other routes
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
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      // Exclude API routes from X-Frame-Options DENY
      {
        source: "/api/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ]
  },
}

export default nextConfig
