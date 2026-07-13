import { NextResponse } from "next/server";
import { getSession, setSessionCookie } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  phone: z.string().max(20).optional().nullable(),
});

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = profileSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, phone } = parsed.data;

    // Update user in DB
    await db
      .update(users)
      .set({
        name,
        phone: phone || null,
      })
      .where(eq(users.id, session.id));

    // Re-issue session cookie with the updated name
    await setSessionCookie({
      ...session,
      name,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Profile update error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
