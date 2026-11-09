"use client";

import L from "leaflet";
import RemountOnReveal from "@/components/shared/RemountOnReveal";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import type { VenueMapProps } from "@/components/events/VenueMap";

export default function VenueLeaflet({ latitude, longitude, title, address, color }: VenueMapProps) {
  const icon = L.divIcon({
    className: "eh-pin-wrap",
    html: `<span class="eh-pin eh-pin-active" style="--pin:${color ?? "#5b21b6"}"></span>`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -36],
  });

  return (
    <RemountOnReveal fallback={<div className="h-full w-full animate-pulse rounded-card bg-gray-100" aria-hidden />}>
      <MapContainer
        center={[latitude, longitude]}
        zoom={15}
        scrollWheelZoom={false}
        className="h-full w-full"
        aria-label={`Map showing the venue of ${title}`}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[latitude, longitude]} icon={icon} title={title}>
          <Popup>
            <p className="text-sm font-bold">{title}</p>
            <p className="text-xs text-gray-600">{address}</p>
          </Popup>
        </Marker>
      </MapContainer>
    </RemountOnReveal>
  );
}
