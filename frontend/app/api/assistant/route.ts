import { NextResponse } from "next/server";
import { AssistantError, askAssistant, type ChatMessage } from "@/lib/assistant";
import { getCachedAssistantEvents } from "@/lib/data";

const MAX_MESSAGES = 6; // conversation turns sent to the model
const MAX_LENGTH = 400; // characters per message
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 10; // requests per client per minute

// Best-effort limiter (in memory, per server instance): protects the free-tier API key from loops and abuse.
const hits = new Map<string, number[]>();

function rateLimited(key: string) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) {
    for (const [k, times] of hits) if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
  }
  return recent.length > MAX_PER_WINDOW;
}

function parseMessages(body: unknown): ChatMessage[] | null {
  const raw = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const messages: ChatMessage[] = [];
  for (const item of raw.slice(-MAX_MESSAGES)) {
    const { role, content } = (item ?? {}) as { role?: unknown; content?: unknown };
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") return null;
    const text = content.trim().slice(0, MAX_LENGTH);
    if (text) messages.push({ role, content: text });
  }
  // Gemini needs the conversation to start with, and end on, a user turn.
  while (messages.length && messages[0].role !== "user") messages.shift();
  return messages.length && messages[messages.length - 1].role === "user" ? messages : null;
}

export async function POST(request: Request) {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: "The AI assistant isn't switched on yet. The site owner needs to add a Gemini API key." }, { status: 503 });
  }

  const client = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  if (rateLimited(client)) {
    return NextResponse.json({ error: "You're asking very quickly. Please wait a moment." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const messages = parseMessages(body);
  if (!messages) return NextResponse.json({ error: "Send a question to the assistant." }, { status: 400 });

  try {
    const events = await getCachedAssistantEvents();
    return NextResponse.json(await askAssistant(messages, events));
  } catch (error) {
    if (error instanceof AssistantError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("Assistant failed:", error);
    return NextResponse.json({ error: "We couldn't load events for the assistant. Please try again." }, { status: 502 });
  }
}
