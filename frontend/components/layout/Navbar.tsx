"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, LogOut, Menu, Shield, X } from "lucide-react";
import { logoutAction } from "@/app/actions/auth";
import { Button, buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { requestEventsReset } from "@/lib/events-reset";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/categories", label: "Categories" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, status, isAdmin, clear } = useAuth();
  // Show the logged-out navbar immediately; the server action then clears the cookie and redirects home.
  const logout = () => {
    clear();
    return logoutAction();
  };
  const [scrolled, setScrolled] = useState(false);
  // The mobile menu is "open for" a specific path, so navigating elsewhere closes it without an effect.
  const [openFor, setOpenFor] = useState<string | null>(null);
  const open = openFor === pathname;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b bg-white transition-shadow",
        scrolled ? "border-gray-200 shadow-md" : "border-transparent",
      )}
    >
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="inline-flex min-h-11 items-center font-syne text-2xl font-bold text-gray-900">
          Event<span className="text-primary-light">Hub</span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={link.href === "/events" ? requestEventsReset : undefined}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn(
                  "inline-flex min-h-11 items-center rounded-lg px-4 text-sm font-semibold transition-colors hover:bg-gray-100",
                  isActive(link.href) ? "text-primary" : "text-gray-700",
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 md:flex">
          {status === "loading" ? (
            <div className="h-10 w-40 animate-pulse rounded-xl bg-gray-100" aria-hidden />
          ) : user ? (
            <>
              {isAdmin && (
                <Link href="/admin" prefetch={false} className={buttonVariants({ variant: "ghost" })}>
                  <Shield className="size-4" aria-hidden /> Admin
                </Link>
              )}
              <Link href="/dashboard" prefetch={false} className={buttonVariants({ variant: "outline" })}>
                <LayoutDashboard className="size-4" aria-hidden />
                {user.name.split(" ")[0] || "Dashboard"}
              </Link>
              <form action={logout}>
                <Button type="submit" variant="ghost" aria-label="Log out">
                  <LogOut className="size-4" aria-hidden />
                </Button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className={buttonVariants({ variant: "ghost" })}>
                Log in
              </Link>
              <Link href="/register" className={buttonVariants({ variant: "primary" })}>
                Sign up
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="inline-flex size-11 items-center justify-center rounded-lg text-gray-800 hover:bg-gray-100 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpenFor(open ? null : pathname)}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </nav>

      {open && (
        <div id="mobile-menu" className="border-t border-gray-100 bg-white px-4 pb-5 pt-2 md:hidden">
          <ul className="flex flex-col">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                onClick={link.href === "/events" ? requestEventsReset : undefined}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={cn(
                    "flex min-h-12 items-center rounded-lg px-3 text-base font-semibold",
                    isActive(link.href) ? "text-primary" : "text-gray-800",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex flex-col gap-2 border-t border-gray-100 pt-4">
            {user ? (
              <>
                <Link href="/dashboard" prefetch={false} className={buttonVariants({ variant: "outline" })}>
                  My dashboard
                </Link>
                {isAdmin && (
                  <Link href="/admin" prefetch={false} className={buttonVariants({ variant: "ghost" })}>
                    Admin panel
                  </Link>
                )}
                <form action={logout}>
                  <Button type="submit" variant="ghost" className="w-full">
                    Log out
                  </Button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login" className={buttonVariants({ variant: "outline" })}>
                  Log in
                </Link>
                <Link href="/register" className={buttonVariants({ variant: "primary" })}>
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
