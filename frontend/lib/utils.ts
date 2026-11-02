import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Event, Media } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Events are local to Karachi; format in that zone explicitly so the server (UTC on Vercel)
// and the browser always render the same text (no hydration mismatch).
const EVENT_TZ = "Asia/Karachi";

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  timeZone: EVENT_TZ,
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
});
const timeFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: EVENT_TZ,
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

export function formatEventDate(iso: string) {
  const parts = Object.fromEntries(dateFormat.formatToParts(new Date(iso)).map((x) => [x.type, x.value]));
  return `${parts.weekday}, ${parts.day} ${parts.month} ${parts.year}`;
}

export function formatEventTime(iso: string) {
  return timeFormat.format(new Date(iso));
}

export function formatPrice(event: Pick<Event, "is_free" | "ticket_price">) {
  if (event.is_free || !event.ticket_price) return "Free";
  return `Rs. ${event.ticket_price.toLocaleString("en-PK")}`;
}

/** Best available image URL for a card/gallery, or null when the event has none. */
export function imageUrl(
  media: Media | null | undefined,
  size: "small" | "medium" | "large" = "medium",
) {
  if (!media) return null;
  return media.formats?.[size]?.url ?? media.url;
}

export function directionsUrl(
  event: Pick<Event, "latitude" | "longitude" | "venue_address">,
) {
  const destination =
    event.latitude != null && event.longitude != null
      ? `${event.latitude},${event.longitude}`
      : encodeURIComponent(event.venue_address);
  return `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
}

// Category badge colours. Keyed by category slug.
export const categoryStyles: Record<string, string> = {
  music: "bg-purple-100 text-purple-700 border-purple-200",
  sports: "bg-green-100 text-green-700 border-green-200",
  technology: "bg-blue-100 text-blue-700 border-blue-200",
  "art-culture": "bg-rose-100 text-rose-700 border-rose-200",
  "food-drink": "bg-amber-100 text-amber-700 border-amber-200",
  community: "bg-pink-100 text-pink-700 border-pink-200",
};

export const fallbackCategoryStyle = "bg-gray-100 text-gray-700 border-gray-200";
