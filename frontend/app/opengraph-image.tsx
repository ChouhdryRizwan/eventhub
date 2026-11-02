import { ImageResponse } from "next/og";

export const alt = "EventHub — discover events around you";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Default share image for every page that does not provide its own.
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(135deg, #0d0d0d 0%, #2e1065 55%, #5b21b6 100%)",
          color: "#ffffff",
        }}
      >
        <div style={{ display: "flex", fontSize: 40, fontWeight: 800, color: "#a78bfa" }}>EventHub</div>
        <div style={{ display: "flex", fontSize: 84, fontWeight: 800, lineHeight: 1.05, marginTop: 24, maxWidth: 900 }}>
          Discover events around you
        </div>
        <div style={{ display: "flex", fontSize: 34, marginTop: 28, color: "#d1d5db" }}>
          Interactive map · Category filters · One-tap RSVP
        </div>
      </div>
    ),
    size,
  );
}
