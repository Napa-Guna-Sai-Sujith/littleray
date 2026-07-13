import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword, setSessionCookie } from "@/lib/auth";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  const d = parsed.data;
  const existing = await db.select().from(users).where(eq(users.email, d.email)).limit(1);
  if (existing.length > 0) return NextResponse.json({ error: "email_taken" }, { status: 409 });
  const [u] = await db.insert(users).values({
    email: d.email,
    name: d.name,
    passwordHash: await hashPassword(d.password),
    phone: d.phone,
    role: "customer",
  }).returning();
  await setSessionCookie({ id: u.id, email: u.email, name: u.name, role: u.role });
  return NextResponse.json({ ok: true, user: { id: u.id, email: u.email, name: u.name, role: u.role } });
}
