import { Suspense } from "react";
import type { Metadata } from "next";
import LoginForm from "@/components/shared/LoginForm";

export const metadata: Metadata = { title: "Log in" };

async function LoginContent({ searchParams }: { searchParams: Promise<{ callbackUrl?: string; confirmed?: string }> }) {
  const { callbackUrl, confirmed } = await searchParams;
  return <LoginForm callbackUrl={callbackUrl ?? "/dashboard"} confirmed={confirmed === "1"} />;
}

export default function LoginPage({ searchParams }: PageProps<"/login">) {
  return (
    <Suspense fallback={<div className="h-72 animate-pulse rounded-xl bg-gray-100" />}>
      <LoginContent searchParams={searchParams as Promise<{ callbackUrl?: string; confirmed?: string }>} />
    </Suspense>
  );
}
