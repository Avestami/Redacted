import type { NextConfig } from "next";
import nextPWA from "@ducanh2912/next-pwa";

const withPWA = nextPWA({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true,
  },
});

const nextConfig: NextConfig = {
  output: "standalone",
  basePath: "/redacted",
  env: {
    NEXT_PUBLIC_BASE_PATH: "/redacted",
    NEXT_PUBLIC_API_URL: "/cts/api",
  },
  async rewrites() {
    return [
      {
        "source": "/cts/api/:path*",
        "destination": "http://localhost:5152/api/:path*"
      }
    ]
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["blckbrd.ir", "*.blckbrd.ir", "localhost:3000"],
    },
  },
};

export default withPWA(nextConfig);
