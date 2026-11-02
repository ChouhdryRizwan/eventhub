"use server";

import axios from "axios";
import { changePassword, getMe, updateUser, uploadImage } from "@/lib/api";
import { auth, unstable_update } from "@/lib/auth";

export interface ProfileState {
  ok?: boolean;
  message?: string;
  error?: string;
  fieldErrors?: Partial<Record<"full_name" | "phone" | "bio" | "currentPassword" | "password", string>>;
}

const GENERIC = "Something went wrong. Please try again.";
const MAX_AVATAR_BYTES = 2 * 1024 * 1024;
const AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"];

function apiMessage(error: unknown, fallback = GENERIC) {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.error?.message;
    if (typeof message === "string" && message) return message;
  }
  return fallback;
}

export async function updateProfileAction(_prev: ProfileState, formData: FormData): Promise<ProfileState> {
  const session = await auth();
  if (!session) return { error: "Please log in again." };

  const full_name = String(formData.get("full_name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();

  const fieldErrors: NonNullable<ProfileState["fieldErrors"]> = {};
  if (full_name.length < 2) fieldErrors.full_name = "Enter your full name.";
  if (full_name.length > 80) fieldErrors.full_name = "Keep your name under 80 characters.";
  if (phone && !/^\+?[0-9\s-]{7,20}$/.test(phone)) fieldErrors.phone = "Enter a valid phone number.";
  if (bio.length > 500) fieldErrors.bio = "Keep your bio under 500 characters.";
  if (Object.keys(fieldErrors).length) return { fieldErrors };

  try {
    await updateUser(Number(session.user.id), { full_name, phone: phone || null, bio: bio || null } as never, session.accessToken);
    // Refresh the session so the navbar shows the new name immediately.
    await unstable_update({ user: { name: full_name, phone: phone || null } } as never);
    return { ok: true, message: "Profile updated." };
  } catch (error) {
    return { error: apiMessage(error) };
  }
}

export async function changePasswordAction(_prev: ProfileState, formData: FormData): Promise<ProfileState> {
  const session = await auth();
  if (!session) return { error: "Please log in again." };

  const currentPassword = String(formData.get("currentPassword") ?? "");
  const password = String(formData.get("password") ?? "");
  const passwordConfirmation = String(formData.get("passwordConfirmation") ?? "");

  const fieldErrors: NonNullable<ProfileState["fieldErrors"]> = {};
  if (!currentPassword) fieldErrors.currentPassword = "Enter your current password.";
  if (password.length < 8) fieldErrors.password = "Use at least 8 characters.";
  else if (password !== passwordConfirmation) fieldErrors.password = "The passwords don't match.";
  if (Object.keys(fieldErrors).length) return { fieldErrors };

  try {
    await changePassword({ currentPassword, password, passwordConfirmation }, session.accessToken);
    return { ok: true, message: "Password changed." };
  } catch (error) {
    const message = apiMessage(error);
    if (/current password|invalid/i.test(message)) return { fieldErrors: { currentPassword: "That isn't your current password." } };
    return { error: message };
  }
}

export interface AvatarResult {
  ok: boolean;
  error?: string;
  url?: string;
}

export async function uploadAvatarAction(formData: FormData): Promise<AvatarResult> {
  const session = await auth();
  if (!session) return { ok: false, error: "Please log in again." };

  const file = formData.get("avatar");
  if (!(file instanceof File) || file.size === 0) return { ok: false, error: "Choose an image first." };
  if (!AVATAR_TYPES.includes(file.type)) return { ok: false, error: "Use a JPG, PNG or WebP image." };
  if (file.size > MAX_AVATAR_BYTES) return { ok: false, error: "The image must be under 2 MB." };

  try {
    const mediaId = await uploadImage(file, file.name, session.accessToken);
    await updateUser(Number(session.user.id), { profile_pic: mediaId } as never, session.accessToken);
    const me = await getMe(session.accessToken);
    return { ok: true, url: me.profile_pic?.url };
  } catch (error) {
    return { ok: false, error: apiMessage(error, "The upload failed. Please try again.") };
  }
}
