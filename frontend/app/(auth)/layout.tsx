import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-ink px-4 py-8 sm:px-6">
      <Link href="/" className="mx-auto font-syne text-2xl font-bold text-white">
        Event<span className="text-primary-lighter">Hub</span>
      </Link>
      <main className="mx-auto flex w-full max-w-md flex-1 items-center py-8">
        <div className="w-full rounded-card border border-white/10 bg-white p-6 shadow-xl sm:p-8">{children}</div>
      </main>
    </div>
  );
}
