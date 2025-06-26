import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Optimize for production
  swcMinify: true,

  // Transpile packages that need it
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],

  // Experimental features
  experimental: {
    // Optimize package imports
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],

    // Enable turbo for faster builds
    turbo: {
      rules: {
        "*.svg": {
          loaders: ["@svgr/webpack"],
          as: "*.js",
        },
      },
    },
  },

  // Webpack configuration
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Handle client-side fallbacks
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
        stream: false,
        buffer: false,
        util: false,
        os: false,
        net: false,
        tls: false,
        child_process: false,
      }
    }

    // Optimize Three.js imports
    config.resolve.alias = {
      ...config.resolve.alias,
      "three/examples/jsm": "three/examples/jsm",
    }

    // Handle externals for optional dependencies
    const externals = config.externals || []
    config.externals = [
      ...externals,
      {
        "utf-8-validate": "commonjs utf-8-validate",
        bufferutil: "commonjs bufferutil",
        canvas: "commonjs canvas",
      },
    ]

    // Optimize chunks
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks?.cacheGroups,
          three: {
            name: "three",
            chunks: "all",
            test: /[\\/]node_modules[\\/](three|@react-three)[\\/]/,
            priority: 20,
          },
          vendor: {
            name: "vendor",
            chunks: "all",
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
          },
        },
      },
    }

    return config
  },

  // Image optimization
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    unoptimized: true,
  },

  // Compiler options
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Headers for security and performance
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ]
  },

  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Output configuration
  output: "standalone",

  // Disable x-powered-by header
  poweredByHeader: false,

  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: true,
  },

  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig
