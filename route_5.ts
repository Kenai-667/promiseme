import { db } from "@/db";
import { threadComments, threads } from "@/db/schema";
import { displayName } from "@/lib/constants";
import { ensureSeeded } from "@/lib/seed";
import { and, eq } from "drizzle-orm";

export const runtime = "nodejs";

function field(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await ensureSeeded();
  const { id } = await params;
  const threadId = Number(id);
  if (!Number.isInteger(threadId) || threadId < 1) return Response.json({ error: "Invalid post." }, { status: 400 });

  const [thread] = await db.select({ id: threads.id }).from(threads).where(eq(threads.id, threadId)).limit(1);
  if (!thread) return Response.json({ error: "Post not found." }, { status: 404 });

  const payload = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const body = field(payload.body, 2000);
  if (!body) return Response.json({ error: "Write a comment first." }, { status: 400 });
  const author = displayName(field(payload.author, 40), "Guest Reader");

  const rawParent = Number(payload.parentId);
  let parentId: number | null = null;
  if (Number.isInteger(rawParent) && rawParent > 0) {
    const [parent] = await db.select({ id: threadComments.id }).from(threadComments)
      .where(and(eq(threadComments.id, rawParent), eq(threadComments.threadId, threadId))).limit(1);
    if (!parent) return Response.json({ error: "Reply target not found." }, { status: 400 });
    parentId = rawParent;
  }

  const [created] = await db.insert(threadComments).values({
    threadId,
    parentId,
    author,
    body,
    score: 1,
  }).returning();

  return Response.json({ ok: true, comment: created });
}
