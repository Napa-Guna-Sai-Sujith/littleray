"use client";
import { useState } from "react";

type Lead = {
  id: number;
  name: string;
  phone: string;
  email: string;
  status: string;
  bhk: string | null;
  budget: string | null;
  cityName: string | null;
  createdAt: string;
};

const STAGES = [
  { k: "new", l: "New" },
  { k: "contacted", l: "Contacted" },
  { k: "site_visit", l: "Site visit" },
  { k: "quoted", l: "Quoted" },
  { k: "booked", l: "Booked" },
  { k: "in_progress", l: "In progress" },
  { k: "delivered", l: "Delivered" },
] as const;

export default function LeadKanban({ initialLeads }: { initialLeads: Lead[] }) {
  const [leads, setLeads] = useState(initialLeads);

  async function move(id: number, status: string) {
    setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, status } : l)));
    await fetch("/api/admin/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
  }

  return (
    <div className="no-scrollbar grid grid-flow-col auto-cols-[280px] gap-3 overflow-x-auto pb-4">
      {STAGES.map((s) => {
        const items = leads.filter((l) => l.status === s.k);
        return (
          <div key={s.k} className="flex flex-col rounded-2xl bg-clay-100/70 p-3">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-display text-lg text-ink-900">{s.l}</span>
              <span className="rounded-full bg-white px-2 py-0.5 text-xs">{items.length}</span>
            </div>
            <div className="space-y-2">
              {items.map((l) => (
                <div key={l.id} className="rounded-xl bg-white p-3 shadow-sm">
                  <div className="font-medium text-ink-900">{l.name}</div>
                  <div className="text-xs text-ink-500">{l.cityName ?? "—"} · {l.bhk ?? "—"}</div>
                  <div className="mt-1 text-xs text-ink-600">{l.phone}</div>
                  <select
                    value={l.status}
                    onChange={(e) => move(l.id, e.target.value)}
                    className="mt-2 w-full rounded border border-clay-200 bg-clay-50 px-2 py-1 text-xs"
                  >
                    {STAGES.map((st) => <option key={st.k} value={st.k}>{st.l}</option>)}
                    <option value="lost">Lost</option>
                  </select>
                </div>
              ))}
              {items.length === 0 && <div className="rounded-xl border border-dashed border-clay-200 p-4 text-center text-xs text-ink-500">Empty</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
