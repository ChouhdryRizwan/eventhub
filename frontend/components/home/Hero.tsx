import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin, Search } from "lucide-react";
import { CategoryIcon } from "@/lib/category-meta";
import { formatEventDate, formatEventTime, formatPrice, imageUrl } from "@/lib/utils";
import type { Category, Event } from "@/types";

const QUICK_LINKS = [
  { label: "Music", href: "/events?category=music" },
  { label: "Free events", href: "/events?search=free" },
  { label: "Tech", href: "/events?category=technology" },
  { label: "Food & drink", href: "/events?category=food-drink" },
];

function SoonCard({ event }: { event: Event }) {
  const cover = event.images?.[0];
  const src = imageUrl(cover, "small");
  return (
    <Link
      href={`/events/${event.slug}`}
      className="group flex gap-4 rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur-md transition hover:bg-white/20"
    >
      <span className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-primary">
        {src ? (
          <Image src={src} alt={cover?.alternativeText || event.title} fill sizes="80px" className="object-cover" />
        ) : (
          <span className="flex h-full items-center justify-center text-white">
            <CategoryIcon slug={event.category?.slug} className="size-8" />
          </span>
        )}
      </span>
      <span className="min-w-0 flex-1 text-white">
        <span className="block text-xs font-semibold uppercase tracking-wide text-primary-lighter">
          {formatEventDate(event.start_datetime)} · {formatEventTime(event.start_datetime)}
        </span>
        <span className="mt-0.5 line-clamp-2 block font-bold leading-snug">{event.title}</span>
        <span className="mt-1 flex items-center gap-1 text-xs text-gray-300">
          <MapPin className="size-3.5 shrink-0" aria-hidden />
          <span className="truncate">{event.venue_address.split(",")[0]}</span>
          <span className="ml-auto shrink-0 font-semibold text-white">{formatPrice(event)}</span>
        </span>
      </span>
    </Link>
  );
}

export default function Hero({ categories, soon }: { categories: Category[]; soon: Event[] }) {
  return (
    <section className="relative isolate overflow-hidden bg-ink text-white">
      <Image
        src="/images/hero.jpg"
        alt="A crowd enjoying a live concert under stage lights"
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-center"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/95 via-ink/65 to-ink/10" aria-hidden />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-ink/80 to-transparent" aria-hidden />

      <div className="mx-auto grid max-w-7xl gap-12 px-4 pb-28 pt-14 sm:px-6 sm:pt-20 lg:grid-cols-12 lg:pb-36 lg:pt-28">
        <div className="lg:col-span-7">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary-lighter backdrop-blur">
            <span className="size-1.5 rounded-full bg-green-400" aria-hidden />
            Your event guide
          </p>
          <h1 className="mt-6 max-w-2xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            Find what&apos;s on.
            <br />
            <span className="text-primary-lighter">Go where it&apos;s happening.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base text-gray-300 sm:text-lg">
            Concerts, matches, summits, food festivals and community days across the city — all on one
            interactive map. Pick an event, RSVP in a tap, and get directions.
          </p>

          <form action="/events" role="search" className="mt-9 max-w-2xl rounded-2xl bg-white p-2 shadow-2xl shadow-black/40">
            <div className="flex flex-col gap-2 sm:flex-row">
              <label htmlFor="hero-search" className="sr-only">
                Search events by name, venue or organizer
              </label>
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-gray-400" aria-hidden />
                <input
                  id="hero-search"
                  name="search"
                  type="search"
                  placeholder="Search events, venues, organizers…"
                  className="min-h-12 w-full rounded-xl bg-transparent pl-12 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-light"
                />
              </div>
              <label htmlFor="hero-category" className="sr-only">
                Category
              </label>
              <select
                id="hero-category"
                name="category"
                defaultValue=""
                className="min-h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-light sm:w-44"
              >
                <option value="">All categories</option>
                {categories.map((c) => (
                  <option key={c.documentId} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="min-h-12 rounded-xl bg-primary px-7 text-sm font-bold text-white transition-colors hover:bg-primary-light"
              >
                Find events
              </button>
            </div>
          </form>

          <p className="mt-5 flex flex-wrap items-center gap-2 text-sm text-gray-300">
            <span className="text-gray-400">Popular:</span>
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="inline-flex min-h-9 items-center rounded-full border border-white/20 px-4 text-sm font-medium text-white transition hover:border-primary-lighter hover:bg-white/10"
              >
                {link.label}
              </Link>
            ))}
          </p>
        </div>

        {soon.length > 0 && (
          <aside aria-labelledby="soon-heading" className="lg:col-span-5 lg:pt-6">
            <div className="flex items-center justify-between">
              <h2 id="soon-heading" className="flex items-center gap-2 text-lg font-bold">
                <CalendarDays className="size-5 text-primary-lighter" aria-hidden /> Happening soon
              </h2>
              <Link href="/events" className="inline-flex min-h-9 items-center gap-1 text-sm font-semibold text-primary-lighter hover:text-white">
                See all <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
            <ul className="mt-4 space-y-3">
              {soon.slice(0, 3).map((event) => (
                <li key={event.documentId}>
                  <SoonCard event={event} />
                </li>
              ))}
            </ul>
          </aside>
        )}
      </div>
    </section>
  );
}
