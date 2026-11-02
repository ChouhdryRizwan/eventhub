"use server";

import axios from "axios";
import { updateTag } from "next/cache";
import { deleteEvent, setUserBlocked, updateEvent } from "@/lib/api";
import { auth } from "@/lib/auth";
import type { EventStatus } from "@/types";

// Every action re-checks the Administrator role on the server; the STRAPI_API_TOKEN used for
// the Strapi calls is full-access and must never run for a non-admin session.

export type AdminResult = { ok: true } | { ok: false; error: string };

const FAILED = "That didn't work. Please try again.";
const isId = (value: unknown): value is string => typeof value === "string" && /^[a-z0-9]{10,40}$/i.test(value);
const isSlug = (value: unknown): value is string => typeof value === "string" && /^[a-z0-9-]{1,200}$/.test(value);

async function requireAdmin() {
  const session = await auth();
  return session?.user.role === "admin" ? session : null;
}

function refresh(slug: string) {
  updateTag("events"); // homepage featured list, stats, event lists
  updateTag(`event-${slug}`);
}

function fail(error: unknown): AdminResult {
  if (axios.isAxiosError(error) && error.response?.status === 404) return { ok: false, error: "That item no longer exists." };
  return { ok: false, error: FAILED };
}

export async function setEventStatusAction(documentId: string, slug: string, status: EventStatus): Promise<AdminResult> {
  if (!isId(documentId) || !isSlug(slug) || !["published", "rejected", "pending"].includes(status)) return { ok: false, error: FAILED };
  if (!(await requireAdmin())) return { ok: false, error: "Administrator access required." };
  try {
    // A rejected or pending event can never stay featured.
    await updateEvent(documentId, status === "published" ? { status } : { status, is_featured: false });
    refresh(slug);
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}

export async function setFeaturedAction(documentId: string, slug: string, featured: boolean): Promise<AdminResult> {
  if (!isId(documentId) || !isSlug(slug) || typeof featured !== "boolean") return { ok: false, error: FAILED };
  if (!(await requireAdmin())) return { ok: false, error: "Administrator access required." };
  try {
    await updateEvent(documentId, { is_featured: featured });
    refresh(slug);
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}

export async function deleteEventAction(documentId: string, slug: string): Promise<AdminResult> {
  if (!isId(documentId) || !isSlug(slug)) return { ok: false, error: FAILED };
  if (!(await requireAdmin())) return { ok: false, error: "Administrator access required." };
  try {
    await deleteEvent(documentId);
    refresh(slug);
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}

export async function setUserBlockedAction(userId: number, blocked: boolean): Promise<AdminResult> {
  if (!Number.isInteger(userId) || typeof blocked !== "boolean") return { ok: false, error: FAILED };
  const session = await requireAdmin();
  if (!session) return { ok: false, error: "Administrator access required." };
  if (String(userId) === session.user.id) return { ok: false, error: "You can't block your own account." };
  try {
    await setUserBlocked(userId, blocked);
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}
