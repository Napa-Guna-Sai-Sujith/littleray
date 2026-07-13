import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { db } from "@/db";
import { leads, waitlist, quotes, projects, cities, events } from "@/db/schema";
import { count, sql, eq } from "drizzle-orm";
import LogoutButton from "@/components/LogoutButton";

export default async function AdminPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (!["admin", "designer", "sales"].includes(session.role)) redirect("/account");

  const [totalLeads] = await db.select({ n: count() }).from(leads);
  const [totalWait] = await db.select({ n: count() }).from(waitlist);
  const [totalQuotes] = await db.select({ n: count() }).from(quotes);
  const [totalProjects] = await db.select({ n: count() }).from(projects);

  const bookedLeads = await db.select({ n: count() }).from(leads).where(eq(leads.status, "booked"));
  const inProgress = await db.select({ n: count() }).from(leads).where(eq(leads.status, "in_progress"));
  const delivered = await db.select({ n: count() }).from(leads).where(eq(leads.status, "delivered"));

  const conversionRate = totalLeads.n > 0
    ? Math.round(((bookedLeads[0].n + inProgress[0].n + delivered[0].n) / totalLeads.n) * 100)
    : 0;

  const cityBreakdown = await db.execute(sql`
    SELECT c.name, COUNT(l.id) as leads
    FROM cities c LEFT JOIN leads l ON l.city_id = c.id
    GROUP BY c.name ORDER BY leads DESC LIMIT 6
  `);

  const recentEvents = await db.select().from(events).orderBy(sql`created_at desc`).limit(5);

  const cards = [
    { l: "Total leads", n: totalLeads.n, href: "/admin/leads" },
    { l: "Waitlist signups", n: totalWait.n, href: "/admin/waitlist" },
    { l: "Saved quotes", n: totalQuotes.n },
    { l: "Portfolio projects", n: totalProjects.n },
    { l: "Conversion rate", n: `${conversionRate}%` },
    { l: "In progress", n: inProgress[0].n },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-clay-600">Admin</div>
          <h1 className="mt-1 font-display text-4xl text-ink-900">Dashboard</h1>
          <div className="mt-1 text-sm text-ink-500">Signed in as {session.name} ({session.role})</div>
        </div>
        <nav className="flex flex-wrap gap-2 text-sm">
          <Link href="/admin/leads" className="rounded-full bg-clay-600 px-4 py-2 text-white">Leads pipeline</Link>
          <Link href="/admin/cities" className="rounded-full border border-clay-300 px-4 py-2 text-ink-700 hover:bg-clay-100">Cities</Link>
          <Link href="/admin/waitlist" className="rounded-full border border-clay-300 px-4 py-2 text-ink-700 hover:bg-clay-100">Waitlist</Link>
          <LogoutButton />
        </nav>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {cards.map((c) => (
          <Link key={c.l} href={c.href ?? "#"} className="rounded-2xl border border-clay-200 bg-white p-5">
            <div className="text-xs uppercase text-clay-600">{c.l}</div>
            <div className="mt-1 font-display text-3xl text-ink-900">{c.n}</div>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-clay-200 bg-white p-6">
          <h2 className="font-display text-2xl text-ink-900">Leads by city</h2>
          <div className="mt-4 space-y-2">
            {cityBreakdown.rows.map((r) => {
              const rec = r as { name: string; leads: string | number };
              const num = Number(rec.leads);
              const pct = Math.min(100, num * 20);
              return (
                <div key={rec.name}>
                  <div className="flex justify-between text-sm">
                    <span>{rec.name}</span>
                    <span className="text-ink-500">{num}</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-clay-100">
                    <div className="h-2 rounded-full bg-clay-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-clay-200 bg-white p-6">
          <h2 className="font-display text-2xl text-ink-900">Recent activity</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {recentEvents.length === 0 && <li className="text-ink-500">No events yet.</li>}
            {recentEvents.map((e) => (
              <li key={e.id} className="flex justify-between border-b border-clay-100 pb-1">
                <span className="text-ink-700">{e.eventType.replace(/_/g, " ")}</span>
                <span className="text-xs text-ink-500">{new Date(e.createdAt).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
