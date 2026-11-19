import { db } from "@/db";
import { siteProfile } from "@/db/schema";
import { displayName } from "@/lib/constants";
import { ensureSeeded } from "@/lib/seed";
import { isOwnerAuthorized, OWNER_UNAUTHORIZED_MESSAGE } from "@/lib/owner";

export const runtime = "nodejs";

function field(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  if (!isOwnerAuthorized(request)) {
    return Response.json({ error: OWNER_UNAUTHORIZED_MESSAGE }, { status: 401 });
  }
  await ensureSeeded();
  const payload = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const ownerName = displayName(field(payload.ownerName, 80), "The PromiseMe Team");
  const tagline = field(payload.tagline, 160) || "Stories worth promising your time to.";
  const aboutText = field(payload.aboutText, 3000) || "PromiseMe is an open home for independent creators.";
  const contactEmail = field(payload.contactEmail, 120) || "hello@promiseme.com";

  await db.insert(siteProfile).values({
    id: 1,
    ownerName,
    tagline,
    aboutText,
    contactEmail,
    updatedAt: new Date(),
  }).onConflictDoUpdate({
    target: siteProfile.id,
    set: { ownerName, tagline, aboutText, contactEmail, updatedAt: new Date() },
  });

  return Response.json({ ok: true });
}
