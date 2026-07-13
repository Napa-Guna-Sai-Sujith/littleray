import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { setSessionCookie, verifyPassword } from "@/lib/auth";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  const [u] = await db.select().from(users).where(eq(users.email, parsed.data.email)).limit(1);
  if (!u || !(await verifyPassword(parsed.data.password, u.passwordHash))) {
    return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
  }
  await setSessionCookie({ id: u.id, email: u.email, name: u.name, role: u.role });
  return NextResponse.json({ ok: true, user: { id: u.id, email: u.email, name: u.name, role: u.role } });
}
