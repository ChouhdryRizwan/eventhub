import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { CalendarDays, ChevronRight, Mail, MapPin, Navigation, Phone, Tag, User, Users } from "lucide-react";
import EventActions from "@/components/events/EventActions";
import EventGallery from "@/components/events/EventGallery";
import ReviewForm from "@/components/events/ReviewForm";
import VenueMap from "@/components/events/VenueMap";
import CategoryBadge from "@/components/shared/CategoryBadge";
import { StarDisplay } from "@/components/shared/StarRating";
import { buttonVariants } from "@/components/ui/button";
import { getEvents, getFeaturedEvents, getMyBookmarkForEvent, getMyRsvpForEvent } from "@/lib/api";
import { auth } from "@/lib/auth";
import { getCachedEvent, getCachedReviews } from "@/lib/data";
import { SITE_URL } from "@/lib/site";
import { cn, directionsUrl, formatEventDate, formatEventTime, formatPrice, hasEventEnded, imageUrl } from "@/lib/utils";
import type { Event } from "@/types";

type Params = Promise<{ slug: string }>;

// Prerender only the featured events at build time; every other event page is rendered on its
// first visit and then cached, which keeps builds fast and light on the CMS.
// Cache Components requires at least one result, and the free-tier API can be asleep when a build
// runs, so retry (the first request wakes it) and fall back to any events when none are featured.
export async function generateStaticParams() {
  const attempts = 4;
  let lastError: unknown;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      let { data } = await getFeaturedEvents(6);
      if (data.length === 0) ({ data } = await getEvents({ pageSize: 3 }));
      if (data.length > 0) return data.map((event) => ({ slug: event.slug }));
      lastError = new Error("The API returned no events to prerender.");
    } catch (error) {
      lastError = error;
    }
    if (attempt < attempts) await new Promise((resolve) => setTimeout(resolve, 5000));
  }
  throw lastError;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const event = await getCachedEvent(slug).catch(() => null);
  if (!event) return { title: "Event not found", robots: { index: false, follow: false } };

  const description = event.short_desc || event.description.slice(0, 160);
  const image = imageUrl(event.images?.[0], "large");
  return {
    title: event.title,
    description,
    alternates: { canonical: `/events/${event.slug}` },
    openGraph: {
      title: event.title,
      description,
      type: "website",
      url: `${SITE_URL}/events/${event.slug}`,
      images: image ? [{ url: image, alt: event.title }] : [{ url: "/opengraph-image", width: 1200, height: 630, alt: "EventHub" }],
    },
    twitter: { card: image ? "summary_large_image" : "summary", title: event.title, description },
  };
}

