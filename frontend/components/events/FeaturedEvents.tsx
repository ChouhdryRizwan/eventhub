import Link from "next/link";
import { ArrowRight } from "lucide-react";
import EventCard from "@/components/events/EventCard";
import { getCachedFeaturedEvents } from "@/lib/data";

export function FeaturedEventsSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-hidden>
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="h-80 animate-pulse rounded-card bg-gray-100" />
      ))}
    </div>
  );
}

export default async function FeaturedEvents() {
  let events;
  try {
    events = await getCachedFeaturedEvents();
  } catch {
    return (
      <p role="alert" className="rounded-card border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
        We couldn&apos;t load featured events right now. Please refresh in a moment.
      </p>
    );
  }

  if (events.length === 0) {
    return (
      <p className="rounded-card border border-dashed border-gray-300 p-10 text-center text-gray-500">
        No featured events yet — check back soon.
      </p>
    );
  }

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event, i) => (
          <EventCard key={event.documentId} event={event} priority={i < 3} />
        ))}
      </div>
      <div className="mt-10 text-center">
        <Link
          href="/events"
          className="inline-flex min-h-11 items-center gap-2 font-semibold text-primary hover:underline"
        >
          Browse all events <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
    </>
  );
}
