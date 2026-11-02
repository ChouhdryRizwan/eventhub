import { MapPinned, Star, Ticket } from "lucide-react";
import SectionHeading from "@/components/home/SectionHeading";

const STEPS = [
  {
    icon: MapPinned,
    title: "Discover on the map",
    text: "Browse every event as a pin on the city map, or flip to the list. Filter by category and search by name, venue or organizer.",
  },
  {
    icon: Ticket,
    title: "RSVP & save in a tap",
    text: "Create a free account to RSVP, bookmark favourites for later, and see everything you're going to in one dashboard.",
  },
  {
    icon: Star,
    title: "Go, then share how it was",
    text: "Get directions in Google Maps, enjoy the event, and leave a rating and review to help others choose well.",
  },
];

export default function HowItWorks() {
  return (
    <section aria-labelledby="how-heading" className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <SectionHeading eyebrow="How it works" title="From “what's on?” to “see you there” in three steps" align="center" />
        <h3 id="how-heading" className="sr-only">
          Three steps
        </h3>
        <ol className="relative grid gap-10 md:grid-cols-3">
          <span className="absolute left-[16.6%] right-[16.6%] top-8 hidden border-t-2 border-dashed border-primary/20 md:block" aria-hidden />
          {STEPS.map(({ icon: Icon, title, text }, i) => (
            <li key={title} className="relative text-center">
              <span className="relative mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/30">
                <Icon className="size-7" aria-hidden />
                <span className="absolute -right-2 -top-2 flex size-7 items-center justify-center rounded-full bg-ink text-xs font-bold ring-2 ring-white">
                  {i + 1}
                </span>
              </span>
              <h4 className="mt-6 text-xl font-bold text-gray-900">{title}</h4>
              <p className="mx-auto mt-2 max-w-xs text-gray-600">{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
