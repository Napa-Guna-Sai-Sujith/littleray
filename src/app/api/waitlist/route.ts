import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { waitlist, events, cities, states } from "@/db/schema";
import { z } from "zod";
import { eq } from "drizzle-orm";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(6),
  citySlug: z.string().optional(),
  stateSlug: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  const d = parsed.data;
  let cityId: number | undefined;
  let stateId: number | undefined;
  if (d.citySlug) {
    const [c] = await db.select().from(cities).where(eq(cities.slug, d.citySlug)).limit(1);
    if (c) { cityId = c.id; stateId = c.stateId; }
  }
  if (!stateId && d.stateSlug) {
    const [s] = await db.select().from(states).where(eq(states.slug, d.stateSlug)).limit(1);
    if (s) stateId = s.id;
  }
  const [w] = await db.insert(waitlist).values({
    name: d.name, email: d.email, phone: d.phone, cityId, stateId,
  }).returning();
  await db.insert(events).values({
    eventType: "waitlist_signup",
    metadata: { waitlistId: w.id, cityId, stateId },
  });
  return NextResponse.json({ ok: true, waitlistId: w.id });
}
