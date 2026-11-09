"use client";

import { Search, Star, X } from "lucide-react";
import { categoryStyles, cn, fallbackCategoryStyle } from "@/lib/utils";
import type { Category } from "@/types";

interface EventFiltersProps {
  categories: Category[];
  selected: string[];
  search: string;
  featuredOnly: boolean;
  onToggleFeatured: () => void;
  onToggleCategory: (slug: string) => void;
  onClearCategories: () => void;
  onSearchChange: (value: string) => void;
  onReset: () => void;
}

export default function EventFilters({
  categories,
  selected,
  search,
  featuredOnly,
  onToggleFeatured,
  onToggleCategory,
  onClearCategories,
  onSearchChange,
  onReset,
}: EventFiltersProps) {
  const dirty = selected.length > 0 || search.trim() !== "" || featuredOnly;

  return (
    <div className="space-y-3">
      <form role="search" onSubmit={(e) => e.preventDefault()} className="relative">
        <label htmlFor="event-search" className="sr-only">
          Search events by name, category, organizer or venue
        </label>
        <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-gray-400" aria-hidden />
        <input
          id="event-search"
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name, category, organizer or venue…"
          className="min-h-11 w-full rounded-xl border border-gray-200 bg-white pl-12 pr-24 text-sm focus:border-primary-light focus:outline-none focus:ring-2 focus:ring-primary-light/30 [&::-webkit-search-cancel-button]:hidden"
        />
        {dirty && (
          <button
            type="button"
            onClick={onReset}
            className="absolute right-2 top-1/2 inline-flex min-h-9 -translate-y-1/2 items-center gap-1 rounded-lg px-3 text-xs font-semibold text-gray-600 hover:bg-gray-100"
          >
            <X className="size-3.5" aria-hidden /> Clear
          </button>
        )}
      </form>

      <div role="group" aria-label="Filter by category" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        <button
          type="button"
          onClick={onClearCategories}
          aria-pressed={selected.length === 0}
          className={cn(
            "inline-flex min-h-10 shrink-0 items-center rounded-full border px-4 text-sm font-semibold transition-colors",
            selected.length === 0
              ? "border-primary bg-primary text-white"
              : "border-gray-200 bg-white text-gray-700 hover:border-primary-lighter",
          )}
        >
          All
        </button>
        <button
          type="button"
          onClick={onToggleFeatured}
          aria-pressed={featuredOnly}
          className={cn(
            "inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full border px-4 text-sm font-semibold transition-colors",
            featuredOnly
              ? "border-amber-500 bg-amber-400 text-ink"
              : "border-amber-200 bg-amber-50 text-amber-800 hover:border-amber-400",
          )}
        >
          <Star className="size-4 fill-current" aria-hidden /> Featured only
        </button>
        {categories.map((category) => {
          const active = selected.includes(category.slug);
          return (
            <button
              key={category.documentId}
              type="button"
              onClick={() => onToggleCategory(category.slug)}
              aria-pressed={active}
              className={cn(
                "inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full border px-4 text-sm font-semibold transition-colors",
                active
                  ? "border-primary bg-primary text-white"
                  : cn(categoryStyles[category.slug] ?? fallbackCategoryStyle, "hover:brightness-95"),
              )}
            >
              <span aria-hidden>{category.icon}</span>
              {category.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
