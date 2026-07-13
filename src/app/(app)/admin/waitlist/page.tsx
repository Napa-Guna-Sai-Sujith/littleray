import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { db } from "@/db";
import { waitlist, cities, states } from "@/db/schema";
import { desc } from "drizzle-orm";

export default async function WaitlistPage() {
  const session = await getSession();
  if (!session || !["admin", "sales"].includes(session.role)) redirect("/login");

  const rows = await db.select().from(waitlist).orderBy(desc(waitlist.createdAt));
  const allCities = await db.select().from(cities);
  const allStates = await db.select().from(states);
  const cityMap = new Map(allCities.map((c) => [c.id, c.name]));
  const stateMap = new Map(allStates.map((s) => [s.id, s.name]));

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Link href="/admin" className="text-sm text-clay-600">← Dashboard</Link>
      <h1 className="mt-2 font-display text-4xl text-ink-900">Waitlist</h1>
      <p className="mt-1 text-sm text-ink-500">Signups for cities/states not yet live.</p>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-clay-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-clay-100 text-left text-xs uppercase tracking-widest text-ink-700">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Location</th>
              <th className="p-3">When</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={5} className="p-6 text-center text-ink-500">No signups yet.</td></tr>
            )}
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-clay-100">
                <td className="p-3 font-medium">{r.name}</td>
                <td className="p-3">{r.email}</td>
                <td className="p-3">{r.phone}</td>
                <td className="p-3">
                  {r.cityId ? cityMap.get(r.cityId) : ""}
                  {r.stateId ? ` · ${stateMap.get(r.stateId)}` : ""}
                </td>
                <td className="p-3 text-xs text-ink-500">{new Date(r.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
