import type { Metadata } from "next";
import Link from "next/link";
import StyleQuiz from "@/components/StyleQuiz";
import { db } from "@/db";
import { projects, testimonials } from "@/db/schema";
import { count, avg } from "drizzle-orm";

export const metadata: Metadata = {
  title: "Services — end-to-end home interiors",
  description: "Full home interiors, modular kitchens, wardrobes, false ceilings, and more. Transparent pricing, 45-day timelines.",
};

const services = [
  { icon: "🏠", t: "Full home interiors", d: "End-to-end design and execution — from mood board to move-in. Every room, every detail, one team.", price: "From ₹3.2L for a 2BHK", features: ["3D photorealistic renders", "Factory-built modular units", "45-day delivery", "10-year modular warranty"] },
  { icon: "🍳", t: "Modular kitchens", d: "Ergonomic layouts, Hettich/Blum hardware, soft-close everything. Available in laminate, acrylic, and veneer finishes.", price: "From ₹1.45L", features: ["Corner carousels & tandem drawers", "Marine plywood carcass", "Corian/granite countertops", "Integrated chimney & appliance slots"] },
  { icon: "🚪", t: "Modular wardrobes", d: "Sliding, hinged, or walk-in — custom storage designed around your actual wardrobe, not a template.", price: "From ₹85K", features: ["Soft-close hinges & channels", "LED-lit interiors", "Velvet-lined drawers", "Mirror sliding doors"] },
  { icon: "💡", t: "False ceiling & lighting", d: "Layered lighting plans that transform a room's mood. Cove LEDs, recessed spots, pendant accents.", price: "From ₹45K", features: ["Gypsum board (moisture resistant)", "Warm 3000K LED profiles", "Shadow-gap floating panels", "6-day installation"] },
  { icon: "📺", t: "Living & TV units", d: "Statement TV walls, hidden cable management, cozy seating zones.", price: "From ₹85K", features: ["Fluted panel feature walls", "Back-lit shelving", "Hidden soundbar integration", "Cable management system"] },
  { icon: "🔧", t: "Renovation & repainting", d: "Refresh what you love, replace what you don't. Partial renovations without full-home disruption.", price: "Custom quote", features: ["Room-by-room renovation", "Asian Paints / Berger premium range", "Waterproofing & dampness treatment", "Minimal disruption approach"] },
];

export default async function ServicesPage() {
  const [projectCount] = await db.select({ n: count() }).from(projects);
  const [avgRatingRow] = await db.select({ a: avg(testimonials.rating) }).from(testimonials);
  const avgRating = avgRatingRow.a ? Number(avgRatingRow.a).toFixed(1) : "—";

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <div className="max-w-2xl">
        <div className="text-xs uppercase tracking-[0.2em] text-clay-600">Services</div>
        <h1 className="mt-2 font-display text-5xl text-ink-900">Everything your home needs.</h1>
        <p className="mt-3 text-lg text-ink-700">One team, one price, one warranty. {projectCount.n} homes completed with a {avgRating}/5 average rating.</p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <div key={s.t} className="rounded-2xl border border-clay-200 bg-white p-6 transition hover:shadow-md">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{s.icon}</span>
              <div className="font-display text-2xl text-ink-900">{s.t}</div>
            </div>
            <p className="mt-2 text-ink-700">{s.d}</p>
            <ul className="mt-4 space-y-1">
              {s.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-ink-600">
                  <span className="text-sage-500">✓</span> {f}
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-center justify-between">
              <div className="text-xs font-medium uppercase tracking-widest text-clay-600">{s.price}</div>
              <Link href="/calculator" className="rounded-full bg-clay-100 px-4 py-2 text-sm text-clay-700 hover:bg-clay-200 transition-colors">Estimate →</Link>
            </div>
          </div>
        ))}
      </div>

      <section className="mt-20">
        <div className="text-xs uppercase tracking-[0.2em] text-clay-600">AI style quiz</div>
        <h2 className="mt-2 font-display text-4xl text-ink-900">Not sure where to start?</h2>
        <p className="mt-2 max-w-xl text-ink-700">Answer three quick questions and we&apos;ll match you with real projects from our portfolio that fit your taste.</p>
        <div className="mt-6">
          <StyleQuiz />
        </div>
      </section>
    </div>
  );
}
