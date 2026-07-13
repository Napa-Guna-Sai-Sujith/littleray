"use client";
import Link from "next/link";
import { useState } from "react";

type Project = { id: number; slug: string; title: string; coverImage: string; style: string; bhk: string };

export default function StyleQuiz() {
  const [palette, setPalette] = useState("warm-neutral");
  const [roomType, setRoomType] = useState("full_home");
  const [budgetTier, setBudgetTier] = useState("premium");
  const [results, setResults] = useState<Project[] | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    const res = await fetch("/api/style-quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ palette, roomType, budgetTier }),
    });
    const data = await res.json();
    setLoading(false);
    setResults(data.recommendations);
  }

  const options = {
    palette: [
      { v: "warm-neutral", l: "Warm neutral" },
      { v: "bold-jewel", l: "Bold jewel tones" },
      { v: "cool-monochrome", l: "Cool monochrome" },
      { v: "earthy-natural", l: "Earthy natural" },
    ],
    roomType: [
      { v: "full_home", l: "Full home" },
      { v: "living_room", l: "Living room" },
      { v: "bedroom", l: "Bedroom" },
      { v: "kitchen", l: "Kitchen" },
    ],
    budgetTier: [
      { v: "budget", l: "Budget" },
      { v: "premium", l: "Premium" },
      { v: "luxury", l: "Luxury" },
    ],
  };

  return (
    <div className="rounded-2xl border border-clay-200 bg-white p-6">
      <div className="grid gap-6 md:grid-cols-3">
        {[
          { label: "Color palette", value: palette, set: setPalette, opts: options.palette },
          { label: "What are you designing?", value: roomType, set: setRoomType, opts: options.roomType },
          { label: "Budget tier", value: budgetTier, set: setBudgetTier, opts: options.budgetTier },
        ].map((q) => (
          <div key={q.label}>
            <div className="text-sm text-ink-500">{q.label}</div>
            <div className="mt-2 space-y-2">
              {q.opts.map((o) => (
                <button key={o.v} onClick={() => q.set(o.v)} className={`w-full rounded-lg border px-3 py-2 text-left text-sm ${q.value === o.v ? "border-clay-600 bg-clay-50" : "border-clay-200 hover:border-clay-400"}`}>
                  {o.l}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button onClick={submit} disabled={loading} className="mt-6 rounded-full bg-clay-600 px-6 py-2.5 text-sm text-white hover:bg-clay-700 disabled:opacity-60">
        {loading ? "Matching…" : "Show me matching designs"}
      </button>

      {results && (
        <div className="mt-8">
          <div className="text-sm text-ink-500">Top matches for you:</div>
          <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.length === 0 && <p className="text-ink-500">No perfect matches yet — try adjusting your preferences.</p>}
            {results.map((p) => (
              <Link key={p.id} href={`/portfolio/${p.slug}`} className="group overflow-hidden rounded-xl border border-clay-200">
                <div className="h-40 w-full bg-cover bg-center transition group-hover:scale-105" style={{ backgroundImage: `url(${p.coverImage})` }} />
                <div className="p-3">
                  <div className="text-xs uppercase text-clay-600">{p.style} · {p.bhk}</div>
                  <div className="font-display text-sm text-ink-900">{p.title}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
