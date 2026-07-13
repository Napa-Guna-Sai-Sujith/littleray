import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/db";
import { projects, testimonials } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getCityBySlug, getAllStatesWithCities } from "@/lib/geo";
import WaitlistForm from "@/components/WaitlistForm";
import LeadForm from "@/components/LeadForm";

export async function generateStaticParams() {
  try {
    const states = await getAllStatesWithCities();
    return states.flatMap((s) => s.cities.map((c) => ({ slug: c.slug })));
  } catch {
    return [];
  }
}

export const dynamicParams = true;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const city = await getCityBySlug(slug);
  if (!city) return { title: "City not found" };
  if (city.status === "live") {
    return {
      title: `Home interior designers in ${city.name}, ${city.state.name}`,
      description: `Full-service interior design & execution in ${city.name}. Free consultations, transparent pricing, 10-year warranty.`,
      alternates: { canonical: `/cities/${city.slug}` },
      openGraph: {
        title: `Interior designers in ${city.name}`,
        description: `Design your ${city.name} home with Little Ray Interio.`,
        images: city.heroImage ? [city.heroImage] : [],
      },
    };
  }
  return {
    title: `Launching soon in ${city.name} — join the waitlist`,
    description: `We're expanding to ${city.name}, ${city.state.name}. Join the waitlist for early-bird pricing.`,
    robots: { index: true, follow: true },
  };
}

export default async function CityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const city = await getCityBySlug(slug);
  if (!city) notFound();

  const isLive = city.status === "live";

  // Coming soon → lighter announcement page
  if (!isLive) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <Link href="/where-we-operate" className="text-sm text-clay-600 hover:text-clay-700">← Expansion roadmap</Link>
        <div
          className="mt-4 h-56 w-full rounded-2xl bg-cover bg-center"
          style={{ backgroundImage: `url(${city.heroImage})` }}
          role="img"
          aria-label={`${city.name} skyline`}
        />
        <div className="mt-6">
          <span className="inline-block rounded-full bg-clay-100 px-3 py-1 text-xs font-medium uppercase tracking-widest text-clay-700">
            Coming soon · {city.state.name}
          </span>
          <h1 className="mt-3 font-display text-4xl text-ink-900 md:text-5xl">
            We&apos;re heading to {city.name}.
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-ink-700">
            {city.state.tagline}
          </p>
        </div>
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-clay-200 bg-white p-6">
            <div className="font-display text-2xl text-ink-900">Notify me when we launch here</div>
            <p className="mt-1 text-sm text-ink-500">Get early-bird pricing and be first in the design queue.</p>
            <div className="mt-4">
              <WaitlistForm citySlug={city.slug} stateSlug={city.state.slug} />
            </div>
          </div>
          <div className="rounded-2xl bg-clay-100 p-6">
            <div className="font-display text-2xl text-ink-900">In the meantime</div>
            <ul className="mt-2 space-y-2 text-sm text-ink-700">
              <li>· Explore our <Link href="/portfolio" className="text-clay-700 underline">live Telangana projects</Link></li>
              <li>· Try the <Link href="/calculator" className="text-clay-700 underline">price calculator</Link> with your city selected</li>
              <li>· Read the <Link href="/magazine" className="text-clay-700 underline">design magazine</Link></li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Live city → full landing
  const cityProjects = await db.select().from(projects).where(eq(projects.cityId, city.id)).limit(6);
  const cityTestimonials = await db
    .select()
    .from(testimonials)
    .where(and(eq(testimonials.cityId, city.id), eq(testimonials.verified, true)))
    .limit(4);
  const avgRating = cityTestimonials.length
    ? (cityTestimonials.reduce((s, t) => s + t.rating, 0) / cityTestimonials.length).toFixed(1)
    : "5.0";

  return (
    <>
      <section className="relative">
        <div
          className="h-[420px] w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${city.heroImage})` }}
          role="img"
          aria-label={`${city.name} homes`}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70" />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6">
            <span className="inline-block rounded-full bg-sage-500 px-3 py-1 text-xs font-medium uppercase tracking-widest text-white">
              Live · {city.state.name}
            </span>
            <h1 className="mt-3 font-display text-5xl text-white md:text-6xl">
              Home interior designers in {city.name}.
            </h1>
            <p className="mt-3 max-w-2xl text-lg text-white/90">
              Rated {avgRating}/5 across {cityTestimonials.length}+ verified {city.name} homes.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-10">
          <div>
            <h2 className="font-display text-3xl text-ink-900">Recent projects in {city.name}</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {cityProjects.map((p) => (
                <Link key={p.id} href={`/portfolio/${p.slug}`} className="group overflow-hidden rounded-2xl border border-clay-200">
                  <div className="h-48 w-full bg-cover bg-center transition group-hover:scale-105" style={{ backgroundImage: `url(${p.coverImage})` }} />
                  <div className="p-4">
                    <div className="text-xs uppercase tracking-widest text-clay-600">{p.bhk} · {p.style}</div>
                    <div className="font-display text-lg text-ink-900">{p.title}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {cityTestimonials.length > 0 && (
            <div>
              <h2 className="font-display text-3xl text-ink-900">What {city.name} homeowners say</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {cityTestimonials.map((t) => (
                  <figure key={t.id} className="rounded-2xl border border-clay-200 bg-white p-5">
                    <div className="text-clay-500">{"★".repeat(t.rating)}</div>
                    <blockquote className="mt-2 text-ink-800">“{t.quote}”</blockquote>
                    <figcaption className="mt-3 text-sm text-ink-500">— {t.customerName}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="md:sticky md:top-24 h-fit rounded-2xl border border-clay-200 bg-white p-6 shadow-sm">
          <div className="font-display text-2xl text-ink-900">Book a free {city.name} consultation</div>
          <p className="mt-1 text-sm text-ink-500">45 minutes with a senior designer. In-home or virtual.</p>
          <div className="mt-4">
            <LeadForm citySlug={city.slug} />
          </div>
        </aside>
      </section>
    </>
  );
}
