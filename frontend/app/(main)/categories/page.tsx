import { Suspense } from "react";
import type { Metadata } from "next";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import PageHero from "@/components/shared/PageHero";
import { getCachedCategories, getCachedCategoryCounts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Event categories",
  description: "Browse EventHub by category: music, sports, technology, art & culture, food & drink and community.",
  alternates: { canonical: "/categories" },
};

function CategoriesSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-hidden>
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="aspect-[4/3] animate-pulse rounded-2xl bg-gray-100" />
      ))}
    </div>
  );
}

async function CategoryGrid() {
  let categories;
  let counts: Record<string, number> = {};
  try {
    categories = await getCachedCategories();
  } catch {
    return (
      <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
        We couldn&apos;t load categories right now. Please refresh in a moment.
      </p>
    );
  }
  // Counts are a nicety; the page still works without them.
  try {
    counts = await getCachedCategoryCounts();
  } catch (error) {
    console.error("[categories] could not load event counts", error);
  }

  if (categories.length === 0) {
    return <p className="rounded-2xl border border-dashed border-gray-300 p-10 text-center text-gray-500">No categories yet.</p>;
  }

  return <CategoryShowcase categories={categories} counts={counts} />;
}

export default function CategoriesPage() {
  return (
    <main>
      <PageHero
        crumb="Categories"
        title="Browse events by category"
        intro="Pick what you're into and see matching events on the map and in the list."
        image="/images/sections/stage.jpg"
        imageAlt="Stage lights over a concert crowd"
      />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <Suspense fallback={<CategoriesSkeleton />}>
          <CategoryGrid />
        </Suspense>
      </div>
    </main>
  );
}
