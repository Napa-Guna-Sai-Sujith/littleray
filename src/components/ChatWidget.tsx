"use client";
import { useState } from "react";

type Msg = { from: "bot" | "user"; text: string };

const FAQ: { q: RegExp; a: string }[] = [
  { q: /price|cost|budget|calculator/i, a: "Our 2BHK packages start around ₹3.2L (budget) and go up to ₹6.5L+ (luxury). Try our interactive calculator for a live estimate!" },
  { q: /city|location|available|serve/i, a: "We're live across Telangana (Hyderabad, Warangal, Nizamabad, Karimnagar, Secunderabad, Khammam). Andhra Pradesh & Karnataka launch soon — join the waitlist." },
  { q: /timeline|how long|delivery/i, a: "Typical projects take 45–60 days from design sign-off, with a 10-year warranty on modular work." },
  { q: /consultation|meet|designer|book/i, a: "A free 45-minute consultation with a designer is just a click away — head to Book consultation." },
  { q: /warranty|guarantee/i, a: "We offer a 10-year warranty on modular units and 1 year on service — all in writing." },
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    { from: "bot", text: "Hi! I'm Ray, your design assistant. Ask about pricing, cities, timelines — or say 'talk to human'." },
  ]);
  const [input, setInput] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [leadMode, setLeadMode] = useState(false);
  const [leadSent, setLeadSent] = useState(false);

  function reply(userText: string): string {
    if (/human|agent|call me|contact/i.test(userText)) {
      setLeadMode(true);
      return "Sure — share your name and phone and a designer will reach out today.";
    }
    for (const f of FAQ) if (f.q.test(userText)) return f.a;
    return "Great question! A designer can answer that best. Would you like us to call you? (type 'yes')";
  }

  function send() {
    if (!input.trim()) return;
    const u: Msg = { from: "user", text: input };
    const b: Msg = { from: "bot", text: reply(input) };
    setMsgs((m) => [...m, u, b]);
    setInput("");
  }

  async function submitLead() {
    if (!name || !phone) return;
    await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email: "chat@lead.local", phone, source: "chat_widget", message: "Chat widget lead" }),
    });
    setLeadSent(true);
    setMsgs((m) => [...m, { from: "bot", text: "Got it! A designer will call you shortly. Meanwhile, feel free to browse our portfolio." }]);
  }

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Open chat"
        className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-clay-600 text-clay-50 shadow-lg hover:bg-clay-700"
      >
        {open ? "×" : "💬"}
      </button>
      {open && (
        <div className="fixed bottom-24 right-5 z-50 flex h-[460px] w-[340px] flex-col overflow-hidden rounded-2xl border border-clay-200 bg-white shadow-2xl">
          <div className="bg-clay-600 px-4 py-3 text-clay-50">
            <div className="font-display text-lg">Chat with Ray</div>
            <div className="text-xs text-clay-100/80">Usually replies instantly</div>
          </div>
          <div className="flex-1 space-y-2 overflow-y-auto bg-clay-50/60 p-3 text-sm">
            {msgs.map((m, i) => (
              <div key={i} className={m.from === "bot" ? "text-ink-800" : "text-right"}>
                <span
                  className={
                    m.from === "bot"
                      ? "inline-block rounded-2xl rounded-tl-sm bg-white px-3 py-2 shadow-sm"
                      : "inline-block rounded-2xl rounded-tr-sm bg-clay-500 px-3 py-2 text-white"
                  }
                >
                  {m.text}
                </span>
              </div>
            ))}
            {leadMode && !leadSent && (
              <div className="mt-3 space-y-2 rounded-lg border border-clay-200 bg-white p-3">
                <input placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded border border-clay-200 px-2 py-1 text-sm" />
                <input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded border border-clay-200 px-2 py-1 text-sm" />
                <button onClick={submitLead} className="w-full rounded bg-clay-600 py-1.5 text-sm text-white hover:bg-clay-700">Request callback</button>
              </div>
            )}
          </div>
          <form
            onSubmit={(e) => { e.preventDefault(); send(); }}
            className="flex gap-2 border-t border-clay-200 p-2"
          >
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your question…" className="flex-1 rounded-full border border-clay-200 px-3 py-1.5 text-sm" />
            <button className="rounded-full bg-clay-600 px-4 text-sm text-white hover:bg-clay-700">Send</button>
          </form>
        </div>
      )}
    </>
  );
}
