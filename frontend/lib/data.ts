import { cacheLife, cacheTag } from "next/cache";
import { getCategories, getCategoryCounts, getEventBySlug, getEventReviews, getEvents, getFeaturedEvents } from "@/lib/api";

// Cached server-side reads for public pages. A failed fetch throws out of the cached scope,
// so errors are never cached; callers handle them with try/catch and show an error state.

export async function getCachedFeaturedEvents() {
  "use cache";
  cacheLife("minutes");
  cacheTag("events");
  const { data } = await getFeaturedEvents(6);
  return data;
}

export async function getCachedCategories() {
  "use cache";
  cacheLife("hours");
  cacheTag("categories");
  const { data } = await getCategories();
  return data;
}

export async function getCachedStats() {
  "use cache";
  cacheLife("minutes");
  cacheTag("events");
  const [events, categories] = await Promise.all([getEvents({ pageSize: 1 }), getCategories()]);
  return { events: events.meta.pagination.total, categories: categories.meta.pagination.total };
}

/**
 * Everything the landing page needs from ONE events request (the CMS is slow to reach, so we
 * fetch once and derive featured / upcoming / per-category counts / stats here).
 */
export async function getCachedHomeData() {
  "use cache";
  cacheLife("minutes");
  cacheTag("events", "categories");

  const [{ data: events }, { data: categories }] = await Promise.all([getEvents({ pageSize: 100 }), getCategories()]);
  const now = Date.now();

  const upcoming = events.filter((e) => new Date(e.start_datetime).getTime() >= now);
  const counts: Record<string, number> = {};
  for (const event of upcoming) {
    const slug = event.category?.slug;
    if (slug) counts[slug] = (counts[slug] ?? 0) + 1;
  }

  return {
    categories,
    featured: upcoming.filter((e) => e.is_featured).slice(0, 6),
    upcoming: upcoming.slice(0, 6), // already sorted by start date by the API call
    counts,
    stats: {
      events: upcoming.length,
      free: upcoming.filter((e) => e.is_free).length,
      categories: categories.length,
      venues: new Set(upcoming.map((e) => e.venue_address.split(",")[0].trim())).size,
    },
  };
}

/** Upcoming published events for the AI assistant's catalogue. */
export async function getCachedAssistantEvents() {
  "use cache";
  cacheLife("minutes");
  cacheTag("events");
  const { data } = await getEvents({ pageSize: 100 });
  const now = Date.now();
  return data.filter((e) => new Date(e.start_datetime).getTime() >= now);
}

// Returns null when the slug does not exist (or the event is still pending). That "missing"
// answer is cached too, but only for seconds and under the same `event-<slug>` tag, so the
// moment an admin approves the event (updateTag) the stale "not found" page is expired.
// A thrown error would not work here: errors leave no tag behind, so nothing could expire the
// cached 404 and an approved event would keep showing "not found".
export async function getCachedEvent(slug: string) {
  "use cache";
  cacheTag("events", `event-${slug}`);
  const event = await getEventBySlug(slug);
  if (event) cacheLife("minutes");
  else cacheLife("seconds");
  return event;
}

export async function getCachedReviews(eventDocumentId: string, slug: string) {
  "use cache";
  cacheLife("minutes");
  cacheTag(`event-${slug}`);
  const { data, meta } = await getEventReviews(eventDocumentId);
  return { reviews: data, total: meta.pagination.total };
}

export async function getCachedCategoryCounts() {
  "use cache";
  cacheLife("minutes");
  cacheTag("events");
  return getCategoryCounts();
}
