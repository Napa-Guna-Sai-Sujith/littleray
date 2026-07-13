import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/db";
import { projects, testimonials, leads, cities, states } from "@/db/schema";
import { count, avg, eq } from "drizzle-orm";

export const metadata: Metadata = { title: "About Little Ray Interio" };

export default async function AboutPage() {
  // Real-time stats from DB
  const [projectCount] = await db.select({ n: count() }).from(projects);
  const [reviewCount] = await db.select({ n: count() }).from(testimonials);
  const [avgRatingRow] = await db.select({ a: avg(testimonials.rating) }).from(testimonials);
  const liveCities = await db.select({ n: count() }).from(cities).where(eq(cities.status, "live"));
  const comingSoonCities = await db.select({ n: count() }).from(cities).where(eq(cities.status, "coming_soon"));
  const allStates = await db.select({ n: count() }).from(states);

  const avgRating = avgRatingRow.a ? Number(avgRatingRow.a).toFixed(1) : "—";

  const stats = [
    { n: String(projectCount.n), l: "Projects completed" },
    { n: `${avgRating}/5`, l: `From ${reviewCount.n} verified reviews` },
    { n: String(liveCities[0].n), l: "Live cities" },
    { n: String(comingSoonCities[0].n), l: "Cities launching next" },
    { n: String(allStates[0].n), l: "States covered" },
    { n: "45 days", l: "Avg. delivery timeline" },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <div className="text-xs uppercase tracking-[0.2em] text-clay-600">About</div>
      <h1 className="mt-2 font-display text-5xl text-ink-900">Small studio, careful craft.</h1>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <div className="space-y-5 text-lg text-ink-700">
          <p>
            Little Ray Interio was founded with one belief: <strong className="text-ink-900">a home doesn&apos;t need to look like a showroom to feel beautiful.</strong>
          </p>
          <p>
            We&apos;re a studio of designers, carpenters, and site engineers headquartered in Hyderabad, designing homes across Telangana — with Andhra Pradesh and Karnataka next.
          </p>
          <p>
            Every project is executed end-to-end by our in-house team: no subcontracting to random contractors, no surprises on the bill, no handover delays. We manufacture in our own factory, install with our own crew, and warrant every modular unit for 10 years — in writing.
          </p>
          <p>
            We grow slowly on purpose. Each new city gets a trained studio, a vetted factory partner, and a dedicated senior designer before we accept the first booking. That&apos;s why quality stays consistent whether you&apos;re in Hyderabad or Khammam.
          </p>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-clay-100 to-sage-100 p-8">
          <div className="font-display text-2xl text-ink-900 mb-4">Why homeowners choose us</div>
          <ul className="space-y-3 text-ink-700">
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sage-500 text-white text-xs">✓</span>
              <span><strong>Transparent pricing.</strong> Detailed BOQ shared before you commit. No hidden charges.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sage-500 text-white text-xs">✓</span>
              <span><strong>45-day delivery.</strong> We meet deadlines because we control the entire chain.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sage-500 text-white text-xs">✓</span>
              <span><strong>10-year modular warranty.</strong> Written, honoured, no questions asked.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sage-500 text-white text-xs">✓</span>
              <span><strong>Weekly updates.</strong> Photo progress reports every Friday. No radio silence.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sage-500 text-white text-xs">✓</span>
              <span><strong>Single-window execution.</strong> One team, one bill, one point of contact.</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {stats.map((s) => (
          <div key={s.l} className="rounded-2xl border border-clay-200 bg-white p-6 text-center">
            <div className="font-display text-3xl text-clay-700">{s.n}</div>
            <div className="mt-1 text-sm text-ink-500">{s.l}</div>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-2xl bg-ink-900 p-8 text-clay-50 md:p-12">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-clay-300">Our team</div>
            <h2 className="mt-2 font-display text-3xl">Designers who listen. Engineers who deliver.</h2>
          </div>
          <div className="space-y-3 text-clay-200/90">
            <p>
              <strong>Design studio:</strong> 8 interior designers, 2 3D visualisers, 1 Vastu consultant.
            </p>
            <p>
              <strong>Factory:</strong> 12,000 sq ft facility in Jeedimetla. CNC-cut panels, edge-banding, and quality check before dispatch.
            </p>
            <p>
              <strong>Site crew:</strong> 15 trained carpenters, 4 site engineers, 3 electricians — all in-house employees, not daily-wage contractors.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center">
        <Link href="/consultation" className="rounded-full bg-clay-600 px-8 py-3 text-sm font-medium text-white hover:bg-clay-700 transition-colors">
          Book a free consultation →
        </Link>
      </div>
    </div>
  );
}
