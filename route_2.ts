import { db } from "@/db";
import { voices } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { ensureSeeded } from "@/lib/seed";

export const runtime = "nodejs";

export async function POST(request: Request) {
  await ensureSeeded();
  const payload = (await request.json().catch(() => ({}))) as { id?: unknown };
  const id = Number(payload.id);
  if (!Number.isInteger(id) || id < 1) return Response.json({ error: "Invalid voice clip." }, { status: 400 });

  const [updated] = await db
    .update(voices)
    .set({ plays: sql`${voices.plays} + 1` })
    .where(eq(voices.id, id))
    .returning({ plays: voices.plays });

  return Response.json({ ok: true, plays: updated?.plays ?? 0 });
}
