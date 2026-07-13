"use client";
import { useState } from "react";

export default function WaitlistForm({ citySlug, stateSlug }: { citySlug?: string; stateSlug?: string }) {
  const [f, setF] = useState({ name: "", email: "", phone: "" });
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    const res = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...f, citySlug, stateSlug }),
    });
    setState(res.ok ? "done" : "error");
  }

  if (state === "done") {
    return (
      <div className="rounded-lg bg-sage-100 p-4 text-sm text-sage-700">
        You&apos;re on the list — we&apos;ll be in touch the moment we launch.
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <input required placeholder="Full name" className="w-full rounded-lg border border-clay-200 px-3 py-2 text-sm" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
      <input required type="email" placeholder="Email" className="w-full rounded-lg border border-clay-200 px-3 py-2 text-sm" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
      <input required placeholder="Phone" className="w-full rounded-lg border border-clay-200 px-3 py-2 text-sm" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} />
      <button disabled={state === "loading"} className="w-full rounded-full bg-clay-600 py-2.5 text-sm font-medium text-white hover:bg-clay-700 disabled:opacity-60">
        {state === "loading" ? "Submitting…" : "Notify me at launch"}
      </button>
      {state === "error" && <div className="text-xs text-red-600">Something went wrong.</div>}
    </form>
  );
}
