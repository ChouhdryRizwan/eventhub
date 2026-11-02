import type { NextConfig } from "next";

const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL
  ? new URL(process.env.NEXT_PUBLIC_STRAPI_URL)
  : undefined;

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    agentUpgrade: "security",
    // Event submissions upload up to 5 photos (3 MB each) through a Server Action.
    serverActions: { bodySizeLimit: "20mb" },
    // The CMS sits behind a remote database; keep the build from flooding it with parallel requests.
    staticGenerationMaxConcurrency: 2,
    staticGenerationRetryCount: 2,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      // Local Strapi uploads (only used if the Cloudinary provider is off)
      ...(strapiUrl
        ? [
            {
              protocol: strapiUrl.protocol.replace(":", "") as "http" | "https",
              hostname: strapiUrl.hostname,
              port: strapiUrl.port,
            },
          ]
        : []),
    ],
  },
};

export default nextConfig;
