import Link from "next/link";
import { SearchX } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFoundContent() {
  return (
    <main className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <SearchX className="size-14 text-primary-lighter" aria-hidden />
      <h1 className="mt-6 text-3xl font-bold text-gray-900">We couldn&apos;t find that page</h1>
      <p className="mt-2 text-gray-600">
        The event or page you&apos;re looking for doesn&apos;t exist, or it may have been removed.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/events" className={buttonVariants()}>
          Browse events
        </Link>
        <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
          Go home
        </Link>
      </div>
    </main>
  );
}
