"use client";
import { useEffect, useMemo, useState } from "react";
import { ROOM_LABELS, ADDON_LABELS, formatINR, type BhkOption, type Tier, type Room, type Addon } from "@/lib/pricing";

type CityOpt = { slug: string; name: string; stateName: string };

export default function Calculator({ cities }: { cities: CityOpt[] }) {
  const [step, setStep] = useState(0);
  const [bhk, setBhk] = useState<BhkOption>("2BHK");
  const [tier, setTier] = useState<Tier>("premium");
  const [rooms, setRooms] = useState<Room[]>(["living_room", "master_bedroom", "kitchen"]);
  const [addons, setAddons] = useState<Addon[]>(["false_ceiling", "modular_wardrobe"]);
  const [citySlug, setCitySlug] = useState(cities[0]?.slug ?? "");
  const [result, setResult] = useState<{ total: number; breakdown: Record<string, number> } | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedId, setSavedId] = useState<number | null>(null);

  const payload = useMemo(() => ({ bhk, tier, rooms, addons, citySlug }), [bhk, tier, rooms, addons, citySlug]);

  useEffect(() => {
    const t = setTimeout(async () => {
      const res = await fetch("/api/calculator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) setResult(await res.json());
    }, 200);
    return () => clearTimeout(t);
  }, [payload]);

  function toggle<T>(arr: T[], v: T): T[] {
    return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
  }

  async function saveQuote() {
    setSaving(true);
    const res = await fetch("/api/calculator", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, save: true }),
    });
    setSaving(false);
    if (res.ok) {
      const data = await res.json();
      setSavedId(data.quoteId);
    }
  }

  function downloadPDF() {
    if (!result) return;
    const w = window.open("", "_blank", "width=800,height=1000");
    if (!w) return;
    w.document.write(`
      <html><head><title>Little Ray Interio — Quote</title>
      <style>
        body{font-family: Georgia, serif; padding:40px; color:#1a1712;}
        h1{color:#6e4d27; margin:0 0 4px;}
        .muted{color:#6b6355; font-size:12px;}
        table{width:100%; border-collapse:collapse; margin-top:20px;}
        th,td{border-bottom:1px solid #e7d7c0; padding:10px; text-align:left;}
        .total{font-size:22px; color:#6e4d27; font-weight:600;}
      </style></head><body>
      <h1>Little Ray Interio</h1>
      <div class="muted">Estimate generated ${new Date().toLocaleDateString()}</div>
      <h2>${bhk} · ${tier.toUpperCase()} tier · ${cities.find(c=>c.slug===citySlug)?.name ?? ""}</h2>
      <p><b>Rooms:</b> ${rooms.map(r => ROOM_LABELS[r]).join(", ")}</p>
      <p><b>Add-ons:</b> ${addons.map(a => ADDON_LABELS[a]).join(", ") || "—"}</p>
      <table>
        <thead><tr><th>Line item</th><th style="text-align:right">Amount</th></tr></thead>
        <tbody>
          ${Object.entries(result.breakdown).map(([k, v]) => `<tr><td>${k}</td><td style="text-align:right">${formatINR(v)}</td></tr>`).join("")}
        </tbody>
      </table>
      <p class="total" style="margin-top:20px">Total estimate: ${formatINR(result.total)}</p>
      <p class="muted">This is an indicative estimate. Final quote requires a design consultation.</p>
      </body></html>`);
    w.document.close();
    w.print();
  }

  const stepTitle = ["Home size", "Rooms", "Material tier & city", "Add-ons"][step];

  return (
    <div className="grid gap-8 md:grid-cols-[1fr_360px]">
      <div className="rounded-2xl border border-clay-200 bg-white p-6 md:p-8">
        <div className="mb-6 flex items-center gap-2">
          {["Size", "Rooms", "Tier", "Add-ons"].map((s, i) => (
            <button
              key={s}
              onClick={() => setStep(i)}
              className={`rounded-full px-3 py-1 text-xs font-medium ${step === i ? "bg-clay-600 text-white" : "bg-clay-100 text-clay-700 hover:bg-clay-200"}`}
            >
              {i + 1}. {s}
            </button>
          ))}
        </div>
        <h2 className="font-display text-3xl text-ink-900">{stepTitle}</h2>

        {step === 0 && (
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-5">
            {(["1BHK", "2BHK", "3BHK", "4BHK", "Villa"] as BhkOption[]).map((b) => (
              <button key={b} onClick={() => setBhk(b)} className={`rounded-xl border p-4 text-center ${bhk === b ? "border-clay-600 bg-clay-50" : "border-clay-200 hover:border-clay-400"}`}>
                <div className="font-display text-xl">{b}</div>
              </button>
            ))}
          </div>
        )}

        {step === 1 && (
          <div className="mt-6 grid gap-2 md:grid-cols-2">
            {(Object.keys(ROOM_LABELS) as Room[]).map((r) => (
              <label key={r} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 ${rooms.includes(r) ? "border-clay-600 bg-clay-50" : "border-clay-200"}`}>
                <input type="checkbox" checked={rooms.includes(r)} onChange={() => setRooms(toggle(rooms, r))} className="h-4 w-4 accent-clay-600" />
                <span className="font-medium">{ROOM_LABELS[r]}</span>
              </label>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="mt-6 space-y-6">
            <div>
              <div className="mb-2 text-sm text-ink-500">Material tier</div>
              <div className="grid grid-cols-3 gap-3">
                {(["budget", "premium", "luxury"] as Tier[]).map((t) => (
                  <button key={t} onClick={() => setTier(t)} className={`rounded-xl border p-4 text-left ${tier === t ? "border-clay-600 bg-clay-50" : "border-clay-200"}`}>
                    <div className="font-display text-lg capitalize">{t}</div>
                    <div className="text-xs text-ink-500 mt-1">
                      {t === "budget" ? "Laminate finishes, everyday hardware" : t === "premium" ? "Acrylic + veneer, soft-close everywhere" : "Solid wood accents, imported hardware"}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="mb-2 text-sm text-ink-500">City (adjusts regional pricing)</div>
              <select value={citySlug} onChange={(e) => setCitySlug(e.target.value)} className="w-full rounded-lg border border-clay-200 px-3 py-2 text-sm">
                {cities.map((c) => (
                  <option key={c.slug} value={c.slug}>{c.name} · {c.stateName}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="mt-6 grid gap-2 md:grid-cols-2">
            {(Object.keys(ADDON_LABELS) as Addon[]).map((a) => (
              <label key={a} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 ${addons.includes(a) ? "border-clay-600 bg-clay-50" : "border-clay-200"}`}>
                <input type="checkbox" checked={addons.includes(a)} onChange={() => setAddons(toggle(addons, a))} className="h-4 w-4 accent-clay-600" />
                <span className="font-medium">{ADDON_LABELS[a]}</span>
              </label>
            ))}
          </div>
        )}

        <div className="mt-8 flex justify-between">
          <button disabled={step === 0} onClick={() => setStep(step - 1)} className="rounded-full border border-clay-300 px-5 py-2 text-sm text-ink-700 disabled:opacity-40">← Back</button>
          <button disabled={step === 3} onClick={() => setStep(step + 1)} className="rounded-full bg-clay-600 px-5 py-2 text-sm text-white disabled:opacity-40">Continue →</button>
        </div>
      </div>

      <aside className="md:sticky md:top-24 h-fit rounded-2xl bg-ink-900 p-6 text-clay-50">
        <div className="text-xs uppercase tracking-widest text-clay-300">Live estimate</div>
        <div className="mt-2 font-display text-4xl">
          {result ? formatINR(result.total) : "—"}
        </div>
        <div className="mt-4 space-y-2 text-sm">
          {result && Object.entries(result.breakdown).map(([k, v]) => (
            <div key={k} className="flex justify-between border-b border-white/10 pb-1">
              <span className="text-clay-200">{k}</span>
              <span>{formatINR(v)}</span>
            </div>
          ))}
        </div>
        <button onClick={saveQuote} disabled={saving} className="mt-5 w-full rounded-full bg-clay-500 py-2.5 text-sm font-medium text-white hover:bg-clay-400 disabled:opacity-50">
          {savedId ? "Saved ✓" : saving ? "Saving…" : "Save this quote"}
        </button>
        <button onClick={downloadPDF} className="mt-2 w-full rounded-full border border-clay-300/40 py-2.5 text-sm text-clay-100 hover:bg-white/10">
          Download PDF
        </button>
        <p className="mt-3 text-[11px] text-clay-300/70">Indicative estimate. Log in to save quotes to your account.</p>
      </aside>
    </div>
  );
}
