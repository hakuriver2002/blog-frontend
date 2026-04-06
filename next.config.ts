import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Add your backend / CDN domain here
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',  // Allow any HTTPS image — tighten in production
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },

};

export default nextConfig;
