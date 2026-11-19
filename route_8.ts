import { db } from "@/db";
import { voices } from "@/db/schema";
import { cleanText, displayName, VOICE_CATEGORIES } from "@/lib/constants";
import { ensureSeeded } from "@/lib/seed";
import { isUpload, saveAsset } from "@/lib/storage";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    await ensureSeeded();
    const form = await request.formData();
    const audioFile = isUpload(form.get("audio")) ? (form.get("audio") as File) : null;
    if (!audioFile) return Response.json({ error: "Choose or record an audio clip first." }, { status: 400 });

    const audioUrl = (await saveAsset(audioFile, "audio")).url;
    let coverUrl = "/images/cover-moonlit.jpg";
    const coverFile = isUpload(form.get("cover")) ? (form.get("cover") as File) : null;
    if (coverFile) coverUrl = (await saveAsset(coverFile, "image")).url;

    const title = displayName(cleanText(form.get("title"), 100), "Untitled Voice");
    const creator = displayName(cleanText(form.get("creator"), 60), "Guest Artist");
    const categoryInput = cleanText(form.get("category"), 40);
    const category = VOICE_CATEGORIES.includes(categoryInput as (typeof VOICE_CATEGORIES)[number]) ? categoryInput : "Other";

    const [created] = await db.insert(voices).values({
      title,
      creator,
      description: cleanText(form.get("description"), 1000) || "An independent voice clip shared on PromiseMe.",
      category,
      audioUrl,
      sampleScript: cleanText(form.get("sampleScript"), 500) || null,
      coverUrl,
      durationLabel: "Uploaded audio",
      plays: 0,
    }).returning({ id: voices.id });

    return Response.json({ ok: true, id: created.id });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Could not publish the voice clip." }, { status: 400 });
  }
}
