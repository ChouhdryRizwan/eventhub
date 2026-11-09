import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import ContactForm from "@/components/shared/ContactForm";
import PageHero from "@/components/shared/PageHero";

export const metadata: Metadata = {
  title: "Contact us",
  description: "Questions about an event, want to list yours, or found a problem? Get in touch with the EventHub team.",
  alternates: { canonical: "/contact" },
};

const DETAILS = [
  { icon: Mail, label: "Email", value: "hello@eventhub.example", href: "mailto:hello@eventhub.example" },
  { icon: Phone, label: "Phone", value: "+92 21 3500 0000", href: "tel:+922135000000" },
  { icon: MapPin, label: "Visit", value: "Karachi, Pakistan" },
  { icon: Clock, label: "Hours", value: "Mon–Sat, 10:00 AM – 6:00 PM" },
];

export default function ContactPage() {
  return (
    <main>
      <PageHero
        crumb="Contact"
        title="We'd love to hear from you"
        intro="A question about an event, a listing you'd like to submit, or something that isn't working — send us a note."
        image="/images/sections/crowd.jpg"
        imageAlt="A cheering crowd at a live event"
      />

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-5">
        <section aria-labelledby="details-heading" className="lg:col-span-2">
          <h2 id="details-heading" className="text-2xl font-bold">
            Contact details
          </h2>
          <ul className="mt-6 space-y-5">
            {DETAILS.map(({ icon: Icon, label, value, href }) => (
              <li key={label} className="flex gap-4">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" aria-hidden />
                </span>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">{label}</p>
                  {href ? (
                    <a href={href} className="inline-flex min-h-9 items-center text-lg font-medium text-gray-900 hover:text-primary">
                      {value}
                    </a>
                  ) : (
                    <p className="text-lg font-medium text-gray-900">{value}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-8 rounded-2xl bg-gray-50 p-5 text-sm leading-relaxed text-gray-600">
            Looking for a quick answer? Many common questions are covered in our{" "}
            <Link href="/#faq" className="font-semibold text-primary hover:underline">
              FAQ
            </Link>
            .
          </p>
        </section>

        <section aria-labelledby="form-heading" className="lg:col-span-3">
          <h2 id="form-heading" className="mb-6 text-2xl font-bold">
            Send a message
          </h2>
          <ContactForm />
        </section>
      </div>
    </main>
  );
}
