import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import AdminPanel from "@/components/admin/AdminPanel";
import type { AdminUser } from "@/components/admin/UsersTable";
import { getAllEvents, getUsers } from "@/lib/api";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin panel",
  robots: { index: false, follow: false },
};

function AdminSkeleton() {
  return (
    <div className="space-y-6" aria-hidden>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-card bg-gray-100" />
        ))}
      </div>
      <div className="h-96 animate-pulse rounded-card bg-gray-100" />
    </div>
  );
}

async function AdminContent() {
  await connection();
  const session = await auth();
  if (!session) redirect("/login?callbackUrl=/admin");
  // The proxy already redirects non-admins; this re-check is the real authorization.
  if (session.user.role !== "admin") redirect("/dashboard");

  const [events, users] = await Promise.allSettled([getAllEvents(), getUsers()]);

  const adminUsers: AdminUser[] =
    users.status === "fulfilled"
      ? users.value.map((u) => ({
          id: u.id,
          email: u.email,
          username: u.username,
          full_name: u.full_name,
          blocked: u.blocked,
          role: u.role?.type ?? "authenticated",
          createdAt: u.createdAt,
        }))
      : [];

  const failed = [events, users].some((r) => r.status === "rejected");

  return (
    <AdminPanel
      initialEvents={events.status === "fulfilled" ? events.value.data : []}
      initialUsers={adminUsers}
      currentUserId={session.user.id}
      strapiAdminUrl={process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337"}
      loadError={failed ? "Some data couldn't be loaded from the server. Refresh to try again." : undefined}
    />
  );
}

export default function AdminPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">Admin panel</h1>
      <Suspense fallback={<AdminSkeleton />}>
        <AdminContent />
      </Suspense>
    </main>
  );
}
