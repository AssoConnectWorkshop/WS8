import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbo: {},
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ hostname: "cataas.com" }],
  },
};

export default nextConfig;
