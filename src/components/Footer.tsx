import Link from "next/link";
import { SITE } from "@/lib/site";
import { db } from "@/db";
import { cities, testimonials, projects } from "@/db/schema";
import { count, avg, eq } from "drizzle-orm";

export default async function Footer() {
  const [liveCities] = await db.select({ n: count() }).from(cities).where(eq(cities.status, "live"));
  const [projectCount] = await db.select({ n: count() }).from(projects);
  const [avgRatingRow] = await db.select({ a: avg(testimonials.rating) }).from(testimonials);
  const avgRating = avgRatingRow.a ? Number(avgRatingRow.a).toFixed(1) : "—";

  return (
    <footer className="mt-24 border-t border-clay-200 bg-ink-900 text-clay-100">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div>
          <div className="font-display text-2xl text-clay-50">{SITE.name}</div>
          <p className="mt-2 max-w-xs text-sm text-clay-200/80">{SITE.tagline}</p>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded-lg bg-white/5 p-2">
              <div className="font-display text-lg text-clay-50">{projectCount.n}</div>
              <div className="text-clay-300/60">Projects</div>
            </div>
            <div className="rounded-lg bg-white/5 p-2">
              <div className="font-display text-lg text-clay-50">{avgRating}</div>
              <div className="text-clay-300/60">Avg. rating</div>
            </div>
            <div className="rounded-lg bg-white/5 p-2">
              <div className="font-display text-lg text-clay-50">{liveCities.n}</div>
              <div className="text-clay-300/60">Live cities</div>
            </div>
          </div>
        </div>
        <div>
          <div className="mb-3 text-xs uppercase tracking-widest text-clay-300/70">
            Explore
          </div>
          <ul className="space-y-2 text-sm">
            <li><Link href="/portfolio" className="hover:text-white transition-colors">Portfolio</Link></li>
            <li><Link href="/services" className="hover:text-white transition-colors">Services</Link></li>
            <li><Link href="/calculator" className="hover:text-white transition-colors">Price calculator</Link></li>
            <li><Link href="/magazine" className="hover:text-white transition-colors">Magazine</Link></li>
            <li><Link href="/shop" className="hover:text-white transition-colors">Shop furnishings</Link></li>
          </ul>
        </div>
        <div>
          <div className="mb-3 text-xs uppercase tracking-widest text-clay-300/70">
            Company
          </div>
          <ul className="space-y-2 text-sm">
            <li><Link href="/where-we-operate" className="hover:text-white transition-colors">Where we operate</Link></li>
            <li><Link href="/about" className="hover:text-white transition-colors">About us</Link></li>
            <li><Link href="/consultation" className="hover:text-white transition-colors">Book consultation</Link></li>
            <li><Link href="/login" className="hover:text-white transition-colors">Customer login</Link></li>
          </ul>
        </div>
        <div>
          <div className="mb-3 text-xs uppercase tracking-widest text-clay-300/70">
            Contact
          </div>
          <ul className="space-y-2 text-sm text-clay-200/80">
            <li className="flex items-center gap-2">📞 {SITE.phone}</li>
            <li className="flex items-center gap-2">✉️ {SITE.email}</li>
            <li className="flex items-center gap-2">📍 Head office · Hyderabad, Telangana</li>
          </ul>
          <div className="mt-4 text-xs text-clay-300/60">
            Currently live in {liveCities.n} Telangana cities.
            <br />AP & Karnataka launching soon.
          </div>
        </div>
      </div>
      <div className="border-t border-clay-800/40">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-2 px-4 py-4 text-xs text-clay-300/60 sm:flex-row sm:px-6">
          <span>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</span>
          <span>Crafted with care in South India.</span>
        </div>
      </div>
    </footer>
  );
}
