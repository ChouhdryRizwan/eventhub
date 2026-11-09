"use client";

import { useMemo, useState } from "react";
import { SearchX } from "lucide-react";
import EventListItem from "@/components/events/EventListItem";
import { Button } from "@/components/ui/button";
import { sortUpcomingFirst } from "@/lib/utils";
import type { Event } from "@/types";

const PAGE_SIZE = 8;

interface EventGridProps {
  events: Event[];
  highlightedId: string | null;
  loading: boolean;
  error?: string;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
  onReset: () => void;
}

export default function EventGrid({ events, highlightedId, loading, error, onHover, onSelect, onReset }: EventGridProps) {
  const [visible, setVisible] = useState(PAGE_SIZE);

  const ordered = useMemo(() => sortUpcomingFirst(events), [events]);

  if (error) {
    return (
      <p role="alert" className="rounded-card border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
        {error}
      </p>
    );
  }

  if (!loading && events.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-card border border-dashed border-gray-300 px-6 py-14 text-center">
        <SearchX className="size-10 text-gray-400" aria-hidden />
        <h3 className="mt-4 text-lg font-bold text-gray-900">No results found</h3>
        <p className="mt-1 max-w-xs text-sm text-gray-500">
          Try a different search term or remove some filters.
        </p>
        <Button variant="outline" className="mt-5" onClick={onReset}>
          Reset filters
        </Button>
      </div>
    );
  }

  const shown = ordered.slice(0, visible);

  return (
    <div aria-busy={loading} className={loading ? "opacity-60 transition-opacity" : "transition-opacity"}>
      <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-1">
        {shown.map((event, i) => (
          <li key={event.documentId}>
            <EventListItem
              event={event}
              priority={i < 4}
              highlighted={highlightedId === event.documentId}
              onHover={onHover}
              onSelect={onSelect}
            />
          </li>
        ))}
      </ul>
      {visible < ordered.length && (
        <div className="mt-6 text-center">
          <Button variant="outline" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
            Show more ({ordered.length - visible} left)
          </Button>
        </div>
      )}
    </div>
  );
}
