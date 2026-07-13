import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { calculatePrice, type BhkOption, type Tier, type Room, type Addon } from "@/lib/pricing";
import { db } from "@/db";
import { quotes, cities, states, events } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";

const schema = z.object({
  bhk: z.enum(["1BHK", "2BHK", "3BHK", "4BHK", "Villa"]),
  tier: z.enum(["budget", "premium", "luxury"]),
  rooms: z.array(z.string()),
  addons: z.array(z.string()),
  citySlug: z.string().optional(),
  save: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  const d = parsed.data;

  let cityMult = 1;
  let stateMult = 1;
  let cityId: number | undefined;
  if (d.citySlug) {
    const [c] = await db.select().from(cities).where(eq(cities.slug, d.citySlug)).limit(1);
    if (c) {
      cityMult = Number(c.priceMultiplier);
      cityId = c.id;
      const [s] = await db.select().from(states).where(eq(states.id, c.stateId)).limit(1);
      if (s) stateMult = Number(s.priceMultiplier);
    }
  }
  const result = calculatePrice({
    bhk: d.bhk as BhkOption,
    tier: d.tier as Tier,
    rooms: d.rooms as Room[],
    addons: d.addons as Addon[],
    cityMultiplier: cityMult,
    stateMultiplier: stateMult,
  });

  let quoteId: number | undefined;
  if (d.save) {
    const session = await getSession();
    const [q] = await db.insert(quotes).values({
      userId: session?.id,
      cityId,
      bhk: d.bhk,
      tier: d.tier,
      rooms: d.rooms,
      addons: d.addons,
      totalAmount: String(result.total),
      breakdown: result.breakdown,
      status: session ? "saved" : "draft",
    }).returning();
    quoteId = q.id;
    await db.insert(events).values({
      eventType: "quote_saved",
      metadata: { quoteId, total: result.total, cityId },
      userId: session?.id,
    });
  }

  await db.insert(events).values({
    eventType: "calculator_completed",
    metadata: { bhk: d.bhk, tier: d.tier, total: result.total },
  });

  return NextResponse.json({ ...result, quoteId });
}
