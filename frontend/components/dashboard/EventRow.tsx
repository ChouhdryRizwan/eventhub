import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import CategoryBadge from "@/components/shared/CategoryBadge";
import { formatEventDate, formatEventTime, imageUrl } from "@/lib/utils";
import type { Event } from "@/types";

/** Compact event summary used by the RSVP and saved lists. `actions` renders on the right. */
export default function EventRow({
  event,
  badge,
  actions,
}: {
  event: Event;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  const cover = event.images?.[0];
  const src = imageUrl(cover, "small");

  return (
    <article className="flex flex-col gap-4 rounded-card border border-gray-200 bg-white p-4 sm:flex-row sm:items-center">
      <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-primary to-accent sm:w-36">
        {src ? (
          <Image
            src={src}
            alt={cover?.alternativeText || `${event.title} event photo`}
            fill
            sizes="(min-width: 640px) 144px, 100vw"
            className="object-cover"
            loading="lazy"
          />
        ) : (
          <span className="flex h-full items-center justify-center text-4xl" aria-hidden>
            {event.category?.icon ?? "🎟️"}
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <CategoryBadge category={event.category} />
          {badge}
        </div>
        <h3 className="text-lg font-bold leading-snug text-gray-900">
          <Link href={`/events/${event.slug}`} className="inline-flex min-h-9 items-center hover:text-primary">
            {event.title}
          </Link>
        </h3>
        <p className="flex items-center gap-2 text-sm text-gray-600">
          <CalendarDays className="size-4 shrink-0 text-primary-light" aria-hidden />
          {formatEventDate(event.start_datetime)} · {formatEventTime(event.start_datetime)}
        </p>
        <p className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="size-4 shrink-0 text-primary-light" aria-hidden />
          <span className="truncate">{event.venue_address}</span>
        </p>
      </div>

      {actions && <div className="flex shrink-0 flex-wrap gap-2 sm:flex-col sm:items-stretch">{actions}</div>}
    </article>
  );
}
