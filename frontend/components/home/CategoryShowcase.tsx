import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CategoryIcon, categoryAlt, categoryImage } from "@/lib/category-meta";
import type { Category } from "@/types";

export default function CategoryShowcase({ categories, counts }: { categories: Category[]; counts: Record<string, number> }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => {
        const count = counts[category.slug] ?? 0;
        return (
          <li key={category.documentId}>
            <Link
              href={`/events?category=${category.slug}`}
              className="group relative block aspect-[4/3] overflow-hidden rounded-2xl bg-ink"
            >
              <Image
                src={categoryImage(category.slug)}
                alt={categoryAlt[category.slug] ?? `${category.name} events`}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                loading="lazy"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent" aria-hidden />
              <span className="absolute left-4 top-4 flex size-11 items-center justify-center rounded-xl bg-white/90 text-primary shadow">
                <CategoryIcon slug={category.slug} className="size-6" />
              </span>
              <span className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full bg-white/0 text-white opacity-0 ring-1 ring-white/50 transition group-hover:bg-white group-hover:text-primary group-hover:opacity-100">
                <ArrowUpRight className="size-5" aria-hidden />
              </span>
              <span className="absolute inset-x-0 bottom-0 p-5 text-white">
                <span className="block text-2xl font-bold">{category.name}</span>
                <span className="mt-0.5 block text-sm text-gray-200">
                  {count > 0 ? `${count} upcoming ${count === 1 ? "event" : "events"}` : category.description}
                </span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
