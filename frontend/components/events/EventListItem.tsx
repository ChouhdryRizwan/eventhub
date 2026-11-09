import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin, Star } from "lucide-react";
import CategoryBadge from "@/components/shared/CategoryBadge";
import { CategoryIcon } from "@/lib/category-meta";
import { cn, formatEventDate, formatEventTime, formatPrice, hasEventEnded, imageUrl } from "@/lib/utils";
import type { Event } from "@/types";

interface EventListItemProps {
  event: Event;
  highlighted?: boolean;
  priority?: boolean;
  onHover?: (id: string | null) => void;
  onSelect?: (id: string) => void;
}

/** Compact horizontal row used in the events explorer: dense, scannable, synced with the map. */
export default function EventListItem({ event, highlighted, priority, onHover, onSelect }: EventListItemProps) {
  const cover = event.images?.[0];
  const src = imageUrl(cover, "medium");
  const href = `/events/${event.slug}`;
  const ended = hasEventEnded(event);

  return (
    <article
      id={`event-card-${event.documentId}`}
      onMouseEnter={onHover ? () => onHover(event.documentId) : undefined}
      onMouseLeave={onHover ? () => onHover(null) : undefined}
      onFocus={onHover ? () => onHover(event.documentId) : undefined}
      onBlur={onHover ? () => onHover(null) : undefined}
      onClick={onSelect ? () => onSelect(event.documentId) : undefined}
      className={cn(
        "group relative flex gap-3.5 rounded-2xl border border-gray-200 bg-white p-3 transition duration-200 hover:border-primary-lighter hover:shadow-md sm:gap-4",
        highlighted && "border-primary-light shadow-md ring-2 ring-primary-light/30",
        ended && "bg-gray-50/70",
      )}
    >
      <Link
        href={href}
        tabIndex={-1}
        aria-hidden
        className="relative block size-28 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-primary to-accent sm:size-32"
      >
        {src ? (
          <Image
            src={src}
            alt=""
            fill
            sizes="128px"
            className={cn("object-cover transition duration-300 group-hover:scale-105", ended && "grayscale")}
            priority={priority}
            loading={priority ? undefined : "lazy"}
          />
        ) : (
          <span className="flex h-full items-center justify-center text-white">
            <CategoryIcon slug={event.category?.slug} className="size-9" />
          </span>
        )}
        {event.is_featured && (
          <span
            title="Featured event"
            className="absolute left-1.5 top-1.5 inline-flex size-6 items-center justify-center rounded-full bg-amber-400 text-ink shadow"
          >
            <Star className="size-3.5 fill-current" aria-hidden />
            <span className="sr-only">Featured</span>
          </span>
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between gap-2">
          <CategoryBadge category={event.category} />
          <span className="shrink-0 text-sm font-bold text-primary">{formatPrice(event)}</span>
        </div>

        <h3 className="mt-1.5 text-base font-bold leading-snug text-gray-900">
          <Link href={href} className="line-clamp-2 hover:text-primary">
            {event.title}
          </Link>
        </h3>

        <dl className="mt-auto space-y-1 pt-2 text-xs text-gray-600">
          <div className="flex items-center gap-1.5">
            <CalendarDays className="size-3.5 shrink-0 text-primary-light" aria-hidden />
            <dt className="sr-only">Date</dt>
            <dd className="truncate">
              {formatEventDate(event.start_datetime)} · {formatEventTime(event.start_datetime)}
              {ended && <span className="ml-2 rounded bg-gray-200 px-1.5 py-0.5 text-[10px] font-bold uppercase text-gray-600">Ended</span>}
            </dd>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="size-3.5 shrink-0 text-primary-light" aria-hidden />
            <dt className="sr-only">Venue</dt>
            <dd className="truncate">{event.venue_address}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}
