import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/db";
import { projects, cities } from "@/db/schema";
import { desc } from "drizzle-orm";

export const metadata: Metadata = {
  title: "Portfolio — homes we've designed",
  description: "Browse our recent interior design projects across Telangana.",
};

export default async function PortfolioPage({ searchParams }: { searchParams: Promise<{ style?: string; bhk?: string }> }) {
  const params = await searchParams;
  const allProjects = await db.select().from(projects).orderBy(desc(projects.createdAt));
  const allCities = await db.select().from(cities);
  const cityMap = new Map(allCities.map((c) => [c.id, c.name]));

  const filtered = allProjects.filter((p) => {
    if (params.style && p.style !== params.style) return false;
    if (params.bhk && p.bhk !== params.bhk) return false;
    return true;
  });

  const styles = Array.from(new Set(allProjects.map((p) => p.style).filter(Boolean))) as string[];
  const bhks = ["1BHK", "2BHK", "3BHK", "4BHK", "Villa"];

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <div className="max-w-2xl">
        <div className="text-xs uppercase tracking-[0.2em] text-clay-600">Portfolio</div>
        <h1 className="mt-2 font-display text-5xl text-ink-900">Homes we&apos;ve designed.</h1>
        <p className="mt-3 text-lg text-ink-700">Each project is fully executed by our in-house team. Real photos, real budgets.</p>
      </div>

      <div className="mt-8 flex flex-wrap gap-2 text-sm">
        <Link href="/portfolio" className={`rounded-full border px-3 py-1 ${!params.style && !params.bhk ? "bg-clay-600 text-white border-clay-600" : "border-clay-300 text-ink-700"}`}>All</Link>
        {styles.map((s) => (
          <Link key={s} href={`/portfolio?style=${encodeURIComponent(s)}`} className={`rounded-full border px-3 py-1 ${params.style === s ? "bg-clay-600 text-white border-clay-600" : "border-clay-300 text-ink-700 hover:border-clay-500"}`}>{s}</Link>
        ))}
        <span className="mx-2 text-clay-300">·</span>
        {bhks.map((b) => (
          <Link key={b} href={`/portfolio?bhk=${b}`} className={`rounded-full border px-3 py-1 ${params.bhk === b ? "bg-clay-600 text-white border-clay-600" : "border-clay-300 text-ink-700 hover:border-clay-500"}`}>{b}</Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <Link key={p.id} href={`/portfolio/${p.slug}`} className="group overflow-hidden rounded-2xl border border-clay-200 bg-white">
            <div className="h-60 w-full bg-cover bg-center transition group-hover:scale-105" style={{ backgroundImage: `url(${p.coverImage})` }} />
            <div className="p-4">
              <div className="text-xs uppercase tracking-widest text-clay-600">
                {p.bhk} · {p.style} · {p.cityId ? cityMap.get(p.cityId) : ""}
              </div>
              <div className="mt-1 font-display text-lg text-ink-900">{p.title}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
