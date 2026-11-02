import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

/** Header band for content pages: breadcrumb, title, intro and an optional background photo. */
export default function PageHero({
  title,
  intro,
  crumb,
  image,
  imageAlt = "",
}: {
  title: string;
  intro?: string;
  crumb: string;
  image?: string;
  imageAlt?: string;
}) {
  return (
    <header className="relative isolate overflow-hidden bg-ink text-white">
      {image && <Image src={image} alt={imageAlt} fill priority sizes="100vw" className="-z-20 object-cover" />}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/80 to-ink/40" aria-hidden />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        <nav aria-label="Breadcrumb" className="text-sm text-gray-300">
          <ol className="flex items-center gap-1">
            <li>
              <Link href="/" className="inline-flex min-h-9 items-center hover:text-white">
                Home
              </Link>
            </li>
            <ChevronRight className="size-4" aria-hidden />
            <li aria-current="page" className="font-semibold text-white">
              {crumb}
            </li>
          </ol>
        </nav>
        <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">{title}</h1>
        {intro && <p className="mt-4 max-w-2xl text-lg text-gray-300">{intro}</p>}
      </div>
    </header>
  );
}
