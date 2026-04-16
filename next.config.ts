import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "ioredis",
    "puppeteer-core",
    "@anthropic-ai/sdk",
    "@google/genai",
  ],
};

export default nextConfig;
