import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @ts-expect-error
  eslint: {
    ignoreDuringBuilds: true,
  },
  // @ts-expect-error
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
