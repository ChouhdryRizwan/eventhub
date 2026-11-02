import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import SectionHeading from "@/components/home/SectionHeading";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const POINTS = [
  "Every event is a colour-coded pin — see what's near you at a glance",
  "Hover a card and its pin lights up; click a pin to open the details",
  "Filter by several categories at once, with no page reloads",
  "One tap to open turn-by-turn directions in Google Maps",
];

export default function MapShowcase() {
  return (
    <section aria-labelledby="map-heading" className="overflow-hidden bg-gray-50">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeading eyebrow="The map" title="See the whole city's events in one view" />
          <h3 id="map-heading" className="sr-only">
            Interactive event map
          </h3>
          <ul className="-mt-4 space-y-4">
            {POINTS.map((point) => (
              <li key={point} className="flex gap-3 text-gray-700">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Check className="size-4" aria-hidden />
                </span>
                {point}
              </li>
            ))}
          </ul>
          <Link href="/events" className={cn(buttonVariants({ size: "lg" }), "mt-9")}>
            Open the map <ArrowRight className="size-5" aria-hidden />
          </Link>
        </div>

        <div className="lg:col-span-7">
          <div className="rounded-2xl bg-white p-2 shadow-2xl shadow-primary/20 ring-1 ring-gray-200 lg:translate-x-6">
            <div className="flex items-center gap-1.5 px-3 py-2" aria-hidden>
              <span className="size-2.5 rounded-full bg-red-400" />
              <span className="size-2.5 rounded-full bg-amber-400" />
              <span className="size-2.5 rounded-full bg-green-400" />
              <span className="ml-3 truncate rounded-md bg-gray-100 px-3 py-0.5 text-xs text-gray-600">eventhub.app/events</span>
            </div>
            <Image
              src="/images/sections/map-preview.jpg"
              alt="The EventHub events page showing a city map with coloured pins next to a list of event cards"
              width={1400}
              height={860}
              sizes="(min-width: 1024px) 56vw, 100vw"
              loading="lazy"
              className="h-auto w-full rounded-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
