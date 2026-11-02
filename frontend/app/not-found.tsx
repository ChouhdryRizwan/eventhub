import type { Metadata } from "next";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import TopBar from "@/components/layout/TopBar";
import NotFoundContent from "@/components/shared/NotFoundContent";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

// Any URL that matches no route at all. Brings its own navbar and footer because it sits outside the route groups.
export default function RootNotFound() {
  return (
    <>
      <TopBar />
      <Navbar />
      <div className="flex-1">
        <NotFoundContent />
      </div>
      <Footer />
    </>
  );
}
