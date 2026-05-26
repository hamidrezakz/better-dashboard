import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  cacheComponents: true,
  // LAN / phone testing: add your dev host IP when needed, e.g.
  // allowedDevOrigins: ["10.0.0.12"],
};

export default nextConfig;
