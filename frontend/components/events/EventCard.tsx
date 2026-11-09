import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin, Star } from "lucide-react";
import { CategoryIcon } from "@/lib/category-meta";
import CategoryBadge from "@/components/shared/CategoryBadge";
import { cn, formatEventDate, formatEventTime, formatPrice, imageUrl } from "@/lib/utils";
import type { Event } from "@/types";

interface EventCardProps {
  event: Event;
  highlighted?: boolean;
  /** Mark the first above-the-fold cards so their image is not lazy loaded. */
  priority?: boolean;
  onHover?: (id: string | null) => void;
  onSelect?: (id: string) => void;
  className?: string;
}

export default function EventCard({ event, highlighted, priority, onHover, onSelect, className }: EventCardProps) {
  // With onSelect the card highlights its map marker on click, so only the title and the
  // button navigate; otherwise the whole card is one stretched link.
  const interactive = Boolean(onSelect);
  const cover = event.images?.[0];
  const src = imageUrl(cover, "medium");

  return (
    <article
      id={`event-card-${event.documentId}`}
      onMouseEnter={onHover ? () => onHover(event.documentId) : undefined}
      onMouseLeave={onHover ? () => onHover(null) : undefined}
      onFocus={onHover ? () => onHover(event.documentId) : undefined}
      onBlur={onHover ? () => onHover(null) : undefined}
      onClick={onSelect ? () => onSelect(event.documentId) : undefined}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-card border border-gray-200 bg-white transition duration-200 hover:-translate-y-1 hover:shadow-lg",
        highlighted && "border-primary-light ring-2 ring-primary-light/40",
        className,
      )}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-primary to-accent">
        {src ? (
          <Image
            src={src}
            alt={cover?.alternativeText || `${event.title} event photo`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-300 group-hover:scale-105"
            priority={priority}
            loading={priority ? undefined : "lazy"}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-white" aria-hidden>
            <CategoryIcon slug={event.category?.slug} className="size-14" />
          </div>
        )}
        <div className="absolute left-3 top-3">
          <CategoryBadge category={event.category} className="bg-white/95 backdrop-blur" />
        </div>
        <span className="absolute right-3 top-3 rounded-full bg-ink/80 px-3 py-1 text-xs font-bold text-white">
          {formatPrice(event)}
        </span>
        {event.is_featured && (
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-ink">
            <Star className="size-3.5 fill-current" aria-hidden /> Featured
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="text-lg font-bold leading-snug text-gray-900">
          <Link href={`/events/${event.slug}`} className={cn("line-clamp-2 block py-2", !interactive && "after:absolute after:inset-0")}>
            {event.title}
          </Link>
        </h3>
        {event.short_desc && <p className="line-clamp-2 text-sm text-gray-600">{event.short_desc}</p>}

        <dl className="mt-auto space-y-1.5 text-sm text-gray-600">
          <div className="flex items-start gap-2">
            <CalendarDays className="mt-0.5 size-4 shrink-0 text-primary-light" aria-hidden />
            <dt className="sr-only">Date</dt>
            <dd>
              {formatEventDate(event.start_datetime)} · {formatEventTime(event.start_datetime)}
            </dd>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 size-4 shrink-0 text-primary-light" aria-hidden />
            <dt className="sr-only">Venue</dt>
            <dd className="line-clamp-1">{event.venue_address}</dd>
          </div>
        </dl>

        {interactive ? (
          <Link
            href={`/events/${event.slug}`}
            className="mt-1 inline-flex min-h-10 items-center justify-center rounded-xl border border-primary px-4 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
          >
            View Details
          </Link>
        ) : (
          <span
            aria-hidden
            className="mt-1 inline-flex min-h-10 items-center justify-center rounded-xl border border-primary px-4 text-sm font-semibold text-primary transition-colors group-hover:bg-primary group-hover:text-white"
          >
            View Details
          </span>
        )}
      </div>
    </article>
  );
}
