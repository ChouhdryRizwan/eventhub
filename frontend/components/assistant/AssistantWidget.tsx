"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Sparkles } from "lucide-react";

// The chat panel is only downloaded the first time someone opens the assistant.
const AssistantPanel = dynamic(() => import("@/components/assistant/AssistantPanel"), { ssr: false });

export default function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  return (
    <>
      {mounted && <AssistantPanel open={open} onClose={() => setOpen(false)} />}
      {!open && (
        <button
          type="button"
          onClick={() => {
            setMounted(true);
            setOpen(true);
          }}
          aria-label="Ask the EventHub assistant"
          className="fixed bottom-4 right-4 z-40 inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-transform hover:-translate-y-0.5 hover:bg-primary-light sm:bottom-6 sm:right-6"
        >
          <Sparkles className="size-5" aria-hidden />
          <span className="hidden sm:inline">Ask AI</span>
        </button>
      )}
    </>
  );
}
