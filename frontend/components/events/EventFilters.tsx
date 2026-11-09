"use client";

import { Search, Star, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";

interface EventSearchProps {
  search: string;
  dirty: boolean;
  onSearchChange: (value: string) => void;
  onReset: () => void;
  className?: string;
}

/** Search box (FR-08). Sits in the dark page header, so it is a bright, high-contrast field. */
export function EventSearch({ search, dirty, onSearchChange, onReset, className }: EventSearchProps) {
  return (
    <form role="search" onSubmit={(e) => e.preventDefault()} className={cn("relative", className)}>
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
        className="min-h-12 w-full rounded-xl border border-transparent bg-white pl-12 pr-24 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-primary-lighter focus:outline-none focus:ring-4 focus:ring-primary-light/30 [&::-webkit-search-cancel-button]:hidden"
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
  );
}

interface EventFiltersProps {
  categories: Category[];
  selected: string[];
  featuredOnly: boolean;
  onToggleFeatured: () => void;
  onToggleCategory: (slug: string) => void;
  onClearCategories: () => void;
}

const chip =
  "inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full border px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light/50";
const chipIdle = "border-gray-200 bg-white text-gray-700 hover:border-primary-lighter hover:text-primary";
const chipActive = "border-primary bg-primary text-white";

/** Category tab bar (FR-03): one consistent chip style, multi-select, plus a Featured toggle. */
export default function EventFilters({
  categories,
  selected,
  featuredOnly,
  onToggleFeatured,
  onToggleCategory,
  onClearCategories,
}: EventFiltersProps) {
  return (
    <div
      role="group"
      aria-label="Filter events"
      className="-mx-4 flex items-center gap-2 overflow-x-auto px-4 py-3 sm:mx-0 sm:flex-wrap sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <button
        type="button"
        onClick={onClearCategories}
        aria-pressed={selected.length === 0}
        className={cn(chip, selected.length === 0 ? chipActive : chipIdle)}
      >
        All
      </button>

      {categories.map((category) => {
        const active = selected.includes(category.slug);
        return (
          <button
            key={category.documentId}
            type="button"
            onClick={() => onToggleCategory(category.slug)}
            aria-pressed={active}
            className={cn(chip, active ? chipActive : chipIdle)}
          >
            <span aria-hidden>{category.icon}</span>
            {category.name}
          </button>
        );
      })}

      <span className="mx-1 hidden h-6 w-px shrink-0 bg-gray-200 sm:block" aria-hidden />

      <button
        type="button"
        onClick={onToggleFeatured}
        aria-pressed={featuredOnly}
        className={cn(
          chip,
          featuredOnly
            ? "border-amber-500 bg-amber-400 text-ink"
            : "border-amber-200 bg-amber-50 text-amber-800 hover:border-amber-400",
        )}
      >
        <Star className="size-4 fill-current" aria-hidden /> Featured only
      </button>
    </div>
  );
}
