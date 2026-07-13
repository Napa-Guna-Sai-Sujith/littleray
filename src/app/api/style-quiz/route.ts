import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { z } from "zod";

const schema = z.object({
  palette: z.enum(["warm-neutral", "bold-jewel", "cool-monochrome", "earthy-natural"]),
  roomType: z.enum(["living_room", "bedroom", "kitchen", "full_home"]),
  budgetTier: z.enum(["budget", "premium", "luxury"]),
});

// naive rules-based recommender — map palette → style keyword
const PALETTE_STYLE: Record<string, string[]> = {
  "warm-neutral": ["Contemporary", "Modern Classic", "Boho Warm"],
  "bold-jewel": ["Indo-Fusion", "Modern Classic"],
  "cool-monochrome": ["Minimal Scandinavian", "Contemporary"],
  "earthy-natural": ["Boho Warm", "Indo-Fusion"],
};

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  const styles = PALETTE_STYLE[parsed.data.palette];
  const all = await db.select().from(projects);
  const scored = all
    .map((p) => {
      let s = 0;
      if (p.style && styles.includes(p.style)) s += 3;
      if (p.budgetTier === parsed.data.budgetTier) s += 2;
      if (parsed.data.roomType !== "full_home" && p.roomType?.toLowerCase().includes(parsed.data.roomType.replace("_", " "))) s += 1;
      return { p, s };
    })
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, 6)
    .map((x) => x.p);
  return NextResponse.json({ recommendations: scored });
}
