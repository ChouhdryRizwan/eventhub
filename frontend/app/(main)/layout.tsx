import AssistantWidget from "@/components/assistant/AssistantWidget";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import TopBar from "@/components/layout/TopBar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopBar />
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
      <AssistantWidget />
    </>
  );
}
