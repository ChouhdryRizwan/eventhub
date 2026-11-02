import { CalendarCheck, Layers, MapPinned, Ticket } from "lucide-react";

interface StatsBarProps {
  stats: { events: number; free: number; categories: number; venues: number };
}

export default function StatsBar({ stats }: StatsBarProps) {
  const items = [
    { icon: CalendarCheck, value: stats.events, label: "Upcoming events" },
    { icon: Ticket, value: stats.free, label: "Free to attend" },
    { icon: Layers, value: stats.categories, label: "Categories" },
    { icon: MapPinned, value: stats.venues, label: "Venues across the city" },
  ];

  return (
    <div className="relative z-10 mx-auto -mt-16 max-w-6xl px-4 sm:px-6 lg:-mt-20">
      <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-gray-200 shadow-xl shadow-black/10 ring-1 ring-gray-200 lg:grid-cols-4">
        {items.map(({ icon: Icon, value, label }) => (
          <li key={label} className="flex items-center gap-4 bg-white p-5 sm:p-6">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="size-6" aria-hidden />
            </span>
            <p>
              <span className="block font-syne text-3xl font-bold leading-none text-gray-900">{value}</span>
              <span className="mt-1 block text-sm text-gray-600">{label}</span>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
