"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Loader2, MailCheck } from "lucide-react";
import { registerAction, type FormState } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import ResendConfirmation from "@/components/shared/ResendConfirmation";

const initial: FormState = {};

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1 text-xs text-red-600">
      {message}
    </p>
  );
}

export default function RegisterForm() {
  const [state, action, pending] = useActionState(registerAction, initial);
  const errors = state.fieldErrors ?? {};
  const values = state.values ?? {};

  if (state.registered) {
    return (
      <div className="space-y-5 text-center" role="status">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <MailCheck className="size-7" aria-hidden />
        </span>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Check your inbox</h1>
          <p className="mt-2 text-sm text-gray-600">
            We sent a confirmation link to <strong className="break-all">{state.registered.email}</strong>. Click it to
            activate your account, then log in.
          </p>
        </div>
        <div className="flex flex-col items-center gap-3">
          <ResendConfirmation email={state.registered.email} />
          <Link href="/login" className="text-sm font-semibold text-primary hover:underline">
            Go to log in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5" noValidate>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
        <p className="mt-1 text-sm text-gray-500">Join EventHub to RSVP, save events and submit your own.</p>
      </div>

      {state.error && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <div>
        <Label htmlFor="name">Full name</Label>
        <Input id="name" name="name" defaultValue={values.name} autoComplete="name" required aria-invalid={!!errors.name} aria-describedby="name-error" />
        <FieldError id="name-error" message={errors.name} />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" defaultValue={values.email} autoComplete="email" required aria-invalid={!!errors.email} aria-describedby="email-error" />
        <FieldError id="email-error" message={errors.email} />
      </div>
      <div>
        <Label htmlFor="phone">
          Phone <span className="font-normal text-gray-400">(optional)</span>
        </Label>
        <Input id="phone" name="phone" type="tel" defaultValue={values.phone} autoComplete="tel" placeholder="+92 300 1234567" aria-invalid={!!errors.phone} aria-describedby="phone-error" />
        <FieldError id="phone-error" message={errors.phone} />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" autoComplete="new-password" required minLength={8} aria-invalid={!!errors.password} aria-describedby="password-error" />
        <FieldError id="password-error" message={errors.password} />
      </div>

      <Button type="submit" className="w-full" disabled={pending}>
        {pending && <Loader2 className="size-4 animate-spin" aria-hidden />}
        {pending ? "Creating account…" : "Create account"}
      </Button>

      <p className="text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
