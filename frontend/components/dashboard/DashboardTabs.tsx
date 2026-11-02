"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarPlus, Star } from "lucide-react";
import EventRow from "@/components/dashboard/EventRow";
import ProfileSettings from "@/components/dashboard/ProfileSettings";
import RSVPList from "@/components/dashboard/RSVPList";
import SavedList from "@/components/dashboard/SavedList";
import { StarDisplay } from "@/components/shared/StarRating";
import { buttonVariants } from "@/components/ui/button";
import { cn, formatEventDate } from "@/lib/utils";
import type { Bookmark, Event, Review, Rsvp } from "@/types";

const TABS = [
  { id: "rsvps", label: "My RSVPs" },
  { id: "saved", label: "Saved events" },
  { id: "events", label: "My events" },
  { id: "reviews", label: "My reviews" },
  { id: "settings", label: "Settings" },
] as const;
type TabId = (typeof TABS)[number]["id"];

interface DashboardTabsProps {
  rsvps: Rsvp[];
  bookmarks: Bookmark[];
  reviews: Review[];
  events: Event[];
  initialTab?: TabId;
  profile: { name: string; email: string; phone: string; bio: string; avatar: string | null };
}

const STATUS_BADGE: Record<Event["status"], { label: string; className: string }> = {
  pending: { label: "Pending review", className: "bg-amber-100 text-amber-800" },
  published: { label: "Live", className: "bg-green-100 text-green-700" },
  rejected: { label: "Not approved", className: "bg-red-100 text-red-700" },
};

function MyEvents({ events }: { events: Event[] }) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-card border border-dashed border-gray-300 px-6 py-14 text-center">
        <CalendarPlus className="size-10 text-gray-400" aria-hidden />
        <h3 className="mt-4 text-lg font-bold">You haven&apos;t submitted any events</h3>
        <p className="mt-1 max-w-xs text-sm text-gray-500">Hosting something? Submit it and we&apos;ll review it for the map.</p>
        <Link href="/dashboard/submit-event" prefetch={false} className={cn(buttonVariants(), "mt-5")}>
          Submit an event
        </Link>
      </div>
    );
  }
  return (
    <ul className="space-y-3">
      {events.map((event) => {
        const badge = STATUS_BADGE[event.status];
        return (
          <li key={event.documentId}>
            <EventRow
              event={event}
              badge={<span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", badge.className)}>{badge.label}</span>}
            />
          </li>
        );
      })}
    </ul>
  );
}

function MyReviews({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-card border border-dashed border-gray-300 px-6 py-14 text-center">
        <Star className="size-10 text-gray-400" aria-hidden />
        <h3 className="mt-4 text-lg font-bold">No reviews yet</h3>
        <p className="mt-1 max-w-xs text-sm text-gray-500">Rate an event you attended and it will show up here.</p>
      </div>
    );
  }
  return (
    <ul className="space-y-3">
      {reviews.map((review) => (
        <li key={review.documentId} className="rounded-card border border-gray-200 bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            {review.event ? (
              <Link href={`/events/${review.event.slug}`} className="inline-flex min-h-9 items-center font-bold text-gray-900 hover:text-primary">
                {review.event.title}
              </Link>
            ) : (
              <span className="font-bold text-gray-500">Removed event</span>
            )}
            <time dateTime={review.createdAt} className="text-xs text-gray-500">
              {formatEventDate(review.createdAt)}
            </time>
          </div>
          <StarDisplay value={review.rating} className="mt-1" />
          <p className="mt-2 whitespace-pre-line text-sm text-gray-700">{review.review_text}</p>
        </li>
      ))}
    </ul>
  );
}

export default function DashboardTabs({ rsvps, bookmarks, reviews, events, initialTab = "rsvps", profile }: DashboardTabsProps) {
  const [tab, setTab] = useState<TabId>(initialTab);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const index = TABS.findIndex((t) => t.id === tab);
    if (e.key === "ArrowRight") setTab(TABS[(index + 1) % TABS.length].id);
    if (e.key === "ArrowLeft") setTab(TABS[(index - 1 + TABS.length) % TABS.length].id);
  };

  return (
    <div>
      <div
        role="tablist"
        aria-label="Dashboard sections"
        onKeyDown={onKeyDown}
        className="-mx-4 flex gap-1 overflow-x-auto border-b border-gray-200 px-4 sm:mx-0 sm:px-0"
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            id={`tab-${t.id}`}
            role="tab"
            type="button"
            aria-selected={tab === t.id}
            aria-controls={`panel-${t.id}`}
            tabIndex={tab === t.id ? 0 : -1}
            onClick={() => setTab(t.id)}
            className={cn(
              "min-h-11 shrink-0 border-b-2 px-4 text-sm font-semibold transition-colors",
              tab === t.id ? "border-primary text-primary" : "border-transparent text-gray-600 hover:text-gray-900",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div id={`panel-${tab}`} role="tabpanel" aria-labelledby={`tab-${tab}`} className="pt-6">
        {tab === "rsvps" && <RSVPList initial={rsvps} />}
        {tab === "saved" && <SavedList initial={bookmarks} />}
        {tab === "events" && <MyEvents events={events} />}
        {tab === "reviews" && <MyReviews reviews={reviews} />}
        {tab === "settings" && <ProfileSettings user={profile} />}
      </div>
    </div>
  );
}
