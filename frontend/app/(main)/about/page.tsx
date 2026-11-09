import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Compass, Eye, HeartHandshake, Smartphone } from "lucide-react";
import PageHero from "@/components/shared/PageHero";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About us",
  description: "EventHub is Karachi's event guide: one place to find what's on, on an interactive map. Learn why we built it.",
  alternates: { canonical: "/about" },
};

const VALUES = [
  { icon: Compass, title: "Local first", text: "Built around Karachi's venues, neighbourhoods and the way people here actually plan a night out." },
  { icon: Eye, title: "Honest listings", text: "Every submitted event is reviewed before it goes live, so the map shows things that are really happening." },
  { icon: Smartphone, title: "Simple by design", text: "A fast, touch-friendly interface. Find an event, RSVP, get directions — that's it." },
  { icon: HeartHandshake, title: "Open to everyone", text: "Free for attendees and free for organizers, from big concerts to small neighbourhood clean-ups." },
];

const STACK = ["Next.js", "React", "Tailwind CSS", "Strapi CMS", "PostgreSQL (NeonDB)", "Leaflet maps", "Cloudinary"];

export default function AboutPage() {
  return (
    <main>
      <PageHero
        crumb="About us"
        title="One place to find what's on in Karachi"
        intro="Great events are happening all the time — but they're scattered across posters, group chats and social feeds. EventHub brings them together on a single map."
        image="/images/sections/community.jpg"
        imageAlt="Friends sitting together with their arms around each other"
      />

      <section aria-labelledby="story-heading" className="bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-primary-light">Our story</p>
            <h2 id="story-heading" className="mt-2 text-3xl font-bold leading-tight sm:text-4xl">
              Built because finding something to do shouldn&apos;t take an hour of scrolling
            </h2>
            <div className="mt-5 space-y-4 text-lg leading-relaxed text-gray-600">
              <p>
                We noticed the same thing again and again: a concert, a food festival or a tech meetup would be on — and half the people
                who would have loved it only found out afterwards.
              </p>
              <p>
                EventHub puts every event on a map, with clear dates, prices and directions. You can filter by what you like, save what
                interests you, RSVP when you&apos;re sure, and tell others how it went. Organizers get a simple way to put their event in
                front of the city.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/events" className={cn(buttonVariants({ size: "lg" }))}>
                Explore events <ArrowRight className="size-5" aria-hidden />
              </Link>
              <Link href="/contact" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
                Get in touch
              </Link>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-xl">
            <Image
              src="/images/sections/stage.jpg"
              alt="Stage lights and silhouettes of a cheering concert crowd"
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              loading="lazy"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section aria-labelledby="values-heading" className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="mb-10 text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-primary-light">What we care about</p>
            <h2 id="values-heading" className="mt-2 text-3xl font-bold sm:text-4xl">
              The ideas behind EventHub
            </h2>
          </div>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map(({ icon: Icon, title, text }) => (
              <li key={title} className="rounded-2xl border border-gray-200 bg-white p-6">
                <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-6" aria-hidden />
                </span>
                <h3 className="mt-5 text-lg font-bold">{title}</h3>
                <p className="mt-2 text-gray-600">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="project-heading" className="bg-white">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
          <p className="text-sm font-bold uppercase tracking-widest text-primary-light">The project</p>
          <h2 id="project-heading" className="mt-2 text-3xl font-bold sm:text-4xl">
            A final year project, built properly
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-gray-600">
            EventHub is the CS619 Final Year Project of a student group in Karachi — designed, built and tested as a
            full web application with a headless CMS, a managed database and cloud hosting.
          </p>
          <ul className="mt-8 flex flex-wrap justify-center gap-2">
            {STACK.map((tech) => (
              <li key={tech} className="rounded-full border border-gray-200 bg-gray-50 px-4 py-1.5 text-sm font-medium text-gray-700">
                {tech}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
