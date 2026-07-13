import type { Metadata } from "next";
import { getAllStatesWithCities } from "@/lib/geo";
import ConsultationForm from "@/components/ConsultationForm";

export const metadata: Metadata = { title: "Book a free consultation" };

export default async function ConsultationPage() {
  const geo = await getAllStatesWithCities();
  const cities = geo.flatMap((s) => s.cities.map((c) => ({ slug: c.slug, name: c.name, stateName: s.name, status: c.status })));

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2">
      <div>
        <div className="text-xs uppercase tracking-[0.2em] text-clay-600">Free consultation</div>
        <h1 className="mt-2 font-display text-5xl text-ink-900">45 minutes with a designer.</h1>
        <ul className="mt-6 space-y-3 text-ink-700">
          <li>✓ We understand your family, lifestyle, and budget.</li>
          <li>✓ We share preliminary ideas and a ballpark quote.</li>
          <li>✓ Zero obligation — a lot of people just come for advice.</li>
        </ul>
        <div className="mt-8 rounded-2xl bg-clay-100 p-6 text-sm text-ink-700">
          Prefer WhatsApp? Message us on <b>+91 90000 00000</b> — a designer replies in under 30 minutes during work hours.
        </div>
      </div>
      <ConsultationForm cities={cities} />
    </div>
  );
}
