"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { List, Map as MapIcon } from "lucide-react";
import { searchEvents } from "@/app/actions/events";
import EventFilters from "@/components/events/EventFilters";
import EventGrid from "@/components/events/EventGrid";
import EventMap from "@/components/events/EventMap";
import { Button } from "@/components/ui/button";
import { getEventsResetCount, subscribeEventsReset } from "@/lib/events-reset";
import { cn } from "@/lib/utils";
import type { Category, Event } from "@/types";

const DESKTOP_QUERY = "(min-width: 1024px)";

function useIsDesktop() {
  return useSyncExternalStore(
    (notify) => {
      const mq = window.matchMedia(DESKTOP_QUERY);
      mq.addEventListener("change", notify);
      return () => mq.removeEventListener("change", notify);
    },
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => false,
  );
}

interface EventsExplorerProps {
  initialEvents: Event[];
  categories: Category[];
  initialCategory: string[];
  initialSearch: string;
  initialFeatured: boolean;
  initialError?: string;
}

export default function EventsExplorer({
  initialEvents,
  categories,
  initialCategory,
  initialSearch,
  initialFeatured,
  initialError,
}: EventsExplorerProps) {
  const [events, setEvents] = useState(initialEvents);
  const [selectedCategories, setSelectedCategories] = useState(initialCategory);
  const [search, setSearch] = useState(initialSearch);
  const [featuredOnly, setFeaturedOnly] = useState(initialFeatured);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(initialError);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [view, setView] = useState<"list" | "map">("list");
  const isDesktop = useIsDesktop();

  // The navbar "Events" link asks for a clean list: clear filters (the effect below then refetches and
  // resets the URL). Also runs when a preserved, hidden page is shown again.
  const resetCount = useSyncExternalStore(subscribeEventsReset, getEventsResetCount, () => 0);
  const seenReset = useRef(resetCount);
  useEffect(() => {
    if (seenReset.current === resetCount) return;
    seenReset.current = resetCount;
    setSelectedCategories([]);
    setSearch("");
    setFeaturedOnly(false);
  }, [resetCount]);

  // Server-rendered data already matches the initial filters, so skip the first fetch.
  const firstRun = useRef(true);
  const latestRequest = useRef(0);

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }

    const params = new URLSearchParams();
    if (selectedCategories.length) params.set("category", selectedCategories.join(","));
    if (search.trim()) params.set("search", search.trim());
    if (featuredOnly) params.set("featured", "1");
    const query = params.toString();
    window.history.replaceState(null, "", query ? `/events?${query}` : "/events");

    const requestId = ++latestRequest.current;
    setLoading(true);
    const timer = setTimeout(async () => {
      const result = await searchEvents({ category: selectedCategories, search, featured: featuredOnly });
      if (requestId !== latestRequest.current) return; // a newer filter change superseded this one
      setEvents(result.events);
      setError(result.error);
      setSelectedId(null);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [selectedCategories, search, featuredOnly]);

  const toggleCategory = useCallback((slug: string) => {
    setSelectedCategories((current) =>
      current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug],
    );
  }, []);

  const reset = useCallback(() => {
    setSelectedCategories([]);
    setSearch("");
    setFeaturedOnly(false);
  }, []);

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
    document.getElementById(`event-card-${id}`)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, []);

  const mapActive = isDesktop || view === "map";
  const noResults = !loading && !error && events.length === 0;

  return (
    <main className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6">
      <div className="mb-5">
        <h1 className="mb-4 text-3xl font-bold text-gray-900">Explore events</h1>
        <EventFilters
          categories={categories}
          selected={selectedCategories}
          search={search}
          featuredOnly={featuredOnly}
          onToggleFeatured={() => setFeaturedOnly((v) => !v)}
          onToggleCategory={toggleCategory}
          onClearCategories={() => setSelectedCategories([])}
          onSearchChange={setSearch}
          onReset={reset}
        />
      </div>

      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-sm text-gray-600" role="status" aria-live="polite">
          {loading ? "Updating…" : noResults ? "No results found" : `${events.length} ${events.length === 1 ? "event" : "events"}`}
        </p>
        <div role="tablist" aria-label="Switch between list and map" className="flex rounded-xl bg-gray-100 p-1 lg:hidden">
          {(["list", "map"] as const).map((tab) => (
            <button
              key={tab}
              role="tab"
              type="button"
              aria-selected={view === tab}
              onClick={() => setView(tab)}
              className={cn(
                "inline-flex min-h-10 items-center gap-1.5 rounded-lg px-4 text-sm font-semibold capitalize transition-colors",
                view === tab ? "bg-white text-primary shadow-sm" : "text-gray-600",
              )}
            >
              {tab === "list" ? <List className="size-4" aria-hidden /> : <MapIcon className="size-4" aria-hidden />}
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:h-[calc(100dvh-17rem)] lg:min-h-[32rem] lg:grid-cols-5">
        <section
          aria-label="Event map"
          className={cn(
            "relative h-[65dvh] overflow-hidden rounded-card border border-gray-200 lg:col-span-3 lg:block lg:h-full",
            view === "map" ? "block" : "hidden",
          )}
        >
          <EventMap
            events={events}
            highlightedId={highlightedId}
            selectedId={selectedId}
            onSelect={handleSelect}
            active={mapActive}
          />
          {noResults && (
            <div className="absolute inset-x-4 top-4 z-[1000] rounded-xl bg-white p-4 text-center shadow-lg ring-1 ring-gray-200">
              <p className="font-bold text-gray-900">No results found</p>
              <p className="mt-0.5 text-sm text-gray-600">
                {search.trim() ? `Nothing matches “${search.trim()}”.` : "No events match these filters."}
              </p>
              <Button variant="outline" size="sm" className="mt-3" onClick={reset}>
                Clear search &amp; filters
              </Button>
            </div>
          )}
        </section>

        <section
          aria-label="Event list"
          className={cn("lg:col-span-2 lg:block lg:h-full lg:overflow-y-auto lg:pr-1", view === "list" ? "block" : "hidden")}
        >
          <h2 className="sr-only">Events</h2>
          <EventGrid
            events={events}
            highlightedId={highlightedId ?? selectedId}
            loading={loading}
            error={error}
            onHover={setHighlightedId}
            onSelect={handleSelect}
            onReset={reset}
          />
        </section>
      </div>
    </main>
  );
}
