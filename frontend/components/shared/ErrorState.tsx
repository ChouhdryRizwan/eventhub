"use client";

import { useEffect } from "react";
import Link from "next/link";
import { TriangleAlert } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Friendly fallback used by the route error boundaries. `retry` re-renders the failed segment. */
export default function ErrorState({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <TriangleAlert className="size-14 text-amber-500" aria-hidden />
      <h1 className="mt-6 text-3xl font-bold text-gray-900">Something went wrong</h1>
      <p className="mt-2 text-gray-600">
        We hit an unexpected problem loading this page. It&apos;s usually temporary — please try again.
      </p>
      {error.digest && <p className="mt-2 text-xs text-gray-400">Reference: {error.digest}</p>}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button onClick={() => retry()}>Try again</Button>
        <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
          Go home
        </Link>
      </div>
    </main>
  );
}
