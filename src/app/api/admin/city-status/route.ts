import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { cities, states } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireRole } from "@/lib/auth";
import { z } from "zod";
import { invalidate } from "@/lib/cache";

const schema = z.object({
  type: z.enum(["city", "state"]),
  id: z.number(),
  status: z.enum(["live", "coming_soon"]),
});

export async function PATCH(req: NextRequest) {
  const role = await requireRole(["admin"]);
  if (!role) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  if (parsed.data.type === "city") {
    await db.update(cities).set({ status: parsed.data.status }).where(eq(cities.id, parsed.data.id));
  } else {
    await db.update(states).set({ status: parsed.data.status }).where(eq(states.id, parsed.data.id));
  }
  invalidate("geo:");
  return NextResponse.json({ ok: true });
}
