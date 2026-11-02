"use client";

import { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import Link from "next/link";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import CategoryBadge from "@/components/shared/CategoryBadge";
import { formatEventDate, formatEventTime } from "@/lib/utils";
import type { Event } from "@/types";

const KARACHI: L.LatLngExpression = [24.8607, 67.0011];
const DEFAULT_COLOR = "#5b21b6";

export interface LeafletMapProps {
  events: Event[];
  /** Marker highlighted by hovering/focusing a list item (FR-06). */
  highlightedId: string | null;
  /** Marker selected by a click on the list or the map; its popup is opened. */
  selectedId: string | null;
  onSelect: (id: string) => void;
  /** False while the map is hidden (mobile list view) so it can re-measure when shown. */
  active: boolean;
}

type Located = Event & { latitude: number; longitude: number };

const hasCoords = (event: Event): event is Located => event.latitude != null && event.longitude != null;

function pinIcon(color: string, highlighted: boolean) {
  const size = highlighted ? 40 : 30;
  return L.divIcon({
    className: "eh-pin-wrap",
    html: `<span class="eh-pin${highlighted ? " eh-pin-active" : ""}" style="--pin:${color}"></span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size + 4],
  });
}

/** Fit all markers on load and whenever the visible set changes (FR-01). */
function FitBounds({ events, active }: { events: Located[]; active: boolean }) {
  const map = useMap();
  const key = events.map((e) => e.documentId).join("|");

  useEffect(() => {
    if (!active) return;
    map.invalidateSize();
    if (events.length === 0) {
      map.setView(KARACHI, 11);
    } else if (events.length === 1) {
      map.setView([events[0].latitude, events[0].longitude], 14);
    } else {
      map.fitBounds(L.latLngBounds(events.map((e) => [e.latitude, e.longitude] as [number, number])), {
        padding: [48, 48],
        maxZoom: 15,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refit only when the set of events or visibility changes
  }, [key, active, map]);

  return null;
}

/** Keep the highlighted marker in view; centre on the selected one (FR-01, FR-06). */
function FocusMarker({
  events,
  highlightedId,
  selectedId,
  markers,
}: {
  events: Located[];
  highlightedId: string | null;
  selectedId: string | null;
  markers: React.RefObject<Map<string, L.Marker>>;
}) {
  const map = useMap();

  useEffect(() => {
    const event = events.find((e) => e.documentId === highlightedId);
    if (!event) return;
    const point = L.latLng(event.latitude, event.longitude);
    if (!map.getBounds().pad(-0.1).contains(point)) map.panTo(point, { animate: true });
  }, [highlightedId, events, map]);

  useEffect(() => {
    const event = events.find((e) => e.documentId === selectedId);
    if (!event) return;
    map.flyTo([event.latitude, event.longitude], Math.max(map.getZoom(), 13), { duration: 0.6 });
    markers.current.get(event.documentId)?.openPopup();
  }, [selectedId, events, map, markers]);

  return null;
}

export default function LeafletMap({ events, highlightedId, selectedId, onSelect, active }: LeafletMapProps) {
  const markers = useRef(new Map<string, L.Marker>());
  const located = useMemo(() => events.filter(hasCoords), [events]);

  return (
    <MapContainer
      center={KARACHI}
      zoom={11}
      scrollWheelZoom
      className="h-full w-full"
      aria-label="Map of events"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds events={located} active={active} />
      <FocusMarker events={located} highlightedId={highlightedId} selectedId={selectedId} markers={markers} />

      {located.map((event) => {
        const highlighted = event.documentId === (highlightedId ?? selectedId);
        return (
          <Marker
            key={event.documentId}
            position={[event.latitude, event.longitude]}
            icon={pinIcon(event.category?.color ?? DEFAULT_COLOR, highlighted)}
            zIndexOffset={highlighted ? 1000 : 0}
            title={event.title}
            ref={(marker) => {
              if (marker) markers.current.set(event.documentId, marker);
              else markers.current.delete(event.documentId);
            }}
            eventHandlers={{ click: () => onSelect(event.documentId) }}
          >
            <Popup>
              <div className="min-w-44 space-y-1.5 font-jakarta">
                <CategoryBadge category={event.category} />
                <p className="text-sm font-bold leading-snug text-gray-900">{event.title}</p>
                <p className="text-xs text-gray-600">
                  {formatEventDate(event.start_datetime)} · {formatEventTime(event.start_datetime)}
                </p>
                <Link href={`/events/${event.slug}`} className="inline-block text-xs font-semibold text-primary hover:underline">
                  View details →
                </Link>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
