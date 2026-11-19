import { db } from "@/db";
import { threads } from "@/db/schema";
import { COMMUNITIES, displayName, FLAIRS } from "@/lib/constants";
import { ensureSeeded } from "@/lib/seed";

export const runtime = "nodejs";

function field(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  await ensureSeeded();
  const payload = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const title = field(payload.title, 180);
  if (!title) return Response.json({ error: "Give your post a title." }, { status: 400 });

  const communityInput = field(payload.community, 50);
  const flairInput = field(payload.flair, 40);
  const community = COMMUNITIES.some((item) => item.slug === communityInput) ? communityInput : "promiseme";
  const flair = FLAIRS.includes(flairInput as (typeof FLAIRS)[number]) ? flairInput : "Discussion";
  const author = displayName(field(payload.author, 40), "Guest Reader");

  const [created] = await db.insert(threads).values({
    community,
    title,
    body: field(payload.body, 5000),
    author,
    flair,
    score: 1,
    views: 1,
  }).returning({ id: threads.id });

  return Response.json({ ok: true, id: created.id });
}
