import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import EventCard from "@/components/events/EventCard";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import Faq, { FAQS } from "@/components/home/Faq";
import FeatureGrid from "@/components/home/FeatureGrid";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import MapShowcase from "@/components/home/MapShowcase";
import OrganizerCta from "@/components/home/OrganizerCta";
import SectionHeading from "@/components/home/SectionHeading";
import StatsBar from "@/components/home/StatsBar";
import UpcomingTimeline from "@/components/home/UpcomingTimeline";
import { buttonVariants } from "@/components/ui/button";
import { getCachedHomeData } from "@/lib/data";
import { SITE_URL } from "@/lib/site";
import { cn } from "@/lib/utils";

const TITLE = "EventHub — Discover events around you";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description:
    "Find concerts, sports, tech summits, food festivals and community events near you on an interactive map. RSVP, save favourites and share your own events.",
  alternates: { canonical: "/" },
  openGraph: {
    title: TITLE,
    description: "Find events on an interactive map, filter by category and RSVP in a tap.",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "EventHub — discover events around you" }],
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "EventHub",
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/events?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  },
];

function HomeSkeleton() {
  return (
    <div aria-hidden>
      <div className="h-[34rem] animate-pulse bg-ink" />
      <div className="mx-auto -mt-16 h-28 max-w-6xl animate-pulse rounded-2xl bg-gray-100 px-4" />
      <div className="mx-auto mt-16 grid max-w-7xl gap-4 px-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="aspect-[4/3] animate-pulse rounded-2xl bg-gray-100" />
        ))}
      </div>
    </div>
  );
}

async function HomeSections() {
  let data;
  try {
    data = await getCachedHomeData();
  } catch (error) {
    console.error("[home] could not load events", error);
    return (
      <>
        <Hero categories={[]} soon={[]} />
        <p role="alert" className="mx-auto my-16 max-w-xl rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
          We couldn&apos;t load events right now. Please refresh in a moment.
        </p>
      </>
    );
  }

  const { categories, featured, upcoming, counts, stats } = data;

  return (
    <>
      <Hero categories={categories} soon={upcoming} />
      <StatsBar stats={stats} />

      <section aria-labelledby="categories-heading" className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <SectionHeading
            eyebrow="Browse by interest"
            title="Whatever you're into, there's an event for it"
            description="Pick a category to see matching events on the map and in the list."
            action={
              <Link href="/categories" className="inline-flex min-h-11 items-center gap-2 font-semibold text-primary hover:underline">
                All categories <ArrowRight className="size-4" aria-hidden />
              </Link>
            }
          />
          <h3 id="categories-heading" className="sr-only">
            Event categories
          </h3>
          <CategoryShowcase categories={categories} counts={counts} />
        </div>
      </section>

      {featured.length > 0 && (
        <section aria-labelledby="featured-heading" className="bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
            <SectionHeading
              eyebrow="Featured"
              title="Hand-picked events you won't want to miss"
              description="Chosen by our team for great lineups, venues and value."
              action={
                <Link href="/events" className={cn(buttonVariants({ variant: "outline" }))}>
                  Browse all events
                </Link>
              }
            />
            <h3 id="featured-heading" className="sr-only">
              Featured events
            </h3>
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((event, i) => (
                <li key={event.documentId}>
                  <EventCard event={event} priority={i < 3} className="h-full" />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {upcoming.length > 0 && <UpcomingTimeline events={upcoming} />}
      <HowItWorks />
      <MapShowcase />
      <FeatureGrid />
      <OrganizerCta />
      <Faq />
    </>
  );
}

export default function HomePage() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <Suspense fallback={<HomeSkeleton />}>
        <HomeSections />
      </Suspense>
    </main>
  );
}
