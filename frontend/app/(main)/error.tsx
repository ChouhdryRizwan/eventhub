"use client";

import ErrorState from "@/components/shared/ErrorState";

export default function MainError(props: { error: Error & { digest?: string }; retry: () => void }) {
  return <ErrorState {...props} />;
}
