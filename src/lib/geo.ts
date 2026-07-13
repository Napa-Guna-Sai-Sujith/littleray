import { db } from "@/db";
import { cities, states } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { cached } from "./cache";

export type StateRow = typeof states.$inferSelect;
export type CityRow = typeof cities.$inferSelect;

export type CityWithState = CityRow & { state: StateRow };
export type StateWithCities = StateRow & { cities: CityRow[] };

export async function getAllStatesWithCities(): Promise<StateWithCities[]> {
  return cached("geo:all", 60_000, async () => {
    const allStates = await db.select().from(states).orderBy(asc(states.name));
    const allCities = await db.select().from(cities).orderBy(asc(cities.name));
    return allStates.map((s) => ({
      ...s,
      cities: allCities.filter((c) => c.stateId === s.id),
    }));
  });
}

export async function getCityBySlug(slug: string): Promise<CityWithState | null> {
  const rows = await db
    .select()
    .from(cities)
    .innerJoin(states, eq(cities.stateId, states.id))
    .where(eq(cities.slug, slug))
    .limit(1);
  if (rows.length === 0) return null;
  const r = rows[0];
  return { ...r.cities, state: r.states };
}

export async function getStateBySlug(slug: string): Promise<StateWithCities | null> {
  const [s] = await db.select().from(states).where(eq(states.slug, slug)).limit(1);
  if (!s) return null;
  const cityRows = await db
    .select()
    .from(cities)
    .where(eq(cities.stateId, s.id))
    .orderBy(asc(cities.name));
  return { ...s, cities: cityRows };
}
