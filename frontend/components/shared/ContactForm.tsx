"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

const TOPICS = ["General question", "Submitting an event", "Report a problem", "Partnership"];
const TO = "hello@eventhub.example";

/** Composes an email in the visitor's own mail app (EventHub has no mail server to post to). */
export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState(TOPICS[0]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.trim().length < 10) {
      setError("Please enter your name, a valid email and a message of at least 10 characters.");
      return;
    }
    setError("");
    const body = `${message.trim()}\n\n— ${name.trim()} (${email.trim()})`;
    window.location.href = `mailto:${TO}?subject=${encodeURIComponent(`[EventHub] ${topic}`)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="c-name">Your name</Label>
          <Input id="c-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required />
        </div>
        <div>
          <Label htmlFor="c-email">Email</Label>
          <Input id="c-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
        </div>
      </div>
      <div>
        <Label htmlFor="c-topic">Topic</Label>
        <select
          id="c-topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="min-h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm focus:border-primary-light focus:outline-none focus:ring-2 focus:ring-primary-light/30"
        >
          {TOPICS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="c-message">Message</Label>
        <textarea
          id="c-message"
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          className="w-full rounded-xl border border-gray-200 bg-white p-4 text-sm focus:border-primary-light focus:outline-none focus:ring-2 focus:ring-primary-light/30"
        />
      </div>
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-gray-500">This opens your email app with the message ready to send.</p>
        <Button type="submit" size="lg">
          <Send className="size-4" aria-hidden /> Write the email
        </Button>
      </div>
    </form>
  );
}
