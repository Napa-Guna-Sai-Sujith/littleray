import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { getAllStatesWithCities } from "@/lib/geo";
import CityStatusToggle from "@/components/CityStatusToggle";

export default async function AdminCitiesPage() {
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/login");
  const states = await getAllStatesWithCities();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Link href="/admin" className="text-sm text-clay-600">← Dashboard</Link>
      <h1 className="mt-2 font-display text-4xl text-ink-900">Cities & states</h1>
      <p className="mt-1 text-sm text-ink-500">
        Flip a city or state to <b>live</b> to publish its full landing page. No code changes needed — this is how we roll out AP & Karnataka.
      </p>
      <div className="mt-8 space-y-8">
        {states.map((s) => (
          <div key={s.id} className="rounded-2xl border border-clay-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div className="font-display text-2xl text-ink-900">{s.name}</div>
              <CityStatusToggle type="state" id={s.id} status={s.status} />
            </div>
            <div className="mt-4 grid gap-2 md:grid-cols-2">
              {s.cities.map((c) => (
                <div key={c.id} className="flex items-center justify-between rounded-lg bg-clay-50 p-3 text-sm">
                  <span>{c.name}</span>
                  <CityStatusToggle type="city" id={c.id} status={c.status} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
