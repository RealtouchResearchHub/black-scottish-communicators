"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { ThistleMark } from "@/components/ThistleMark";

type Message = { role: "user" | "assistant"; content: string };

const GREETING: Message = {
  role: "assistant",
  content: "Hi, I'm the BSC Assistant. I can tell you about BSC's programmes, membership, hubs and how to get involved. How can I help?",
};

function getSessionId() {
  if (typeof window === "undefined") return "";
  const key = "bsc_assistant_session";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

export function BscAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, sessionId: getSessionId() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessages((m) => [...m, { role: "assistant", content: data.error || "Something went wrong." }]);
      } else {
        setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
      }
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "I couldn't reach the server. Please try again in a moment." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close BSC Assistant" : "Open BSC Assistant"}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gold text-ink shadow-lg hover:bg-gold-light transition-colors"
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-50 flex h-[32rem] w-[22rem] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-lg border border-gold/30 bg-ink shadow-2xl">
          <div className="flex items-center gap-2.5 border-b border-gold/20 bg-ink px-4 py-3.5">
            <ThistleMark className="h-6 w-5 text-gold" />
            <div>
              <p className="font-display text-parchment text-base leading-none">BSC Assistant</p>
              <p className="text-[11px] text-parchment/50 mt-0.5">Answers from verified BSC info</p>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-md px-3 py-2 text-sm leading-relaxed ${
                  m.role === "user" ? "ml-auto bg-gold text-ink" : "bg-white/5 text-parchment"
                }`}
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="max-w-[85%] rounded-md bg-white/5 px-3 py-2 text-sm text-parchment/60">Thinking…</div>
            )}
          </div>

          <div className="border-t border-gold/20 p-3">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask about BSC…"
                className="flex-1 rounded-sm bg-white/5 px-3 py-2 text-sm text-parchment placeholder:text-parchment/40 outline-none focus-visible:ring-1 focus-visible:ring-gold"
              />
              <button
                onClick={send}
                disabled={loading || !input.trim()}
                aria-label="Send message"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-gold text-ink disabled:opacity-40"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
