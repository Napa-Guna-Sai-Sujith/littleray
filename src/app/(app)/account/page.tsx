import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { db } from "@/db";
import { quotes, cities, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { formatINR } from "@/lib/pricing";
import ProfileDetailsForm from "@/components/ProfileDetailsForm";

export default async function AccountPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [dbUser] = await db.select().from(users).where(eq(users.id, session.id)).limit(1);
  if (!dbUser) redirect("/login");

  const myQuotes = await db.select().from(quotes).where(eq(quotes.userId, session.id)).orderBy(desc(quotes.createdAt));
  const allCities = await db.select().from(cities);
  const cityMap = new Map(allCities.map((c) => [c.id, c.name]));

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 space-y-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="flex-1">
          <div className="text-xs uppercase tracking-[0.2em] text-clay-600">Account</div>
          <h1 className="mt-2 font-display text-4xl text-ink-900">Hi, {dbUser.name} 👋</h1>
          <p className="text-sm text-ink-500 mt-1 uppercase tracking-wider">{dbUser.role} portal</p>
        </div>
        <div className="w-full md:max-w-md">
          <ProfileDetailsForm user={dbUser} />
        </div>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl bg-clay-100 p-6">
          <div className="text-xs uppercase text-clay-700">Saved quotes</div>
          <div className="mt-1 font-display text-3xl text-ink-900">{myQuotes.length}</div>
        </div>
        <div className="rounded-2xl bg-clay-100 p-6">
          <div className="text-xs uppercase text-clay-700">Wishlist</div>
          <div className="mt-1 font-display text-3xl text-ink-900">0</div>
        </div>
        <div className="rounded-2xl bg-clay-100 p-6">
          <div className="text-xs uppercase text-clay-700">Consultations</div>
          <div className="mt-1 font-display text-3xl text-ink-900">0</div>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="font-display text-2xl text-ink-900">My saved quotes</h2>
        <div className="mt-4 space-y-3">
          {myQuotes.length === 0 && (
            <div className="rounded-2xl border border-dashed border-clay-300 p-8 text-center text-ink-500">
              No saved quotes yet. <Link href="/calculator" className="text-clay-700 underline">Try the calculator →</Link>
            </div>
          )}
          {myQuotes.map((q) => (
            <div key={q.id} className="flex items-center justify-between rounded-2xl border border-clay-200 bg-white p-5">
              <div>
                <div className="font-display text-xl text-ink-900">
                  {q.bhk} · {q.tier} · {q.cityId ? cityMap.get(q.cityId) : ""}
                </div>
                <div className="text-sm text-ink-500">
                  {q.rooms.length} rooms, {q.addons.length} add-ons · {new Date(q.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="text-right">
                <div className="font-display text-2xl text-clay-700">{formatINR(Number(q.totalAmount))}</div>
                <span className="text-xs uppercase tracking-widest text-ink-500">{q.status}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
