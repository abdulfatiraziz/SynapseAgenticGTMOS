import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @ts-expect-error
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
