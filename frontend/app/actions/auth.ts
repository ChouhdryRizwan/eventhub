"use server";

import axios from "axios";
import { AuthError } from "next-auth";
import { signIn, signOut } from "@/lib/auth";

export interface FormState {
  error?: string;
  /** Echoed back so the form keeps what the user typed (React resets forms after an action). */
  values?: { name?: string; email?: string; phone?: string };
  /** Set after sign-up when Strapi sent a confirmation email instead of logging the user in. */
  registered?: { email: string };
  /** Set when login failed only because the email address is not confirmed yet. */
  unconfirmed?: { email: string };
  fieldErrors?: Partial<Record<"name" | "email" | "password" | "phone", string>>;
}

const strapi = axios.create({ baseURL: process.env.NEXT_PUBLIC_STRAPI_API_URL, timeout: 20000 });

// Only allow same-site relative redirects (prevents open-redirect via ?callbackUrl=).
function safeRedirect(value: FormDataEntryValue | null) {
  const url = typeof value === "string" ? value : "";
  return url.startsWith("/") && !url.startsWith("//") ? url : "/dashboard";
}

async function credentialsSignIn(identifier: string, password: string, redirectTo: string): Promise<FormState> {
  try {
    await signIn("credentials", { identifier, password, redirectTo });
    return {};
  } catch (error) {
    if (error instanceof AuthError) {
      const code = (error as { code?: string }).code;
      if (code === "email_not_confirmed") {
        return { error: "Please confirm your email first. We sent a link to your inbox.", unconfirmed: { email: identifier } };
      }
      return {
        error:
          code === "service_unavailable"
            ? "We couldn't reach the server. Please try again in a moment."
            : "Incorrect email or password.",
      };
    }
    throw error; // the redirect after a successful sign-in is thrown and must propagate
  }
}

export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Enter your email and password.", values: { email } };
  const result = await credentialsSignIn(email, password, safeRedirect(formData.get("callbackUrl")));
  return { ...result, values: { email } };
}

export async function registerAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const phone = String(formData.get("phone") ?? "").trim();

  const fieldErrors: NonNullable<FormState["fieldErrors"]> = {};
  if (name.length < 2) fieldErrors.name = "Enter your full name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fieldErrors.email = "Enter a valid email address.";
  if (password.length < 8) fieldErrors.password = "Use at least 8 characters.";
  if (phone && !/^\+?[0-9\s-]{7,20}$/.test(phone)) fieldErrors.phone = "Enter a valid phone number.";
  const values = { name, email, phone };
  if (Object.keys(fieldErrors).length) return { fieldErrors, values };

  try {
    // The email doubles as the unique Strapi username; the display name is full_name.
    const { data } = await strapi.post("/auth/local/register", {
      username: email,
      email,
      password,
      full_name: name,
      ...(phone ? { phone } : {}),
    });
    // With email confirmation on, Strapi returns no JWT: the user must click the emailed link first.
    if (!data?.jwt) return { registered: { email }, values };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const message = String(error.response.data?.error?.message ?? "");
      if (/taken/i.test(message)) return { fieldErrors: { email: "An account with this email already exists." }, values };
      return { error: message || "Could not create your account.", values };
    }
    return { error: "We couldn't reach the server. Please try again in a moment.", values };
  }

  const result = await credentialsSignIn(email, password, "/dashboard");
  return { ...result, values };
}

export interface ResendState {
  message?: string;
  error?: string;
}

export async function resendConfirmationAction(_prev: ResendState, formData: FormData): Promise<ResendState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email) return { error: "Enter your email address." };
  try {
    await strapi.post("/auth/send-email-confirmation", { email });
    return { message: "Confirmation email sent. Check your inbox (and spam folder)." };
  } catch {
    return { error: "We couldn't send the email right now. Please try again in a moment." };
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}
