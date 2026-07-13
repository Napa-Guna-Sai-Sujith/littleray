import type { Metadata } from "next";
import Link from "next/link";
import { getAllStatesWithCities } from "@/lib/geo";
import WaitlistForm from "@/components/WaitlistForm";

export const metadata: Metadata = {
  title: "Where we operate — expansion roadmap",
  description: "Little Ray Interio is live across Telangana and expanding to Andhra Pradesh and Karnataka.",
};

export default async function WhereWeOperatePage() {
  const states = await getAllStatesWithCities();

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="max-w-2xl">
        <div className="text-xs uppercase tracking-[0.2em] text-clay-600">Expansion roadmap</div>
        <h1 className="mt-2 font-display text-5xl text-ink-900">
          Where we design homes today — and tomorrow.
        </h1>
        <p className="mt-3 text-lg text-ink-700">
          We started in Telangana. We&apos;re growing carefully — one city at a time — so quality never dips.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {states.map((s) => {
          const live = s.status === "live";
          return (
            <div key={s.id} className={`rounded-3xl border p-6 ${live ? "border-sage-500 bg-sage-100" : "border-clay-200 bg-white"}`}>
              <div className="flex items-center justify-between">
                <div className="font-display text-3xl text-ink-900">{s.name}</div>
                <span className={`rounded-full px-3 py-1 text-xs font-medium uppercase tracking-widest ${live ? "bg-sage-500 text-white" : "bg-clay-500 text-white"}`}>
                  {live ? "Live now" : `Launching ${s.launchQuarter}`}
                </span>
              </div>
              <p className="mt-2 text-sm text-ink-700">{s.tagline}</p>
              <ul className="mt-4 grid grid-cols-2 gap-2 text-sm">
                {s.cities.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/cities/${c.slug}`}
                      className={`flex items-center gap-2 rounded-lg border px-3 py-2 transition ${
                        c.status === "live"
                          ? "border-sage-500/40 bg-white hover:bg-sage-50 text-ink-900"
                          : "border-clay-200 bg-clay-50/50 hover:bg-white text-ink-700"
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${c.status === "live" ? "bg-sage-500" : "bg-clay-400"}`} />
                      {c.name}
                      {c.status !== "live" && <span className="ml-auto text-[10px] uppercase text-clay-500">waitlist</span>}
                    </Link>
                  </li>
                ))}
              </ul>
              {!live && (
                <div className="mt-5 rounded-xl border border-clay-200 bg-white p-4">
                  <div className="font-display text-lg text-ink-900">Join the {s.name} waitlist</div>
                  <p className="mt-1 text-xs text-ink-500">Get early-bird pricing and priority scheduling.</p>
                  <div className="mt-3">
                    <WaitlistForm stateSlug={s.slug} />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-16 rounded-3xl bg-ink-900 p-8 text-clay-50 md:p-12">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-clay-300">Why the phased rollout?</div>
            <h2 className="mt-2 font-display text-3xl">
              Slow growth is how great craft survives scale.
            </h2>
          </div>
          <p className="text-clay-100/90">
            Every new city needs a trained studio, a vetted factory network, and a dedicated senior designer before we launch. We&apos;d rather delay a few months than compromise on a single home.
          </p>
        </div>
      </div>
    </div>
  );
}
