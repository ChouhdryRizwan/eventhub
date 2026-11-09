import Link from "next/link";
import { CalendarPlus, MapPin } from "lucide-react";

/** Slim announcement strip above the navbar (hidden on very small screens to save space). */
export default function TopBar() {
  return (
    <div className="hidden bg-ink text-xs text-gray-300 sm:block">
      <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-4 sm:px-6">
        <p className="flex items-center gap-2">
          <MapPin className="size-3.5 text-primary-lighter" aria-hidden />
          Discover events happening near you — free to browse, free to join.
        </p>
        <nav aria-label="Secondary" className="flex items-center gap-5">
          <Link href="/#faq" className="hover:text-white">
            Help
          </Link>
          <Link href="/contact" className="hover:text-white">
            Contact
          </Link>
          <Link href="/dashboard/submit-event" prefetch={false} className="inline-flex items-center gap-1.5 font-semibold text-primary-lighter hover:text-white">
            <CalendarPlus className="size-3.5" aria-hidden /> Submit your event
          </Link>
        </nav>
      </div>
    </div>
  );
}
