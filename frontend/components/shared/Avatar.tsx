import Image from "next/image";
import { cn } from "@/lib/utils";

export default function Avatar({
  name,
  src,
  size = 64,
  className,
}: {
  name: string;
  src?: string | null;
  size?: number;
  className?: string;
}) {
  const initials =
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "?";

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary to-accent font-syne font-bold text-white",
        className,
      )}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {src ? (
        <Image src={src} alt={`${name}'s profile photo`} fill sizes={`${size}px`} className="object-cover" />
      ) : (
        <span aria-hidden>{initials}</span>
      )}
    </span>
  );
}