function eventJsonLd(event: Event) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.short_desc || event.description,
    startDate: event.start_datetime,
    ...(event.end_datetime ? { endDate: event.end_datetime } : {}),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: event.venue_address,
      address: event.venue_address,
      ...(event.latitude != null && event.longitude != null
        ? { geo: { "@type": "GeoCoordinates", latitude: event.latitude, longitude: event.longitude } }
        : {}),
    },
    image: (event.images ?? []).map((image) => imageUrl(image, "large")).filter(Boolean),
    offers: {
      "@type": "Offer",
      price: event.is_free ? 0 : event.ticket_price,
      priceCurrency: "PKR",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/events/${event.slug}`,
    },
    ...(event.organizer_name
      ? {
          organizer: {
            "@type": "Organization",
            name: event.organizer_name,
            ...(event.organizer_email ? { email: event.organizer_email } : {}),
            ...(event.organizer_phone ? { telephone: event.organizer_phone } : {}),
          },
        }
      : {}),
  };
}

function Breadcrumb({ title }: { title: string }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-gray-500">
      <ol className="flex flex-wrap items-center gap-1">
        <li>
          <Link href="/" className="inline-flex min-h-9 items-center hover:text-primary">
            Home
          </Link>
        </li>
        <ChevronRight className="size-4" aria-hidden />
        <li>
          <Link href="/events" className="inline-flex min-h-9 items-center hover:text-primary">
            Events
          </Link>
        </li>
        <ChevronRight className="size-4" aria-hidden />
        <li aria-current="page" className="line-clamp-1 font-semibold text-gray-900">
          {title}
        </li>
      </ol>
    </nav>
  );
}

/** Per-user state (RSVP / saved) — dynamic, so it streams in after the cached page shell. */
async function PersonalActions({ event }: { event: Event }) {
  await connection(); // NextAuth touches crypto before reading the request; defer to request time
  const session = await auth();
  let attending = false;
  let saved = false;

  if (session) {
    const [rsvp, bookmark] = await Promise.allSettled([
      getMyRsvpForEvent(event.documentId, session.accessToken),
      getMyBookmarkForEvent(event.documentId, session.accessToken),
    ]);
    attending = rsvp.status === "fulfilled" && rsvp.value?.status === "confirmed";
    saved = bookmark.status === "fulfilled" && Boolean(bookmark.value);
  }

  return (
    <EventActions
      eventId={event.documentId}
      slug={event.slug}
      isAuthenticated={Boolean(session)}
      ended={hasEventEnded(event)}
      initialAttending={attending}
      initialSaved={saved}
    />
  );
}

async function ReviewFormGate({ event }: { event: Event }) {
  await connection();
  const session = await auth();
  return <ReviewForm eventId={event.documentId} slug={event.slug} isAuthenticated={Boolean(session)} />;
}

async function Reviews({ event }: { event: Event }) {
  let data;
  try {
    data = await getCachedReviews(event.documentId, event.slug);
  } catch {
    return <p className="text-sm text-red-600">Reviews couldn&apos;t be loaded right now.</p>;
  }
  const { reviews, total } = data;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <StarDisplay value={event.avg_rating} />
        <p className="text-sm text-gray-600">
          {total > 0 ? `${event.avg_rating.toFixed(1)} average · ${total} ${total === 1 ? "review" : "reviews"}` : "No reviews yet"}
        </p>
      </div>

      {reviews.length === 0 ? (
        <p className="rounded-card border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
          Be the first to review this event.
        </p>
      ) : (
        <ul className="space-y-3">
          {reviews.map((review) => (
            <li key={review.documentId} className="rounded-card border border-gray-200 bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                  <User className="size-4 text-gray-400" aria-hidden /> {review.author_name || "EventHub member"}
                </p>
                <time dateTime={review.createdAt} className="text-xs text-gray-500">
                  {formatEventDate(review.createdAt)}
                </time>
              </div>
              <StarDisplay value={review.rating} className="mt-2" />
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-gray-700">{review.review_text}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function InfoRow({ icon: Icon, label, children }: { icon: typeof MapPin; label: string; children: React.ReactNode }) {
  return (
    // A <dl> may only contain <div> groups of <dt>/<dd>, so the icon lives inside the <dt>.
    <div>
      <dt className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
        <Icon className="size-5 shrink-0 text-primary-light" aria-hidden />
        {label}
      </dt>
      <dd className="mt-0.5 pl-8 text-sm text-gray-900">{children}</dd>
    </div>
  );
}

async function EventDetail({ params }: { params: Params }) {
  const { slug } = await params;
  let event: Event | null;
  try {
    event = await getCachedEvent(slug);
  } catch {
    return (
      <main className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">We couldn&apos;t load this event</h1>
        <p className="mt-2 text-gray-600">Please check your connection and try again.</p>
        <Link href="/events" className={cn(buttonVariants(), "mt-6")}>
          Back to events
        </Link>
      </main>
    );
  }
  if (!event) {
    // A missing (or still pending) event must never be stored as prerendered output, or the
    // "not found" page would outlive the approval. Defer this branch to request time.
    await connection();
    notFound();
  }

  const hasCoords = event.latitude != null && event.longitude != null;
  const end = event.end_datetime ? ` – ${formatEventTime(event.end_datetime)}` : "";

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd(event)).replace(/</g, "\\u003c") }}
      />
      <Breadcrumb title={event.title} />

      <div className="mt-4 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="min-w-0 space-y-8 lg:col-span-2">
          <EventGallery images={event.images ?? []} title={event.title} fallbackIcon={event.category?.icon} />

          <header className="space-y-3">
            <CategoryBadge category={event.category} />
            <h1 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">{event.title}</h1>
            {event.short_desc && <p className="text-lg text-gray-600">{event.short_desc}</p>}
          </header>

          <section aria-labelledby="about-heading">
            <h2 id="about-heading" className="mb-3 text-2xl font-bold">
              About this event
            </h2>
            <p className="whitespace-pre-line leading-relaxed text-gray-700">{event.description}</p>
          </section>

          {(event.organizer_name || event.organizer_email || event.organizer_phone) && (
            <section aria-labelledby="organizer-heading" className="rounded-card border border-gray-200 bg-gray-50 p-5">
              <h2 id="organizer-heading" className="mb-3 text-xl font-bold">
                Organizer
              </h2>
              <dl className="space-y-3">
                {event.organizer_name && (
                  <InfoRow icon={User} label="Name">
                    {event.organizer_name}
                  </InfoRow>
                )}
                {event.organizer_email && (
                  <InfoRow icon={Mail} label="Email">
                    <a href={`mailto:${event.organizer_email}`} className="inline-flex min-h-9 items-center text-primary hover:underline">
                      {event.organizer_email}
                    </a>
                  </InfoRow>
                )}
                {event.organizer_phone && (
                  <InfoRow icon={Phone} label="Phone">
                    <a href={`tel:${event.organizer_phone.replace(/\s/g, "")}`} className="inline-flex min-h-9 items-center text-primary hover:underline">
                      {event.organizer_phone}
                    </a>
                  </InfoRow>
                )}
              </dl>
            </section>
          )}

          <section aria-labelledby="venue-heading">
            <h2 id="venue-heading" className="mb-3 text-2xl font-bold">
              Venue
            </h2>
            <p className="mb-3 flex items-start gap-2 text-gray-700">
              <MapPin className="mt-0.5 size-5 shrink-0 text-primary-light" aria-hidden /> {event.venue_address}
            </p>
            {hasCoords && (
              <div className="h-72 overflow-hidden rounded-card border border-gray-200 sm:h-80">
                <VenueMap
                  latitude={event.latitude!}
                  longitude={event.longitude!}
                  title={event.title}
                  address={event.venue_address}
                  color={event.category?.color}
                />
              </div>
            )}
          </section>

          <section aria-labelledby="reviews-heading" className="space-y-4">
            <h2 id="reviews-heading" className="text-2xl font-bold">
              Reviews
            </h2>
            <Suspense fallback={<div className="h-24 animate-pulse rounded-card bg-gray-100" aria-hidden />}>
              <Reviews event={event} />
            </Suspense>
            <Suspense fallback={<div className="h-56 animate-pulse rounded-card bg-gray-100" aria-hidden />}>
              <ReviewFormGate event={event} />
            </Suspense>
          </section>
        </div>

        <aside className="min-w-0 lg:col-span-1">
          <div className="space-y-5 rounded-card border border-gray-200 bg-white p-5 shadow-sm lg:sticky lg:top-24">
            <p className="font-syne text-3xl font-bold text-primary">{formatPrice(event)}</p>

            <dl className="space-y-4">
              <InfoRow icon={CalendarDays} label="Date & time">
                {formatEventDate(event.start_datetime)}
                <br />
                {formatEventTime(event.start_datetime)}
                {end}
              </InfoRow>
              <InfoRow icon={MapPin} label="Venue">
                {event.venue_address}
              </InfoRow>
              {event.category && (
                <InfoRow icon={Tag} label="Category">
                  {event.category.name}
                </InfoRow>
              )}
              <InfoRow icon={Users} label="Going">
                {event.rsvp_count} {event.rsvp_count === 1 ? "person" : "people"}
              </InfoRow>
            </dl>

            <a
              href={directionsUrl(event)}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "dark" }), "w-full")}
            >
              <Navigation className="size-4" aria-hidden /> Get Directions
            </a>

            <Suspense fallback={<div className="h-28 animate-pulse rounded-xl bg-gray-100" aria-hidden />}>
              <PersonalActions event={event} />
            </Suspense>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default function EventPage({ params }: { params: Params }) {
  return (
    <Suspense fallback={<div className="mx-auto h-[60vh] max-w-7xl animate-pulse px-4 py-6 sm:px-6" aria-hidden />}>
      <EventDetail params={params} />
    </Suspense>
  );
}
