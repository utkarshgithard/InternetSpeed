import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Applies to Server Actions
    serverActions: {
      bodySizeLimit: "25mb",
    },
  },
};

export default nextConfig;
