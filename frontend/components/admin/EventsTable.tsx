"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ExternalLink, Search, Trash2 } from "lucide-react";
import CategoryBadge from "@/components/shared/CategoryBadge";
import { Button } from "@/components/ui/button";
import { cn, formatEventDate } from "@/lib/utils";
import type { Event, EventStatus } from "@/types";

interface EventsTableProps {
  events: Event[];
  busyId: string | null;
  onStatus: (event: Event, status: EventStatus) => void;
  onFeatured: (event: Event, featured: boolean) => void;
  onDelete: (event: Event) => void;
}

const STATUS_STYLE: Record<EventStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  published: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

export default function EventsTable({ events, busyId, onStatus, onFeatured, onDelete }: EventsTableProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | EventStatus>("all");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return events.filter(
      (e) =>
        (status === "all" || e.status === status) &&
        (!q || e.title.toLowerCase().includes(q) || e.venue_address.toLowerCase().includes(q) || e.category?.name.toLowerCase().includes(q)),
    );
  }, [events, query, status]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <label htmlFor="admin-event-search" className="sr-only">
            Search events
          </label>
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-gray-400" aria-hidden />
          <input
            id="admin-event-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, venue or category…"
            className="min-h-11 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm focus:border-primary-light focus:outline-none focus:ring-2 focus:ring-primary-light/30"
          />
        </div>
        <label className="sr-only" htmlFor="admin-status-filter">
          Filter by status
        </label>
        <select
          id="admin-status-filter"
          value={status}
          onChange={(e) => setStatus(e.target.value as typeof status)}
          className="min-h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm"
        >
          <option value="all">All statuses</option>
          <option value="published">Published</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <p className="text-sm text-gray-500" role="status" aria-live="polite">
        {rows.length} of {events.length} events
      </p>

      <div className="overflow-x-auto rounded-card border border-gray-200 bg-white">
        <table className="w-full min-w-[56rem] text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th scope="col" className="px-4 py-3">Event</th>
              <th scope="col" className="px-4 py-3">Date</th>
              <th scope="col" className="px-4 py-3">Status</th>
              <th scope="col" className="px-4 py-3">Featured</th>
              <th scope="col" className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-gray-500">
                  No events match your filters.
                </td>
              </tr>
            )}
            {rows.map((event) => {
              const busy = busyId === event.documentId;
              return (
                <tr key={event.documentId} className={cn(busy && "opacity-60")}>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-gray-900">{event.title}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <CategoryBadge category={event.category} />
                      <span className="text-xs text-gray-500">{event.rsvp_count} going</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-600">{formatEventDate(event.start_datetime)}</td>
                  <td className="px-4 py-3">
                    <label className="sr-only" htmlFor={`status-${event.documentId}`}>
                      Status of {event.title}
                    </label>
                    <select
                      id={`status-${event.documentId}`}
                      value={event.status}
                      disabled={busy}
                      onChange={(e) => onStatus(event, e.target.value as EventStatus)}
                      className={cn("min-h-9 rounded-full border-0 px-3 text-xs font-semibold", STATUS_STYLE[event.status])}
                    >
                      <option value="published">Published</option>
                      <option value="pending">Pending</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={event.is_featured}
                      aria-label={`Featured: ${event.title}`}
                      disabled={busy || event.status !== "published"}
                      title={event.status !== "published" ? "Only published events can be featured" : undefined}
                      onClick={() => onFeatured(event, !event.is_featured)}
                      className="inline-flex h-10 w-14 items-center justify-center disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <span className={cn("relative inline-flex h-7 w-12 items-center rounded-full transition-colors", event.is_featured ? "bg-primary-light" : "bg-gray-300")}>
                        <span className={cn("inline-block size-5 rounded-full bg-white shadow transition-transform", event.is_featured ? "translate-x-6" : "translate-x-1")} />
                      </span>
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {event.status === "published" && (
                        <Link
                          href={`/events/${event.slug}`}
                          className="inline-flex min-h-9 items-center gap-1 rounded-lg px-3 text-xs font-semibold text-primary hover:bg-primary/5"
                        >
                          View <ExternalLink className="size-3.5" aria-hidden />
                        </Link>
                      )}
                      {confirmDelete === event.documentId ? (
                        <div role="alertdialog" aria-label={`Confirm deleting ${event.title}`} className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-red-700">Delete?</span>
                          <Button size="sm" variant="danger" disabled={busy} onClick={() => onDelete(event)}>
                            Yes
                          </Button>
                          <Button size="sm" variant="ghost" disabled={busy} onClick={() => setConfirmDelete(null)}>
                            No
                          </Button>
                        </div>
                      ) : (
                        <Button size="sm" variant="ghost" aria-label={`Delete ${event.title}`} disabled={busy} onClick={() => setConfirmDelete(event.documentId)} className="text-red-600 hover:bg-red-50">
                          <Trash2 className="size-4" aria-hidden />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
