"use client";

import dynamic from "next/dynamic";

export interface LocationPickerProps {
  latitude: number | null;
  longitude: number | null;
  onChange: (latitude: number, longitude: number) => void;
}

// Leaflet touches `window`, so it must only ever load in the browser.
const PickerMap = dynamic(() => import("@/components/dashboard/LocationPickerMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse rounded-card bg-gray-100" aria-label="Loading map" />,
});

export default function LocationPicker(props: LocationPickerProps) {
  return <PickerMap {...props} />;
}
