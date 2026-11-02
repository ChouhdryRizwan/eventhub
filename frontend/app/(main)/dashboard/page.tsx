import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Bookmark, CheckCircle2, PlusCircle, Star, Ticket } from "lucide-react";
import DashboardTabs from "@/components/dashboard/DashboardTabs";
import Avatar from "@/components/shared/Avatar";
import { buttonVariants } from "@/components/ui/button";
import { getMe, getMyBookmarks, getMyEvents, getMyReviews, getMyRsvps } from "@/lib/api";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "My dashboard",
  robots: { index: false },
};

function DashboardSkeleton() {
  return (
    <div className="space-y-6" aria-hidden>
      <div className="h-28 animate-pulse rounded-card bg-gray-100" />
      <div className="grid grid-cols-3 gap-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-card bg-gray-100" />
        ))}
      </div>
      <div className="h-72 animate-pulse rounded-card bg-gray-100" />
    </div>
  );
}

function Stat({ icon: Icon, value, label }: { icon: typeof Ticket; value: number; label: string }) {
  return (
    <div className="rounded-card border border-gray-200 bg-white p-4 text-center sm:p-5">
      <Icon className="mx-auto size-5 text-primary-light" aria-hidden />
      <p className="mt-2 font-syne text-2xl font-bold text-gray-900 sm:text-3xl">{value}</p>
      <p className="text-xs text-gray-500 sm:text-sm">{label}</p>
    </div>
  );
}

type SearchParams = Promise<{ tab?: string; submitted?: string }>;
const TAB_IDS = ["rsvps", "saved", "events", "reviews", "settings"] as const;

async function DashboardContent({ searchParams }: { searchParams: SearchParams }) {
  const { tab, submitted } = await searchParams;
  const initialTab = TAB_IDS.find((id) => id === tab);
  await connection(); // the session is request-time data
  const session = await auth();
  if (!session) redirect("/login?callbackUrl=/dashboard");
  const token = session.accessToken;

  const [me, rsvps, bookmarks, reviews, myEvents] = await Promise.allSettled([
    getMe(token),
    getMyRsvps(token),
    getMyBookmarks(token),
    getMyReviews(token),
    getMyEvents(token),
  ]);

  if (me.status === "rejected") {
    // An expired/revoked token: send the user back through login instead of showing a broken page.
    redirect("/login?callbackUrl=/dashboard");
  }

  const user = me.value;
  const rsvpList = rsvps.status === "fulfilled" ? rsvps.value.data.filter((r) => r.event) : [];
  const bookmarkList = bookmarks.status === "fulfilled" ? bookmarks.value.data.filter((b) => b.event) : [];
  const reviewList = reviews.status === "fulfilled" ? reviews.value.data : [];
  const eventList = myEvents.status === "fulfilled" ? myEvents.value.data : [];
  const loadFailed = [rsvps, bookmarks, reviews, myEvents].some((r) => r.status === "rejected");

  const displayName = user.full_name || user.username;
  const isAdmin = session.user.role === "admin";

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-5 rounded-card bg-ink p-5 text-white sm:flex-row sm:items-center sm:p-7">
        <Avatar name={displayName} src={user.profile_pic?.url} size={72} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="truncate text-2xl font-bold sm:text-3xl">{displayName}</h1>
            <span className="rounded-full bg-primary-light/30 px-3 py-0.5 text-xs font-semibold text-primary-lighter">
              {isAdmin ? "Administrator" : "Member"}
            </span>
          </div>
          <p className="mt-1 truncate text-sm text-gray-300">{user.email}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard/submit-event" prefetch={false} className={cn(buttonVariants({ variant: "primary" }), "bg-primary-light hover:bg-primary-lighter hover:text-ink")}>
            <PlusCircle className="size-4" aria-hidden /> Submit an event
          </Link>
          {isAdmin && (
            <Link href="/admin" prefetch={false} className={cn(buttonVariants({ variant: "ghost" }), "text-white hover:bg-white/10")}>
              Admin panel
            </Link>
          )}
        </div>
      </header>

      {submitted === "1" && (
        <p role="status" className="flex items-start gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0" aria-hidden />
          Thanks! Your event was submitted and is waiting for review. You can track it under “My events”.
        </p>
      )}

      {loadFailed && (
        <p role="alert" className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Some of your activity couldn&apos;t be loaded right now. Refresh the page to try again.
        </p>
      )}

      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <Stat icon={Ticket} value={rsvpList.filter((r) => r.status === "confirmed").length} label="RSVPs" />
        <Stat icon={Bookmark} value={bookmarkList.length} label="Saved" />
        <Stat icon={Star} value={reviewList.length} label="Reviews" />
      </div>

      <DashboardTabs
        rsvps={rsvpList}
        bookmarks={bookmarkList}
        reviews={reviewList}
        events={eventList}
        initialTab={initialTab}
        profile={{
          name: user.full_name ?? "",
          email: user.email,
          phone: user.phone ?? "",
          bio: user.bio ?? "",
          avatar: user.profile_pic?.url ?? null,
        }}
      />
    </div>
  );
}

export default function DashboardPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
