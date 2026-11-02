"use server";

import axios from "axios";
import { redirect } from "next/navigation";
import { createEvent, uploadImage } from "@/lib/api";
import { auth } from "@/lib/auth";

export type SubmitField =
  | "title"
  | "category"
  | "short_desc"
  | "description"
  | "venue_address"
  | "location"
  | "start_datetime"
  | "end_datetime"
  | "ticket_price"
  | "organizer_email"
  | "organizer_phone"
  | "images";

export interface SubmitEventState {
  error?: string;
  fieldErrors?: Partial<Record<SubmitField, string>>;
}

const MAX_IMAGES = 5;
const MAX_IMAGE_BYTES = 3 * 1024 * 1024;
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const KARACHI_OFFSET = "+05:00"; // event times are entered as local Karachi time

const text = (data: FormData, key: string) => String(data.get(key) ?? "").trim();

/** "2026-12-01T19:00" (datetime-local, Karachi time) -> ISO string, or null when invalid. */
function toIso(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) return null;
  const date = new Date(`${value}:00${KARACHI_OFFSET}`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export async function submitEventAction(formData: FormData): Promise<SubmitEventState> {
  const session = await auth();
  if (!session) return { error: "Please log in to submit an event." };

  const errors: NonNullable<SubmitEventState["fieldErrors"]> = {};

  const title = text(formData, "title");
  const category = text(formData, "category");
  const short_desc = text(formData, "short_desc");
  const description = text(formData, "description");
  const venue_address = text(formData, "venue_address");
  const latitude = Number(text(formData, "latitude"));
  const longitude = Number(text(formData, "longitude"));
  const start = toIso(text(formData, "start_datetime"));
  const endRaw = text(formData, "end_datetime");
  const end = endRaw ? toIso(endRaw) : null;
  const priceRaw = text(formData, "ticket_price");
  const ticket_price = priceRaw === "" ? 0 : Number(priceRaw);
  const organizer_name = text(formData, "organizer_name");
  const organizer_email = text(formData, "organizer_email");
  const organizer_phone = text(formData, "organizer_phone");

  if (title.length < 3 || title.length > 120) errors.title = "Enter a title between 3 and 120 characters.";
  if (!/^[A-Za-z0-9]{10,40}$/.test(category)) errors.category = "Choose a category.";
  if (short_desc.length > 200) errors.short_desc = "Keep the summary under 200 characters.";
  if (description.length < 20) errors.description = "Describe the event in at least 20 characters.";
  if (description.length > 5000) errors.description = "The description is too long (5000 characters max).";
  if (venue_address.length < 5) errors.venue_address = "Enter the venue address.";
  if (
    !text(formData, "latitude") ||
    !text(formData, "longitude") ||
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    Math.abs(latitude) > 90 ||
    Math.abs(longitude) > 180
  ) {
    errors.location = "Click the map to place the venue.";
  }
  if (!start) errors.start_datetime = "Choose a start date and time.";
  else if (start.getTime() < Date.now()) errors.start_datetime = "The start must be in the future.";
  if (endRaw && !end) errors.end_datetime = "Choose a valid end date and time.";
  else if (start && end && end <= start) errors.end_datetime = "The end must be after the start.";
  if (!Number.isFinite(ticket_price) || ticket_price < 0 || ticket_price > 1_000_000) {
    errors.ticket_price = "Enter a valid price (0 for free).";
  }
  if (organizer_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(organizer_email)) {
    errors.organizer_email = "Enter a valid email address.";
  }
  if (organizer_phone && !/^\+?[0-9\s-]{7,20}$/.test(organizer_phone)) {
    errors.organizer_phone = "Enter a valid phone number.";
  }

  const images = formData.getAll("images").filter((f): f is File => f instanceof File && f.size > 0);
  if (images.length > MAX_IMAGES) errors.images = `Upload at most ${MAX_IMAGES} photos.`;
  else if (images.some((f) => !IMAGE_TYPES.includes(f.type))) errors.images = "Photos must be JPG, PNG or WebP.";
  else if (images.some((f) => f.size > MAX_IMAGE_BYTES)) errors.images = "Each photo must be under 3 MB.";

  if (Object.keys(errors).length) return { fieldErrors: errors };

  try {
    const imageIds: number[] = [];
    for (const file of images) imageIds.push(await uploadImage(file, file.name, session.accessToken));

    // The API forces status=pending and records the submitter; nothing here can publish it.
    await createEvent(
      {
        title,
        category,
        short_desc: short_desc || null,
        description,
        venue_address,
        latitude,
        longitude,
        start_datetime: start!.toISOString(),
        end_datetime: end ? end.toISOString() : null,
        ticket_price,
        is_free: ticket_price === 0,
        organizer_name: organizer_name || null,
        organizer_email: organizer_email || null,
        organizer_phone: organizer_phone || null,
        images: imageIds,
      },
      session.accessToken,
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 401 || status === 403) return { error: "Your session expired. Please log in again." };
      const message = error.response?.data?.error?.message;
      if (typeof message === "string" && message) return { error: message };
    }
    return { error: "We couldn't submit your event. Please try again." };
  }

  redirect("/dashboard?tab=events&submitted=1");
}
