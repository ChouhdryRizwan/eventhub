"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Bookmark } from "lucide-react";
import toast from "react-hot-toast";
import { setBookmarkAction } from "@/app/actions/engagement";
import EventRow from "@/components/dashboard/EventRow";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Bookmark as BookmarkType } from "@/types";

export default function SavedList({ initial }: { initial: BookmarkType[] }) {
  const [saved, setSaved] = useState(initial);
  const [confirming, setConfirming] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const remove = (bookmark: BookmarkType) => {
    if (!bookmark.event) return;
    setPendingId(bookmark.documentId);
    startTransition(async () => {
      const result = await setBookmarkAction(bookmark.event!.documentId, bookmark.event!.slug, false);
      setPendingId(null);
      if (result.ok) {
        setSaved((list) => list.filter((b) => b.documentId !== bookmark.documentId));
        toast.success("Removed from saved events.");
      } else {
        toast.error(result.error);
      }
    });
  };

  if (saved.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-card border border-dashed border-gray-300 px-6 py-14 text-center">
        <Bookmark className="size-10 text-gray-400" aria-hidden />
        <h3 className="mt-4 text-lg font-bold">Nothing saved yet</h3>
        <p className="mt-1 max-w-xs text-sm text-gray-500">Tap “Save event” on any event to keep it here for later.</p>
        <Link href="/events" className={cn(buttonVariants(), "mt-5")}>
          Browse events
        </Link>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {saved.map((bookmark) => {
        if (!bookmark.event) return null;
        const busy = pendingId === bookmark.documentId;
        return (
          <li key={bookmark.documentId}>
            <EventRow
              event={bookmark.event}
              actions={
                confirming === bookmark.documentId ? (
                  <div role="alertdialog" aria-label="Confirm removing this saved event" className="space-y-2">
                    <p className="text-xs font-semibold text-red-700">Remove from saved?</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="danger" disabled={busy} onClick={() => remove(bookmark)}>
                        Remove
                      </Button>
                      <Button size="sm" variant="ghost" disabled={busy} onClick={() => setConfirming(null)}>
                        Keep
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => setConfirming(bookmark.documentId)}>
                    Remove
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
