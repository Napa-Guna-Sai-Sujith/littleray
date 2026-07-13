import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { leads } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireRole } from "@/lib/auth";
import { z } from "zod";

const patch = z.object({
  id: z.number(),
  status: z.enum(["new", "contacted", "site_visit", "quoted", "booked", "in_progress", "delivered", "lost"]),
});

export async function PATCH(req: NextRequest) {
  const role = await requireRole(["admin", "sales", "designer"]);
  if (!role) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const parsed = patch.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  await db.update(leads).set({ status: parsed.data.status, updatedAt: new Date() }).where(eq(leads.id, parsed.data.id));
  return NextResponse.json({ ok: true });
}
