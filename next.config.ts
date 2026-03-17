import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // `make up-live fe` is served through the local HTTPS proxy at rallyon.test.
  allowedDevOrigins: ["rallyon.test"],
  reactCompiler: true,
};

export default nextConfig;
