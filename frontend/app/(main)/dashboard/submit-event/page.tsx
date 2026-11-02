import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { ChevronLeft } from "lucide-react";
import SubmitEventForm from "@/components/dashboard/SubmitEventForm";
import { auth } from "@/lib/auth";
import { getCachedCategories } from "@/lib/data";

export const metadata: Metadata = {
  title: "Submit an event",
  robots: { index: false },
};

async function SubmitContent() {
  await connection();
  const session = await auth();
  if (!session) redirect("/login?callbackUrl=/dashboard/submit-event");

  let categories;
  try {
    categories = await getCachedCategories();
  } catch {
    return (
      <p role="alert" className="rounded-card border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        We couldn&apos;t load the form right now. Please refresh in a moment.
      </p>
    );
  }
  return <SubmitEventForm categories={categories} />;
}

export default function SubmitEventPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link href="/dashboard" prefetch={false} className="mb-4 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-gray-600 hover:text-primary">
        <ChevronLeft className="size-4" aria-hidden /> Back to dashboard
      </Link>
      <h1 className="text-3xl font-bold text-gray-900">Submit an event</h1>
      <p className="mb-6 mt-2 text-gray-600">
        Tell us about your event. After a quick review by our team it will appear on the map and in the event list.
      </p>
      <Suspense fallback={<div className="h-96 animate-pulse rounded-card bg-gray-100" aria-hidden />}>
        <SubmitContent />
      </Suspense>
    </main>
  );
}
