import { Suspense } from "react";
import type { Metadata } from "next";
import EventsExplorer from "@/components/events/EventsExplorer";
import { getEvents } from "@/lib/api";
import { getCachedCategories } from "@/lib/data";

type SearchParams = Promise<{ category?: string; search?: string }>;

// The title reflects the active filter, e.g. "Music & Sports events" or "Search: jazz".
export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const { category, search } = await searchParams;
  const slugs = (category ?? "").split(",").map((s) => s.trim()).filter((s) => /^[a-z0-9-]{1,60}$/.test(s));
  const query = (search ?? "").trim().slice(0, 60);

  let title = "Explore events";
  if (query) {
    title = `Search: ${query}`;
  } else if (slugs.length) {
    const categories = await getCachedCategories().catch(() => []);
    const names = slugs.map((slug) => categories.find((c) => c.slug === slug)?.name).filter(Boolean);
    if (names.length) title = `${names.join(" & ")} events`;
  }

  return {
    title,
    description: "Browse every event on an interactive map or list, filter by category and search by name, venue or organizer.",
    alternates: { canonical: "/events" },
    // Filtered and search result pages are duplicates of /events for search engines.
    robots: query || slugs.length ? { index: false, follow: true } : undefined,
  };
}

function ExplorerSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6" aria-hidden>
      <div className="mb-5 h-10 w-56 animate-pulse rounded-lg bg-gray-100" />
      <div className="mb-5 h-11 animate-pulse rounded-xl bg-gray-100" />
      <div className="grid gap-4 lg:h-[calc(100dvh-17rem)] lg:grid-cols-5">
        <div className="h-[50dvh] animate-pulse rounded-card bg-gray-100 lg:col-span-3 lg:h-full" />
        <div className="space-y-4 lg:col-span-2">
          <div className="h-72 animate-pulse rounded-card bg-gray-100" />
          <div className="h-72 animate-pulse rounded-card bg-gray-100" />
        </div>
      </div>
    </div>
  );
}

async function ExplorerData({ searchParams }: { searchParams: SearchParams }) {
  const { category, search } = await searchParams;
  const initialCategory = (category ?? "")
    .split(",")
    .map((slug) => slug.trim())
    .filter((slug) => /^[a-z0-9-]{1,60}$/.test(slug));
  const initialSearch = (search ?? "").slice(0, 100);

  const [eventsResult, categoriesResult] = await Promise.allSettled([
    getEvents({ category: initialCategory, search: initialSearch, pageSize: 100 }),
    getCachedCategories(),
  ]);

  return (
    <EventsExplorer
      initialEvents={eventsResult.status === "fulfilled" ? eventsResult.value.data : []}
      categories={categoriesResult.status === "fulfilled" ? categoriesResult.value : []}
      initialCategory={initialCategory}
      initialSearch={initialSearch}
      initialError={eventsResult.status === "rejected" ? "We couldn't load events. Please try again." : undefined}
    />
  );
}

export default function EventsPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <Suspense fallback={<ExplorerSkeleton />}>
      <ExplorerData searchParams={searchParams} />
    </Suspense>
  );
}
