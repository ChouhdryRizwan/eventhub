"use client";

import { useState, useTransition } from "react";
import { CalendarDays, Clock, ExternalLink, Users } from "lucide-react";
import toast from "react-hot-toast";
import {
  deleteEventAction,
  setEventStatusAction,
  setFeaturedAction,
  setUserBlockedAction,
  type AdminResult,
} from "@/app/actions/admin";
import EventsTable from "@/components/admin/EventsTable";
import PendingQueue from "@/components/admin/PendingQueue";
import UsersTable, { type AdminUser } from "@/components/admin/UsersTable";
import { cn } from "@/lib/utils";
import type { Event, EventStatus } from "@/types";

const TABS = [
  { id: "pending", label: "Pending review" },
  { id: "events", label: "All events" },
  { id: "users", label: "Users" },
] as const;
type TabId = (typeof TABS)[number]["id"];

interface AdminPanelProps {
  initialEvents: Event[];
  initialUsers: AdminUser[];
  currentUserId: string;
  strapiAdminUrl: string;
  loadError?: string;
}

function Stat({ icon: Icon, value, label }: { icon: typeof Users; value: number; label: string }) {
  return (
    <div className="rounded-card border border-gray-200 bg-white p-4">
      <Icon className="size-5 text-primary-light" aria-hidden />
      <p className="mt-2 font-syne text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 sm:text-sm">{label}</p>
    </div>
  );
}

export default function AdminPanel({ initialEvents, initialUsers, currentUserId, strapiAdminUrl, loadError }: AdminPanelProps) {
  const [events, setEvents] = useState(initialEvents);
  const [users, setUsers] = useState(initialUsers);
  const [tab, setTab] = useState<TabId>("pending");
  const [busyEvent, setBusyEvent] = useState<string | null>(null);
  const [busyUser, setBusyUser] = useState<number | null>(null);
  const [, startTransition] = useTransition();

  const pending = events.filter((e) => e.status === "pending");

  const run = (event: Event, action: () => Promise<AdminResult>, apply: () => void, success: string) => {
    setBusyEvent(event.documentId);
    startTransition(async () => {
      const result = await action();
      setBusyEvent(null);
      if (result.ok) {
        apply();
        toast.success(success);
      } else {
        toast.error(result.error);
      }
    });
  };

  const patch = (documentId: string, changes: Partial<Event>) =>
    setEvents((list) => list.map((e) => (e.documentId === documentId ? { ...e, ...changes } : e)));

  const setStatus = (event: Event, status: EventStatus) =>
    run(
      event,
      () => setEventStatusAction(event.documentId, event.slug, status),
      // Mirrors the server: anything but published loses its featured flag.
      () => patch(event.documentId, status === "published" ? { status } : { status, is_featured: false }),
      status === "published" ? `“${event.title}” is now live.` : status === "rejected" ? `“${event.title}” was rejected.` : `“${event.title}” moved back to pending.`,
    );

  const setFeatured = (event: Event, featured: boolean) =>
    run(
      event,
      () => setFeaturedAction(event.documentId, event.slug, featured),
      () => patch(event.documentId, { is_featured: featured }),
      featured ? "Added to featured events." : "Removed from featured events.",
    );

  const remove = (event: Event) =>
    run(
      event,
      () => deleteEventAction(event.documentId, event.slug),
      () => setEvents((list) => list.filter((e) => e.documentId !== event.documentId)),
      `“${event.title}” was deleted.`,
    );

  const toggleBlocked = (user: AdminUser) => {
    setBusyUser(user.id);
    startTransition(async () => {
      const result = await setUserBlockedAction(user.id, !user.blocked);
      setBusyUser(null);
      if (result.ok) {
        setUsers((list) => list.map((u) => (u.id === user.id ? { ...u, blocked: !user.blocked } : u)));
        toast.success(user.blocked ? "Account unblocked." : "Account blocked.");
      } else {
        toast.error(result.error);
      }
    });
  };

  const counts: Record<TabId, number | null> = { pending: pending.length, events: events.length, users: users.length };

  return (
    <div className="space-y-6">
      {loadError && (
        <p role="alert" className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {loadError}
        </p>
      )}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat icon={Clock} value={pending.length} label="Awaiting review" />
        <Stat icon={CalendarDays} value={events.filter((e) => e.status === "published").length} label="Live events" />
        <Stat icon={CalendarDays} value={events.filter((e) => e.is_featured).length} label="Featured" />
        <Stat icon={Users} value={users.length} label="Registered users" />
      </div>

      <div>
        <div role="tablist" aria-label="Admin sections" className="-mx-4 flex gap-1 overflow-x-auto border-b border-gray-200 px-4 sm:mx-0 sm:px-0">
          {TABS.map((t) => (
            <button
              key={t.id}
              id={`admin-tab-${t.id}`}
              role="tab"
              type="button"
              aria-selected={tab === t.id}
              aria-controls={`admin-panel-${t.id}`}
              onClick={() => setTab(t.id)}
              className={cn(
                "inline-flex min-h-11 shrink-0 items-center gap-2 border-b-2 px-4 text-sm font-semibold transition-colors",
                tab === t.id ? "border-primary text-primary" : "border-transparent text-gray-600 hover:text-gray-900",
              )}
            >
              {t.label}
              <span className={cn("rounded-full px-2 py-0.5 text-xs", t.id === "pending" && counts.pending ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-600")}>
                {counts[t.id]}
              </span>
            </button>
          ))}
        </div>

        <div id={`admin-panel-${tab}`} role="tabpanel" aria-labelledby={`admin-tab-${tab}`} className="pt-6">
          {tab === "pending" && (
            <PendingQueue events={pending} busyId={busyEvent} onApprove={(e) => setStatus(e, "published")} onReject={(e) => setStatus(e, "rejected")} />
          )}
          {tab === "events" && <EventsTable events={events} busyId={busyEvent} onStatus={setStatus} onFeatured={setFeatured} onDelete={remove} />}
          {tab === "users" && <UsersTable users={users} currentUserId={currentUserId} busyId={busyUser} onToggleBlocked={toggleBlocked} />}
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-card border border-gray-200 bg-white p-4 text-sm text-gray-600 sm:flex-row sm:items-center sm:justify-between">
        <p>Need to edit event details, manage categories or change roles and permissions? Use Strapi&apos;s own dashboard.</p>
        <a
          href={`${strapiAdminUrl}/admin`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-primary px-4 font-semibold text-primary hover:bg-primary/5"
        >
          Open Strapi admin <ExternalLink className="size-4" aria-hidden />
        </a>
      </div>
    </div>
  );
}
