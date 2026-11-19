import { db } from "@/db";
import { threadComments, threads } from "@/db/schema";
import { ensureSeeded } from "@/lib/seed";
import { eq, sql } from "drizzle-orm";

export const runtime = "nodejs";

export async function POST(request: Request) {
  await ensureSeeded();
  const payload = (await request.json().catch(() => ({}))) as { kind?: unknown; id?: unknown; delta?: unknown };
  const id = Number(payload.id);
  const delta = Number(payload.delta);
  if (!Number.isInteger(id) || id < 1 || ![-2, -1, 1, 2].includes(delta)) {
    return Response.json({ error: "Invalid vote." }, { status: 400 });
  }

  if (payload.kind === "thread") {
    const [updated] = await db.update(threads).set({ score: sql`${threads.score} + ${delta}` }).where(eq(threads.id, id)).returning({ score: threads.score });
    return Response.json({ ok: true, score: updated?.score ?? 0 });
  }
  if (payload.kind === "comment") {
    const [updated] = await db.update(threadComments).set({ score: sql`${threadComments.score} + ${delta}` }).where(eq(threadComments.id, id)).returning({ score: threadComments.score });
    return Response.json({ ok: true, score: updated?.score ?? 0 });
  }
  return Response.json({ error: "Unknown vote target." }, { status: 400 });
}
