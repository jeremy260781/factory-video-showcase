import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "etf-nodes.com" }],
        destination: "https://www.etf-nodes.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
