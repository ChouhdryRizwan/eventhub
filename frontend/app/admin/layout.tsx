import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import TopBar from "@/components/layout/TopBar";

// /admin sits outside the (main) route group, so it brings its own navbar and footer.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopBar />
      <Navbar />
      <div className="flex-1 bg-gray-50">{children}</div>
      <Footer />
    </>
  );
}
