import type { Metadata } from "next";
import { getAllStatesWithCities } from "@/lib/geo";
import Calculator from "@/components/Calculator";

export const metadata: Metadata = {
  title: "Interactive interior price calculator",
  description: "Live estimate for your home interiors. Choose home size, rooms, tier, and add-ons.",
};

export default async function CalculatorPage() {
  const geo = await getAllStatesWithCities();
  const cities = geo.flatMap((s) => s.cities.map((c) => ({ slug: c.slug, name: c.name, stateName: s.name })));

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <div className="max-w-2xl">
        <div className="text-xs uppercase tracking-[0.2em] text-clay-600">Price calculator</div>
        <h1 className="mt-2 font-display text-5xl text-ink-900">Get your live estimate.</h1>
        <p className="mt-3 text-lg text-ink-700">
          A ballpark cost for your home, updated as you change options. Save the quote, download a PDF, and share it with your family.
        </p>
      </div>
      <div className="mt-10">
        <Calculator cities={cities} />
      </div>
    </div>
  );
}
