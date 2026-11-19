import { db } from "@/db";
import { socialLinks } from "@/db/schema";
import { displayName, normalizeUrl, PLATFORMS } from "@/lib/constants";
import { ensureSeeded } from "@/lib/seed";
import { isOwnerAuthorized, OWNER_UNAUTHORIZED_MESSAGE } from "@/lib/owner";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";

function stringField(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  if (!isOwnerAuthorized(request)) {
    return Response.json({ error: OWNER_UNAUTHORIZED_MESSAGE }, { status: 401 });
  }
  await ensureSeeded();
  const payload = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const platformInput = stringField(payload.platform, 40);
  const handle = displayName(stringField(payload.handle, 80), "@owner");
  const rawUrl = stringField(payload.url, 500);
  const url = normalizeUrl(rawUrl || handle.replace(/^@/, ""));
  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) throw new Error("Invalid protocol");
  } catch {
    return Response.json({ error: "Enter a valid http or https profile URL." }, { status: 400 });
  }

  const platform = PLATFORMS.find((item) => item.name === platformInput)?.name || displayName(platformInput, "Website");
  const accent = PLATFORMS.find((item) => item.name === platformInput)?.color || "#00d564";
  const [created] = await db.insert(socialLinks).values({ platform, handle, url, accent }).returning({ id: socialLinks.id });
  return Response.json({ ok: true, id: created.id });
}

export async function DELETE(request: Request) {
  if (!isOwnerAuthorized(request)) {
    return Response.json({ error: OWNER_UNAUTHORIZED_MESSAGE }, { status: 401 });
  }
  await ensureSeeded();
  const payload = (await request.json().catch(() => ({}))) as { id?: unknown };
  const id = Number(payload.id);
  if (!Number.isInteger(id) || id < 1) return Response.json({ error: "Invalid handle." }, { status: 400 });
  await db.delete(socialLinks).where(eq(socialLinks.id, id));
  return Response.json({ ok: true });
}
