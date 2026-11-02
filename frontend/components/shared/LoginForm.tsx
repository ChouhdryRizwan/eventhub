"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { loginAction, type FormState } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import ResendConfirmation from "@/components/shared/ResendConfirmation";

const initial: FormState = {};

export default function LoginForm({ callbackUrl, confirmed = false }: { callbackUrl: string; confirmed?: boolean }) {
  const [state, action, pending] = useActionState(loginAction, initial);

  return (
    <form action={action} className="space-y-5" noValidate>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
        <p className="mt-1 text-sm text-gray-500">Log in to RSVP, save events and leave reviews.</p>
      </div>

      {confirmed && !state.error && (
        <p role="status" className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          Your email is confirmed. Log in to get started.
        </p>
      )}

      {state.error && (
        <div role="alert" className="space-y-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <p>{state.error}</p>
          {state.unconfirmed && <ResendConfirmation email={state.unconfirmed.email} />}
        </div>
      )}

      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" defaultValue={state.values?.email} autoComplete="email" required placeholder="you@example.com" />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" autoComplete="current-password" required />
      </div>

      <Button type="submit" className="w-full" disabled={pending}>
        {pending && <Loader2 className="size-4 animate-spin" aria-hidden />}
        {pending ? "Logging in…" : "Log in"}
      </Button>

      <p className="text-center text-sm text-gray-500">
        New to EventHub?{" "}
        <Link href="/register" className="font-semibold text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  );
}
