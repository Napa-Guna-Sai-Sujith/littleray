"use client";
import { useMemo, useState } from "react";

type C = { slug: string; name: string; stateName: string; status: string };

function nextBusinessSlots(days = 5): string[] {
  const out: string[] = [];
  const now = new Date();
  for (let d = 1; d <= days; d++) {
    const day = new Date(now);
    day.setDate(now.getDate() + d);
    for (const hr of [10, 12, 15, 17]) {
      const t = new Date(day);
      t.setHours(hr, 0, 0, 0);
      out.push(t.toISOString());
    }
  }
  return out;
}

export default function ConsultationForm({ cities }: { cities: C[] }) {
  const [f, setF] = useState({ name: "", email: "", phone: "", citySlug: cities[0]?.slug ?? "", bhk: "2BHK", mode: "in_person" });
  const [slot, setSlot] = useState<string>("");
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const slots = useMemo(() => nextBusinessSlots(5), []);
  const city = cities.find((c) => c.slug === f.citySlug);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...f,
        source: "consultation_form",
        message: `Requested slot: ${slot} · Mode: ${f.mode}`,
      }),
    });
    setState("done");
  }

  if (state === "done") {
    return (
      <div className="rounded-2xl border border-sage-500 bg-sage-100 p-8 text-center">
        <div className="font-display text-3xl text-ink-900">You&apos;re booked! 🎉</div>
        <p className="mt-2 text-ink-700">A designer will confirm your slot via SMS within an hour.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-clay-200 bg-white p-6 shadow-sm">
      <div className="grid grid-cols-2 gap-3">
        <input required placeholder="Full name" className="col-span-2 rounded-lg border border-clay-200 px-3 py-2 text-sm" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
        <input required type="email" placeholder="Email" className="rounded-lg border border-clay-200 px-3 py-2 text-sm" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
        <input required placeholder="Phone" className="rounded-lg border border-clay-200 px-3 py-2 text-sm" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} />
        <select className="rounded-lg border border-clay-200 px-3 py-2 text-sm" value={f.citySlug} onChange={(e) => setF({ ...f, citySlug: e.target.value })}>
          {cities.map((c) => <option key={c.slug} value={c.slug}>{c.name}, {c.stateName}</option>)}
        </select>
        <select className="rounded-lg border border-clay-200 px-3 py-2 text-sm" value={f.bhk} onChange={(e) => setF({ ...f, bhk: e.target.value })}>
          <option>1BHK</option><option>2BHK</option><option>3BHK</option><option>4BHK</option><option>Villa</option>
        </select>
      </div>

      {city?.status === "coming_soon" && (
        <p className="mt-3 rounded-lg bg-clay-100 p-3 text-xs text-clay-700">
          {city.name} isn&apos;t live yet — we&apos;ll add you to the waitlist and reach out when we open.
        </p>
      )}

      <div className="mt-4">
        <div className="text-sm text-ink-700">Meeting mode</div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {["in_person", "video"].map((m) => (
            <button type="button" key={m} onClick={() => setF({ ...f, mode: m })} className={`rounded-lg border px-3 py-2 text-sm ${f.mode === m ? "border-clay-600 bg-clay-50" : "border-clay-200"}`}>
              {m === "in_person" ? "In-home visit" : "Video call"}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <div className="text-sm text-ink-700">Preferred slot</div>
        <div className="mt-2 grid max-h-40 grid-cols-2 gap-2 overflow-y-auto">
          {slots.map((s) => (
            <button type="button" key={s} onClick={() => setSlot(s)} className={`rounded-lg border px-2 py-1.5 text-xs ${slot === s ? "border-clay-600 bg-clay-50" : "border-clay-200 hover:border-clay-400"}`}>
              {new Date(s).toLocaleString("en-IN", { weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })}
            </button>
          ))}
        </div>
      </div>

      <button disabled={state === "loading" || !slot} className="mt-5 w-full rounded-full bg-clay-600 py-2.5 text-sm font-medium text-white hover:bg-clay-700 disabled:opacity-60">
        {state === "loading" ? "Booking…" : "Confirm consultation"}
      </button>
    </form>
  );
}
