"use server";

import axios from "axios";
import { updateTag } from "next/cache";
import { auth } from "@/lib/auth";
import { hasEventEnded } from "@/lib/utils";
import {
  createBookmark,
  createReview,
  createRsvp,
  deleteBookmark,
  getEventBySlug,
  getMyBookmarkForEvent,
  getMyRsvpForEvent,
  updateRsvp,
} from "@/lib/api";

// All mutations read the Strapi JWT from the server-side session, so the browser never
// handles it. updateTag() makes the event page show the change immediately.

const LOGIN_REQUIRED = "Please log in to continue.";
const GENERIC_ERROR = "Something went wrong. Please try again.";

function messageFrom(error: unknown) {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 409) return "You've already done this for this event.";
    if (error.response?.status === 401 || error.response?.status === 403) return LOGIN_REQUIRED;
  }
  return GENERIC_ERROR;
}

const isId = (value: unknown): value is string => typeof value === "string" && /^[a-z0-9]{10,40}$/i.test(value);
const isSlug = (value: unknown): value is string => typeof value === "string" && /^[a-z0-9-]{1,200}$/.test(value);

export type RsvpResult = { ok: true; status: "confirmed" | "cancelled" } | { ok: false; error: string };

export async function setRsvpAction(eventId: string, slug: string, attending: boolean): Promise<RsvpResult> {
  if (!isId(eventId) || !isSlug(slug)) return { ok: false, error: GENERIC_ERROR };
  const session = await auth();
  if (!session) return { ok: false, error: LOGIN_REQUIRED };
  const token = session.accessToken;

  try {
    if (attending) {
      const event = await getEventBySlug(slug);
      if (event && hasEventEnded(event)) return { ok: false, error: "This event has already ended." };
    }
    const existing = await getMyRsvpForEvent(eventId, token);
    const status = attending ? "confirmed" : "cancelled";
    if (existing) {
      if (existing.status !== status) await updateRsvp(existing.documentId, status, token);
    } else if (attending) {
      await createRsvp(eventId, token);
    }
    updateTag(`event-${slug}`);
    return { ok: true, status };
  } catch (error) {
    return { ok: false, error: messageFrom(error) };
  }
}

export type BookmarkResult = { ok: true; saved: boolean } | { ok: false; error: string };

export async function setBookmarkAction(eventId: string, slug: string, save: boolean): Promise<BookmarkResult> {
  if (!isId(eventId) || !isSlug(slug)) return { ok: false, error: GENERIC_ERROR };
  const session = await auth();
  if (!session) return { ok: false, error: LOGIN_REQUIRED };
  const token = session.accessToken;

  try {
    const existing = await getMyBookmarkForEvent(eventId, token);
    if (save && !existing) await createBookmark(eventId, token);
    if (!save && existing) await deleteBookmark(existing.documentId, token);
    return { ok: true, saved: save };
  } catch (error) {
    return { ok: false, error: messageFrom(error) };
  }
}

export interface ReviewState {
  ok?: boolean;
  error?: string;
  /** The text the user typed, echoed back on failure so it is not lost. */
  text?: string;
}

export async function submitReviewAction(_prev: ReviewState, formData: FormData): Promise<ReviewState> {
  const eventId = formData.get("eventId");
  const slug = formData.get("slug");
  const rating = Number(formData.get("rating"));
  const text = String(formData.get("review_text") ?? "").trim();

  if (!isId(eventId) || !isSlug(slug)) return { error: GENERIC_ERROR, text };
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return { error: "Choose a star rating from 1 to 5.", text };
  if (text.length < 3) return { error: "Write a few words about your experience.", text };
  if (text.length > 2000) return { error: "Reviews can be up to 2000 characters.", text };

  const session = await auth();
  if (!session) return { error: LOGIN_REQUIRED, text };

  try {
    await createReview({ event: eventId, rating, review_text: text }, session.accessToken);
    updateTag(`event-${slug}`);
    return { ok: true };
  } catch (error) {
    return { error: messageFrom(error), text };
  }
}
