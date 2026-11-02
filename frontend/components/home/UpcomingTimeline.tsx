import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import SectionHeading from "@/components/home/SectionHeading";
import { CategoryIcon } from "@/lib/category-meta";
import { formatEventTime, formatPrice } from "@/lib/utils";
import type { Event } from "@/types";

const monthFormat = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Karachi", month: "short" });
const dayFormat = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Karachi", day: "numeric" });
const weekdayFormat = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Karachi", weekday: "short" });

export default function UpcomingTimeline({ events }: { events: Event[] }) {
  return (
    <section aria-labelledby="upcoming-heading" className="bg-ink text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <SectionHeading
            invert
            eyebrow="Coming up"
            title="What's on in the next few weeks"
            description="Plan your calendar — these are the next events happening around the city."
          />
          <h3 id="upcoming-heading" className="sr-only">
            Upcoming events
          </h3>
          <ol className="divide-y divide-white/10 border-y border-white/10">
            {events.map((event) => {
              return (
                <li key={event.documentId}>
                  <Link
                    href={`/events/${event.slug}`}
                    className="group flex items-center gap-4 py-5 transition hover:bg-white/5 sm:gap-6 sm:px-3"
                  >
                    <time
                      dateTime={event.start_datetime}
                      className="flex w-16 shrink-0 flex-col items-center rounded-xl bg-white/10 py-2 text-center"
                    >
                      <span className="text-xs font-semibold uppercase tracking-wider text-primary-lighter">{monthFormat.format(new Date(event.start_datetime))}</span>
                      <span className="font-syne text-2xl font-bold leading-none">{dayFormat.format(new Date(event.start_datetime))}</span>
                    </time>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2 text-xs text-gray-400">
                        <CategoryIcon slug={event.category?.slug} className="size-3.5" />
                        {event.category?.name} · {weekdayFormat.format(new Date(event.start_datetime))}, {formatEventTime(event.start_datetime)}
                      </span>
                      <span className="mt-0.5 block text-lg font-bold leading-snug group-hover:text-primary-lighter">{event.title}</span>
                      <span className="mt-0.5 flex items-center gap-1 text-sm text-gray-400">
                        <MapPin className="size-3.5 shrink-0" aria-hidden />
                        <span className="truncate">{event.venue_address}</span>
                      </span>
                    </span>
                    <span className="hidden shrink-0 rounded-full bg-white/10 px-3 py-1 text-sm font-semibold sm:block">{formatPrice(event)}</span>
                    <ArrowRight className="size-5 shrink-0 text-gray-500 transition group-hover:translate-x-1 group-hover:text-white" aria-hidden />
                  </Link>
                </li>
              );
            })}
          </ol>
          <Link href="/events" className="mt-8 inline-flex min-h-11 items-center gap-2 font-semibold text-primary-lighter hover:text-white">
            View the full calendar on the map <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>

        <div className="relative hidden min-h-[28rem] overflow-hidden rounded-3xl lg:col-span-5 lg:block">
          <Image
            src="/images/sections/crowd.jpg"
            alt="Excited crowd cheering at a live event"
            fill
            sizes="(min-width: 1024px) 40vw, 0px"
            loading="lazy"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" aria-hidden />
          <p className="absolute inset-x-0 bottom-0 p-7 text-2xl font-bold leading-snug">
            The best nights out start with a good plan.
          </p>
        </div>
      </div>
    </section>
  );
}
