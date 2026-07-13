"use client";
import { useState } from "react";

export default function LeadForm({ citySlug, compact = false }: { citySlug?: string; compact?: boolean }) {
  const [f, setF] = useState({ name: "", email: "", phone: "", bhk: "2BHK", message: "" });
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...f, citySlug, source: "lead_form" }),
    });
    setState(res.ok ? "done" : "error");
  }

  if (state === "done") {
    return (
      <div className="rounded-lg bg-sage-100 p-4 text-sm text-sage-700">
        Thank you! Our team will call within 24 hours.
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <input required placeholder="Full name" className="w-full rounded-lg border border-clay-200 px-3 py-2 text-sm" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
      <div className="grid grid-cols-2 gap-3">
        <input required type="email" placeholder="Email" className="rounded-lg border border-clay-200 px-3 py-2 text-sm" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
        <input required placeholder="Phone" className="rounded-lg border border-clay-200 px-3 py-2 text-sm" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} />
      </div>
      <select className="w-full rounded-lg border border-clay-200 px-3 py-2 text-sm" value={f.bhk} onChange={(e) => setF({ ...f, bhk: e.target.value })}>
        <option>1BHK</option><option>2BHK</option><option>3BHK</option><option>4BHK</option><option>Villa</option>
      </select>
      {!compact && (
        <textarea placeholder="Anything specific you'd like to share?" rows={2} className="w-full rounded-lg border border-clay-200 px-3 py-2 text-sm" value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} />
      )}
      <button disabled={state === "loading"} className="w-full rounded-full bg-clay-600 py-2.5 text-sm font-medium text-white hover:bg-clay-700 disabled:opacity-60">
        {state === "loading" ? "Sending…" : "Request callback"}
      </button>
      {state === "error" && <div className="text-xs text-red-600">Something went wrong. Please try again.</div>}
    </form>
  );
}
