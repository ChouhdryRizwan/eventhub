import type { MetadataRoute } from "next";
import { getEvents } from "@/lib/api";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/events`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/categories`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.2 },
  ];

  try {
    const { data } = await getEvents({ pageSize: 100 });
    const events: MetadataRoute.Sitemap = data.map((event) => ({
      url: `${SITE_URL}/events/${event.slug}`,
      lastModified: new Date(event.updatedAt),
      changeFrequency: "weekly",
      priority: 0.8,
    }));
    return [...pages, ...events];
  } catch {
    // If Strapi is unreachable, still serve the static pages rather than failing the sitemap.
    return pages;
  }
}
