"use client";

import { useActionState, useEffect, useRef } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { submitReviewAction, type ReviewState } from "@/app/actions/engagement";
import { Button, buttonVariants } from "@/components/ui/button";
import { StarInput } from "@/components/shared/StarRating";

const initial: ReviewState = {};

export default function ReviewForm({
  eventId,
  slug,
  isAuthenticated,
}: {
  eventId: string;
  slug: string;
  isAuthenticated: boolean;
}) {
  const [state, action, pending] = useActionState(submitReviewAction, initial);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) {
      toast.success("Thanks! Your review was posted.");
      formRef.current?.reset();
    }
  }, [state]);

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-card border border-dashed border-gray-300 p-6 text-center">
        <p className="text-sm text-gray-600">Log in to rate this event and share your experience.</p>
        <Link
          href={`/login?callbackUrl=${encodeURIComponent(`/events/${slug}`)}`}
          className={buttonVariants({ variant: "outline" })}
        >
          Log in to review
        </Link>
      </div>
    );
  }

  return (
    <form ref={formRef} action={action} className="space-y-4 rounded-card border border-gray-200 bg-white p-5" noValidate>
      <input type="hidden" name="eventId" value={eventId} />
      <input type="hidden" name="slug" value={slug} />

      <StarInput name="rating" disabled={pending} />

      <div>
        <label htmlFor="review_text" className="mb-1.5 block text-sm font-semibold text-gray-700">
          Your review
        </label>
        <textarea
          id="review_text"
          name="review_text"
          rows={4}
          maxLength={2000}
          required
          disabled={pending}
          placeholder="What did you think of this event?"
          className="w-full rounded-xl border border-gray-200 bg-white p-4 text-sm placeholder:text-gray-400 focus:border-primary-light focus:outline-none focus:ring-2 focus:ring-primary-light/30"
        />
      </div>

      {state.error && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}

      <Button type="submit" disabled={pending}>
        {pending && <Loader2 className="size-4 animate-spin" aria-hidden />}
        {pending ? "Posting…" : "Post review"}
      </Button>
    </form>
  );
}
