import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { leads, events, cities } from "@/db/schema";
import { z } from "zod";
import { eq } from "drizzle-orm";

const schema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  phone: z.string().min(6).max(20),
  citySlug: z.string().optional(),
  cityId: z.number().optional(),
  stateId: z.number().optional(),
  source: z.string().optional(),
  message: z.string().optional(),
  bhk: z.string().optional(),
  propertyType: z.string().optional(),
  budget: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input", details: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;
  let cityId = data.cityId;
  let stateId = data.stateId;
  if (!cityId && data.citySlug) {
    const [c] = await db.select().from(cities).where(eq(cities.slug, data.citySlug)).limit(1);
    if (c) { cityId = c.id; stateId = c.stateId; }
  }
  const [inserted] = await db.insert(leads).values({
    name: data.name,
    email: data.email,
    phone: data.phone,
    cityId,
    stateId,
    source: data.source ?? "website",
    message: data.message,
    bhk: data.bhk,
    propertyType: data.propertyType,
    budget: data.budget,
  }).returning();

  // Analytics event + stubbed notification
  await db.insert(events).values({
    eventType: "lead_submitted",
    metadata: { leadId: inserted.id, source: inserted.source },
  });
  console.log(`[notify] Would send SMS/email to ${data.phone} / ${data.email} (Twilio/SendGrid stub)`);

  return NextResponse.json({ ok: true, leadId: inserted.id });
}
