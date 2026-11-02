"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Loader2, MapPin, Send, Sparkles, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface AssistantEvent {
  slug: string;
  title: string;
  category: string | null;
  date: string;
  time: string;
  venue: string;
  price: string;
  image: string | null;
}

interface Turn {
  role: "user" | "assistant";
  content: string;
  events?: AssistantEvent[];
  error?: boolean;
}

const SUGGESTIONS = [
  "Free events this month",
  "Any tech events coming up?",
  "Something fun for a weekend with family",
  "Cheapest music events",
];

const GREETING: Turn = {
  role: "assistant",
  content: "Hi! I'm the EventHub assistant. Tell me what you're in the mood for and I'll find events for you.",
};

export default function AssistantPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [turns, setTurns] = useState<Turn[]>([GREETING]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) document.getElementById("assistant-input")?.focus();
  }, [open]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [turns, pending]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  async function send(text: string) {
    const question = text.trim();
    if (!question || pending) return;
    const asked: Turn = { role: "user", content: question };
    setTurns([...turns, asked]);
    setInput("");
    setPending(true);
    try {
      // The greeting and failed attempts are not part of the conversation the model should see.
      const history = [...turns, asked].filter((t) => t !== GREETING && !t.error);
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history.map(({ role, content }) => ({ role, content })) }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setTurns((t) => [...t, { role: "assistant", content: data.reply, events: data.events }]);
    } catch (error) {
      setTurns((t) => [
        ...t,
        { role: "assistant", content: error instanceof Error ? error.message : "Something went wrong.", error: true },
      ]);
    } finally {
      setPending(false);
    }
  }

  if (!open) return null;

  return (
    <section
      role="dialog"
      aria-label="EventHub assistant"
      className="fixed inset-x-0 bottom-0 z-50 flex h-[85dvh] flex-col overflow-hidden rounded-t-2xl border border-gray-200 bg-white shadow-2xl sm:inset-x-auto sm:bottom-6 sm:right-6 sm:h-[36rem] sm:max-h-[calc(100dvh-3rem)] sm:w-[24rem] sm:rounded-2xl"
    >
      <header className="flex items-center justify-between bg-[#0d0d0d] px-4 py-3 text-white">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-full bg-primary">
            <Sparkles className="size-4" aria-hidden />
          </span>
          <div>
            <p className="font-syne text-sm font-bold leading-tight">EventHub assistant</p>
            <p className="text-xs text-gray-300">AI · answers from our live events</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close assistant"
          className="flex size-10 items-center justify-center rounded-full hover:bg-white/10"
        >
          <X className="size-5" aria-hidden />
        </button>
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto bg-gray-50 p-4" aria-live="polite">
        {turns.map((turn, i) => (
          <div key={i} className={turn.role === "user" ? "flex justify-end" : "flex flex-col items-start gap-2"}>
            <p
              className={
                turn.role === "user"
                  ? "max-w-[85%] rounded-2xl rounded-br-md bg-primary px-3.5 py-2 text-sm text-white"
                  : turn.error
                    ? "max-w-[90%] rounded-2xl rounded-bl-md border border-red-200 bg-red-50 px-3.5 py-2 text-sm text-red-700"
                    : "max-w-[90%] rounded-2xl rounded-bl-md bg-white px-3.5 py-2 text-sm text-gray-800 shadow-sm ring-1 ring-gray-200"
              }
            >
              {turn.content}
            </p>
            {turn.events?.map((event) => (
              <Link
                key={event.slug}
                href={`/events/${event.slug}`}
                onClick={onClose}
                className="flex w-full max-w-[95%] gap-3 rounded-xl bg-white p-2.5 text-left shadow-sm ring-1 ring-gray-200 transition hover:ring-primary-light"
              >
                {event.image && (
                  <Image src={event.image} alt="" width={64} height={64} className="size-16 shrink-0 rounded-lg object-cover" />
                )}
                <span className="min-w-0 text-xs text-gray-600">
                  <span className="block truncate text-sm font-bold text-gray-900">{event.title}</span>
                  <span className="mt-0.5 flex items-center gap-1">
                    <CalendarDays className="size-3.5 shrink-0" aria-hidden />
                    <span className="truncate">
                      {event.date}, {event.time}
                    </span>
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3.5 shrink-0" aria-hidden />
                    <span className="truncate">{event.venue}</span>
                  </span>
                  <span className="font-semibold text-primary">{event.price}</span>
                </span>
              </Link>
            ))}
          </div>
        ))}

        {turns.length === 1 && (
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => send(s)}
                className="min-h-9 rounded-full border border-primary/30 bg-white px-3 text-xs font-semibold text-primary hover:bg-primary/5"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {pending && (
          <p className="flex items-center gap-2 text-sm text-gray-500" role="status">
            <Loader2 className="size-4 animate-spin" aria-hidden /> Looking through events…
          </p>
        )}
        <div ref={endRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void send(input);
        }}
        className="flex items-center gap-2 border-t border-gray-200 bg-white p-3"
      >
        <label htmlFor="assistant-input" className="sr-only">
          Ask about events
        </label>
        <Input
          id="assistant-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={400}
          placeholder="e.g. free events this weekend"
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={pending || !input.trim()}
          aria-label="Send"
          className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-white transition-colors hover:bg-primary-light disabled:opacity-50"
        >
          <Send className="size-5" aria-hidden />
        </button>
      </form>
    </section>
  );
}
