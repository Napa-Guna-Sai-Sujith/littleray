import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/db";
import { products } from "@/db/schema";
import { formatINR } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Shop furnishings & decor",
  description: "Hand-picked furnishings and decor curated by the Little Ray Interio design team. Ships across Telangana in 3–5 days.",
};

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ cat?: string }> }) {
  const params = await searchParams;
  const all = await db.select().from(products);
  const cats = Array.from(new Set(all.map((p) => p.category))).sort();
  const filtered = params.cat ? all.filter((p) => p.category === params.cat) : all;

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <div className="max-w-2xl">
        <div className="text-xs uppercase tracking-[0.2em] text-clay-600">Shop</div>
        <h1 className="mt-2 font-display text-5xl text-ink-900">Furnishings & decor.</h1>
        <p className="mt-3 text-ink-700">A hand-picked selection curated by our design team. Everything here we&apos;ve used in real client homes.</p>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="no-scrollbar flex flex-wrap gap-2 text-sm">
          <Link href="/shop" className={`rounded-full border px-3 py-1.5 transition ${!params.cat ? "bg-clay-600 text-white border-clay-600" : "border-clay-300 text-ink-700 hover:border-clay-500 hover:bg-clay-50"}`}>All ({all.length})</Link>
          {cats.map((c) => {
            const n = all.filter((p) => p.category === c).length;
            return (
              <Link key={c} href={`/shop?cat=${encodeURIComponent(c)}`} className={`rounded-full border px-3 py-1.5 transition ${params.cat === c ? "bg-clay-600 text-white border-clay-600" : "border-clay-300 text-ink-700 hover:border-clay-500 hover:bg-clay-50"}`}>{c} ({n})</Link>
            );
          })}
        </div>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {filtered.map((p) => {
          const hasDiscount = p.originalPrice && Number(p.originalPrice) > Number(p.price);
          const discountPct = hasDiscount ? Math.round((1 - Number(p.price) / Number(p.originalPrice!)) * 100) : 0;
          return (
            <Link key={p.id} href={`/shop/${p.slug}`} className="group overflow-hidden rounded-2xl border border-clay-200 bg-white transition hover:shadow-md">
              <div className="relative overflow-hidden">
                <div className="h-56 w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: `url(${p.image})` }} role="img" aria-label={p.name} />
                {hasDiscount && (
                  <span className="absolute right-3 top-3 rounded-full bg-clay-600 px-2 py-0.5 text-xs font-medium text-white">
                    {discountPct}% off
                  </span>
                )}
                {p.stock !== null && p.stock < 15 && (
                  <span className="absolute left-3 top-3 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                    Only {p.stock} left
                  </span>
                )}
              </div>
              <div className="p-4">
                <div className="text-xs uppercase tracking-widest text-clay-600">{p.category}</div>
                <div className="mt-1 font-display text-base text-ink-900 group-hover:text-clay-700 transition-colors">{p.name}</div>
                <p className="mt-1 text-xs text-ink-500 line-clamp-2">{p.description}</p>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="font-display text-lg text-ink-900">{formatINR(Number(p.price))}</span>
                  {hasDiscount && <span className="text-xs text-ink-400 line-through">{formatINR(Number(p.originalPrice!))}</span>}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-12 rounded-2xl bg-clay-100 p-8 text-center">
        <div className="font-display text-2xl text-ink-900">Need bulk furnishing for your new home?</div>
        <p className="mt-2 text-ink-700">Our design team can curate a complete furnishing package for your home at project pricing.</p>
        <Link href="/consultation" className="mt-4 inline-block rounded-full bg-clay-600 px-6 py-2.5 text-sm text-white hover:bg-clay-700 transition-colors">
          Talk to a designer →
        </Link>
      </div>
    </div>
  );
}
