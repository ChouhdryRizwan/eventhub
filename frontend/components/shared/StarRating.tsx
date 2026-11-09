"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

/** Read-only stars (supports fractional averages by rounding to the nearest half). */
export function StarDisplay({ value, className }: { value: number; className?: string }) {
  return (
    <span
      className={cn("inline-flex items-center gap-0.5", className)}
      role="img"
      aria-label={`Rated ${value.toFixed(1)} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          aria-hidden
          className={cn(
            "size-4",
            value >= n - 0.25 ? "fill-amber-400 text-amber-400" : "fill-transparent text-gray-300",
          )}
        />
      ))}
    </span>
  );
}

/** Clickable 1-5 star input (controlled); submits its value under `name` with the surrounding form. */
export function StarInput({
  name,
  value,
  onChange,
  disabled,
}: {
  name: string;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}) {
  const setValue = onChange;
  const [hover, setHover] = useState(0);
  const shown = hover || value;

  return (
    <fieldset disabled={disabled} className="border-0 p-0">
      <legend className="mb-1.5 block text-sm font-semibold text-gray-700">Your rating</legend>
      <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setValue(n)}
            onMouseEnter={() => setHover(n)}
            onFocus={() => setHover(n)}
            onBlur={() => setHover(0)}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            aria-pressed={value === n}
            className="inline-flex size-11 items-center justify-center rounded-lg hover:bg-amber-50"
          >
            <Star
              aria-hidden
              className={cn("size-7 transition-colors", shown >= n ? "fill-amber-400 text-amber-400" : "text-gray-300")}
            />
          </button>
        ))}
      </div>
      <input type="hidden" name={name} value={value || ""} />
    </fieldset>
  );
}
