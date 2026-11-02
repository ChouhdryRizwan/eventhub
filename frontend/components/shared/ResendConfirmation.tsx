"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { resendConfirmationAction, type ResendState } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";

// A plain button (not a <form>) because this renders inside the login form.
export default function ResendConfirmation({ email }: { email: string }) {
  const [state, setState] = useState<ResendState>({});
  const [pending, startTransition] = useTransition();

  function resend() {
    startTransition(async () => {
      const data = new FormData();
      data.set("email", email);
      setState(await resendConfirmationAction({}, data));
    });
  }

  return (
    <div className="space-y-2">
      <Button type="button" variant="outline" size="sm" onClick={resend} disabled={pending}>
        {pending && <Loader2 className="size-4 animate-spin" aria-hidden />}
        Resend confirmation email
      </Button>
      {state.message && (
        <p role="status" className="text-sm text-green-700">
          {state.message}
        </p>
      )}
      {state.error && (
        <p role="alert" className="text-sm text-red-700">
          {state.error}
        </p>
      )}
    </div>
  );
}
