import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// Optimistic redirect only. Pages re-check the session and role on the server.
export default auth((req) => {
  const { pathname } = req.nextUrl;

  if (!req.auth) {
    const login = new URL("/login", req.nextUrl.origin);
    login.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(login);
  }

  if (pathname.startsWith("/admin") && req.auth.user.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
