import { db } from "@/db";
import { chatMessages, chatRooms } from "@/db/schema";
import { displayName } from "@/lib/constants";
import { ensureSeeded } from "@/lib/seed";
import { and, asc, eq, gt } from "drizzle-orm";

export const runtime = "nodejs";

function field(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function GET(request: Request) {
  await ensureSeeded();
  const url = new URL(request.url);
  const slug = url.searchParams.get("room") || "general";
  const after = Number(url.searchParams.get("after") || 0);
  const [room] = await db.select().from(chatRooms).where(eq(chatRooms.slug, slug)).limit(1);
  if (!room) return Response.json({ error: "Room not found." }, { status: 404 });

  const safeAfter = Number.isInteger(after) && after > 0 ? after : 0;
  const condition = safeAfter
    ? and(eq(chatMessages.roomId, room.id), gt(chatMessages.id, safeAfter))
    : eq(chatMessages.roomId, room.id);
  const messages = await db.select().from(chatMessages).where(condition).orderBy(asc(chatMessages.id)).limit(100);
  return Response.json({ ok: true, messages }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  await ensureSeeded();
  const payload = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const slug = field(payload.room, 60) || "general";
  const author = displayName(field(payload.author, 40), "Guest Reader");
  const body = field(payload.body, 1000);
  if (!body) return Response.json({ error: "Write a message first." }, { status: 400 });

  const [room] = await db.select().from(chatRooms).where(eq(chatRooms.slug, slug)).limit(1);
  if (!room) return Response.json({ error: "Room not found." }, { status: 404 });

  const [created] = await db.insert(chatMessages).values({ roomId: room.id, author, body }).returning();
  return Response.json({ ok: true, message: created });
}
