"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, ChevronDown, ClipboardCheck, X } from "lucide-react";
import CategoryBadge from "@/components/shared/CategoryBadge";
import { Button } from "@/components/ui/button";
import { cn, formatEventDate, formatEventTime, formatPrice, imageUrl } from "@/lib/utils";
import type { Event } from "@/types";

interface PendingQueueProps {
  events: Event[];
  busyId: string | null;
  onApprove: (event: Event) => void;
  onReject: (event: Event) => void;
}

export default function PendingQueue({ events, busyId, onApprove, onReject }: PendingQueueProps) {
  const [open, setOpen] = useState<string | null>(null);
  const [confirmReject, setConfirmReject] = useState<string | null>(null);

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-card border border-dashed border-gray-300 px-6 py-14 text-center">
        <ClipboardCheck className="size-10 text-green-500" aria-hidden />
        <h3 className="mt-4 text-lg font-bold">All caught up</h3>
        <p className="mt-1 text-sm text-gray-500">There are no events waiting for review.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {events.map((event) => {
        const expanded = open === event.documentId;
        const busy = busyId === event.documentId;
        const submitter = event.submitted_by;
        return (
          <li key={event.documentId} className="rounded-card border border-gray-200 bg-white">
            <div className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center">
              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <CategoryBadge category={event.category} />
                  <span className="text-xs text-gray-500">
                    Submitted by {submitter?.full_name || submitter?.username || "unknown"}
                    {submitter?.email ? ` (${submitter.email})` : ""}
                  </span>
                </div>
                <h3 className="text-lg font-bold leading-snug text-gray-900">{event.title}</h3>
                <p className="text-sm text-gray-600">
                  {formatEventDate(event.start_datetime)} · {formatEventTime(event.start_datetime)} · {event.venue_address}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  aria-expanded={expanded}
                  aria-controls={`pending-${event.documentId}`}
                  onClick={() => setOpen(expanded ? null : event.documentId)}
                >
                  Details <ChevronDown className={cn("size-4 transition-transform", expanded && "rotate-180")} aria-hidden />
                </Button>
                {confirmReject === event.documentId ? (
                  <div role="alertdialog" aria-label={`Confirm rejecting ${event.title}`} className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-red-700">Reject this event?</span>
                    <Button size="sm" variant="danger" disabled={busy} onClick={() => onReject(event)}>
                      Yes, reject
                    </Button>
                    <Button size="sm" variant="ghost" disabled={busy} onClick={() => setConfirmReject(null)}>
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <>
                    <Button size="sm" disabled={busy} onClick={() => onApprove(event)} className="bg-green-600 hover:bg-green-700">
                      <Check className="size-4" aria-hidden /> Approve
                    </Button>
                    <Button size="sm" variant="outline" disabled={busy} onClick={() => setConfirmReject(event.documentId)} className="border-red-300 text-red-700 hover:bg-red-50">
                      <X className="size-4" aria-hidden /> Reject
                    </Button>
                  </>
                )}
              </div>
            </div>

            {expanded && (
              <div id={`pending-${event.documentId}`} className="space-y-4 border-t border-gray-100 bg-gray-50 p-4">
                <dl className="grid gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="font-semibold text-gray-500">Price</dt>
                    <dd>{formatPrice(event)}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-gray-500">Organizer</dt>
                    <dd>
                      {[event.organizer_name, event.organizer_email, event.organizer_phone].filter(Boolean).join(" · ") || "Not provided"}
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="font-semibold text-gray-500">Description</dt>
                    <dd className="whitespace-pre-line text-gray-800">{event.description}</dd>
                  </div>
                  {event.latitude != null && (
                    <div className="sm:col-span-2">
                      <dt className="font-semibold text-gray-500">Location</dt>
                      <dd>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${event.latitude},${event.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-9 items-center text-primary hover:underline"
                        >
                          {event.latitude}, {event.longitude} (open in Google Maps)
                        </a>
                      </dd>
                    </div>
                  )}
                </dl>
                {(event.images?.length ?? 0) > 0 && (
                  <ul className="flex flex-wrap gap-3">
                    {event.images!.map((image) => (
                      <li key={image.id} className="relative size-24 overflow-hidden rounded-xl border border-gray-200">
                        <Image
                          src={imageUrl(image, "small") ?? image.url}
                          alt={image.alternativeText || `${event.title} submitted photo`}
                          fill
                          sizes="96px"
                          className="object-cover"
                          loading="lazy"
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
