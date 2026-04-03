import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "ioredis",
    "puppeteer-core",
    "@anthropic-ai/sdk",
  ],
  turbopack: {
    root: "/Users/kirankumarbhalekar/Desktop/Digital_School_App/Digi-School-App",
  },
};

export default nextConfig;
