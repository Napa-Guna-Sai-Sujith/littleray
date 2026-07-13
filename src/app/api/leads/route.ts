import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { leads, events, cities } from "@/db/schema";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { sendEmail } from "@/lib/mail";

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

  // Analytics event
  await db.insert(events).values({
    eventType: "lead_submitted",
    metadata: { leadId: inserted.id, source: inserted.source },
  });

  // Send email to Administrator
  try {
    await sendEmail({
      to: "napagunasaisujith@gmail.com",
      subject: `New Lead: ${inserted.name}`,
      text: `A new lead has been submitted:
Name: ${inserted.name}
Email: ${inserted.email}
Phone: ${inserted.phone}
Source: ${inserted.source}
Message: ${inserted.message || "No message"}
BHK: ${inserted.bhk || "N/A"}
Property Type: ${inserted.propertyType || "N/A"}
Budget: ${inserted.budget || "N/A"}`
    });
  } catch (err) {
    console.error("Failed to send admin email:", err);
  }

  // Send confirmation email to Customer
  try {
    await sendEmail({
      to: inserted.email,
      subject: "We received your request! - Little Ray Interio",
      text: `Hi ${inserted.name},

Thank you for reaching out to Little Ray Interio. A designer will contact you shortly at ${inserted.phone}.

Meanwhile, feel free to browse our portfolio!

Best regards,
Little Ray Interio Team`
    });
  } catch (err) {
    console.error("Failed to send customer confirmation email:", err);
  }

  return NextResponse.json({ ok: true, leadId: inserted.id });
}
