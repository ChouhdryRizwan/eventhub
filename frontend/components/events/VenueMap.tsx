"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

export interface VenueMapProps {
  latitude: number;
  longitude: number;
  title: string;
  address: string;
  color?: string | null;
}

// Leaflet touches `window`, so it must only ever load in the browser.
const VenueLeaflet = dynamic(() => import("@/components/events/VenueLeaflet"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse rounded-card bg-gray-100" aria-label="Loading map" />,
});

/**
 * The venue map sits far below the fold, so its JavaScript (Leaflet) and map tiles are only
 * fetched once the placeholder is close to the viewport. This keeps the first paint light.
 */
export default function VenueMap(props: VenueMapProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      const timer = setTimeout(() => setNear(true), 0); // very old browsers: just load the map
      return () => clearTimeout(timer);
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="h-full w-full">
      {near ? <VenueLeaflet {...props} /> : <div className="h-full w-full rounded-card bg-gray-100" aria-hidden />}
    </div>
  );
}
