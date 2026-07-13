import { db } from "@/db";
import { projects, testimonials, cities, states } from "@/db/schema";
import { count, avg, eq } from "drizzle-orm";
import { getAllStatesWithCities } from "@/lib/geo";
import LandingClient from "@/components/LandingClient";

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const [projectCount] = await db.select({ n: count() }).from(projects);
  const [reviewCount] = await db.select({ n: count() }).from(testimonials);
  const [avgRatingRow] = await db.select({ a: avg(testimonials.rating) }).from(testimonials);
  const liveCities = await db.select().from(cities).where(eq(cities.status, "live"));
  const comingSoonCities = await db.select().from(cities).where(eq(cities.status, "coming_soon"));
  const geo = await getAllStatesWithCities();

  const avgRating = avgRatingRow.a ? Number(avgRatingRow.a).toFixed(1) : "5.0";

  const allTestimonials = await db.select().from(testimonials).limit(6);
  const allCities = await db.select().from(cities);
  const cityMap = Object.fromEntries(allCities.map((c) => [c.id, c.name]));

  const statesData = geo.map((s) => ({
    name: s.name,
    status: s.status,
    launchQuarter: s.launchQuarter,
    cities: s.cities.map((c) => ({ name: c.name, status: c.status })),
  }));

  const testimonialsData = allTestimonials.map((t) => ({
    customerName: t.customerName,
    rating: t.rating,
    quote: t.quote,
    cityName: t.cityId ? cityMap[t.cityId] ?? "" : "",
  }));

  return (
    <LandingClient
      stats={{
        projects: projectCount.n,
        reviews: reviewCount.n,
        avgRating,
        liveCities: liveCities.length,
        comingSoonCities: comingSoonCities.length,
      }}
      states={statesData}
      testimonials={testimonialsData}
    />
  );
}
