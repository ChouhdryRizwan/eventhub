"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Bookmark, BookmarkCheck, CheckCircle2, Ticket } from "lucide-react";
import toast from "react-hot-toast";
import { setBookmarkAction, setRsvpAction } from "@/app/actions/engagement";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EventActionsProps {
  eventId: string;
  slug: string;
  isAuthenticated: boolean;
  initialAttending: boolean;
  initialSaved: boolean;
}

export default function EventActions({ eventId, slug, isAuthenticated, initialAttending, initialSaved }: EventActionsProps) {
  const [attending, setAttending] = useState(initialAttending);
  const [saved, setSaved] = useState(initialSaved);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [pending, startTransition] = useTransition();

  if (!isAuthenticated) {
    const loginHref = `/login?callbackUrl=${encodeURIComponent(`/events/${slug}`)}`;
    return (
      <div className="space-y-2">
        <Link href={loginHref} className={cn(buttonVariants({ size: "lg" }), "w-full")}>
          <Ticket className="size-5" aria-hidden /> Log in to RSVP
        </Link>
        <Link href={loginHref} className={cn(buttonVariants({ variant: "outline" }), "w-full")}>
          <Bookmark className="size-4" aria-hidden /> Log in to save
        </Link>
      </div>
    );
  }

  const rsvp = (attend: boolean) =>
    startTransition(async () => {
      const result = await setRsvpAction(eventId, slug, attend);
      if (result.ok) {
        setAttending(result.status === "confirmed");
        setConfirmCancel(false);
        toast.success(attend ? "You're going! See you there." : "Your RSVP was cancelled.");
      } else {
        toast.error(result.error);
      }
    });

  const toggleSaved = () =>
    startTransition(async () => {
      const result = await setBookmarkAction(eventId, slug, !saved);
      if (result.ok) {
        setSaved(result.saved);
        toast.success(result.saved ? "Event saved to your dashboard." : "Removed from saved events.");
      } else {
        toast.error(result.error);
      }
    });

  return (
    <div className="space-y-2">
      {attending ? (
        confirmCancel ? (
          <div role="alertdialog" aria-label="Confirm cancelling your RSVP" className="rounded-xl border border-red-200 bg-red-50 p-3">
            <p className="text-sm font-semibold text-red-800">Cancel your RSVP?</p>
            <div className="mt-2 flex gap-2">
              <Button variant="danger" size="sm" disabled={pending} onClick={() => rsvp(false)}>
                Yes, cancel
              </Button>
              <Button variant="ghost" size="sm" disabled={pending} onClick={() => setConfirmCancel(false)}>
                Keep it
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-green-50 px-4 text-sm font-semibold text-green-700">
              <CheckCircle2 className="size-5" aria-hidden /> You&apos;re going
            </p>
            <Button variant="ghost" size="sm" className="w-full text-gray-600" onClick={() => setConfirmCancel(true)}>
              Cancel RSVP
            </Button>
          </div>
        )
      ) : (
        <Button size="lg" className="w-full" disabled={pending} onClick={() => rsvp(true)}>
          <Ticket className="size-5" aria-hidden /> {pending ? "Saving…" : "RSVP to this event"}
        </Button>
      )}

      <Button variant="outline" className="w-full" disabled={pending} aria-pressed={saved} onClick={toggleSaved}>
        {saved ? <BookmarkCheck className="size-4" aria-hidden /> : <Bookmark className="size-4" aria-hidden />}
        {saved ? "Saved" : "Save event"}
      </Button>
    </div>
  );
}
