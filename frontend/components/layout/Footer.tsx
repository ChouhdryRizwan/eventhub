import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { FacebookIcon, InstagramIcon, XIcon, YoutubeIcon } from "@/components/layout/SocialIcons";

const explore = [
  { href: "/events", label: "All events" },
  { href: "/events", label: "Events map" },
  { href: "/categories", label: "Categories" },
  { href: "/#faq", label: "FAQ" },
];

const categories = [
  { href: "/events?category=music", label: "Music" },
  { href: "/events?category=sports", label: "Sports" },
  { href: "/events?category=technology", label: "Technology" },
  { href: "/events?category=art-culture", label: "Art & Culture" },
  { href: "/events?category=food-drink", label: "Food & Drink" },
  { href: "/events?category=community", label: "Community" },
];

const company = [
  { href: "/about", label: "About us" },
  { href: "/contact", label: "Contact" },
  { href: "/dashboard/submit-event", label: "Submit an event" },
  { href: "/register", label: "Create an account" },
];

const social = [
  { href: "https://www.facebook.com/", label: "EventHub on Facebook", icon: FacebookIcon },
  { href: "https://www.instagram.com/", label: "EventHub on Instagram", icon: InstagramIcon },
  { href: "https://x.com/", label: "EventHub on X", icon: XIcon },
  { href: "https://www.youtube.com/", label: "EventHub on YouTube", icon: YoutubeIcon },
];

function LinkList({ title, items }: { title: string; items: { href: string; label: string }[] }) {
  return (
    <div>
      <h2 className="font-syne text-sm font-bold uppercase tracking-wider text-white">{title}</h2>
      <ul className="mt-4 space-y-1">
        {items.map((item) => (
          <li key={item.label}>
            <Link href={item.href} prefetch={item.href.startsWith("/dashboard") || item.href.startsWith("/admin") ? false : undefined} className="inline-flex min-h-9 items-center text-sm text-gray-400 transition-colors hover:text-primary-lighter">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="mt-auto bg-ink text-gray-300">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Link href="/" className="inline-flex min-h-11 items-center font-syne text-2xl font-bold text-white">
            Event<span className="text-primary-lighter">Hub</span>
          </Link>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-gray-400">
            Karachi&apos;s event guide. Discover concerts, matches, summits and community days on an interactive map, RSVP in a tap and
            keep your favourites one click away.
          </p>
          <ul className="mt-6 flex gap-2">
            {social.map(({ href, label, icon: Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex size-11 items-center justify-center rounded-full border border-white/15 text-gray-300 transition hover:border-primary-lighter hover:text-primary-lighter"
                >
                  <Icon />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-5">
          <LinkList title="Explore" items={explore} />
          <LinkList title="Categories" items={categories} />
          <LinkList title="Company" items={company} />
        </div>

        <div className="lg:col-span-3">
          <h2 className="font-syne text-sm font-bold uppercase tracking-wider text-white">Get in touch</h2>
          <ul className="mt-4 space-y-3 text-sm text-gray-400">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary-lighter" aria-hidden />
              Karachi, Pakistan
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-primary-lighter" aria-hidden />
              <a href="mailto:hello@eventhub.example" className="inline-flex min-h-9 items-center hover:text-primary-lighter">
                hello@eventhub.example
              </a>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-primary-lighter" aria-hidden />
              +92 21 3500 0000
            </li>
            <li className="flex gap-3">
              <Clock className="mt-0.5 size-4 shrink-0 text-primary-lighter" aria-hidden />
              Mon–Sat, 10:00 AM – 6:00 PM
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-4 py-6 text-xs text-gray-400 sm:flex-row sm:items-center sm:px-6">
          <p>© 2026 EventHub · A CS619 Final Year Project, Karachi.</p>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <li>
              <Link href="/terms" className="inline-flex min-h-9 items-center hover:text-primary-lighter">
                Terms of use
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="inline-flex min-h-9 items-center hover:text-primary-lighter">
                Privacy policy
              </Link>
            </li>
            <li>
              Photos from{" "}
              <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-9 items-center underline hover:text-primary-lighter">
                Unsplash
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
