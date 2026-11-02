import { cn } from "@/lib/utils";

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  invert = false,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  invert?: boolean;
  action?: React.ReactNode;
}) {
  return (
    <div className={cn("mb-10 flex flex-wrap items-end justify-between gap-4", align === "center" && "flex-col items-center text-center")}>
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        <p className={cn("text-sm font-bold uppercase tracking-widest", invert ? "text-primary-lighter" : "text-primary-light")}>{eyebrow}</p>
        <h2 className={cn("mt-2 text-3xl font-bold leading-tight sm:text-4xl", invert ? "text-white" : "text-gray-900")}>{title}</h2>
        {description && <p className={cn("mt-3 text-base sm:text-lg", invert ? "text-gray-300" : "text-gray-600")}>{description}</p>}
      </div>
      {action}
    </div>
  );
}
