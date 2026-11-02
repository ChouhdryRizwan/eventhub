"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Ticket } from "lucide-react";
import toast from "react-hot-toast";
import { setRsvpAction } from "@/app/actions/engagement";
import EventRow from "@/components/dashboard/EventRow";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Rsvp } from "@/types";

export default function RSVPList({ initial }: { initial: Rsvp[] }) {
  const [rsvps, setRsvps] = useState(initial);
  const [confirming, setConfirming] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const change = (rsvp: Rsvp, attending: boolean) => {
    if (!rsvp.event) return;
    setPendingId(rsvp.documentId);
    startTransition(async () => {
      const result = await setRsvpAction(rsvp.event!.documentId, rsvp.event!.slug, attending);
      setPendingId(null);
      if (result.ok) {
        setRsvps((list) => list.map((r) => (r.documentId === rsvp.documentId ? { ...r, status: result.status } : r)));
        setConfirming(null);
        toast.success(attending ? "You're going again!" : "Your RSVP was cancelled.");
      } else {
        toast.error(result.error);
      }
    });
  };

  if (rsvps.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-card border border-dashed border-gray-300 px-6 py-14 text-center">
        <Ticket className="size-10 text-gray-400" aria-hidden />
        <h3 className="mt-4 text-lg font-bold">No RSVPs yet</h3>
        <p className="mt-1 max-w-xs text-sm text-gray-500">Find an event you like and tap RSVP to see it here.</p>
        <Link href="/events" className={cn(buttonVariants(), "mt-5")}>
          Browse events
        </Link>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {rsvps.map((rsvp) => {
        if (!rsvp.event) return null;
        const going = rsvp.status === "confirmed";
        const busy = pendingId === rsvp.documentId;
        return (
          <li key={rsvp.documentId}>
            <EventRow
              event={rsvp.event}
              badge={
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                    going ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600",
                  )}
                >
                  {going ? "Going" : "Cancelled"}
                </span>
              }
              actions={
                going ? (
                  confirming === rsvp.documentId ? (
                    <div role="alertdialog" aria-label="Confirm cancelling this RSVP" className="space-y-2">
                      <p className="text-xs font-semibold text-red-700">Cancel this RSVP?</p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="danger" disabled={busy} onClick={() => change(rsvp, false)}>
                          Yes, cancel
                        </Button>
                        <Button size="sm" variant="ghost" disabled={busy} onClick={() => setConfirming(null)}>
                          Keep
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => setConfirming(rsvp.documentId)}>
                      Cancel RSVP
                    </Button>
                  )
                ) : (
                  <Button size="sm" disabled={busy} onClick={() => change(rsvp, true)}>
                    {busy ? "Saving…" : "Re-join"}
                  </Button>
                )
              }
            />
          </li>
        );
      })}
    </ul>
  );
}
