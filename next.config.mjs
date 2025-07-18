/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_SYNCFUSION_LICENSE_KEY:
      "Ngo9BigBOggjHTQxAR8/V1JEaF5cXmRCeUx0R3xbf1x1ZFxMYlVbRHJPMyBoS35Rc0VkWHpeeXZcRmRdVU1xVEFd",
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  swcMinify: false, // Disable SWC minification to avoid potential issues
  images: {
    unoptimized: true,
  },
  // Add output configuration for better Vercel support
  output: "standalone",
  // Optimize for static generation where possible
  experimental: {
    optimizePackageImports: ["@radix-ui/react-icons", "lucide-react"],
  },
  // Configure React for Bryntum compatibility
  reactStrictMode: false, // Disable to prevent Bryntum double mounting issues
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
