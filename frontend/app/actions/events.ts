"use server";

import { getEvents } from "@/lib/api";
import type { Event } from "@/types";

export interface SearchResult {
  events: Event[];
  total: number;
  error?: string;
}

// Runs on the server so the browser never talks to Strapi directly for list/map data.
export async function searchEvents(input: { category: string[]; search: string }): Promise<SearchResult> {
  const category = (Array.isArray(input.category) ? input.category : [])
    .filter((slug): slug is string => typeof slug === "string" && /^[a-z0-9-]{1,60}$/.test(slug))
    .slice(0, 12);
  const search = typeof input.search === "string" ? input.search.slice(0, 100) : "";

  try {
    const { data, meta } = await getEvents({ category, search, pageSize: 100 });
    return { events: data, total: meta.pagination.total };
  } catch {
    return { events: [], total: 0, error: "We couldn't load events. Please try again." };
  }
}
