import NotFoundContent from "@/components/shared/NotFoundContent";

// Shown inside the main layout (navbar + footer) when a page such as an unknown event calls notFound().
export default function NotFound() {
  return <NotFoundContent />;
}
