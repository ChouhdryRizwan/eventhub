/** Canonical origin used for absolute URLs (sitemap, Open Graph, JSON-LD). Set NEXT_PUBLIC_SITE_URL in production. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
export const SITE_NAME = "EventHub";
