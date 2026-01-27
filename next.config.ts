import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "softstar.s3.amazonaws.com",
      },
    ],
  },
  compiler: {
    styledComponents: true,
  },
  output: "standalone",
};

export default nextConfig;
