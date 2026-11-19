import { db } from "@/db";
import { comics, episodes } from "@/db/schema";
import { ensureSeeded } from "@/lib/seed";
import { eq, sql } from "drizzle-orm";

export const runtime = "nodejs";

export async function POST(request: Request) {
  await ensureSeeded();
  const payload = (await request.json().catch(() => ({}))) as { episodeId?: unknown; comicId?: unknown };
  const episodeId = Number(payload.episodeId);
  const comicId = Number(payload.comicId);
  if (!Number.isInteger(episodeId) || episodeId < 1) return Response.json({ error: "Invalid episode." }, { status: 400 });

  const [updated] = await db.update(episodes).set({ likes: sql`${episodes.likes} + 1` }).where(eq(episodes.id, episodeId)).returning({ likes: episodes.likes });
  if (Number.isInteger(comicId) && comicId > 0) {
    await db.update(comics).set({ likes: sql`${comics.likes} + 1` }).where(eq(comics.id, comicId));
  }
  return Response.json({ ok: true, likes: updated?.likes ?? 0 });
}
