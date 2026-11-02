import type { Metadata } from "next";
import LegalPage from "@/components/shared/LegalPage";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "What information EventHub collects, how it is used and the choices you have.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      crumb="Privacy policy"
      title="Privacy policy"
      updated="13 October 2026"
      intro="We collect only what we need to run EventHub. Here is exactly what that is and why."
      sections={[
        {
          heading: "What we collect",
          paragraphs: [
            "Account details: your name, email address and password (stored only as a secure hash), plus an optional phone number, bio and profile photo.",
            "Activity you create: RSVPs, saved events, reviews and events you submit, including any photos you upload.",
          ],
        },
        {
          heading: "How we use it",
          paragraphs: [
            "To sign you in, show your dashboard, display your reviews with your name, and let admins review events you submit. We do not sell your information and do not use it for advertising.",
          ],
        },
        {
          heading: "Cookies",
          paragraphs: [
            "EventHub uses a single secure session cookie to keep you signed in. We do not use advertising or third-party tracking cookies.",
          ],
        },
        {
          heading: "Who handles your data",
          paragraphs: [
            "EventHub relies on a few providers to operate: a managed PostgreSQL database (NeonDB) for data, Cloudinary for image storage, and OpenStreetMap for map tiles. Map tile requests reveal your IP address to OpenStreetMap, as with any website that shows a map.",
          ],
        },
        {
          heading: "Your choices",
          paragraphs: [
            "You can edit your name, phone, bio, photo and password from your dashboard at any time, and cancel RSVPs or remove saved events whenever you like. To have your account and content deleted, email hello@eventhub.example and we will remove it.",
          ],
        },
        {
          heading: "Security",
          paragraphs: [
            "Passwords are hashed, connections use HTTPS in production, and administrative actions are checked on the server. No system is perfectly secure, so please use a strong, unique password.",
          ],
        },
        {
          heading: "Contact",
          paragraphs: ["Questions about this policy? Write to hello@eventhub.example."],
        },
      ]}
    />
  );
}
