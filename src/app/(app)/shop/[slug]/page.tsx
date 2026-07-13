import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { formatINR } from "@/lib/pricing";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const [p] = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
  if (!p) return { title: "Product not found" };
  return { title: p.name, description: p.description ?? undefined, openGraph: { images: [p.image] } };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [product] = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
  if (!product) notFound();

  const related = await db.select().from(products).where(eq(products.category, product.category)).limit(4);
  const hasDiscount = product.originalPrice && Number(product.originalPrice) > Number(product.price);
  const discountPct = hasDiscount ? Math.round((1 - Number(product.price) / Number(product.originalPrice!)) * 100) : 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Link href="/shop" className="text-sm text-clay-600 hover:text-clay-700">← Back to shop</Link>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <div className="overflow-hidden rounded-2xl">
          <div className="h-[500px] w-full bg-cover bg-center rounded-2xl" style={{ backgroundImage: `url(${product.image})` }} role="img" aria-label={product.name} />
        </div>
        <div className="flex flex-col justify-center">
          <div className="text-xs uppercase tracking-widest text-clay-600">{product.category}</div>
          <h1 className="mt-2 font-display text-4xl text-ink-900">{product.name}</h1>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="font-display text-3xl text-ink-900">{formatINR(Number(product.price))}</span>
            {hasDiscount && (
              <>
                <span className="text-lg text-ink-400 line-through">{formatINR(Number(product.originalPrice!))}</span>
                <span className="rounded-full bg-sage-100 px-2 py-0.5 text-xs font-medium text-sage-700">{discountPct}% off</span>
              </>
            )}
          </div>

          <p className="mt-4 text-ink-700 leading-relaxed">{product.description}</p>

          <div className="mt-4 flex items-center gap-2 text-sm text-ink-500">
            {product.stock !== null && product.stock > 0 ? (
              <>
                <span className="h-2 w-2 rounded-full bg-sage-500" />
                <span>In stock ({product.stock} available)</span>
              </>
            ) : (
              <>
                <span className="h-2 w-2 rounded-full bg-red-400" />
                <span>Out of stock</span>
              </>
            )}
          </div>

          <div className="mt-6 space-y-3">
            <button className="w-full rounded-full bg-clay-600 py-3 text-sm font-medium text-white hover:bg-clay-700 transition-colors">
              Add to cart
            </button>
            <button className="w-full rounded-full border border-clay-300 py-3 text-sm text-ink-700 hover:bg-clay-50 transition-colors">
              Save to wishlist ♡
            </button>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3 text-center text-xs text-ink-500">
            <div className="rounded-lg bg-clay-50 p-3">
              <div className="font-medium text-ink-700">📦 Shipping</div>
              <div>3–5 business days within Telangana</div>
            </div>
            <div className="rounded-lg bg-clay-50 p-3">
              <div className="font-medium text-ink-700">↩️ Returns</div>
              <div>7-day easy returns</div>
            </div>
            <div className="rounded-lg bg-clay-50 p-3">
              <div className="font-medium text-ink-700">🛡️ Quality</div>
              <div>Handcrafted, quality checked</div>
            </div>
          </div>
        </div>
      </div>

      {related.filter(r => r.id !== product.id).length > 0 && (
        <div className="mt-16">
          <h2 className="font-display text-2xl text-ink-900">More in {product.category}</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.filter(r => r.id !== product.id).map((p) => (
              <Link key={p.id} href={`/shop/${p.slug}`} className="group overflow-hidden rounded-2xl border border-clay-200 bg-white">
                <div className="h-48 w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: `url(${p.image})` }} />
                <div className="p-4">
                  <div className="font-display text-base text-ink-900">{p.name}</div>
                  <div className="mt-1 font-display text-lg text-clay-700">{formatINR(Number(p.price))}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
