"use client";

import Image from "next/image";
import { A11y, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { imageUrl } from "@/lib/utils";
import type { Media } from "@/types";

export interface EventGalleryProps {
  images: Media[];
  title: string;
  fallbackIcon?: string | null;
}

export default function EventGallerySwiper({ images, title, fallbackIcon }: EventGalleryProps) {
  if (images.length === 0) {
    return (
      <div className="flex aspect-[16/9] w-full items-center justify-center rounded-card bg-gradient-to-br from-primary to-accent text-7xl">
        <span aria-hidden>{fallbackIcon ?? "🎟️"}</span>
        <span className="sr-only">No photos available for {title}</span>
      </div>
    );
  }

  return (
    <Swiper
      modules={[Navigation, Pagination, A11y]}
      navigation={images.length > 1}
      pagination={images.length > 1 ? { type: "fraction" } : false}
      loop={images.length > 1}
      spaceBetween={0}
      slidesPerView={1}
      a11y={{ prevSlideMessage: "Previous photo", nextSlideMessage: "Next photo" }}
      className="aspect-[16/9] w-full min-w-0 max-w-full overflow-hidden rounded-card bg-gray-100"
      style={{ "--swiper-theme-color": "#7c3aed" } as React.CSSProperties}
    >
      {images.map((image, index) => (
        <SwiperSlide key={image.id}>
          <div className="relative h-full w-full">
            <Image
              src={imageUrl(image, "large") ?? image.url}
              alt={image.alternativeText || `${title} — photo ${index + 1} of ${images.length}`}
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover"
              priority={index === 0}
              loading={index === 0 ? undefined : "lazy"}
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
