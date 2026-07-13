import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/db";
import { leads, cities } from "@/db/schema";
import { desc } from "drizzle-orm";
import LeadKanban from "@/components/LeadKanban";
import Link from "next/link";

export default async function LeadsPage() {
  const session = await getSession();
  if (!session || !["admin", "sales", "designer"].includes(session.role)) redirect("/login");

  const allLeads = await db.select().from(leads).orderBy(desc(leads.createdAt));
  const allCities = await db.select().from(cities);
  const cityMap = new Map(allCities.map((c) => [c.id, c.name]));

  const leadsWithCity = allLeads.map((l) => ({
    ...l,
    createdAt: l.createdAt.toISOString(),
    updatedAt: l.updatedAt.toISOString(),
    cityName: l.cityId ? (cityMap.get(l.cityId) ?? null) : null,
  }));

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6">
      <Link href="/admin" className="text-sm text-clay-600">← Dashboard</Link>
      <h1 className="mt-2 font-display text-4xl text-ink-900">Leads pipeline</h1>
      <p className="mt-1 text-sm text-ink-500">Drag-free kanban — click a status to move a lead.</p>
      <div className="mt-6">
        <LeadKanban initialLeads={leadsWithCity} />
      </div>
    </div>
  );
}
