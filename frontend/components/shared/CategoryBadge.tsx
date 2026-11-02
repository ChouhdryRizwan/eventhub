import { categoryStyles, cn, fallbackCategoryStyle } from "@/lib/utils";
import type { Category } from "@/types";

export default function CategoryBadge({
  category,
  className,
}: {
  category?: Pick<Category, "name" | "slug" | "icon"> | null;
  className?: string;
}) {
  if (!category) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        categoryStyles[category.slug] ?? fallbackCategoryStyle,
        className,
      )}
    >
      {category.icon && <span aria-hidden>{category.icon}</span>}
      {category.name}
    </span>
  );
}
