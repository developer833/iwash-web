import type { NextConfig } from "next";

/** Item photos come from the iWash ERP. Only its icon folder may be optimised. */
function erpImagePatterns(): NonNullable<NextConfig["images"]>["remotePatterns"] {
  try {
    const url = new URL(process.env.NEXT_PUBLIC_BASE_URL ?? "");
    return [
      {
        protocol: url.protocol === "http:" ? "http" : "https",
        hostname: url.hostname,
        ...(url.port ? { port: url.port } : {}),
        pathname: "/api/icons/**",
      },
    ];
  } catch {
    return [];
  }
}

const nextConfig: NextConfig = {
  images: { remotePatterns: erpImagePatterns() },
  redirects: async () => [
    { source: "/book", destination: "/download", permanent: true },
    { source: "/track", destination: "/download", permanent: true },
  ],
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
};

export default nextConfig;
