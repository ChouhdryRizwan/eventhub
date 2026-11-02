import { Bookmark, MapPin, MessageSquareText, ShieldCheck, SlidersHorizontal, Smartphone } from "lucide-react";
import SectionHeading from "@/components/home/SectionHeading";

const FEATURES = [
  { icon: MapPin, title: "Interactive map", text: "Colour-coded pins, popups and auto-pan make it easy to find events close to you." },
  { icon: SlidersHorizontal, title: "Smart filters & search", text: "Combine categories and search by name, venue, organizer or category — results update instantly." },
  { icon: Bookmark, title: "Save your favourites", text: "Bookmark events you're considering and come back to them from your dashboard." },
  { icon: ShieldCheck, title: "Reviewed before it goes live", text: "Every submitted event is checked by our team, so what you see on the map is real." },
  { icon: MessageSquareText, title: "Honest reviews", text: "Ratings and reviews from people who went help you pick the right night out." },
  { icon: Smartphone, title: "Made for your phone", text: "A fast, touch-friendly layout with a simple map/list switch on small screens." },
];

export default function FeatureGrid() {
  return (
    <section aria-labelledby="features-heading" className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <SectionHeading
          eyebrow="Why EventHub"
          title="Everything you need to plan a great outing"
          description="Built for people who go out — and for the organizers who make it happen."
          align="center"
        />
        <h3 id="features-heading" className="sr-only">
          Features
        </h3>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <li key={title} className="rounded-2xl border border-gray-200 bg-white p-6 transition hover:-translate-y-1 hover:border-primary-lighter hover:shadow-lg">
              <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-6" aria-hidden />
              </span>
              <h4 className="mt-5 text-lg font-bold text-gray-900">{title}</h4>
              <p className="mt-2 text-gray-600">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
