import { ChevronDown } from "lucide-react";
import SectionHeading from "@/components/home/SectionHeading";

export const FAQS = [
  {
    q: "Is EventHub free to use?",
    a: "Yes. Browsing events, using the map, and creating an account are all free. EventHub doesn't sell tickets — the price shown on an event is set by its organizer and paid to them directly.",
  },
  {
    q: "Do I need an account?",
    a: "You can browse the map, list, categories and event pages without one. You'll need a free account to RSVP, save events, leave reviews or submit an event of your own.",
  },
  {
    q: "How do I submit my own event?",
    a: "Log in, open your dashboard and choose “Submit an event”. Add the details, pin the venue on the map and upload photos. Our team reviews it, and once approved it appears on the map for everyone.",
  },
  {
    q: "Can I cancel an RSVP?",
    a: "Of course. Open the event or your dashboard and cancel in one tap. You can re-join later if your plans change.",
  },
  {
    q: "How do I get to an event?",
    a: "Every event page has a “Get Directions” button that opens Google Maps with the venue's exact location already set as your destination.",
  },
  {
    q: "Which cities are covered?",
    a: "EventHub is open to every city. Organizers can list events anywhere, and the map shows them wherever they happen.",
  },
];

export default function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-heading" className="scroll-mt-20 bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <SectionHeading eyebrow="FAQ" title="Questions, answered" description="The short answers to what people ask most." align="center" />
        <h3 id="faq-heading" className="sr-only">
          Frequently asked questions
        </h3>
        <div className="space-y-3">
          {FAQS.map(({ q, a }) => (
            <details key={q} className="group rounded-2xl border border-gray-200 bg-white open:shadow-md">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left font-bold text-gray-900 [&::-webkit-details-marker]:hidden">
                {q}
                <ChevronDown className="size-5 shrink-0 text-primary transition-transform group-open:rotate-180" aria-hidden />
              </summary>
              <p className="px-5 pb-5 leading-relaxed text-gray-600">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
