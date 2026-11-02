"use client";

import dynamic from "next/dynamic";
import type { EventGalleryProps } from "@/components/events/EventGallerySwiper";

// Swiper and its CSS are only downloaded for events that actually have photos.
const GallerySwiper = dynamic(() => import("@/components/events/EventGallerySwiper"), {
  loading: () => <div className="aspect-[16/9] w-full animate-pulse rounded-card bg-gray-100" aria-label="Loading photos" />,
});

export default function EventGallery({ images, title, fallbackIcon }: EventGalleryProps) {
  if (images.length === 0) {
    return (
      <div className="flex aspect-[16/9] w-full items-center justify-center rounded-card bg-gradient-to-br from-primary to-accent text-7xl">
        <span aria-hidden>{fallbackIcon ?? "🎟️"}</span>
        <span className="sr-only">No photos available for {title}</span>
      </div>
    );
  }
  return <GallerySwiper images={images} title={title} fallbackIcon={fallbackIcon} />;
}
