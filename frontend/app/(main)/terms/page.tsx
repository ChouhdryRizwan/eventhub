import type { Metadata } from "next";
import LegalPage from "@/components/shared/LegalPage";

export const metadata: Metadata = {
  title: "Terms of use",
  description: "The rules for using EventHub: accounts, event listings, reviews and acceptable behaviour.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage
      crumb="Terms of use"
      title="Terms of use"
      updated="13 October 2026"
      intro="By using EventHub you agree to these terms. They are short and written to be read."
      sections={[
        {
          heading: "About EventHub",
          paragraphs: [
            "EventHub is a directory that helps people discover events in Karachi. We list events submitted by organizers and reviewed by our team. We do not organize, sell tickets for, or guarantee any event.",
            "EventHub is a student project (CS619). It is provided as-is for demonstration and learning purposes.",
          ],
        },
        {
          heading: "Your account",
          paragraphs: [
            "You can browse EventHub without an account. To RSVP, save events, write reviews or submit events you need to register with a valid email address and a password.",
            "You are responsible for keeping your password safe and for what happens under your account. Please give accurate information and do not create accounts on behalf of other people.",
          ],
        },
        {
          heading: "Event listings",
          paragraphs: [
            "Organizers who submit an event confirm that the details are accurate, that they have the right to promote the event and to upload the photos they attach.",
            "Submitted events are reviewed before they appear. We may edit, reject or remove a listing that is inaccurate, misleading, unlawful or offensive. Ticket prices and details are set by the organizer and may change; always confirm with the organizer.",
          ],
        },
        {
          heading: "RSVPs and tickets",
          paragraphs: [
            "An RSVP on EventHub shows your interest and helps organizers plan. It does not reserve a ticket, and EventHub does not process payments. Any ticket purchase is a matter between you and the organizer.",
          ],
        },
        {
          heading: "Reviews and conduct",
          paragraphs: [
            "Reviews should reflect your honest experience. Do not post content that is abusive, discriminatory, spam, or that you do not have the right to share. We may remove content that breaks these rules and may block accounts that repeatedly do so.",
          ],
        },
        {
          heading: "Limits of liability",
          paragraphs: [
            "Events can be cancelled, moved or changed at short notice. EventHub is not responsible for events, for inaccuracies in listings, or for losses arising from attending an event. Please use your own judgement and follow the venue's rules.",
          ],
        },
        {
          heading: "Changes and contact",
          paragraphs: [
            "We may update these terms as the service evolves; the date at the top shows the latest version. Questions? Write to hello@eventhub.example.",
          ],
        },
      ]}
    />
  );
}
