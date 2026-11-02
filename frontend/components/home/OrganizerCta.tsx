import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const BENEFITS = ["Free to list your event", "Put your venue on the city map", "Collect RSVPs and reviews in one place"];

export default function OrganizerCta() {
  return (
    <section aria-labelledby="organizer-heading" className="relative isolate overflow-hidden bg-ink text-white">
      <Image
        src="/images/sections/organizer.jpg"
        alt="Attendees watching a speaker at a conference hall"
        fill
        sizes="100vw"
        loading="lazy"
        className="-z-20 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/90 to-ink/50" aria-hidden />
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <p className="text-sm font-bold uppercase tracking-widest text-primary-lighter">For organizers</p>
        <h2 id="organizer-heading" className="mt-3 max-w-2xl text-3xl font-bold leading-tight sm:text-5xl">
          Hosting something great? Get it in front of the city.
        </h2>
        <ul className="mt-8 space-y-3">
          {BENEFITS.map((b) => (
            <li key={b} className="flex items-center gap-3 text-lg text-gray-200">
              <CheckCircle2 className="size-5 shrink-0 text-primary-lighter" aria-hidden />
              {b}
            </li>
          ))}
        </ul>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/dashboard/submit-event"
            prefetch={false}
            className={cn(buttonVariants({ size: "lg" }), "bg-primary-light hover:bg-primary-lighter hover:text-ink")}
          >
            Submit your event <ArrowRight className="size-5" aria-hidden />
          </Link>
          <Link href="/about" className={cn(buttonVariants({ variant: "ghost", size: "lg" }), "text-white hover:bg-white/10")}>
            About EventHub
          </Link>
        </div>
      </div>
    </section>
  );
}
