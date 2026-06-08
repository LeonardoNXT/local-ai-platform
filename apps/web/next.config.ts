import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER, type PHASE_TYPE } from "next/constants";

export default async function nextConfig(
  phase: PHASE_TYPE,
): Promise<NextConfig> {
  const config: NextConfig = {};

  if (phase === PHASE_DEVELOPMENT_SERVER) {
    config.rewrites = async () => [
      {
        source: "/api/:path*",
        destination: "http://localhost:8000/:path*",
      },
    ];
  }

  return config;
}
