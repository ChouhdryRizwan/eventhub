"use client";

import { useState } from "react";
import { SearchX } from "lucide-react";
import EventCard from "@/components/events/EventCard";
import { Button } from "@/components/ui/button";
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

  const shown = events.slice(0, visible);

  return (
    <div aria-busy={loading} className={loading ? "opacity-60 transition-opacity" : "transition-opacity"}>
      <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-1 xl:grid-cols-2">
        {shown.map((event, i) => (
          <li key={event.documentId}>
            <EventCard
              event={event}
              priority={i < 2}
              highlighted={highlightedId === event.documentId}
              onHover={onHover}
              onSelect={onSelect}
              className="h-full"
            />
          </li>
        ))}
      </ul>
      {visible < events.length && (
        <div className="mt-6 text-center">
          <Button variant="outline" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
            Show more ({events.length - visible} left)
          </Button>
        </div>
      )}
    </div>
  );
}
