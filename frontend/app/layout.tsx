import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Syne } from "next/font/google";
import "./globals.css";
import Providers from "@/components/shared/Providers";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: "EventHub — Discover events around you",
    template: "%s | EventHub",
  },
  description:
    "Discover events on an interactive map, filter by category, RSVP and save your favourites.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${syne.variable} ${jakarta.variable}`}>
      <body className="flex min-h-screen flex-col"><Providers>{children}</Providers></body>
    </html>
  );
}
