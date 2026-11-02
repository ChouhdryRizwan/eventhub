"use client";

import dynamic from "next/dynamic";
import type { LeafletMapProps } from "@/components/events/LeafletMap";

// Leaflet touches `window`, so it must only ever load in the browser.
const LeafletMap = dynamic(() => import("@/components/events/LeafletMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse rounded-card bg-gray-100" aria-label="Loading map" />,
});

export default function EventMap(props: LeafletMapProps) {
  return <LeafletMap {...props} />;
}
