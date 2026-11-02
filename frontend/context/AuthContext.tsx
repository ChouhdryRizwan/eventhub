"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
}

interface AuthState {
  user: AuthUser | null;
  /** Strapi JWT for authenticated API calls from client components. */
  token: string | null;
  status: "loading" | "authenticated" | "unauthenticated";
  isAuthenticated: boolean;
  isAdmin: boolean;
  /** Re-read the session from the server (e.g. after a profile edit). */
  refresh: () => void;
}

interface SessionPayload {
  user?: { id: string; name?: string | null; email?: string | null; phone?: string | null; role?: string };
  accessToken?: string;
}

const AuthContext = createContext<AuthState>({
  user: null,
  token: null,
  status: "loading",
  isAuthenticated: false,
  isAdmin: false,
  refresh: () => {},
});

/**
 * Keeps the navbar and client components in sync with the server session.
 *
 * Login and logout run in Server Actions, which a client-side session provider never hears
 * about, so the session is simply re-read (read-only GET, no cookie writes) on every route
 * change. NextAuth's own `update()` is deliberately not used: it rewrites the session cookie
 * and can race with sign-out.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [tick, setTick] = useState(0);
  const [session, setSession] = useState<SessionPayload | null | undefined>(undefined); // undefined = loading

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/session", { cache: "no-store", credentials: "same-origin" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: SessionPayload | null) => {
        if (!cancelled) setSession(data?.user ? data : null);
      })
      .catch(() => {
        if (!cancelled) setSession(null);
      });
    return () => {
      cancelled = true;
    };
  }, [pathname, tick]);

  const refresh = useCallback(() => setTick((n) => n + 1), []);

  const value = useMemo<AuthState>(() => {
    const user: AuthUser | null = session?.user
      ? {
          id: session.user.id,
          name: session.user.name ?? "",
          email: session.user.email ?? "",
          phone: session.user.phone ?? null,
          role: session.user.role ?? "authenticated",
        }
      : null;
    return {
      user,
      token: session?.accessToken ?? null,
      status: session === undefined ? "loading" : user ? "authenticated" : "unauthenticated",
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === "admin",
      refresh,
    };
  }, [session, refresh]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
