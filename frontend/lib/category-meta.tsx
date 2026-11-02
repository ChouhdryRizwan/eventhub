import {
  Cpu,
  HeartHandshake,
  Music,
  Palette,
  Ticket,
  Trophy,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";

/** Icon per category slug (used instead of emoji on marketing pages). */
export const categoryIcons: Record<string, LucideIcon> = {
  music: Music,
  sports: Trophy,
  technology: Cpu,
  "art-culture": Palette,
  "food-drink": UtensilsCrossed,
  community: HeartHandshake,
};

/** Renders the icon for a category slug (falls back to a ticket). */
export function CategoryIcon({ slug, className }: { slug?: string | null; className?: string }) {
  const Icon = (slug && categoryIcons[slug]) || Ticket;
  return <Icon className={className} aria-hidden />;
}

/** Photo per category slug, stored in /public/images/categories. */
export const categoryImages: Record<string, string> = {
  music: "/images/categories/music.jpg",
  sports: "/images/categories/sports.jpg",
  technology: "/images/categories/technology.jpg",
  "art-culture": "/images/categories/art-culture.jpg",
  "food-drink": "/images/categories/food-drink.jpg",
  community: "/images/categories/community.jpg",
};

export const categoryImage = (slug?: string | null) => (slug && categoryImages[slug]) || "/images/sections/crowd.jpg";

export const categoryAlt: Record<string, string> = {
  music: "Crowd with raised hands at a live concert",
  sports: "Cyclists racing together in a pack",
  technology: "Audience at a technology conference",
  "art-culture": "Artist in front of a wall of paintings",
  "food-drink": "Grilled food served at a festival",
  community: "Volunteer helping at a community event",
};
