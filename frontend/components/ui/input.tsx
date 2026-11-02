import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "min-h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-light focus:outline-none focus:ring-2 focus:ring-primary-light/30 disabled:opacity-60",
        className,
      )}
      {...props}
    />
  );
}

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("mb-1.5 block text-sm font-semibold text-gray-700", className)} {...props} />;
}
