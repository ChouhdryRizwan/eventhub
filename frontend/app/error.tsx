"use client";

import ErrorState from "@/components/shared/ErrorState";

// Catches errors in routes outside the (main) group, such as /login, /register and /admin.
export default function RootError(props: { error: Error & { digest?: string }; retry: () => void }) {
  return <ErrorState {...props} />;
}
