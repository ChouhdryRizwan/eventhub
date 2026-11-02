"use client";

import { useEffect } from "react";
import L from "leaflet";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import type { LocationPickerProps } from "@/components/dashboard/LocationPicker";

const KARACHI: L.LatLngExpression = [24.8607, 67.0011];

const pin = L.divIcon({
  className: "eh-pin-wrap",
  html: '<span class="eh-pin eh-pin-active" style="--pin:#7c3aed"></span>',
  iconSize: [36, 36],
  iconAnchor: [18, 36],
});

function ClickToPlace({ onChange }: Pick<LocationPickerProps, "onChange">) {
  useMapEvents({
    click(e) {
      onChange(Number(e.latlng.lat.toFixed(6)), Number(e.latlng.lng.toFixed(6)));
    },
  });
  return null;
}

/** Re-centre when the coordinates are typed in or picked elsewhere. */
function Recenter({ latitude, longitude }: { latitude: number | null; longitude: number | null }) {
  const map = useMap();
  useEffect(() => {
    if (latitude != null && longitude != null) map.panTo([latitude, longitude]);
  }, [latitude, longitude, map]);
  return null;
}

export default function LocationPickerMap({ latitude, longitude, onChange }: LocationPickerProps) {
  const hasPoint = latitude != null && longitude != null;
  return (
    <MapContainer
      center={hasPoint ? [latitude, longitude] : KARACHI}
      zoom={hasPoint ? 15 : 11}
      scrollWheelZoom={false}
      className="h-full w-full"
      aria-label="Click the map to set the venue location"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ClickToPlace onChange={onChange} />
      <Recenter latitude={latitude} longitude={longitude} />
      {hasPoint && <Marker position={[latitude, longitude]} icon={pin} />}
    </MapContainer>
  );
}
