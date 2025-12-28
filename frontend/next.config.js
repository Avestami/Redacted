/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  basePath: "/redacted",
  env: {
    NEXT_PUBLIC_BASE_PATH: "/redacted",
  },
};

module.exports = nextConfig;
