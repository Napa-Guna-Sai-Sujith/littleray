"use client";
import Link from "next/link";
import { useState } from "react";
import type { StateWithCities } from "@/lib/geo";

export default function CitiesDropdown({ states }: { states: StateWithCities[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        className="hover:text-clay-600 flex items-center gap-1"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
      >
        Cities
        <svg width="10" height="10" viewBox="0 0 12 12" aria-hidden="true">
          <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>
      {open && (
        <div className="absolute left-1/2 top-full z-50 mt-2 w-[560px] -translate-x-1/2 rounded-xl border border-clay-200 bg-white p-5 shadow-xl">
          <div className="grid grid-cols-3 gap-5">
            {states.map((s) => (
              <div key={s.id}>
                <div className="mb-2 flex items-center gap-2">
                  <div className="font-display text-sm text-ink-900">{s.name}</div>
                  <span
                    className={
                      s.status === "live"
                        ? "rounded-full bg-sage-100 px-2 py-0.5 text-[10px] font-medium text-sage-700"
                        : "rounded-full bg-clay-100 px-2 py-0.5 text-[10px] font-medium text-clay-700"
                    }
                  >
                    {s.status === "live" ? "Live" : "Coming soon"}
                  </span>
                </div>
                <ul className="space-y-1 text-sm">
                  {s.cities.map((c) => (
                    <li key={c.id}>
                      {c.status === "live" ? (
                        <Link
                          className="text-ink-700 hover:text-clay-600"
                          href={`/cities/${c.slug}`}
                        >
                          {c.name}
                        </Link>
                      ) : (
                        <Link
                          className="text-ink-500 hover:text-clay-600"
                          href={`/cities/${c.slug}`}
                        >
                          {c.name}
                          <span className="ml-1 text-[10px] uppercase tracking-wide text-clay-500">
                            waitlist
                          </span>
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-clay-100 pt-3 text-right">
            <Link
              href="/where-we-operate"
              className="text-xs font-medium text-clay-600 hover:text-clay-700"
            >
              View expansion roadmap →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
