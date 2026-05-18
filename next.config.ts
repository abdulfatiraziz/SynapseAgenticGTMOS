import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @ts-expect-error - NextConfig types are missing the eslint property
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
