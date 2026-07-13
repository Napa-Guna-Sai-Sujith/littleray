import Link from "next/link";
import { db } from "@/db";
import { projects, testimonials, cities, leads, products, blogPosts } from "@/db/schema";
import { desc, eq, count, avg, inArray } from "drizzle-orm";
import { getAllStatesWithCities } from "@/lib/geo";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { formatINR } from "@/lib/pricing";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [featured, latestReviews, geo, allCityRows, shopProducts, latestPosts] = await Promise.all([
    db.select().from(projects).where(eq(projects.featured, true)).limit(6),
    db.select().from(testimonials).orderBy(desc(testimonials.createdAt)).limit(6),
    getAllStatesWithCities(),
    db.select().from(cities),
    db.select().from(products).limit(8),
    db.select().from(blogPosts).where(eq(blogPosts.published, true)).orderBy(desc(blogPosts.createdAt)).limit(3),
  ]);

  const liveCityCount = geo.flatMap((s) => s.cities).filter((c) => c.status === "live").length;
  const cityMap = new Map(allCityRows.map((c) => [c.id, c.name]));

  const [projectCount] = await db.select({ n: count() }).from(projects);
  const [avgRatingRow] = await db.select({ a: avg(testimonials.rating) }).from(testimonials);
  const [reviewCount] = await db.select({ n: count() }).from(testimonials);
  const deliveredStatuses = ["delivered"];
  const [deliveredCount] = await db.select({ n: count() }).from(leads).where(inArray(leads.status, deliveredStatuses));
  const avgRating = avgRatingRow.a ? Number(avgRatingRow.a).toFixed(1) : "—";
  const comingSoonCount = geo.flatMap((s) => s.cities).filter((c) => c.status === "coming_soon").length;

  return (
    <>
      {/* WELCOME BANNER */}
      <section className="bg-gradient-to-br from-clay-100 via-clay-50 to-sage-100 grain">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-clay-300 bg-white/60 px-3 py-1 text-xs font-medium uppercase tracking-widest text-clay-700">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-sage-500" />
                Live in {liveCityCount} cities · {comingSoonCount} more launching
              </span>
              <h1 className="mt-4 font-display text-4xl leading-tight text-ink-900 md:text-5xl">
                Welcome back, {session.name.split(" ")[0]} 👋
              </h1>
              <p className="mt-3 max-w-lg text-ink-700">
                Explore our latest designs, get instant pricing, browse curated furnishings, and track your projects — all in one place.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/consultation" className="rounded-full bg-clay-600 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-clay-700 transition-colors">
                  Book free consultation
                </Link>
                <Link href="/calculator" className="rounded-full border border-clay-400 bg-white/50 px-6 py-3 text-sm font-medium text-clay-700 hover:bg-white transition-colors">
                  Get instant estimate →
                </Link>
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { l: "Projects completed", v: String(projectCount.n), sub: "and counting" },
                { l: "Avg. rating", v: `${avgRating}/5`, sub: `from ${reviewCount.n} reviews` },
                { l: "Homes delivered", v: String(deliveredCount.n > 0 ? deliveredCount.n : projectCount.n), sub: "across Telangana" },
                { l: "Cities", v: String(liveCityCount + comingSoonCount), sub: `${liveCityCount} live, ${comingSoonCount} launching` },
              ].map((s) => (
                <div key={s.l} className="rounded-2xl border border-clay-200 bg-white/80 p-5 backdrop-blur">
                  <div className="text-xs text-ink-500">{s.l}</div>
                  <div className="mt-1 font-display text-3xl text-ink-900">{s.v}</div>
                  <div className="mt-1 text-xs text-clay-500">{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* QUICK LINKS */}
      <section className="bg-white border-b border-clay-100">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
          <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
            {[
              { icon: "🎨", label: "Portfolio", href: "/portfolio" },
              { icon: "🧮", label: "Calculator", href: "/calculator" },
              { icon: "🛍️", label: "Shop", href: "/shop" },
              { icon: "📰", label: "Magazine", href: "/magazine" },
              { icon: "📍", label: "Cities", href: "/where-we-operate" },
              { icon: "☕", label: "Consultation", href: "/consultation" },
            ].map((s) => (
              <Link key={s.label} href={s.href} className="flex flex-col items-center gap-2 rounded-xl border border-clay-100 bg-clay-50/50 p-4 text-center transition hover:border-clay-300 hover:bg-white hover:shadow-sm">
                <span className="text-2xl">{s.icon}</span>
                <span className="text-xs font-medium text-ink-700">{s.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED DESIGNS */}
      <section className="bg-ink-900 text-clay-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-clay-300">Latest work</div>
              <h2 className="mt-2 font-display text-3xl md:text-4xl">Featured designs.</h2>
            </div>
            <Link href="/portfolio" className="hidden text-sm text-clay-200 hover:text-white md:inline">View all {projectCount.n} projects →</Link>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <Link key={p.id} href={`/portfolio/${p.slug}`} className="group overflow-hidden rounded-2xl bg-ink-700">
                <div className="overflow-hidden">
                  <div className="h-56 w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: `url(${p.coverImage})` }} role="img" aria-label={p.title} />
                </div>
                <div className="p-5">
                  <div className="text-xs uppercase tracking-widest text-clay-300">
                    {p.bhk} · {p.style} · {p.cityId ? cityMap.get(p.cityId) : ""}
                  </div>
                  <div className="mt-1 font-display text-lg group-hover:text-clay-200 transition-colors">{p.title}</div>
                  <p className="mt-1 text-sm text-clay-300/70 line-clamp-2">{p.description}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center md:hidden">
            <Link href="/portfolio" className="text-sm text-clay-200 hover:text-white">View all projects →</Link>
          </div>
        </div>
      </section>

      {/* SHOP PREVIEW */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-clay-600">Shop</div>
              <h2 className="mt-2 font-display text-3xl text-ink-900 md:text-4xl">Curated furnishings.</h2>
            </div>
            <Link href="/shop" className="hidden text-sm text-clay-600 hover:text-clay-700 md:inline">Browse all →</Link>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {shopProducts.map((p) => (
              <Link key={p.id} href={`/shop/${p.slug}`} className="group overflow-hidden rounded-2xl border border-clay-200 bg-white transition hover:shadow-md">
                <div className="overflow-hidden">
                  <div className="h-48 w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: `url(${p.image})` }} />
                </div>
                <div className="p-4">
                  <div className="text-xs uppercase tracking-widest text-clay-600">{p.category}</div>
                  <div className="mt-1 font-display text-sm text-ink-900">{p.name}</div>
                  <div className="mt-2 font-display text-base text-ink-900">{formatINR(Number(p.price))}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-clay-100/50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-clay-600">Reviews</div>
              <h2 className="mt-2 font-display text-3xl text-ink-900 md:text-4xl">What homeowners say.</h2>
              <p className="mt-1 text-sm text-ink-500">{avgRating}/5 across {reviewCount.n} verified reviews.</p>
            </div>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {latestReviews.slice(0, 3).map((t) => (
              <figure key={t.id} className="rounded-2xl border border-clay-200 bg-white p-6 shadow-sm">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={i < t.rating ? "text-amber-400" : "text-clay-200"}>★</span>
                  ))}
                </div>
                <blockquote className="mt-3 text-ink-800 leading-relaxed">&ldquo;{t.quote}&rdquo;</blockquote>
                <figcaption className="mt-4 flex items-center gap-2">
                  <div className="grid h-8 w-8 place-items-center rounded-full bg-clay-200 text-xs font-medium text-clay-700">
                    {t.customerName.split(" ").map(w => w[0]).slice(0, 2).join("")}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-ink-900">{t.customerName}</div>
                    <div className="text-xs text-ink-500">{t.cityId ? cityMap.get(t.cityId) : ""} · Verified</div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* MAGAZINE PREVIEW */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-clay-600">Magazine</div>
              <h2 className="mt-2 font-display text-3xl text-ink-900 md:text-4xl">Design ideas & guides.</h2>
            </div>
            <Link href="/magazine" className="hidden text-sm text-clay-600 hover:text-clay-700 md:inline">All articles →</Link>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {latestPosts.map((p) => (
              <Link key={p.id} href={`/magazine/${p.slug}`} className="group overflow-hidden rounded-2xl border border-clay-200 bg-white">
                <div className="overflow-hidden">
                  <div className="h-44 w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: `url(${p.coverImage})` }} />
                </div>
                <div className="p-4">
                  <div className="text-xs uppercase tracking-widest text-clay-600">{p.category}</div>
                  <div className="mt-1 font-display text-base text-ink-900">{p.title}</div>
                  <p className="mt-1 text-xs text-ink-500 line-clamp-2">{p.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* EXPANSION TEASER */}
      <section className="bg-gradient-to-r from-ink-900 to-ink-700 py-14 text-clay-50">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-4 text-center sm:px-6">
          <h2 className="max-w-2xl font-display text-3xl md:text-4xl">Coming to AP & Karnataka.</h2>
          <p className="max-w-xl text-clay-200/80">
            {comingSoonCount} more cities launching soon. Be first when we arrive in yours.
          </p>
          <Link href="/where-we-operate" className="rounded-full bg-clay-500 px-6 py-3 text-sm text-white hover:bg-clay-400 transition-colors">
            View roadmap & join waitlist
          </Link>
        </div>
      </section>
    </>
  );
}
